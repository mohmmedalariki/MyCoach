import React, { useState } from 'react';
import { type Exercise, MUSCLE_NAMES } from '../../data/exercises';
import { useWorkoutStore } from '../../stores/useWorkoutStore';
import { ExerciseViewer3D } from '../3d/ExerciseViewer3D';
import { AnatomicalVectorViewer } from '../vector-motion/AnatomicalVectorViewer';
import {
  Check,
  ChevronDown,
  ChevronUp,
  Info,
  Timer,
  Layers,
  Sparkles,
  HelpCircle,
  Activity,
  Box,
} from 'lucide-react';

interface ExerciseCardProps {
  exercise: Exercise;
}

export const ExerciseCard: React.FC<ExerciseCardProps> = ({ exercise }) => {
  const { activeSets, previousLogs, updateSet, toggleSetComplete, startRestTimer } =
    useWorkoutStore();

  // Visualizer Mode: 'vector' (Option 3: Premium 2D Anatomical Vector) | '3d' | 'hidden'
  const [visualizerMode, setVisualizerMode] = useState<'vector' | '3d' | 'hidden'>('vector');
  const [showInstructions, setShowInstructions] = useState(false);

  const currentSets = activeSets[exercise.id] || [];
  const prevSets = previousLogs[exercise.id] || [];

  return (
    <div className="glass-panel rounded-2xl p-4 border border-white/10 hover:border-white/15 transition-all shadow-lg mb-4">
      {/* Header */}
      <div className="flex items-start justify-between gap-3 mb-3">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-lg font-bold text-white tracking-tight">{exercise.nameAr}</h3>
            {exercise.note && (
              <span className="px-2 py-0.5 rounded-full bg-[#ff3d5a]/20 border border-[#ff3d5a]/30 text-[#ff758c] text-[11px] font-semibold">
                {exercise.note}
              </span>
            )}
          </div>
          <p className="text-xs text-zinc-400 font-mono tracking-wide" dir="ltr">
            {exercise.nameEn}
          </p>
        </div>

        {/* Rest Timer quick button */}
        <button
          onClick={() => startRestTimer(exercise.restSeconds, exercise.nameAr)}
          className="flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs text-zinc-300 transition-colors"
          title="بدء مؤقت الراحة لهذا التمرين"
        >
          <Timer className="w-3.5 h-3.5 text-[#00f59b]" />
          <span dir="ltr">
            {Math.floor(exercise.restSeconds / 60)}:
            {String(exercise.restSeconds % 60).padStart(2, '0')}
          </span>
        </button>
      </div>

      {/* Mode Switcher Bar */}
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-1 bg-black/40 p-1 rounded-xl border border-white/10 text-xs">
          <button
            onClick={() => setVisualizerMode('vector')}
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg transition-all font-medium ${
              visualizerMode === 'vector'
                ? 'bg-[#ff3d5a] text-white shadow-md'
                : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            <Activity className="w-3.5 h-3.5" />
            <span>التشريح الحركي 2D (الأساسي)</span>
          </button>
          <button
            onClick={() => setVisualizerMode('3d')}
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg transition-all font-medium ${
              visualizerMode === '3d'
                ? 'bg-[#00f59b] text-black font-semibold shadow-md'
                : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            <Box className="w-3.5 h-3.5" />
            <span>مجسم 3D</span>
          </button>
        </div>

        {visualizerMode !== 'hidden' && (
          <button
            onClick={() => setVisualizerMode('hidden')}
            className="text-[11px] text-zinc-400 hover:text-zinc-200 px-2 py-1 rounded-lg bg-white/5 border border-white/10"
          >
            إخفاء
          </button>
        )}
      </div>

      {/* Visualization Canvas */}
      {visualizerMode === 'vector' && (
        <div className="mb-3 relative">
          <AnatomicalVectorViewer
            exerciseId={exercise.id}
            exerciseNameAr={exercise.nameAr}
            targetMuscles={exercise.primaryMuscles}
            height="290px"
            onHide={() => setVisualizerMode('hidden')}
            onToggleViewMode={() => setVisualizerMode('3d')}
          />
        </div>
      )}

      {visualizerMode === '3d' && (
        <div className="mb-3 relative">
          <ExerciseViewer3D
            poseId={exercise.poseId}
            exerciseNameAr={exercise.nameAr}
            targetMuscles={exercise.primaryMuscles}
            height="290px"
            onHide={() => setVisualizerMode('hidden')}
          />
        </div>
      )}

      {visualizerMode === 'hidden' && (
        <div className="grid grid-cols-2 gap-2 mb-3">
          <button
            onClick={() => setVisualizerMode('vector')}
            className="py-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 flex items-center justify-center gap-2 text-xs text-zinc-300 font-medium transition-all"
          >
            <Activity className="w-4 h-4 text-[#ff3d5a]" />
            <span>عرض المتجه التشريحي 2D</span>
          </button>
          <button
            onClick={() => setVisualizerMode('3d')}
            className="py-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 flex items-center justify-center gap-2 text-xs text-zinc-300 font-medium transition-all"
          >
            <Box className="w-4 h-4 text-[#00f59b]" />
            <span>عرض مجسم 3D</span>
          </button>
        </div>
      )}

      {/* Target Muscle Badges */}
      <div className="flex flex-wrap items-center gap-1.5 mb-3">
        <div className="flex items-center gap-1">
          <Layers className="w-3.5 h-3.5 text-[#ff3d5a]" />
          <span className="text-[11px] text-zinc-400">المحرك الأساسي:</span>
        </div>
        {exercise.primaryMuscles.map((m) => (
          <span
            key={m}
            className="px-2.5 py-0.5 rounded-lg bg-[#ff3d5a]/20 border border-[#ff3d5a]/40 text-[#ff758c] text-xs font-semibold"
          >
            {MUSCLE_NAMES[m]?.ar || m}
          </span>
        ))}

        {exercise.secondaryMuscles.length > 0 && (
          <>
            <span className="text-[11px] text-zinc-500 mr-1">مساعد:</span>
            {exercise.secondaryMuscles.map((m) => (
              <span
                key={m}
                className="px-2 py-0.5 rounded-lg bg-white/5 border border-white/10 text-zinc-300 text-xs font-medium"
              >
                {MUSCLE_NAMES[m]?.ar || m}
              </span>
            ))}
          </>
        )}
      </div>

      {/* Biomechanical Coaching Cue */}
      <div className="p-2.5 rounded-xl bg-[#00f59b]/5 border border-[#00f59b]/15 text-xs text-[#00f59b] font-medium flex items-start gap-2 mb-3">
        <Info className="w-4 h-4 shrink-0 mt-0.5" />
        <span>{exercise.cue}</span>
      </div>

      {/* Collapsible Setup Instructions ("كيف تؤدي الحركة؟") */}
      <div className="mb-4">
        <button
          onClick={() => setShowInstructions(!showInstructions)}
          className="flex items-center justify-between w-full text-xs font-semibold text-zinc-400 hover:text-zinc-200 transition-colors py-1"
        >
          <span className="flex items-center gap-1.5 text-zinc-300">
            <HelpCircle className="w-3.5 h-3.5 text-[#00f59b]" />
            <span>تفاصيل الإعداد والأداء السليم</span>
          </span>
          {showInstructions ? (
            <ChevronUp className="w-4 h-4" />
          ) : (
            <ChevronDown className="w-4 h-4" />
          )}
        </button>

        {showInstructions && (
          <div className="mt-2.5 p-3 rounded-xl bg-black/40 border border-white/5 text-xs space-y-2 text-zinc-300">
            <p className="text-zinc-400 font-normal leading-relaxed">
              <strong className="text-white font-semibold">الأساس الميكانيكي: </strong>
              {exercise.biomechanicsNote}
            </p>
            <div className="pt-2 border-t border-white/5 space-y-1.5">
              <strong className="text-zinc-200 font-semibold block mb-1">خطوات التنفيذ:</strong>
              {exercise.setupInstructions.map((step, idx) => (
                <div key={idx} className="flex items-start gap-2 text-zinc-300">
                  <span className="w-4 h-4 rounded-full bg-white/10 text-[10px] flex items-center justify-center shrink-0 mt-0.5 text-zinc-400 font-mono">
                    {idx + 1}
                  </span>
                  <span className="leading-relaxed">{step}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Sets Tracker Table */}
      <div className="space-y-2">
        <div className="grid grid-cols-12 gap-2 text-[11px] font-bold text-zinc-400 px-2 py-1 bg-white/5 rounded-lg border border-white/5">
          <span className="col-span-2 text-center">المجموعة</span>
          <span className="col-span-3 text-center">السابقة</span>
          <span className="col-span-3 text-center">التكرارات</span>
          <span className="col-span-2 text-center">الوزن / الباند</span>
          <span className="col-span-2 text-center">تم</span>
        </div>

        {currentSets.map((s) => {
          const prev = prevSets[s.setNumber - 1];
          return (
            <div
              key={s.setNumber}
              className={`grid grid-cols-12 gap-2 items-center px-2 py-2 rounded-xl transition-all border ${
                s.completed
                  ? 'bg-[#00f59b]/10 border-[#00f59b]/30'
                  : 'bg-white/5 border-white/5 hover:border-white/10'
              }`}
            >
              {/* Set number */}
              <div className="col-span-2 flex items-center justify-center font-bold font-mono text-xs text-white">
                #{s.setNumber}
              </div>

              {/* Previous performance */}
              <div className="col-span-3 text-center text-xs text-zinc-400 font-mono" dir="ltr">
                {prev ? `${prev.reps} × ${prev.weight || 'BW'}` : '—'}
              </div>

              {/* Reps input */}
              <div className="col-span-3 flex justify-center">
                <input
                  type="number"
                  min="0"
                  max="100"
                  value={s.reps || ''}
                  onChange={(e) =>
                    updateSet(exercise.id, s.setNumber, {
                      reps: parseInt(e.target.value) || 0,
                    })
                  }
                  className="w-16 h-8 text-center rounded-lg bg-black/50 border border-white/10 text-white font-mono text-sm focus:outline-none focus:border-[#00f59b] transition-colors"
                  placeholder={exercise.reps}
                  dir="ltr"
                />
              </div>

              {/* Weight or Band input */}
              <div className="col-span-2 flex justify-center">
                <input
                  type="text"
                  value={s.weight || ''}
                  onChange={(e) =>
                    updateSet(exercise.id, s.setNumber, {
                      weight: e.target.value,
                    })
                  }
                  className="w-16 h-8 text-center rounded-lg bg-black/50 border border-white/10 text-white font-mono text-xs focus:outline-none focus:border-[#00f59b] transition-colors"
                  placeholder="BW / باند"
                />
              </div>

              {/* Complete Checkbox */}
              <div className="col-span-2 flex justify-center">
                <button
                  onClick={() => toggleSetComplete(exercise.id, s.setNumber)}
                  className={`w-8 h-8 rounded-lg flex items-center justify-center transition-all ${
                    s.completed
                      ? 'bg-[#00f59b] text-black shadow-md shadow-[#00f59b]/30'
                      : 'bg-white/10 hover:bg-white/20 text-transparent hover:text-white/40 border border-white/10'
                  }`}
                  title="تأكيد إكمال المجموعة"
                >
                  <Check className="w-4 h-4 stroke-[3]" />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
