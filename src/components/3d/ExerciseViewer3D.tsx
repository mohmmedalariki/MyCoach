import React, { useState, Suspense, useRef } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, ContactShadows, Grid } from '@react-three/drei';
import { Humanoid3D } from './Humanoid3D';
import { MUSCLE_NAMES } from '../../data/exercises';
import {
  Play,
  Pause,
  RotateCcw,
  Sparkles,
  EyeOff,
  Sliders,
  ArrowDown,
  ArrowUp,
  PauseCircle,
} from 'lucide-react';
import type { OrbitControls as OrbitControlsImpl } from 'three-stdlib';

interface ExerciseViewer3DProps {
  poseId: string;
  exerciseNameAr?: string;
  targetMuscles: string[];
  tempoLabel?: string;
  className?: string;
  height?: string;
  onHide?: () => void;
}

export const ExerciseViewer3D: React.FC<ExerciseViewer3DProps> = ({
  poseId,
  targetMuscles,
  className = '',
  height = '340px',
  onHide,
}) => {
  const [isPaused, setIsPaused] = useState(false);
  const [manualScrub, setManualScrub] = useState<number | undefined>(undefined);
  const [cameraKey, setCameraKey] = useState(0);
  const [activeViewAngle, setActiveViewAngle] = useState<'free' | 'side' | 'front' | 'top'>('front');

  const controlsRef = useRef<OrbitControlsImpl>(null);

  const resetCamera = () => {
    setActiveViewAngle('front');
    setCameraKey((prev) => prev + 1);
  };

  const setViewAngle = (view: 'front' | 'side' | 'top') => {
    setActiveViewAngle(view);
    if (!controlsRef.current) return;

    if (view === 'front') {
      controlsRef.current.object.position.set(0, 0.9, 2.3);
      controlsRef.current.target.set(0, 0.7, 0);
    } else if (view === 'side') {
      controlsRef.current.object.position.set(2.4, 0.8, 0);
      controlsRef.current.target.set(0, 0.6, 0);
    } else if (view === 'top') {
      controlsRef.current.object.position.set(1.5, 2.2, 1.5);
      controlsRef.current.target.set(0, 0.5, 0);
    }
    controlsRef.current.update();
  };

  return (
    <div
      className={`relative w-full rounded-3xl overflow-hidden bg-gradient-to-b from-[#182329] via-[#11191d] to-[#0a0f12] border border-white/15 shadow-2xl ${className}`}
      style={{ height }}
    >
      {/* 3D Canvas */}
      <Canvas
        key={cameraKey}
        shadows
        camera={{ position: [1.8, 1.1, 2.0], fov: 44 }}
        className="w-full h-full cursor-grab active:cursor-grabbing"
      >
        {/* Crisp Studio High-Key Lighting */}
        <ambientLight intensity={1.3} />
        {/* Main Key Light */}
        <directionalLight
          position={[4, 6, 4]}
          intensity={2.2}
          castShadow
          shadow-mapSize={1024}
          shadow-bias={-0.0001}
          color="#ffffff"
        />
        {/* Fill light */}
        <directionalLight position={[-4, 3, -2]} intensity={0.9} color="#b8d5ff" />
        {/* Rim Light for anatomical definition */}
        <pointLight position={[0, 4, -3]} intensity={1.8} color="#00f59b" />

        <Suspense fallback={null}>
          <Humanoid3D
            poseId={poseId}
            targetMuscles={targetMuscles}
            isPaused={isPaused || manualScrub !== undefined}
            manualProgress={manualScrub}
          />

          {/* Contact Shadows */}
          <ContactShadows
            position={[0, 0, 0]}
            opacity={0.7}
            scale={4}
            blur={1.6}
            far={1.5}
            color="#000000"
          />

          {/* Illuminated Studio Floor Grid */}
          <Grid
            position={[0, -0.001, 0]}
            args={[6, 6]}
            cellSize={0.35}
            cellThickness={0.8}
            cellColor="#263842"
            sectionSize={1.4}
            sectionThickness={1.4}
            sectionColor="#3d5666"
            fadeDistance={4.2}
          />
        </Suspense>

        {/* 360° Interactive Orbit Controls */}
        <OrbitControls
          ref={controlsRef}
          enableDamping
          dampingFactor={0.06}
          minDistance={1.1}
          maxDistance={4.2}
          maxPolarAngle={Math.PI / 2 + 0.05}
          target={[0, 0.65, 0]}
        />
      </Canvas>

      {/* Top Overlay Badges */}
      <div className="absolute top-3 inset-x-3 flex items-center justify-between pointer-events-none">
        <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-black/75 backdrop-blur-md border border-white/15 text-xs font-semibold text-white">
          <Sparkles className="w-3.5 h-3.5 text-[#00f59b] animate-pulse" />
          <span>مجسم 3D ناصع (أدر 360°)</span>
        </div>

        {/* Active Target Muscles Pill */}
        <div className="flex items-center gap-1">
          {targetMuscles.slice(0, 2).map((m) => (
            <span
              key={m}
              className="px-2.5 py-0.5 rounded-lg bg-[#ff1744]/25 border border-[#ff1744]/40 text-[#ff4f70] text-[11px] font-bold shadow-[0_0_8px_rgba(255,23,68,0.4)]"
            >
              {MUSCLE_NAMES[m]?.ar || m}
            </span>
          ))}
        </div>
      </div>

      {/* Camera Quick-Angle Preset Pills */}
      <div className="absolute top-12 right-3 flex flex-col gap-1 pointer-events-auto">
        <button
          onClick={() => setViewAngle('front')}
          className={`px-2 py-0.5 rounded-md text-[10px] font-bold border transition-all ${
            activeViewAngle === 'front'
              ? 'bg-[#00f59b] text-black border-[#00f59b]'
              : 'bg-black/60 text-zinc-300 border-white/10 hover:bg-black/80'
          }`}
        >
          أمام
        </button>
        <button
          onClick={() => setViewAngle('side')}
          className={`px-2 py-0.5 rounded-md text-[10px] font-bold border transition-all ${
            activeViewAngle === 'side'
              ? 'bg-[#00f59b] text-black border-[#00f59b]'
              : 'bg-black/60 text-zinc-300 border-white/10 hover:bg-black/80'
          }`}
        >
          جانب
        </button>
        <button
          onClick={() => setViewAngle('top')}
          className={`px-2 py-0.5 rounded-md text-[10px] font-bold border transition-all ${
            activeViewAngle === 'top'
              ? 'bg-[#00f59b] text-black border-[#00f59b]'
              : 'bg-black/60 text-zinc-300 border-white/10 hover:bg-black/80'
          }`}
        >
          أعلى
        </button>
      </div>

      {/* Bottom Floating Control Bar & Scrubber */}
      <div className="absolute bottom-3 inset-x-3 space-y-2 pointer-events-auto">
        {/* Interactive Scrub Slider (when paused or scrubbing) */}
        {manualScrub !== undefined && (
          <div className="flex items-center gap-2 p-2 rounded-xl bg-black/80 backdrop-blur-md border border-[#00f59b]/30">
            <Sliders className="w-3.5 h-3.5 text-[#00f59b]" />
            <input
              type="range"
              min="0"
              max="1"
              step="0.01"
              value={manualScrub}
              onChange={(e) => setManualScrub(parseFloat(e.target.value))}
              className="flex-1 accent-[#00f59b] h-1.5 bg-white/20 rounded-lg cursor-pointer"
            />
            <span className="text-[10px] font-mono font-bold text-[#00f59b]">
              {Math.round(manualScrub * 100)}%
            </span>
          </div>
        )}

        {/* Action Controls Row */}
        <div className="flex items-center justify-between">
          {/* Animated Tempo Guidance Pill */}
          <div className="px-3 py-1.5 rounded-xl bg-black/85 backdrop-blur-md border border-white/15 text-xs text-white font-medium flex items-center gap-2 shadow-lg">
            <span className="w-2 h-2 rounded-full bg-[#00f59b] animate-ping" />
            <span className="font-semibold text-[#00f59b]">إيقاع 3-1-1:</span>
            <span className="text-zinc-300">نزول 3ث ↓ ثبات 1ث ⏸ دفع 1ث ↑</span>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-1.5 bg-black/80 backdrop-blur-md p-1 rounded-xl border border-white/15 shadow-lg">
            <button
              onClick={() => {
                if (manualScrub !== undefined) {
                  setManualScrub(undefined);
                  setIsPaused(false);
                } else {
                  setIsPaused(!isPaused);
                }
              }}
              className="p-1.5 rounded-lg hover:bg-white/10 text-white transition-colors"
              title={isPaused ? 'تشغيل الحركة' : 'إيقاف مؤقت'}
              aria-label="تشغيل/إيقاف"
            >
              {isPaused || manualScrub !== undefined ? (
                <Play className="w-4 h-4 text-[#00f59b]" />
              ) : (
                <Pause className="w-4 h-4" />
              )}
            </button>

            {/* Scrub Mode Toggle */}
            <button
              onClick={() => {
                if (manualScrub === undefined) {
                  setManualScrub(0.5);
                  setIsPaused(true);
                } else {
                  setManualScrub(undefined);
                  setIsPaused(false);
                }
              }}
              className={`p-1.5 rounded-lg transition-colors ${
                manualScrub !== undefined
                  ? 'bg-[#00f59b] text-black font-bold'
                  : 'hover:bg-white/10 text-zinc-300'
              }`}
              title="التحكم اليدوي البطيء بالحركة"
            >
              <Sliders className="w-4 h-4" />
            </button>

            <button
              onClick={resetCamera}
              className="p-1.5 rounded-lg hover:bg-white/10 text-zinc-300 hover:text-white transition-colors"
              title="إعادة ضبط الكاميرا"
              aria-label="إعادة ضبط الزاوية"
            >
              <RotateCcw className="w-4 h-4" />
            </button>

            {onHide && (
              <button
                onClick={onHide}
                className="p-1.5 rounded-lg hover:bg-white/10 text-zinc-400 hover:text-white transition-colors"
                title="إخفاء المجسم لتوفير المساحة"
                aria-label="إخفاء 3D"
              >
                <EyeOff className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
