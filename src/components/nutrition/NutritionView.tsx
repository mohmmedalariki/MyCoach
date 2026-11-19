import React, { useState, useEffect } from 'react';
import { db, type DailyFoodRecord } from '../../db';
import { Apple, Flame, Plus, RotateCcw, Utensils, Check } from 'lucide-react';

export const NutritionView: React.FC = () => {
  const [todayLog, setTodayLog] = useState<DailyFoodRecord>({
    date: new Date().toISOString().slice(0, 10),
    proteinGrams: 0,
    caloriesKcal: 0,
  });
  const [addProtein, setAddProtein] = useState('');
  const [addCalories, setAddCalories] = useState('');
  const [feedback, setFeedback] = useState<string | null>(null);

  const todayStr = new Date().toISOString().slice(0, 10);

  const loadTodayData = async () => {
    try {
      const rec = await db.foodLogs.get(todayStr);
      if (rec) {
        setTodayLog(rec);
      } else {
        setTodayLog({ date: todayStr, proteinGrams: 0, caloriesKcal: 0 });
      }
    } catch (e) {
      console.warn('Failed to load food log:', e);
    }
  };

  useEffect(() => {
    loadTodayData();
  }, []);

  const handleAddFood = async () => {
    const p = parseInt(addProtein) || 0;
    const k = parseInt(addCalories) || 0;

    if (p === 0 && k === 0) return;

    const updated: DailyFoodRecord = {
      date: todayStr,
      proteinGrams: todayLog.proteinGrams + p,
      caloriesKcal: todayLog.caloriesKcal + k,
    };

    await db.foodLogs.put(updated);
    setTodayLog(updated);
    setAddProtein('');
    setAddCalories('');
    setFeedback('تمت إضافة الوجبة بنجاح ✓');
    setTimeout(() => setFeedback(null), 2500);
  };

  const handleResetToday = async () => {
    if (!window.confirm('هل تريد تصفير مدخلات التغذية لهذا اليوم؟')) return;
    const reset: DailyFoodRecord = { date: todayStr, proteinGrams: 0, caloriesKcal: 0 };
    await db.foodLogs.put(reset);
    setTodayLog(reset);
    setFeedback('تم التصفير');
    setTimeout(() => setFeedback(null), 2000);
  };

  const targetProtein = 130;
  const targetCalories = 2600;

  const proteinPercent = Math.min(100, Math.round((todayLog.proteinGrams / targetProtein) * 100));
  const caloriesPercent = Math.min(100, Math.round((todayLog.caloriesKcal / targetCalories) * 100));

  return (
    <div className="space-y-4 pb-28">
      {/* Toast */}
      {feedback && (
        <div className="fixed top-4 inset-x-4 z-50 max-w-sm mx-auto p-3 rounded-2xl bg-[#00f59b] text-black font-bold text-center text-xs shadow-2xl">
          {feedback}
        </div>
      )}

      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-white tracking-tight flex items-center gap-2">
          <span>التغذية والوقود العضلي</span>
          <Apple className="w-5 h-5 text-[#ff3d5a]" />
        </h2>
        <p className="text-xs text-zinc-400 font-medium mt-1">
          حساب دقيق لاحتياجات التضخيم لوزن 59 كجم لضمان بناء أنسجة عضلية نقية.
        </p>
      </div>

      {/* Today's Intake Dashboard */}
      <div className="glass-panel-elevated rounded-3xl p-5 border border-white/10 shadow-xl space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <Utensils className="w-4 h-4 text-[#00f59b]" />
            <span>استهلاك اليوم</span>
          </h3>
          <button
            onClick={handleResetToday}
            className="text-[11px] text-zinc-400 hover:text-red-400 transition-colors flex items-center gap-1"
          >
            <RotateCcw className="w-3 h-3" />
            <span>تصفير اليوم</span>
          </button>
        </div>

        {/* Protein Tracker */}
        <div className="space-y-1.5">
          <div className="flex justify-between items-baseline">
            <span className="text-xs font-bold text-white flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-[#ff3d5a]" />
              <span>البروتين</span>
            </span>
            <span className="text-xs font-mono text-zinc-300">
              <strong className="text-white text-sm">{todayLog.proteinGrams}</strong> / {targetProtein} جم ({proteinPercent}%)
            </span>
          </div>
          <div className="w-full bg-white/10 h-2.5 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-[#ff3d5a] to-[#ff758c] transition-all duration-300 rounded-full"
              style={{ width: `${proteinPercent}%` }}
            />
          </div>
          <p className="text-[10px] text-zinc-500">الحد الأدنى للنمو: 115 جم (2 جم / كجم من وزن الجسم)</p>
        </div>

        {/* Calories Tracker */}
        <div className="space-y-1.5">
          <div className="flex justify-between items-baseline">
            <span className="text-xs font-bold text-white flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-[#00f59b]" />
              <span>السعرات الحرارية</span>
            </span>
            <span className="text-xs font-mono text-zinc-300">
              <strong className="text-white text-sm">{todayLog.caloriesKcal}</strong> / {targetCalories} سعرة ({caloriesPercent}%)
            </span>
          </div>
          <div className="w-full bg-white/10 h-2.5 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-[#00f59b] to-[#00e5ff] transition-all duration-300 rounded-full"
              style={{ width: `${caloriesPercent}%` }}
            />
          </div>
          <p className="text-[10px] text-zinc-500">فائض طاقة مدروس: 350-400 سعرة فوق الاحتياج الأساسي</p>
        </div>

        {/* Quick Add Food Inputs */}
        <div className="pt-2 border-t border-white/5">
          <span className="text-xs font-semibold text-zinc-400 mb-2 block">إضافة وجبة سريعة:</span>
          <div className="grid grid-cols-12 gap-2">
            <input
              type="number"
              placeholder="بروتين (جم)"
              value={addProtein}
              onChange={(e) => setAddProtein(e.target.value)}
              className="col-span-5 py-2 px-3 bg-black/50 border border-white/10 rounded-xl text-sm text-white focus:outline-none focus:border-[#ff3d5a] font-mono text-center"
            />
            <input
              type="number"
              placeholder="سعرات (kcal)"
              value={addCalories}
              onChange={(e) => setAddCalories(e.target.value)}
              className="col-span-5 py-2 px-3 bg-black/50 border border-white/10 rounded-xl text-sm text-white focus:outline-none focus:border-[#00f59b] font-mono text-center"
            />
            <button
              onClick={handleAddFood}
              className="col-span-2 rounded-xl bg-[#ff3d5a] hover:bg-[#ff5c74] text-white flex items-center justify-center transition-all shadow-[0_0_12px_rgba(255,61,90,0.4)]"
            >
              <Plus className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Bulking Guidelines Cards */}
      <div className="glass-panel rounded-3xl p-5 border border-white/10 space-y-3">
        <h3 className="text-sm font-bold text-white flex items-center gap-1.5">
          <Flame className="w-4 h-4 text-[#ff3d5a]" />
          <span>معادلة التضخيم لوزن 59 كجم</span>
        </h3>

        <div className="space-y-2 text-xs leading-relaxed text-zinc-300">
          <div className="p-3 rounded-2xl bg-black/40 border border-white/5 space-y-1">
            <strong className="text-white block text-sm font-semibold">1. السعرات: 2,500 – 2,650 سعرة</strong>
            <p className="text-zinc-400 font-normal">
              توفير فائض استراتيجي (350–400 سعرة) لزيادة الوزن بمعدل 0.25 إلى 0.5 كجم أسبوعياً دون تراكم دهون زائدة.
            </p>
          </div>

          <div className="p-3 rounded-2xl bg-black/40 border border-white/5 space-y-1">
            <strong className="text-white block text-sm font-semibold">2. البروتين: 115 – 130 جم يومياً</strong>
            <p className="text-zinc-400 font-normal">
              بمعدل ~2 جم لكل كجم، يفضل توزيعها على 3 إلى 4 وجبات رئيسية (30-40 جم في كل وجبة) لتنشيط مسار الـ mTOR وبناء الألياف.
            </p>
          </div>

          <div className="p-3 rounded-2xl bg-black/40 border border-white/5 space-y-1">
            <strong className="text-white block text-sm font-semibold">3. الكربوهيدرات والدهون الصحية</strong>
            <p className="text-zinc-400 font-normal">
              أرز وشوفان وبطاطس وخبز قبل وبعد التمرين لملء مخازن الجليكوجين، مع دهون نافعة: زيت زيتون ومكسرات وصفار البيض لدعم الهرمونات البنائية.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
