import React, { useEffect } from 'react';
import { useWorkoutStore } from './stores/useWorkoutStore';
import { BottomNav } from './components/navigation/BottomNav';
import { WorkoutView } from './components/workout/WorkoutView';
import { MuscleAtlasView } from './components/muscles/MuscleAtlasView';
import { ProgressView } from './components/progress/ProgressView';
import { NutritionView } from './components/nutrition/NutritionView';
import { GuideView } from './components/guide/GuideView';
import { RestTimerBar } from './components/workout/RestTimerBar';
import { CoachModal } from './components/coach/CoachModal';

export const App: React.FC = () => {
  const { activeTab, loadInitialData } = useWorkoutStore();

  useEffect(() => {
    loadInitialData();
  }, [loadInitialData]);

  return (
    <div className="min-h-screen bg-[#0b100e] text-[#edf2ee] selection:bg-[#ff3d5a] selection:text-white">
      {/* Centered App Container */}
      <main className="max-w-md mx-auto px-4 pt-3 pb-8">
        {activeTab === 'workout' && <WorkoutView />}
        {activeTab === 'muscles' && <MuscleAtlasView />}
        {activeTab === 'progress' && <ProgressView />}
        {activeTab === 'nutrition' && <NutritionView />}
        {activeTab === 'guide' && <GuideView />}
      </main>

      {/* Persistent Floating Rest Timer */}
      <RestTimerBar />

      {/* Fullscreen 3D Coach Mode Modal */}
      <CoachModal />

      {/* Fixed Bottom Navigation */}
      <BottomNav />
    </div>
  );
};

export default App;
