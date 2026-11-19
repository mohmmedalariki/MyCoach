import React, { useState, useEffect } from 'react';
import { useWorkoutStore } from '../../stores/useWorkoutStore';
import { WORKOUT_DAYS, EXERCISES } from '../../data/exercises';
import { ExerciseCard } from './ExerciseCard';
import { Play, CheckCircle2, Moon, Flame, Sparkles } from 'lucide-react';
import confetti from 'canvas-confetti';

export const WorkoutView: React.FC = () => {
  const {
    selectedDay,
    setSelectedDay,
    activeSets,
    workoutStartTime,
    finishAndSaveWorkout,
    startCoachMode,
  } = useWorkoutStore();

  const [elapsedTime, setElapsedTime] = useState('0:00');
  const [isFinishing, setIsFinishing] = useState(false);
  const [feedbackMsg, setFeedbackMsg] = useState<string | null>(null);

  const dayPlan = WORKOUT_DAYS[selectedDay] || WORKOUT_DAYS[0];

  // Calculate workout statistics
  const totalPlannedSets = dayPlan.exerciseIds.reduce((sum, id) => {
    return sum + (EXERCISES[id]?.sets || 0);
  }, 0);

  let completedSetsCount = 0;
  Object.values(activeSets).forEach((sets) => {
    sets.forEach((s) => {
      if (s && s.completed) completedSetsCount++;
    });
  });

  const progressPercent = totalPlannedSets > 0
    ? Math.min(100, Math.round((completedSetsCount / totalPlannedSets) * 100))
    : 0;

  // Live timer tick
  useEffect(() => {
    if (!workoutStartTime) {
      setElapsedTime('0:00');
      return;
    }
    const interval = setInterval(() => {
      const elapsedSeconds = Math.floor((Date.now() - workoutStartTime) / 1000);
      const minutes = Math.floor(elapsedSeconds / 60);
      const seconds = elapsedSeconds % 60;
      setElapsedTime(`${minutes}:${String(seconds).padStart(2, '0')}`);
    }, 1000);

    return () => clearInterval(interval);
  }, [workoutStartTime]);

  const handleFinish = async () => {
    setIsFinishing(true);
    const success = await finishAndSaveWorkout();
    setIsFinishing(false);

    if (success) {
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#ff3d5a', '#00f59b', '#ffffff'],
      });
      setFeedbackMsg('تم حفظ التمرين بنجاح! عاش يا بطل 💪');
      setTimeout(() => setFeedbackMsg(null), 3000);
    } else {
      setFeedbackMsg('أكمل مجموعة واحدة على الأقل قبل الإنهاء.');
      setTimeout(() => setFeedbackMsg(null), 3000);
    }
  };

  return (
    <div className="space-y-4 pb-28">
      {/* Toast Feedback */}
      {feedbackMsg && (
        <div className="fixed top-4 inset-x-4 z-50 max-w-sm mx-auto p-3 rounded-2xl bg-[#ff3d5a] text-white font-semibold text-center text-sm shadow-2xl animate-bounce">
          {feedbackMsg}
        </div>
      )}

      {/* Header Info */}
      <div className="flex items-center justify-between pt-1">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2">
            <span>مدرّب الضخامة</span>
            <span className="px-2 py-0.5 rounded-full bg-[#ff3d5a]/20 text-[#ff758c] text-xs font-mono">
              3D PWA
            </span>
          </h1>
          <p className="text-xs text-zinc-400 font-medium">
            59 كجم · 173 سم · 4 أيام تمرين + 3 راحة · إيقاع 3-1-1
          </p>
        </div>
      </div>

      {/* Day Selection Chips (7 Days) */}
      <div className="grid grid-cols-7 gap-1.5">
        {WORKOUT_DAYS.map((day, idx) => {
          const isSelected = selectedDay === idx;
          return (
            <button
              key={idx}
              onClick={() => setSelectedDay(idx)}
              className={`flex flex-col items-center justify-center py-2 px-1 rounded-xl transition-all select-none ${
                isSelected
                  ? 'bg-[#ff3d5a] text-white font-bold shadow-[0_0_16px_rgba(255,61,90,0.5)] scale-105'
                  : 'bg-white/5 border border-white/5 text-zinc-400 hover:text-white hover:bg-white/10'
              }`}
            >
              <span className="text-sm font-bold font-mono">{idx + 1}</span>
              <span className="text-[10px] font-medium truncate w-full text-center">
                {day.nameAr}
              </span>
            </button>
          );
        })}
      </div>

      {/* Selected Day Workout Dashboard Card */}
      {dayPlan.isRest ? (
        <div className="glass-panel rounded-2xl p-6 border border-white/10 text-center space-y-3">
          <div className="w-14 h-14 rounded-2xl bg-[#00f59b]/15 text-[#00f59b] flex items-center justify-center mx-auto border border-[#00f59b]/25">
            <Moon className="w-7 h-7" />
          </div>
          <h2 className="text-xl font-bold text-white">يوم استشفاء ونمو عضلي</h2>
          <p className="text-sm text-zinc-300 leading-relaxed max-w-md mx-auto">
            الاستشفاء هو الوقت الفعلي الذي تنمو فيه ألياف العضلات ويُعاد فيه بناء مخازن الجليكوجين.
            تجنب أي مجهود مقاومة شاق، ويكفي المشي الخفيف لتنشيط الدورة الدموية.
          </p>
          <div className="p-3 rounded-xl bg-white/5 border border-white/10 text-xs text-zinc-400 font-medium max-w-sm mx-auto">
            💡 تذكير: واصل استهلاك هدفك من البروتين (115-130 جم) والسعرات اليوم أيضاً.
          </div>
        </div>
      ) : (
        <div className="glass-panel rounded-2xl p-4 border border-white/10 space-y-3 shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-[#ff3d5a] animate-pulse" />
                <h2 className="text-lg font-bold text-white">
                  اليوم {selectedDay + 1}: {dayPlan.nameAr}
                </h2>
              </div>
              <p className="text-xs text-zinc-400 font-medium mt-0.5">{dayPlan.focus}</p>
            </div>

            {/* Timer */}
            <div className="text-left font-mono" dir="ltr">
              <span className="text-xl font-bold text-white">{elapsedTime}</span>
              <span className="block text-[10px] text-zinc-500 font-sans">مدة الجلسة</span>
            </div>
          </div>

          {/* Progress bar */}
          <div className="space-y-1">
            <div className="flex justify-between text-xs text-zinc-400 font-medium">
              <span>نسبة الإنجاز</span>
              <span>
                {completedSetsCount} من {totalPlannedSets} مجموعة ({progressPercent}%)
              </span>
            </div>
            <div className="w-full bg-white/10 h-2 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-[#ff3d5a] to-[#00f59b] transition-all duration-300 rounded-full"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-2.5 pt-1">
            <button
              onClick={startCoachMode}
              className="flex-1 py-2.5 px-4 rounded-xl bg-[#ff3d5a] hover:bg-[#ff5c74] text-white font-bold text-sm shadow-[0_0_16px_rgba(255,61,90,0.4)] transition-all flex items-center justify-center gap-2"
            >
              <Play className="w-4 h-4 fill-white" />
              <span>وضع المدرب 3D</span>
            </button>

            <button
              onClick={handleFinish}
              disabled={isFinishing || completedSetsCount === 0}
              className="py-2.5 px-4 rounded-xl bg-white/10 hover:bg-white/15 disabled:opacity-40 text-white font-semibold text-sm transition-all flex items-center gap-1.5"
            >
              <CheckCircle2 className="w-4 h-4 text-[#00f59b]" />
              <span>إنهاء وحفظ</span>
            </button>
          </div>
        </div>
      )}

      {/* Exercise Cards */}
      {!dayPlan.isRest && (
        <div className="space-y-4">
          {dayPlan.exerciseIds.map((exId) => {
            const ex = EXERCISES[exId];
            if (!ex) return null;
            return <ExerciseCard key={ex.id} exercise={ex} />;
          })}
        </div>
      )}
    </div>
  );
};
