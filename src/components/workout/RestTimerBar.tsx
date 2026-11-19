import React, { useEffect } from 'react';
import { useWorkoutStore } from '../../stores/useWorkoutStore';
import { Timer, Plus, SkipForward, X } from 'lucide-react';

export const RestTimerBar: React.FC = () => {
  const { restTimer, addRestTime, stopRestTimer, tickRestTimer } = useWorkoutStore();

  useEffect(() => {
    if (!restTimer.isActive) return;
    const interval = setInterval(tickRestTimer, 250);
    return () => clearInterval(interval);
  }, [restTimer.isActive, tickRestTimer]);

  if (!restTimer.isActive) return null;

  const minutes = Math.floor(restTimer.remainingSeconds / 60);
  const seconds = restTimer.remainingSeconds % 60;
  const timeFormatted = `${minutes}:${String(seconds).padStart(2, '0')}`;
  const progressPercent = Math.min(100, Math.max(0, (restTimer.remainingSeconds / restTimer.totalSeconds) * 100));

  return (
    <div className="fixed bottom-[72px] inset-x-3 z-30 max-w-md mx-auto">
      <div className="glass-panel-elevated rounded-2xl p-3 border border-[#ff3d5a]/30 shadow-2xl overflow-hidden relative">
        {/* Glow background accent */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-[#ff3d5a]/10 rounded-full blur-2xl pointer-events-none" />

        <div className="flex items-center justify-between gap-3 relative z-10">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-[#ff3d5a]/20 border border-[#ff3d5a]/40 flex items-center justify-center text-[#ff3d5a] font-bold text-lg animate-pulse">
              <Timer className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-baseline gap-1.5">
                <span className="text-xl font-bold tracking-tight text-white font-mono" dir="ltr">
                  {timeFormatted}
                </span>
                <span className="text-[11px] text-zinc-400 font-medium">راحة استشفاء</span>
              </div>
              <p className="text-xs text-zinc-300 truncate max-w-[160px]">
                {restTimer.exerciseName || 'المجموعة التالية'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              onClick={() => addRestTime(15)}
              className="px-2.5 py-1.5 rounded-xl bg-white/10 hover:bg-white/15 text-xs font-semibold text-white transition-all flex items-center gap-1"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>15ث</span>
            </button>
            <button
              onClick={stopRestTimer}
              className="px-2.5 py-1.5 rounded-xl bg-[#ff3d5a] hover:bg-[#ff5c74] text-xs font-semibold text-white transition-all flex items-center gap-1"
            >
              <SkipForward className="w-3.5 h-3.5" />
              <span>تخطي</span>
            </button>
          </div>
        </div>

        {/* Dynamic Progress Bar */}
        <div className="w-full bg-white/10 h-1.5 rounded-full overflow-hidden mt-2.5">
          <div
            className="h-full bg-gradient-to-r from-[#ff3d5a] to-[#ff758c] transition-all duration-300 rounded-full"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>
    </div>
  );
};
