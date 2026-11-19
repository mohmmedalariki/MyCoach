import React from 'react';
import { useWorkoutStore, type AppTab } from '../../stores/useWorkoutStore';
import { Dumbbell, Activity, TrendingUp, Apple, BookOpen } from 'lucide-react';

interface NavItem {
  id: AppTab;
  label: string;
  icon: React.ElementType;
}

const NAV_ITEMS: NavItem[] = [
  { id: 'workout', label: 'تمرين', icon: Dumbbell },
  { id: 'muscles', label: 'العضلات', icon: Activity },
  { id: 'progress', label: 'التقدّم', icon: TrendingUp },
  { id: 'nutrition', label: 'التغذية', icon: Apple },
  { id: 'guide', label: 'الدليل', icon: BookOpen },
];

export const BottomNav: React.FC = () => {
  const { activeTab, setActiveTab } = useWorkoutStore();

  return (
    <nav className="fixed bottom-0 inset-x-0 z-40 bg-[#0d1412]/95 backdrop-blur-xl border-t border-white/10 pb-[env(safe-area-inset-bottom,0px)]">
      <div className="max-w-md mx-auto px-3 flex items-center justify-around h-16">
        {NAV_ITEMS.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;

          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`relative flex flex-col items-center justify-center flex-1 py-1 transition-all duration-200 select-none ${
                isActive ? 'text-[#ff3d5a]' : 'text-zinc-400 hover:text-zinc-200'
              }`}
            >
              {/* Active glow dot */}
              {isActive && (
                <span className="absolute -top-1 w-8 h-1 bg-[#ff3d5a] rounded-full shadow-[0_0_12px_#ff3d5a]" />
              )}
              
              <div
                className={`p-1.5 rounded-xl transition-all ${
                  isActive ? 'bg-[#ff3d5a]/15 scale-110' : ''
                }`}
              >
                <Icon className="w-5 h-5 stroke-[2.2]" />
              </div>
              <span className={`text-[11px] font-semibold mt-0.5 tracking-tight ${isActive ? 'font-bold' : ''}`}>
                {item.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};
