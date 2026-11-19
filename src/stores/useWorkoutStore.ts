import { create } from 'zustand';
import { db, type WorkoutSessionRecord, type ExerciseLastLog } from '../db';
import { WORKOUT_DAYS, EXERCISES } from '../data/exercises';

export type AppTab = 'workout' | 'muscles' | 'progress' | 'nutrition' | 'guide';

export interface SetData {
  reps: string;
  load: string;
  completed: boolean;
}

export interface RestTimerState {
  isActive: boolean;
  endsAt: number;
  totalSeconds: number;
  remainingSeconds: number;
  exerciseName?: string;
}

export interface CoachState {
  isOpen: boolean;
  isPaused: boolean;
  voiceEnabled: boolean;
  soundEnabled: boolean;
  exerciseIndex: number;
  setIndex: number;
  phase: 'ready' | 'rep' | 'rest' | 'done';
  phaseTimer: number; // in seconds
  currentRep: number;
  targetReps: number;
  tempoPhase: 'eccentric' | 'isometric' | 'concentric';
  tempoSecond: number; // 1, 2, 3
}

interface WorkoutStore {
  // Navigation & View
  activeTab: AppTab;
  setActiveTab: (tab: AppTab) => void;
  selectedDay: number;
  setSelectedDay: (day: number) => void;

  // Active workout tracking
  workoutStartTime: number | null;
  activeSets: Record<string, SetData[]>; // exerciseId -> array of sets
  previousLogs: Record<string, { reps: string; load: string }[]>;

  // Rest Timer
  restTimer: RestTimerState;
  startRestTimer: (seconds: number, exerciseName?: string) => void;
  addRestTime: (seconds: number) => void;
  stopRestTimer: () => void;
  tickRestTimer: () => void;

  // Coach Mode
  coach: CoachState;
  startCoachMode: () => void;
  closeCoachMode: () => void;
  toggleCoachPause: () => void;
  toggleVoice: () => void;
  toggleSound: () => void;
  skipCoachPhase: () => void;
  updateCoachTick: (deltaSeconds: number) => void;

  // Actions
  updateSet: (exerciseId: string, setIndex: number, field: 'reps' | 'load', value: string) => void;
  toggleSetComplete: (exerciseId: string, setIndex: number) => void;
  finishAndSaveWorkout: () => Promise<boolean>;
  loadInitialData: () => Promise<void>;
}

export const useWorkoutStore = create<WorkoutStore>((set, get) => ({
  activeTab: 'workout',
  setActiveTab: (tab) => set({ activeTab: tab }),
  selectedDay: 0,
  setSelectedDay: (day) => {
    set({ selectedDay: day });
  },

  workoutStartTime: null,
  activeSets: {},
  previousLogs: {},

  restTimer: {
    isActive: false,
    endsAt: 0,
    totalSeconds: 0,
    remainingSeconds: 0,
  },

  coach: {
    isOpen: false,
    isPaused: false,
    voiceEnabled: true,
    soundEnabled: true,
    exerciseIndex: 0,
    setIndex: 0,
    phase: 'ready',
    phaseTimer: 3,
    currentRep: 1,
    targetReps: 10,
    tempoPhase: 'eccentric',
    tempoSecond: 1,
  },

  startRestTimer: (seconds: number, exerciseName?: string) => {
    const endsAt = Date.now() + seconds * 1000;
    set({
      restTimer: {
        isActive: true,
        endsAt,
        totalSeconds: seconds,
        remainingSeconds: seconds,
        exerciseName,
      },
    });
  },

  addRestTime: (seconds: number) => {
    const { restTimer } = get();
    if (!restTimer.isActive) return;
    const endsAt = restTimer.endsAt + seconds * 1000;
    const remainingSeconds = Math.max(0, Math.ceil((endsAt - Date.now()) / 1000));
    set({
      restTimer: {
        ...restTimer,
        endsAt,
        totalSeconds: restTimer.totalSeconds + seconds,
        remainingSeconds,
      },
    });
  },

  stopRestTimer: () => {
    set({
      restTimer: {
        isActive: false,
        endsAt: 0,
        totalSeconds: 0,
        remainingSeconds: 0,
      },
    });
  },

  tickRestTimer: () => {
    const { restTimer } = get();
    if (!restTimer.isActive) return;
    const remaining = Math.max(0, Math.ceil((restTimer.endsAt - Date.now()) / 1000));
    if (remaining <= 0) {
      set({
        restTimer: {
          ...restTimer,
          isActive: false,
          remainingSeconds: 0,
        },
      });
    } else {
      set({
        restTimer: {
          ...restTimer,
          remainingSeconds: remaining,
        },
      });
    }
  },

  startCoachMode: () => {
    const { selectedDay } = get();
    const dayPlan = WORKOUT_DAYS[selectedDay];
    if (!dayPlan || dayPlan.exerciseIds.length === 0) return;

    const firstExercise = EXERCISES[dayPlan.exerciseIds[0]];
    const targetReps = parseInt(firstExercise.reps.split('-')[0]) || 10;

    set({
      coach: {
        isOpen: true,
        isPaused: false,
        voiceEnabled: true,
        soundEnabled: true,
        exerciseIndex: 0,
        setIndex: 0,
        phase: 'ready',
        phaseTimer: 3,
        currentRep: 1,
        targetReps,
        tempoPhase: 'eccentric',
        tempoSecond: 1,
      },
    });
  },

  closeCoachMode: () => {
    set((state) => ({
      coach: { ...state.coach, isOpen: false, isPaused: false },
    }));
  },

  toggleCoachPause: () => {
    set((state) => ({
      coach: { ...state.coach, isPaused: !state.coach.isPaused },
    }));
  },

  toggleVoice: () => {
    set((state) => ({
      coach: { ...state.coach, voiceEnabled: !state.coach.voiceEnabled },
    }));
  },

  toggleSound: () => {
    set((state) => ({
      coach: { ...state.coach, soundEnabled: !state.coach.soundEnabled },
    }));
  },

  skipCoachPhase: () => {
    // advance phase
    const { coach, selectedDay } = get();
    const dayPlan = WORKOUT_DAYS[selectedDay];
    const currentExId = dayPlan.exerciseIds[coach.exerciseIndex];
    const currentEx = EXERCISES[currentExId];

    if (coach.phase === 'ready') {
      set({ coach: { ...coach, phase: 'rep', phaseTimer: 5, currentRep: 1 } });
    } else if (coach.phase === 'rep') {
      // jump to rest
      set({ coach: { ...coach, phase: 'rest', phaseTimer: currentEx.restSeconds } });
    } else if (coach.phase === 'rest') {
      // jump to next set or exercise
      if (coach.setIndex + 1 < currentEx.sets) {
        set({
          coach: {
            ...coach,
            setIndex: coach.setIndex + 1,
            phase: 'ready',
            phaseTimer: 3,
            currentRep: 1,
          },
        });
      } else if (coach.exerciseIndex + 1 < dayPlan.exerciseIds.length) {
        const nextExId = dayPlan.exerciseIds[coach.exerciseIndex + 1];
        const nextEx = EXERCISES[nextExId];
        const targetReps = parseInt(nextEx.reps.split('-')[0]) || 10;
        set({
          coach: {
            ...coach,
            exerciseIndex: coach.exerciseIndex + 1,
            setIndex: 0,
            targetReps,
            phase: 'ready',
            phaseTimer: 3,
            currentRep: 1,
          },
        });
      } else {
        set({ coach: { ...coach, phase: 'done' } });
      }
    }
  },

  updateCoachTick: (deltaSeconds: number) => {
    const { coach, selectedDay, toggleSetComplete } = get();
    if (!coach.isOpen || coach.isPaused || coach.phase === 'done') return;

    const dayPlan = WORKOUT_DAYS[selectedDay];
    const currentExId = dayPlan.exerciseIds[coach.exerciseIndex];
    const currentEx = EXERCISES[currentExId];

    const newTimer = coach.phaseTimer - deltaSeconds;

    if (coach.phase === 'ready') {
      if (newTimer <= 0) {
        set({
          coach: {
            ...coach,
            phase: 'rep',
            phaseTimer: 5, // each rep takes 5s: 3s down, 1s hold, 1s up
            currentRep: 1,
            tempoPhase: 'eccentric',
            tempoSecond: 1,
          },
        });
      } else {
        set({ coach: { ...coach, phaseTimer: newTimer } });
      }
    } else if (coach.phase === 'rep') {
      // 5-second rep calculation
      // 0s-3s: eccentric (نزول بطيء 1, 2, 3)
      // 3s-4s: isometric (ثبات 1s)
      // 4s-5s: concentric (ادفع/اسحب 1s)
      const elapsedInRep = 5 - newTimer;
      let tempoPhase: 'eccentric' | 'isometric' | 'concentric' = 'eccentric';
      let tempoSecond = 1;

      if (elapsedInRep < 3) {
        tempoPhase = 'eccentric';
        tempoSecond = Math.min(3, Math.floor(elapsedInRep) + 1);
      } else if (elapsedInRep < 4) {
        tempoPhase = 'isometric';
        tempoSecond = 1;
      } else {
        tempoPhase = 'concentric';
        tempoSecond = 1;
      }

      if (newTimer <= 0) {
        // finished one rep
        if (coach.currentRep < coach.targetReps) {
          set({
            coach: {
              ...coach,
              currentRep: coach.currentRep + 1,
              phaseTimer: 5,
              tempoPhase: 'eccentric',
              tempoSecond: 1,
            },
          });
        } else {
          // Finished all reps for this set!
          toggleSetComplete(currentExId, coach.setIndex);
          set({
            coach: {
              ...coach,
              phase: 'rest',
              phaseTimer: currentEx.restSeconds,
            },
          });
        }
      } else {
        set({
          coach: {
            ...coach,
            phaseTimer: newTimer,
            tempoPhase,
            tempoSecond,
          },
        });
      }
    } else if (coach.phase === 'rest') {
      if (newTimer <= 0) {
        // rest ended, move to next set or exercise
        if (coach.setIndex + 1 < currentEx.sets) {
          set({
            coach: {
              ...coach,
              setIndex: coach.setIndex + 1,
              phase: 'ready',
              phaseTimer: 3,
              currentRep: 1,
            },
          });
        } else if (coach.exerciseIndex + 1 < dayPlan.exerciseIds.length) {
          const nextExId = dayPlan.exerciseIds[coach.exerciseIndex + 1];
          const nextEx = EXERCISES[nextExId];
          const targetReps = parseInt(nextEx.reps.split('-')[0]) || 10;
          set({
            coach: {
              ...coach,
              exerciseIndex: coach.exerciseIndex + 1,
              setIndex: 0,
              targetReps,
              phase: 'ready',
              phaseTimer: 3,
              currentRep: 1,
            },
          });
        } else {
          set({ coach: { ...coach, phase: 'done' } });
        }
      } else {
        set({ coach: { ...coach, phaseTimer: newTimer } });
      }
    }
  },

  updateSet: (exerciseId, setIndex, field, value) => {
    const { activeSets, workoutStartTime } = get();
    const currentList = activeSets[exerciseId] || [];
    const updatedList = [...currentList];

    if (!updatedList[setIndex]) {
      updatedList[setIndex] = { reps: '', load: '', completed: false };
    }
    updatedList[setIndex] = { ...updatedList[setIndex], [field]: value };

    set({
      activeSets: {
        ...activeSets,
        [exerciseId]: updatedList,
      },
      workoutStartTime: workoutStartTime || Date.now(),
    });
  },

  toggleSetComplete: (exerciseId, setIndex) => {
    const { activeSets, workoutStartTime, startRestTimer } = get();
    const currentList = activeSets[exerciseId] || [];
    const updatedList = [...currentList];

    if (!updatedList[setIndex]) {
      const exercise = EXERCISES[exerciseId];
      const targetReps = exercise?.reps.split('-')[0] || '10';
      updatedList[setIndex] = { reps: targetReps, load: '', completed: true };
    } else {
      updatedList[setIndex] = {
        ...updatedList[setIndex],
        completed: !updatedList[setIndex].completed,
      };
    }

    const wasJustCompleted = updatedList[setIndex].completed;

    set({
      activeSets: {
        ...activeSets,
        [exerciseId]: updatedList,
      },
      workoutStartTime: workoutStartTime || Date.now(),
    });

    if (wasJustCompleted) {
      const exercise = EXERCISES[exerciseId];
      if (exercise) {
        startRestTimer(exercise.restSeconds, exercise.nameAr);
      }
    }
  },

  finishAndSaveWorkout: async () => {
    const { activeSets, selectedDay, workoutStartTime } = get();
    const dayPlan = WORKOUT_DAYS[selectedDay];

    let totalCompletedSets = 0;
    let totalCompletedReps = 0;
    const loggedMap: Record<string, { setIndex: number; reps: number; load: string }[]> = {};

    Object.entries(activeSets).forEach(([exId, sets]) => {
      const completedSets = sets
        .map((s, idx) => ({ ...s, idx }))
        .filter((s) => s.completed);

      if (completedSets.length > 0) {
        loggedMap[exId] = completedSets.map((s) => {
          const repsNum = parseInt(s.reps) || 0;
          totalCompletedSets += 1;
          totalCompletedReps += repsNum;
          return { setIndex: s.idx, reps: repsNum, load: s.load };
        });
      }
    });

    if (totalCompletedSets === 0) {
      return false;
    }

    const durationMinutes = workoutStartTime
      ? Math.max(1, Math.round((Date.now() - workoutStartTime) / 60000))
      : 15;

    const record: WorkoutSessionRecord = {
      ts: Date.now(),
      date: new Date().toISOString().slice(0, 10),
      dayIndex: selectedDay,
      dayName: dayPlan.nameAr,
      totalSets: totalCompletedSets,
      totalReps: totalCompletedReps,
      durationMinutes,
      exercisesLogged: loggedMap,
    };

    // Save to Dexie
    await db.sessions.add(record);

    // Save last logs for each exercise
    for (const [exId, sets] of Object.entries(activeSets)) {
      if (sets && sets.length > 0) {
        const lastLog: ExerciseLastLog = {
          exerciseId: exId,
          lastUpdated: Date.now(),
          sets: sets.map((s) => ({ reps: s.reps, load: s.load, completed: s.completed })),
        };
        await db.exerciseLastLogs.put(lastLog);
      }
    }

    // Reset current active session
    set({
      activeSets: {},
      workoutStartTime: null,
      restTimer: { isActive: false, endsAt: 0, totalSeconds: 0, remainingSeconds: 0 },
    });

    // Refresh previous logs
    await get().loadInitialData();
    return true;
  },

  loadInitialData: async () => {
    try {
      const allLastLogs = await db.exerciseLastLogs.toArray();
      const prevMap: Record<string, { reps: string; load: string }[]> = {};
      allLastLogs.forEach((l) => {
        prevMap[l.exerciseId] = l.sets.map((s) => ({ reps: s.reps, load: s.load }));
      });
      set({ previousLogs: prevMap });
    } catch (e) {
      console.warn('Failed to load initial db logs:', e);
    }
  },
}));
