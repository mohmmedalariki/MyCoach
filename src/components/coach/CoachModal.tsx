import React, { useEffect, useRef, useState } from 'react';
import { useWorkoutStore } from '../../stores/useWorkoutStore';
import { WORKOUT_DAYS, EXERCISES } from '../../data/exercises';
import { ExerciseViewer3D } from '../3d/ExerciseViewer3D';
import { AnatomicalVectorViewer } from '../vector-motion/AnatomicalVectorViewer';
import {
  X,
  Play,
  Pause,
  SkipForward,
  Volume2,
  VolumeX,
  Mic,
  MicOff,
  Flame,
  Layers,
  Activity,
  Box,
} from 'lucide-react';

export const CoachModal: React.FC = () => {
  const {
    coach,
    selectedDay,
    closeCoachMode,
    toggleCoachPause,
    toggleVoice,
    toggleSound,
    skipCoachPhase,
    updateCoachTick,
  } = useWorkoutStore();

  const [coachViewMode, setCoachViewMode] = useState<'vector' | '3d'>('vector');

  const dayPlan = WORKOUT_DAYS[selectedDay] || WORKOUT_DAYS[0];
  const currentExId = dayPlan?.exerciseIds[coach.exerciseIndex];
  const currentEx = EXERCISES[currentExId];

  // Audio Context for tones
  const audioCtxRef = useRef<AudioContext | null>(null);

  const playTone = (frequency: number, duration: number) => {
    if (!coach.soundEnabled) return;
    try {
      if (!audioCtxRef.current) {
        audioCtxRef.current = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
      }
      const ctx = audioCtxRef.current;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.frequency.value = frequency;
      gain.gain.value = 0.15;
      osc.start();
      osc.stop(ctx.currentTime + duration);
    } catch {
      // Audio might be blocked until user gesture
    }
  };

  const speakArabic = (text: string) => {
    if (!coach.voiceEnabled || !('speechSynthesis' in window)) return;
    try {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'ar-SA';
      utterance.rate = 1.05;
      window.speechSynthesis.speak(utterance);
    } catch {
      // ignore
    }
  };

  // Timer tick
  useEffect(() => {
    if (!coach.isOpen) return;

    let lastTime = performance.now();
    const interval = setInterval(() => {
      const now = performance.now();
      const delta = (now - lastTime) / 1000;
      lastTime = now;
      updateCoachTick(delta);
    }, 100);

    return () => clearInterval(interval);
  }, [coach.isOpen, coach.isPaused, updateCoachTick]);

  // Track phase changes to trigger speech/beeps
  const prevPhaseRef = useRef(coach.phase);
  const prevRepRef = useRef(coach.currentRep);

  useEffect(() => {
    if (!coach.isOpen) return;

    if (coach.phase !== prevPhaseRef.current) {
      if (coach.phase === 'ready') {
        playTone(660, 0.15);
        speakArabic(`استعد. تمرين ${currentEx?.nameAr || ''}`);
      } else if (coach.phase === 'rep') {
        playTone(880, 0.25);
        speakArabic('ابدأ');
      } else if (coach.phase === 'rest') {
        playTone(520, 0.3);
        speakArabic(`استراحة. خذ نفساً عميقاً`);
      } else if (coach.phase === 'done') {
        playTone(1000, 0.5);
        speakArabic('عاش يا بطل! أنهيت التمرين بنجاح');
      }
      prevPhaseRef.current = coach.phase;
    }

    if (coach.phase === 'rep' && coach.currentRep !== prevRepRef.current) {
      playTone(880, 0.2);
      speakArabic(`تكرار ${coach.currentRep}`);
      prevRepRef.current = coach.currentRep;
    }
  }, [coach.phase, coach.currentRep, coach.isOpen, currentEx]);

  if (!coach.isOpen || !currentEx) return null;

  // Title and subtitle according to coach phase
  let phaseTitle = '';
  let phaseSubtitle = '';
  let phaseProgressPercent = 0;

  if (coach.phase === 'ready') {
    phaseTitle = `${Math.ceil(coach.phaseTimer)}ث`;
    phaseSubtitle = 'استعد، خذ الوضعية الصحيحة للباند أو الجسم';
    phaseProgressPercent = ((3 - coach.phaseTimer) / 3) * 100;
  } else if (coach.phase === 'rep') {
    phaseTitle = `تكرار ${coach.currentRep} / ${coach.targetReps}`;
    if (coach.tempoPhase === 'eccentric') {
      phaseSubtitle = `نزول بطيء وتحكم (${coach.tempoSecond}ث / 3ث)`;
    } else if (coach.tempoPhase === 'isometric') {
      phaseSubtitle = 'ثبات وإطالة واعتصار (1ث)';
    } else {
      phaseSubtitle = 'ادفع / اسحب بقوة وانفجار (1ث)';
    }
    phaseProgressPercent = (coach.currentRep / coach.targetReps) * 100;
  } else if (coach.phase === 'rest') {
    const mins = Math.floor(coach.phaseTimer / 60);
    const secs = Math.floor(coach.phaseTimer % 60);
    phaseTitle = `${mins}:${String(secs).padStart(2, '0')}`;
    phaseSubtitle = `استراحة استشفاء بين المجموعات (${coach.setIndex + 1} / ${currentEx.sets})`;
    phaseProgressPercent = ((currentEx.restSeconds - coach.phaseTimer) / currentEx.restSeconds) * 100;
  } else if (coach.phase === 'done') {
    phaseTitle = 'أحسنت!';
    phaseSubtitle = 'أنهيت جميع مجموعات التمرين بكفاءة';
    phaseProgressPercent = 100;
  }

  // Calculate synchronized coach progress for Vector Viewer
  const elapsedInRep = 5 - coach.phaseTimer;
  let vectorCoachProgress = 0;
  let vectorCoachPhase: 'eccentric' | 'hold' | 'concentric' = 'eccentric';

  if (coach.phase === 'rep') {
    if (elapsedInRep < 3) {
      vectorCoachPhase = 'eccentric';
      vectorCoachProgress = 1.0 - elapsedInRep / 3.0;
    } else if (elapsedInRep < 4) {
      vectorCoachPhase = 'hold';
      vectorCoachProgress = 1.0;
    } else {
      vectorCoachPhase = 'concentric';
      vectorCoachProgress = (elapsedInRep - 4.0) / 1.0;
    }
  }

  return (
    <div className="fixed inset-0 z-50 bg-[#080d0b] flex flex-col justify-between p-4 overflow-y-auto">
      {/* Top Header Bar */}
      <div className="flex items-center justify-between z-10">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs text-[#ff758c] font-semibold tracking-wide">
              وضع المدرب الرياضي
            </span>
            <div className="flex items-center gap-1 bg-black/50 p-0.5 rounded-lg border border-white/10 text-[11px]">
              <button
                onClick={() => setCoachViewMode('vector')}
                className={`px-2 py-0.5 rounded transition-all font-medium ${
                  coachViewMode === 'vector'
                    ? 'bg-[#ff3d5a] text-white shadow'
                    : 'text-zinc-400 hover:text-white'
                }`}
              >
                2D متجه
              </button>
              <button
                onClick={() => setCoachViewMode('3d')}
                className={`px-2 py-0.5 rounded transition-all font-medium ${
                  coachViewMode === '3d'
                    ? 'bg-[#00f59b] text-black font-semibold shadow'
                    : 'text-zinc-400 hover:text-white'
                }`}
              >
                3D مجسم
              </button>
            </div>
          </div>
          <h2 className="text-lg font-bold text-white tracking-tight mt-0.5">{currentEx.nameAr}</h2>
        </div>

        <div className="flex items-center gap-2">
          {/* Sound toggle */}
          <button
            onClick={toggleSound}
            className="p-2 rounded-xl bg-white/10 hover:bg-white/15 text-white/80 transition-colors"
            title={coach.soundEnabled ? 'كتم الأصوات' : 'تفعيل الأصوات'}
          >
            {coach.soundEnabled ? <Volume2 className="w-4 h-4 text-[#00f59b]" /> : <VolumeX className="w-4 h-4" />}
          </button>

          {/* Voice toggle */}
          <button
            onClick={toggleVoice}
            className="p-2 rounded-xl bg-white/10 hover:bg-white/15 text-white/80 transition-colors"
            title={coach.voiceEnabled ? 'إيقاف الصوت العربي' : 'تفعيل الصوت العربي'}
          >
            {coach.voiceEnabled ? <Mic className="w-4 h-4 text-[#00f59b]" /> : <MicOff className="w-4 h-4" />}
          </button>

          {/* Close button */}
          <button
            onClick={closeCoachMode}
            className="p-2 rounded-xl bg-white/10 hover:bg-white/15 text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Main Arena: 2D Anatomical Vector (Option 3) OR 3D */}
      <div className="my-2 relative flex-1 min-h-[300px] max-h-[460px] flex items-center justify-center">
        {coachViewMode === 'vector' ? (
          <div className="w-full h-full max-w-xl mx-auto flex items-center justify-center">
            <AnatomicalVectorViewer
              exerciseId={currentEx.id}
              exerciseNameAr={currentEx.nameAr}
              targetMuscles={currentEx.primaryMuscles}
              height="100%"
              isCoachMode={coach.phase === 'rep'}
              coachProgress={vectorCoachProgress}
              coachPhase={vectorCoachPhase}
              onToggleViewMode={() => setCoachViewMode('3d')}
            />
          </div>
        ) : (
          <ExerciseViewer3D
            poseId={currentEx.poseId}
            exerciseNameAr={currentEx.nameAr}
            targetMuscles={currentEx.primaryMuscles}
            height="100%"
            className="shadow-2xl border border-white/15"
          />
        )}
      </div>

      {/* Live Coach Control & Counter Dashboard */}
      <div className="glass-panel-elevated rounded-3xl p-5 border border-white/15 space-y-4">
        {/* Big Counter */}
        <div className="text-center">
          <div className="text-5xl font-black text-white font-mono tracking-tight" dir="ltr">
            {phaseTitle}
          </div>
          <p className="text-sm font-semibold text-[#00f59b] mt-1">{phaseSubtitle}</p>
        </div>

        {/* Progress Bar */}
        <div className="w-full bg-white/10 h-2 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-[#ff3d5a] via-[#ff758c] to-[#00f59b] transition-all duration-200 rounded-full"
            style={{ width: `${Math.min(100, Math.max(0, phaseProgressPercent))}%` }}
          />
        </div>

        {/* Action Controls */}
        <div className="flex items-center justify-center gap-3 pt-1">
          <button
            onClick={toggleCoachPause}
            className="flex-1 py-3 px-5 rounded-2xl bg-white/10 hover:bg-white/15 text-white font-bold text-sm transition-all flex items-center justify-center gap-2"
          >
            {coach.isPaused ? (
              <>
                <Play className="w-4 h-4 fill-white" />
                <span>متابعة</span>
              </>
            ) : (
              <>
                <Pause className="w-4 h-4" />
                <span>إيقاف مؤقت</span>
              </>
            )}
          </button>

          <button
            onClick={skipCoachPhase}
            className="flex-1 py-3 px-5 rounded-2xl bg-[#ff3d5a] hover:bg-[#ff5c74] text-white font-bold text-sm shadow-[0_0_20px_rgba(255,61,90,0.4)] transition-all flex items-center justify-center gap-2"
          >
            <SkipForward className="w-4 h-4" />
            <span>تخطي المرحلة</span>
          </button>
        </div>
      </div>
    </div>
  );
};
