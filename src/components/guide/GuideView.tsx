import React from 'react';
import { BookOpen, Sparkles, ShieldCheck, Zap, Activity } from 'lucide-react';

export const GuideView: React.FC = () => {
  return (
    <div className="space-y-4 pb-28">
      {/* Title */}
      <div>
        <h2 className="text-2xl font-bold text-white tracking-tight flex items-center gap-2">
          <span>دليل وقواعد الضخامة العضلية</span>
          <BookOpen className="w-5 h-5 text-[#ff3d5a]" />
        </h2>
        <p className="text-xs text-zinc-400 font-medium mt-1">
          المبادئ العلمية المعتمدة في تصميم البرنامج لتحقيق أقصى بناء عضلي بأدوات منزلية وباند المقاومة.
        </p>
      </div>

      {/* Rules */}
      <div className="glass-panel-elevated rounded-3xl p-5 border border-white/10 shadow-xl space-y-3">
        <h3 className="text-base font-bold text-white flex items-center gap-2">
          <Zap className="w-4 h-4 text-[#00f59b]" />
          <span>القواعد الأربع لبناء الحجم</span>
        </h3>

        <div className="space-y-3">
          <div className="p-3.5 rounded-2xl bg-black/40 border border-white/5 space-y-1">
            <strong className="text-white text-sm font-bold flex items-center gap-2">
              <span className="w-5 h-5 rounded-lg bg-[#ff3d5a]/20 text-[#ff758c] flex items-center justify-center text-xs font-mono">1</span>
              <span>الرافعة الميكانيكية والزوايا الحركية</span>
            </strong>
            <p className="text-xs text-zinc-300 leading-relaxed font-normal">
              لا تعتمد فقط على زيادة التكرارات؛ بل استبدل التمارين بزوايا أصعب ميكانيكياً (مثل رفع القدمين على كرسي في الضغط، أو استخدام ذراع واحدة في السحب) لرفع الحمل الفعلي على الألياف المستهدفة.
            </p>
          </div>

          <div className="p-3.5 rounded-2xl bg-black/40 border border-white/5 space-y-1">
            <strong className="text-white text-sm font-bold flex items-center gap-2">
              <span className="w-5 h-5 rounded-lg bg-[#ff3d5a]/20 text-[#ff758c] flex items-center justify-center text-xs font-mono">2</span>
              <span>مقاومة الباند الثقيل (Variable Resistance)</span>
            </strong>
            <p className="text-xs text-zinc-300 leading-relaxed font-normal">
              تزداد شدة الباند كلما تمدد، مما يعطيك أقصى مقاومة ميكانيكية في نقطة قمة الانقباض العضلي الكامل (Peak Contraction). تأكد من لف الباند أو تقصير مسافته لضمان مقاومة عالية.
            </p>
          </div>

          <div className="p-3.5 rounded-2xl bg-black/40 border border-white/5 space-y-1">
            <strong className="text-white text-sm font-bold flex items-center gap-2">
              <span className="w-5 h-5 rounded-lg bg-[#00f59b]/20 text-[#00f59b] flex items-center justify-center text-xs font-mono">3</span>
              <span>إيقاع 3-1-1 الصارم (Tempo Hypertrophy)</span>
            </strong>
            <p className="text-xs text-zinc-300 leading-relaxed font-normal">
              • <strong className="text-white">3 ثوانٍ نزول بطيء:</strong> تمزيق دقيق للألياف وتحكم كامل.<br />
              • <strong className="text-white">1 ثانية ثبات في أقصى تمدد:</strong> إلغاء الارتداد المطاطي للمفاصل.<br />
              • <strong className="text-white">1 ثانية دفع أو سحب بقوة:</strong> تجنيد أكبر عدد من الوحدات الحركية السريعة.
            </p>
          </div>

          <div className="p-3.5 rounded-2xl bg-black/40 border border-white/5 space-y-1">
            <strong className="text-white text-sm font-bold flex items-center gap-2">
              <span className="w-5 h-5 rounded-lg bg-[#ff3d5a]/20 text-[#ff758c] flex items-center justify-center text-xs font-mono">4</span>
              <span>القرب من الفشل العضلي (1-2 RIR)</span>
            </strong>
            <p className="text-xs text-zinc-300 leading-relaxed font-normal">
              اجعل آخر تكرارين في كل مجموعة شاقين وبطيئين بحيث لا تقدر على أداء أكثر من تكرار واحد أو تكرارين إضافيين بأداء نظيف.
            </p>
          </div>
        </div>
      </div>

      {/* How to use the 3D model */}
      <div className="glass-panel rounded-3xl p-5 border border-white/10 space-y-3">
        <h3 className="text-sm font-bold text-white flex items-center gap-1.5">
          <Sparkles className="w-4 h-4 text-[#ff3d5a]" />
          <span>كيف تقرأ المجسم ثلاثي الأبعاد 3D</span>
        </h3>
        <p className="text-xs text-zinc-300 leading-relaxed">
          • <strong className="text-[#ff3d5a]">التوهج الأحمر النيون:</strong> يمثل العضلة الرئيسية التي تتحمل العبء الميكانيكي الأكبر وتزداد شدته عند قمة الحركة.<br />
          • <strong className="text-[#00f59b]">حبل المقاومة:</strong> يوضح مسار الشد وزاوية السحب المثالية.<br />
          • <strong className="text-white">التحكم باللمس أو الماوس:</strong> اسحب في أي اتجاه لتدوير الكاميرا 360 درجة ومعاينة استقامة الظهر وزاوية المرفقين.
        </p>
      </div>
    </div>
  );
};
