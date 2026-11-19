import React, { useState } from 'react';
import { WORKOUT_DAYS, EXERCISES, MUSCLE_NAMES } from '../../data/exercises';
import { Layers, Activity, Info, CheckCircle2 } from 'lucide-react';

type FilterCategory = 'all' | 0 | 1 | 2 | 4; // index in WORKOUT_DAYS

// Anatomical SVG polygon coordinates ported and sharpened from anatomical references
const MUSCLE_POLYGONS: {
  front: Record<string, string[]>;
  back: Record<string, string[]>;
} = {
  front: {
    chest: [
      '51.8 41.6 51 55.1 58 58 67.8 55.5 70.6 47.3 62 41.6',
      '29.8 46.5 31.4 55.5 40.8 58 48.2 55.1 47.8 42 37.6 42',
    ],
    'front-deltoids': [
      '78.4 53.1 79.6 47.8 79.2 41.2 75.9 38 71 36.3 72.2 42.9 71.4 47.3',
      '28.2 47.3 21.2 53.1 20 47.8 20.4 40.8 24.5 37.1 28.6 37.1 26.9 43.3',
    ],
    biceps: [
      '16.7 68.2 18 71.4 22.9 66.1 29 53.9 27.8 49.4 20.4 55.9',
      '71.4 49.4 70.2 54.7 76.3 66.1 81.6 71.8 82.9 69 78.8 55.5',
    ],
    abs: [
      '56.3 59.2 58 64.1 58.4 78 58.4 92.7 56.3 98.4 55.1 104.1 51.4 107.8 51 84.5 50.6 67.3 51 57.1',
      '43.7 58.8 48.6 57.1 49 67.3 48.6 84.5 48.2 107.3 44.5 103.7 40.8 91.4 40.8 78.4 41.2 64.5',
    ],
    obliques: [
      '68.6 63.3 67.3 57.1 58.8 59.6 60 64.1 60.4 83.3 65.7 78.8 66.5 69.8',
      '33.9 78.4 33.1 71.8 31 63.3 32.2 57.1 40.8 59.2 39.2 63.3 39.2 83.7',
    ],
    quadriceps: [
      '34.7 98.8 37.1 108.2 37.1 127.8 34.3 137.1 31 132.7 29.4 120 28.2 111.4 29.4 100.8 32.2 94.7',
      '63.3 105.7 64.5 100 66.9 94.7 70.2 101.2 71 111.8 68.2 133.1 65.3 137.6 62.4 128.6 62 111.4',
    ],
    calves: [
      '71.4 160.4 73.5 153.5 76.7 161.2 79.6 167.8 78.4 187.8 79.6 195.5 74.7 195.5',
      '24.9 194.7 27.8 164.9 28.2 160.4 26.1 154.3 24.9 157.6 22.4 161.6 20.8 167.8 22 188.2 20.8 195.5',
    ],
  },
  back: {
    trapezius: [
      '44.7 21.7 47.7 21.7 47.2 38.3 47.7 64.7 38.3 53.2 35.3 40.9 31.1 36.6 39.1 33.2 43.8 27.2',
      '52.3 21.7 55.7 21.7 56.6 27.2 60.9 32.8 68.9 36.6 64.7 40.4 61.7 53.2 52.3 64.7 53.2 38.3',
    ],
    'upper-back': [
      '31.1 38.7 28.1 48.9 28.5 55.3 34 75.3 47.2 71.1 47.2 66.4 36.6 54 33.6 41.3',
      '68.9 38.7 71.9 49.4 71.5 56.2 66 75.3 52.8 71.1 52.8 66.4 63.4 54.5 66.4 41.7',
    ],
    'back-deltoids': [
      '29.4 37 23 39.1 17.4 44.3 18.3 53.6 24.3 49.4 27.2 46.4',
      '71.1 37 78.3 39.6 82.6 44.7 81.7 53.6 74.9 48.9 72.3 45.1',
    ],
    triceps: [
      '26.8 49.8 17.9 55.7 14.5 72.3 16.6 81.7 21.7 63.8 26.8 55.7',
      '73.6 50.2 82.1 55.7 86 73.2 83.4 82.1 77.9 63 73.2 55.7',
    ],
    'lower-back': [
      '47.7 72.8 34.5 77 35.3 83.4 49.4 102.1 46.8 83',
      '52.3 72.8 65.5 77 64.7 83.4 50.6 102.1 53.2 83.8',
    ],
    gluteal: [
      '44.7 99.6 30.2 108.5 29.8 118.7 31.5 126 47.2 121.3 49.4 114.9',
      '55.3 99.1 51.1 114.5 52.3 120.9 68.1 126 69.8 119.1 69.4 108.5',
    ],
    hamstring: [
      '28.9 122.1 31.1 129.4 36.6 126 35.3 135.3 34.5 150.2 29.4 158.3 28.9 146.8 27.7 141.3 27.2 131.5',
      '71.5 121.7 69.4 128.9 63.8 126 65.5 136.6 66.4 150.2 71.1 158.3 71.5 147.7 72.8 142.1 73.6 131.9',
    ],
    calves: [
      '29.4 160.4 28.5 167.2 24.7 179.6 23.8 192.8 25.5 197 28.5 193.2 29.8 180 31.9 171.1 31.9 166.8',
      '70.6 160.4 72.3 168.5 75.7 179.1 76.6 192.8 74.5 196.6 72.3 193.6 70.6 179.6 68.1 168.1',
    ],
  },
};

export const MuscleAtlasView: React.FC = () => {
  const [filter, setFilter] = useState<FilterCategory>('all');
  const [selectedMuscle, setSelectedMuscle] = useState<string | null>('chest');

  // Calculate volume per muscle based on filter
  const calculateVolume = () => {
    const vol: Record<string, number> = {};

    WORKOUT_DAYS.forEach((day, idx) => {
      if (filter !== 'all' && idx !== filter) return;
      day.exerciseIds.forEach((id) => {
        const ex = EXERCISES[id];
        if (!ex) return;
        ex.primaryMuscles.forEach((m) => {
          vol[m] = (vol[m] || 0) + ex.sets;
        });
        ex.secondaryMuscles.forEach((m) => {
          vol[m] = (vol[m] || 0) + ex.sets * 0.5;
        });
      });
    });

    return vol;
  };

  const volumeMap = calculateVolume();

  // Find exercises targeting the selected muscle
  const matchingExercises: { ex: typeof EXERCISES[string]; role: 'primary' | 'secondary' }[] = [];
  if (selectedMuscle) {
    WORKOUT_DAYS.forEach((day, idx) => {
      if (filter !== 'all' && idx !== filter) return;
      day.exerciseIds.forEach((id) => {
        const ex = EXERCISES[id];
        if (!ex) return;
        if (ex.primaryMuscles.includes(selectedMuscle)) {
          matchingExercises.push({ ex, role: 'primary' });
        } else if (ex.secondaryMuscles.includes(selectedMuscle)) {
          matchingExercises.push({ ex, role: 'secondary' });
        }
      });
    });
  }

  // Helper to get fill color for a muscle
  const getMuscleFill = (m: string) => {
    const isSelected = selectedMuscle === m;
    if (isSelected) return '#00f59b';

    const vol = volumeMap[m] || 0;
    if (vol === 0) return '#1a2622';

    // Heatmap opacity based on sets (1 to 20)
    const factor = Math.min(1, Math.max(0.2, vol / 16));
    // Interpolate between subtle red and glowing crimson
    return `rgba(255, 61, 90, ${factor})`;
  };

  return (
    <div className="space-y-4 pb-28">
      {/* Title */}
      <div>
        <h2 className="text-2xl font-bold text-white tracking-tight flex items-center gap-2">
          <span>أطلس العضلات التشريحي</span>
          <Activity className="w-5 h-5 text-[#ff3d5a]" />
        </h2>
        <p className="text-xs text-zinc-400 font-medium mt-1">
          خريطة حرارية لتوزيع الحجم التدريبي. اضغط على أي عضلة لاستعراض تفاصيلها وتمارينها.
        </p>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
        {[
          { id: 'all', label: 'الكل' },
          { id: 0, label: 'دفع' },
          { id: 1, label: 'سحب' },
          { id: 2, label: 'أرجل' },
          { id: 4, label: 'علوي' },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setFilter(tab.id as FilterCategory)}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
              filter === tab.id
                ? 'bg-[#ff3d5a] text-white shadow-[0_0_12px_rgba(255,61,90,0.4)]'
                : 'bg-white/5 border border-white/5 text-zinc-400 hover:text-white hover:bg-white/10'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Anatomical Maps Card */}
      <div className="glass-panel rounded-3xl p-5 border border-white/10 shadow-xl space-y-4">
        {/* Front & Back SVG Figures */}
        <div className="grid grid-cols-2 gap-4 items-center justify-items-center py-2">
          {/* Front (Anterior) */}
          <div className="w-full flex flex-col items-center">
            <span className="text-xs font-semibold text-zinc-400 mb-2">منظر أمامي</span>
            <svg
              viewBox="0 0 100 210"
              className="w-36 h-auto drop-shadow-[0_4px_12px_rgba(0,0,0,0.5)]"
            >
              {/* Silhouette outline */}
              <circle cx="50" cy="12" r="9" fill="#141c19" />
              {Object.entries(MUSCLE_POLYGONS.front).map(([mName, polygons]) => (
                <g
                  key={mName}
                  onClick={() => setSelectedMuscle(mName)}
                  className="cursor-pointer transition-all hover:opacity-80"
                >
                  {polygons.map((p, i) => (
                    <polygon
                      key={i}
                      points={p}
                      fill={getMuscleFill(mName)}
                      stroke={selectedMuscle === mName ? '#ffffff' : '#0b100e'}
                      strokeWidth={selectedMuscle === mName ? '1.5' : '0.5'}
                      className="transition-colors duration-200"
                    />
                  ))}
                </g>
              ))}
            </svg>
          </div>

          {/* Back (Posterior) */}
          <div className="w-full flex flex-col items-center">
            <span className="text-xs font-semibold text-zinc-400 mb-2">منظر خلفي</span>
            <svg
              viewBox="0 0 100 210"
              className="w-36 h-auto drop-shadow-[0_4px_12px_rgba(0,0,0,0.5)]"
            >
              <circle cx="50" cy="12" r="9" fill="#141c19" />
              {Object.entries(MUSCLE_POLYGONS.back).map(([mName, polygons]) => (
                <g
                  key={mName}
                  onClick={() => setSelectedMuscle(mName)}
                  className="cursor-pointer transition-all hover:opacity-80"
                >
                  {polygons.map((p, i) => (
                    <polygon
                      key={i}
                      points={p}
                      fill={getMuscleFill(mName)}
                      stroke={selectedMuscle === mName ? '#ffffff' : '#0b100e'}
                      strokeWidth={selectedMuscle === mName ? '1.5' : '0.5'}
                      className="transition-colors duration-200"
                    />
                  ))}
                </g>
              ))}
            </svg>
          </div>
        </div>

        {/* Corrected RTL Legend (Right = less, Left = more) */}
        <div className="pt-2 border-t border-white/5">
          <div className="flex items-center justify-between text-xs text-zinc-400 font-medium mb-1.5">
            <span className="text-zinc-500">حجم تدريبي أقل (0-4)</span>
            <span className="text-[#ff758c]">حجم تدريبي مثالي (12-20 مجموعة)</span>
          </div>
          {/* RTL Gradient Bar: Starts dark/pale on the right, gets glowing crimson on the left */}
          <div
            className="w-full h-2 rounded-full overflow-hidden"
            style={{
              background: 'linear-gradient(to left, #1a2622 0%, rgba(255, 61, 90, 0.4) 40%, #ff3d5a 100%)',
            }}
          />
        </div>
      </div>

      {/* Selected Muscle Details Sheet */}
      {selectedMuscle && (
        <div className="glass-panel-elevated rounded-3xl p-5 border border-white/10 space-y-3">
          <div className="flex items-start justify-between">
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-xl font-bold text-white">
                  {MUSCLE_NAMES[selectedMuscle]?.ar || selectedMuscle}
                </h3>
                <span className="px-2.5 py-0.5 rounded-full bg-[#00f59b]/15 text-[#00f59b] text-xs font-semibold">
                  {volumeMap[selectedMuscle] || 0} مجموعة فعّالة
                </span>
              </div>
              <p className="text-xs text-zinc-400 font-mono tracking-wide mt-0.5" dir="ltr">
                {MUSCLE_NAMES[selectedMuscle]?.en}
              </p>
            </div>
          </div>

          {/* Hypertrophy Status */}
          <div className="p-3 rounded-xl bg-white/5 border border-white/5 text-xs text-zinc-300 leading-relaxed">
            {(volumeMap[selectedMuscle] || 0) === 0 ? (
              <span className="text-zinc-400">لا يتم تدريب هذه العضلة مباشرة في التصفية الحالية.</span>
            ) : (volumeMap[selectedMuscle] || 0) < 10 ? (
              <span className="text-amber-400">
                الحجم الحالي أقل من المدى الشائع لتضخيم المحرك الأساسي (10–20 مجموعة أسبوعياً)، لكنه
                ممتاز كعضلة مساعدة أو لتجنب الإجهاد الزائد.
              </span>
            ) : (volumeMap[selectedMuscle] || 0) <= 20 ? (
              <span className="text-[#00f59b]">
                ✅ ضمن المدى الذهبي لتضخيم الألياف العضلية (10–20 مجموعة أسبوعياً). استمر على هذا
                البرنامج!
              </span>
            ) : (
              <span className="text-[#ff758c]">
                حجم تدريبي مرتفع جداً (&gt; 20 مجموعة) — راقب جودة نومك وتغذيتك لضمان الاستشفاء.
              </span>
            )}
          </div>

          {/* Targeted Exercises List */}
          <div>
            <h4 className="text-xs font-bold text-zinc-400 uppercase tracking-wider mb-2">
              التمارين المستهدفة في جدولك:
            </h4>
            <div className="space-y-1.5">
              {matchingExercises.length > 0 ? (
                matchingExercises.map(({ ex, role }) => (
                  <div
                    key={ex.id}
                    className="flex items-center justify-between p-2.5 rounded-xl bg-black/40 border border-white/5"
                  >
                    <div>
                      <span className="text-sm font-semibold text-white block">{ex.nameAr}</span>
                      <span className="text-xs text-zinc-400">
                        {ex.sets} مجموعات × {ex.reps} تكرار
                      </span>
                    </div>
                    <span
                      className={`text-xs px-2 py-0.5 rounded-md font-semibold ${
                        role === 'primary'
                          ? 'bg-[#ff3d5a]/20 text-[#ff758c] border border-[#ff3d5a]/30'
                          : 'bg-white/5 text-zinc-400'
                      }`}
                    >
                      {role === 'primary' ? 'محرك أساسي' : 'مساعد'}
                    </span>
                  </div>
                ))
              ) : (
                <p className="text-xs text-zinc-500">لا توجد تمارين محددة في هذا اليوم لهذه العضلة.</p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
