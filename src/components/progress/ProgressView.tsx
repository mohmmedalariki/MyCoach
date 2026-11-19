import React, { useState, useEffect } from 'react';
import { db, type WorkoutSessionRecord, type BodyweightRecord } from '../../db';
import {
  TrendingUp,
  Scale,
  Calendar,
  Download,
  Upload,
  History,
  FileCode,
  Plus,
} from 'lucide-react';

export const ProgressView: React.FC = () => {
  const [sessions, setSessions] = useState<WorkoutSessionRecord[]>([]);
  const [bodyweights, setBodyweights] = useState<BodyweightRecord[]>([]);
  const [newWeight, setNewWeight] = useState('');
  const [feedback, setFeedback] = useState<string | null>(null);

  const loadData = async () => {
    try {
      const s = await db.sessions.orderBy('ts').reverse().toArray();
      const bw = await db.bodyweight.orderBy('date').toArray();
      setSessions(s);
      setBodyweights(bw);
    } catch (e) {
      console.warn('Failed to load progress records:', e);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleAddWeight = async () => {
    const val = parseFloat(newWeight);
    if (!val || isNaN(val)) {
      setFeedback('يرجى إدخال رقم صحيح للوزن');
      setTimeout(() => setFeedback(null), 2500);
      return;
    }

    const todayStr = new Date().toISOString().slice(0, 10);
    await db.bodyweight.add({ date: todayStr, weightKg: val });
    setNewWeight('');
    setFeedback('تم تسجيل الوزن بنجاح ✓');
    setTimeout(() => setFeedback(null), 2500);
    await loadData();
  };

  const handleExportJSON = async () => {
    const s = await db.sessions.toArray();
    const bw = await db.bodyweight.toArray();
    const data = { sessions: s, bodyweight: bw, exportedAt: new Date().toISOString() };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `hypertrophy-data-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleImportJSON = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const text = await file.text();
      const parsed = JSON.parse(text);
      if (parsed.sessions && Array.isArray(parsed.sessions)) {
        await db.sessions.clear();
        await db.sessions.bulkAdd(parsed.sessions);
      }
      if (parsed.bodyweight && Array.isArray(parsed.bodyweight)) {
        await db.bodyweight.clear();
        await db.bodyweight.bulkAdd(parsed.bodyweight);
      }
      setFeedback('تم استيراد البيانات بنجاح ✓');
      setTimeout(() => setFeedback(null), 2500);
      await loadData();
    } catch {
      setFeedback('ملف غير صالح');
      setTimeout(() => setFeedback(null), 2500);
    }
  };

  // 28-day streak heatmap calculation
  const heatmapDays = Array.from({ length: 28 }, (_, i) => {
    const d = new Date(Date.now() - (27 - i) * 86400000).toISOString().slice(0, 10);
    const sessionCount = sessions.filter((s) => s.date === d).length;
    return { date: d, count: sessionCount };
  });

  // Bodyweight SVG chart points
  let chartPolyline = '';
  if (bodyweights.length > 1) {
    const vals = bodyweights.map((b) => b.weightKg);
    const minW = Math.min(...vals) - 0.5;
    const maxW = Math.max(...vals) + 0.5;
    const range = maxW - minW || 1;

    chartPolyline = bodyweights
      .map((b, i) => {
        const x = (i / (bodyweights.length - 1)) * 280 + 10;
        const y = 60 - ((b.weightKg - minW) / range) * 50;
        return `${x.toFixed(1)},${y.toFixed(1)}`;
      })
      .join(' ');
  }

  const latestWeight = bodyweights.length > 0 ? bodyweights[bodyweights.length - 1].weightKg : 59;

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
          <span>التقدّم والنمو العضلي</span>
          <TrendingUp className="w-5 h-5 text-[#00f59b]" />
        </h2>
        <p className="text-xs text-zinc-400 font-medium mt-1">
          متابعة الالتزام الأسبوعي، زيادة الأوزان، وتدرج كتلة الجسم.
        </p>
      </div>

      {/* 28-Day Streak Heatmap */}
      <div className="glass-panel rounded-3xl p-5 border border-white/10 shadow-lg space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold text-white flex items-center gap-1.5">
            <Calendar className="w-4 h-4 text-[#ff3d5a]" />
            <span>نشاط آخر 28 يوماً</span>
          </h3>
          <span className="text-xs text-[#00f59b] font-semibold">
            {sessions.filter((s) => Date.now() - s.ts < 604800000).length} تمارين هذا الأسبوع
          </span>
        </div>

        <div className="grid grid-cols-7 gap-1.5">
          {heatmapDays.map((d, i) => (
            <div
              key={i}
              title={`${d.date}: ${d.count} تمارين`}
              className={`aspect-square rounded-lg transition-all ${
                d.count > 0
                  ? 'bg-[#00f59b] shadow-[0_0_8px_rgba(0,245,155,0.4)]'
                  : 'bg-white/5 border border-white/5'
              }`}
            />
          ))}
        </div>
      </div>

      {/* Bodyweight Tracker */}
      <div className="glass-panel rounded-3xl p-5 border border-white/10 shadow-lg space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold text-white flex items-center gap-1.5">
              <Scale className="w-4 h-4 text-[#00f59b]" />
              <span>وزن الجسم الحالي: {latestWeight} كجم</span>
            </h3>
            <p className="text-xs text-zinc-400">الهدف: زيادة 0.25 - 0.5 كجم أسبوعياً (تضخيم نقي)</p>
          </div>
        </div>

        {/* SVG Sparkline */}
        {bodyweights.length > 1 ? (
          <div className="py-2">
            <svg viewBox="0 0 300 70" className="w-full h-16 overflow-visible">
              <polyline
                points={chartPolyline}
                fill="none"
                stroke="#00f59b"
                strokeWidth="3"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
        ) : (
          <div className="p-3 rounded-xl bg-white/5 text-xs text-zinc-400 text-center">
            سجّل وزنك أسبوعياً لرسم المنحنى البياني ومتابعة الزيادة العضلية.
          </div>
        )}

        {/* Input */}
        <div className="flex items-center gap-2 pt-1">
          <input
            type="number"
            step="0.1"
            placeholder="الوزن بالكيلوجرام (مثال: 59.5)"
            value={newWeight}
            onChange={(e) => setNewWeight(e.target.value)}
            className="flex-1 py-2 px-3 bg-black/50 border border-white/10 rounded-xl text-sm text-white focus:outline-none focus:border-[#00f59b] font-mono"
          />
          <button
            onClick={handleAddWeight}
            className="py-2 px-4 rounded-xl bg-[#00f59b] hover:bg-[#00f59b]/80 text-black font-bold text-xs transition-all flex items-center gap-1"
          >
            <Plus className="w-4 h-4" />
            <span>تسجيل</span>
          </button>
        </div>
      </div>

      {/* Workout History Log */}
      <div className="glass-panel rounded-3xl p-5 border border-white/10 shadow-lg space-y-3">
        <h3 className="text-sm font-bold text-white flex items-center gap-1.5">
          <History className="w-4 h-4 text-[#ff3d5a]" />
          <span>سجل الجلسات السابقة</span>
        </h3>

        <div className="space-y-2">
          {sessions.length > 0 ? (
            sessions.slice(0, 10).map((s) => (
              <div
                key={s.id}
                className="flex items-center justify-between p-3 rounded-2xl bg-black/40 border border-white/5"
              >
                <div>
                  <div className="text-sm font-bold text-white">{s.dayName}</div>
                  <div className="text-xs text-zinc-400 font-mono" dir="ltr">
                    {s.date}
                  </div>
                </div>
                <div className="text-left font-mono">
                  <div className="text-xs font-semibold text-[#00f59b]">
                    {s.totalSets} مج · {s.totalReps} تكرار
                  </div>
                  <div className="text-[11px] text-zinc-500">{s.durationMinutes} دقيقة</div>
                </div>
              </div>
            ))
          ) : (
            <p className="text-xs text-zinc-500 text-center py-4">
              لا توجد جلسات محفوظة بعد. أكمل تمرينك من تبويب "تمرين" ثم اضغط "إنهاء وحفظ".
            </p>
          )}
        </div>
      </div>

      {/* Data Backup & Portability */}
      <div className="glass-panel rounded-3xl p-5 border border-white/10 shadow-lg space-y-3">
        <h3 className="text-sm font-bold text-white flex items-center gap-1.5">
          <FileCode className="w-4 h-4 text-[#00f59b]" />
          <span>حفظ واستيراد البيانات</span>
        </h3>
        <p className="text-xs text-zinc-400 leading-relaxed">
          بياناتك مخزنة محلياً بالكامل داخل متصفحك (Offline-first). يمكنك تنزيل نسخة احتياطية من
          بياناتك في أي وقت ونقلها لأي جهاز.
        </p>

        <div className="flex items-center gap-2 pt-1">
          <button
            onClick={handleExportJSON}
            className="flex-1 py-2.5 px-3 rounded-xl bg-white/10 hover:bg-white/15 text-white font-semibold text-xs transition-all flex items-center justify-center gap-1.5"
          >
            <Download className="w-3.5 h-3.5 text-[#00f59b]" />
            <span>تصدير JSON</span>
          </button>

          <label className="flex-1 py-2.5 px-3 rounded-xl bg-white/10 hover:bg-white/15 text-white font-semibold text-xs transition-all flex items-center justify-center gap-1.5 cursor-pointer">
            <Upload className="w-3.5 h-3.5 text-[#ff3d5a]" />
            <span>استيراد JSON</span>
            <input type="file" accept=".json" onChange={handleImportJSON} className="hidden" />
          </label>
        </div>
      </div>
    </div>
  );
};
