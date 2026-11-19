import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { VECTOR_EXERCISES, type VectorExerciseConfig, type VectorPoseKeyframe } from '../../data/vectorExercises';
import {
  Play,
  Pause,
  RotateCcw,
  Gauge,
  Zap,
  Flame,
  ArrowUpRight,
} from 'lucide-react';

interface AnatomicalVectorViewerProps {
  exerciseId: string;
  exerciseNameAr: string;
  targetMuscles?: string[];
  height?: string;
  isCoachMode?: boolean;
  coachProgress?: number; // 0 to 1 if driven externally
  coachPhase?: 'eccentric' | 'hold' | 'concentric';
  onHide?: () => void;
  onToggleViewMode?: () => void;
}

type Vec2 = [number, number];

function add(a: Vec2, b: Vec2): Vec2 {
  return [a[0] + b[0], a[1] + b[1]];
}

function sub(a: Vec2, b: Vec2): Vec2 {
  return [a[0] - b[0], a[1] - b[1]];
}

function mul(a: Vec2, s: number): Vec2 {
  return [a[0] * s, a[1] * s];
}

function len(v: Vec2): number {
  return Math.hypot(v[0], v[1]) || 1;
}

function norm(v: Vec2): Vec2 {
  const l = len(v);
  return [v[0] / l, v[1] / l];
}

function perp(u: Vec2): Vec2 {
  return [-u[1], u[0]];
}

function dot(a: Vec2, b: Vec2): number {
  return a[0] * b[0] + a[1] * b[1];
}

function lerp(a: number, b: number, t: number): number {
  return a + (b - a) * t;
}

function lerpPoint(p1: Vec2, p2: Vec2, t: number): Vec2 {
  return [lerp(p1[0], p2[0], t), lerp(p1[1], p2[1], t)];
}

function pt(p: Vec2): string {
  return `${p[0].toFixed(1)},${p[1].toFixed(1)}`;
}

// Hypertrophy 3-1-1 Easing
function easeInOutCubic(t: number): number {
  return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
}

function easeInOutSine(t: number): number {
  return -(Math.cos(Math.PI * t) - 1) / 2;
}

export const AnatomicalVectorViewer: React.FC<AnatomicalVectorViewerProps> = ({
  exerciseId,
  exerciseNameAr,
  targetMuscles = [],
  height = '290px',
  isCoachMode = false,
  coachProgress,
  coachPhase,
  onHide,
  onToggleViewMode,
}) => {
  const config: VectorExerciseConfig = useMemo(() => {
    return VECTOR_EXERCISES[exerciseId] || VECTOR_EXERCISES['p1'];
  }, [exerciseId]);

  const [isPlaying, setIsPlaying] = useState(!isCoachMode);
  const [speed, setSpeed] = useState<1 | 0.5>(1);
  const [showMuscles, setShowMuscles] = useState(true);
  const [showArrows, setShowArrows] = useState(true);
  const [manualScrub, setManualScrub] = useState<number | null>(null);

  // Hypertrophy 3-1-1 Tempo Loop (5000ms total)
  const [phaseTime, setPhaseTime] = useState(0);
  const reqRef = useRef<number | null>(null);
  const lastTimeRef = useRef<number | null>(null);

  const animate = useCallback(
    (time: number) => {
      if (lastTimeRef.current === null) lastTimeRef.current = time;
      const delta = (time - lastTimeRef.current) * speed;
      lastTimeRef.current = time;

      if (isPlaying && manualScrub === null && !isCoachMode) {
        setPhaseTime((prev) => (prev + delta) % 5000);
      }
      reqRef.current = requestAnimationFrame(animate);
    },
    [isPlaying, speed, manualScrub, isCoachMode]
  );

  useEffect(() => {
    reqRef.current = requestAnimationFrame(animate);
    return () => {
      if (reqRef.current) cancelAnimationFrame(reqRef.current);
    };
  }, [animate]);

  // Derived Progress & Phase (Zero cascading re-renders!)
  const { currentProgress, currentPhase } = useMemo(() => {
    if (manualScrub !== null) {
      const ph = manualScrub > 0.8 ? 'hold' : manualScrub > 0.3 ? 'concentric' : 'eccentric';
      return { currentProgress: manualScrub, currentPhase: ph as 'hold' | 'concentric' | 'eccentric' };
    }

    if (isCoachMode && coachProgress !== undefined) {
      return { currentProgress: coachProgress, currentPhase: coachPhase || 'eccentric' };
    }

    // 0s..1s: Concentric Drive (t: 0 -> 1)
    // 1s..2s: Isometric Hold (t: 1)
    // 2s..5s: Eccentric Slow Lowering (t: 1 -> 0)
    if (phaseTime < 1000) {
      const p = phaseTime / 1000;
      return { currentProgress: easeInOutCubic(p), currentPhase: 'concentric' as const };
    } else if (phaseTime < 2000) {
      return { currentProgress: 1.0, currentPhase: 'hold' as const };
    } else {
      const p = (phaseTime - 2000) / 3000;
      return { currentProgress: 1.0 - easeInOutSine(p), currentPhase: 'eccentric' as const };
    }
  }, [phaseTime, manualScrub, isCoachMode, coachProgress, coachPhase]);

  // Interpolated Keyframe Pose
  const currentPose = useMemo<VectorPoseKeyframe>(() => {
    const t = currentProgress;
    const { start, end } = config;

    const interpolateProp = (p1?: VectorPoseKeyframe['prop'], p2?: VectorPoseKeyframe['prop']) => {
      const p = p1 || p2;
      if (!p) return undefined;
      return {
        type: p.type,
        rects: p.rects.map((r, i) => {
          const r2 = p2?.rects[i] || r;
          return {
            x: lerp(r.x, r2.x, t),
            y: lerp(r.y, r2.y, t),
            w: lerp(r.w, r2.w, t),
            h: lerp(r.h, r2.h, t),
            rx: r.rx,
          };
        }),
      };
    };

    return {
      head: lerpPoint(start.head, end.head, t),
      neck: lerpPoint(start.neck, end.neck, t),
      shoulder: lerpPoint(start.shoulder, end.shoulder, t),
      hip: lerpPoint(start.hip, end.hip, t),
      nearElbow: lerpPoint(start.nearElbow, end.nearElbow, t),
      nearHand: lerpPoint(start.nearHand, end.nearHand, t),
      farElbow: lerpPoint(start.farElbow, end.farElbow, t),
      farHand: lerpPoint(start.farHand, end.farHand, t),
      nearKnee: lerpPoint(start.nearKnee, end.nearKnee, t),
      nearFoot: lerpPoint(start.nearFoot, end.nearFoot, t),
      farKnee: lerpPoint(start.farKnee, end.farKnee, t),
      farFoot: lerpPoint(start.farFoot, end.farFoot, t),
      prop: interpolateProp(start.prop, end.prop),
      bandAnchor: start.bandAnchor ? lerpPoint(start.bandAnchor, end.bandAnchor || start.bandAnchor, t) : undefined,
    };
  }, [config, currentProgress]);

  // Target muscles
  const muscleTags = useMemo(() => targetMuscles.map((m) => m.toLowerCase()), [targetMuscles]);
  const hasChest = muscleTags.some((m) => m.includes('chest'));
  const hasDelts = muscleTags.some((m) => m.includes('delt') || m.includes('shoulder'));
  const hasTriceps = muscleTags.some((m) => m.includes('tricep'));
  const hasBiceps = muscleTags.some((m) => m.includes('bicep'));
  const hasQuads = muscleTags.some((m) => m.includes('quad'));
  const hasHamstrings = muscleTags.some((m) => m.includes('hamstring') || m.includes('glute'));
  const hasBack = muscleTags.some((m) => m.includes('back') || m.includes('lat') || m.includes('trapezius'));
  const hasAbs = muscleTags.some((m) => m.includes('abs') || m.includes('core'));

  // Spine orientation: su (spine unit vector), fn (front normal), bn (back normal)
  const { su, fn, bn } = useMemo(() => {
    const { hip, neck, head, nearHand } = currentPose;
    const sVec = sub(neck, hip);
    const sUnit = norm(sVec);
    let sNorm = perp(sUnit);

    const spineMid = lerpPoint(hip, neck, 0.5);
    const refPt = nearHand || head;
    const refVec = sub(refPt, spineMid);
    const d = dot(refVec, sNorm);

    const fNormal = d >= 0 ? sNorm : mul(sNorm, -1);
    const bNormal = mul(fNormal, -1);

    return { su: sUnit, fn: fNormal, bn: bNormal };
  }, [currentPose]);

  // -------------------------------------------------------------------------
  // Stylized Athletic Rendering Helpers
  // -------------------------------------------------------------------------
  // Color palette
  const SKIN_NEAR = '#e2e8f0'; // Platinum athletic skin
  const SKIN_STROKE = '#94a3b8';
  const SKIN_FAR = '#475569'; // Depth layer skin
  const SKIN_FAR_STROKE = '#334155';

  const SHIRT_BG = '#1e293b'; // Slate athletic compression shirt
  const SHIRT_STROKE = '#38bdf8'; // Cyan accent piping
  const SHORTS_BG = '#0f172a'; // Dark athletic shorts
  const SHORTS_TRIM = '#00f59b'; // Emerald trim stripe

  const SHOE_BODY = '#1e293b';
  const SHOE_SOLE = '#ffffff';

  // Helper: Renders an anatomical limb segment with joint caps and organic taper
  const renderLimb = useCallback(
    (p1: Vec2, p2: Vec2, r1: number, r2: number, isFar: boolean = false) => {
      const segVec = sub(p2, p1);
      const segU = norm(segVec);
      const segN = perp(segU);

      const p1a = add(p1, mul(segN, r1));
      const p1b = sub(p1, mul(segN, r1));
      const p2a = add(p2, mul(segN, r2));
      const p2b = sub(p2, mul(segN, r2));

      const fillColor = isFar ? SKIN_FAR : SKIN_NEAR;
      const strokeColor = isFar ? SKIN_FAR_STROKE : SKIN_STROKE;

      return (
        <g>
          {/* Main limb segment */}
          <polygon
            points={`${pt(p1a)} ${pt(p2a)} ${pt(p2b)} ${pt(p1b)}`}
            fill={fillColor}
            stroke={strokeColor}
            strokeWidth="1"
          />
          {/* Joint caps for smooth organic continuity */}
          <circle cx={p1[0]} cy={p1[1]} r={r1} fill={fillColor} stroke={strokeColor} strokeWidth="1" />
          <circle cx={p2[0]} cy={p2[1]} r={r2} fill={fillColor} stroke={strokeColor} strokeWidth="1" />
        </g>
      );
    },
    []
  );

  // Helper: Renders modern athletic training sneaker
  const renderShoe = useCallback((foot: Vec2, isFar: boolean = false) => {
    const [fx, fy] = foot;
    const soleW = 16;
    const soleH = 3.5;
    const upperH = 7;

    return (
      <g>
        {/* Sole (white rubber) */}
        <rect
          x={fx - 5}
          y={fy}
          width={soleW}
          height={soleH}
          rx={1}
          fill={isFar ? '#94a3b8' : SHOE_SOLE}
          stroke={isFar ? '#475569' : '#cbd5e1'}
          strokeWidth="0.8"
        />
        {/* Sneaker upper */}
        <path
          d={`M ${fx - 4} ${fy} L ${fx + 2} ${fy - upperH} L ${fx + 7} ${fy - upperH + 2} L ${fx + 10} ${fy} Z`}
          fill={isFar ? '#1e293b' : SHOE_BODY}
          stroke={isFar ? '#0f172a' : '#334155'}
          strokeWidth="0.8"
        />
        {/* Neon accent stripe */}
        {!isFar && (
          <line
            x1={fx}
            y1={fy - 2}
            x2={fx + 7}
            y2={fy - 2}
            stroke="#00f59b"
            strokeWidth="1.2"
          />
        )}
      </g>
    );
  }, []);

  // Helper: Renders athletic closed fist / palm
  const renderHand = useCallback((hand: Vec2, isFar: boolean = false) => {
    return (
      <g>
        {/* Hand knuckle / palm */}
        <circle
          cx={hand[0]}
          cy={hand[1]}
          r="4.2"
          fill={isFar ? SKIN_FAR : '#f8fafc'}
          stroke={isFar ? SKIN_FAR_STROKE : SKIN_STROKE}
          strokeWidth="1"
        />
        {/* Wristband */}
        <circle
          cx={hand[0]}
          cy={hand[1]}
          r="2.5"
          fill="#ff3d5a"
          opacity={isFar ? 0.5 : 0.9}
        />
      </g>
    );
  }, []);

  // Torso (wearing Athletic Tank Top)
  const torsoShape = useMemo(() => {
    const { hip, neck, shoulder } = currentPose;

    const chestFront = add(neck, mul(fn, 9));
    const waistFront = add(hip, mul(fn, 6));
    const waistBack = add(hip, mul(bn, 6));
    const backTop = add(neck, mul(bn, 8));

    return {
      points: `${pt(chestFront)} ${pt(waistFront)} ${pt(waistBack)} ${pt(backTop)}`,
      chestCenter: lerpPoint(neck, hip, 0.4),
      midTorso: lerpPoint(neck, hip, 0.5),
    };
  }, [currentPose, fn, bn]);

  // Shorts (covering pelvis and top of thighs)
  const shortsShape = useMemo(() => {
    const { hip } = currentPose;
    const waistFront = add(hip, mul(fn, 7.5));
    const waistBack = add(hip, mul(bn, 7.5));
    const hemFront = add(waistFront, mul(su, -12));
    const hemBack = add(waistBack, mul(su, -12));

    return `${pt(waistFront)} ${pt(hemFront)} ${pt(hemBack)} ${pt(waistBack)}`;
  }, [currentPose, fn, bn, su]);

  // Head (wearing athletic hairstyle / headband)
  const headElements = useMemo(() => {
    const { head, neck } = currentPose;
    const [hx, hy] = head;

    // Gaze direction vector
    const gazeVec = norm(sub(head, neck));
    const gazeNormal = perp(gazeVec);
    const faceDir = dot(gazeNormal, fn) >= 0 ? gazeNormal : mul(gazeNormal, -1);

    return {
      center: head,
      gazeEye: add(head, add(mul(faceDir, 4.5), mul(gazeVec, 1.5))),
    };
  }, [currentPose, fn]);

  // Resistance Band curve
  const bandPath = useMemo(() => {
    if (!currentPose.bandAnchor) return null;
    const [ax, ay] = currentPose.bandAnchor;
    const [hx, hy] = currentPose.nearHand;

    // Realistic sag when relaxed, straightens under tension
    const midX = (ax + hx) / 2;
    const midY = (ay + hy) / 2 + (1 - currentProgress) * 6;

    return `M ${ax} ${ay} Q ${midX.toFixed(1)} ${midY.toFixed(1)} ${hx} ${hy}`;
  }, [currentPose, currentProgress]);

  const arrow = config.motionArrow;
  const muscleGlowOpacity = 0.45 + currentProgress * 0.55;

  return (
    <div className="relative w-full rounded-2xl overflow-hidden bg-[#0a0f0d] border border-white/10 shadow-2xl flex flex-col select-none">
      {/* Top Bar: Live Tempo Pill & Badges */}
      <div className="absolute top-3 left-3 right-3 flex items-center justify-between z-10 pointer-events-none">
        {/* Phase Pill with 3-1-1 Tempo Cue */}
        <div className="flex items-center gap-2 pointer-events-auto">
          <div
            className={`flex items-center gap-1.5 px-3 py-1 rounded-full border text-xs font-bold transition-all shadow-lg backdrop-blur-md ${
              currentPhase === 'eccentric'
                ? 'bg-amber-500/20 border-amber-500/40 text-amber-300'
                : currentPhase === 'hold'
                ? 'bg-[#00f59b]/20 border-[#00f59b]/40 text-[#00f59b]'
                : 'bg-[#ff3d5a]/20 border-[#ff3d5a]/40 text-[#ff758c]'
            }`}
          >
            <Zap className="w-3.5 h-3.5 animate-pulse" />
            <span>
              {currentPhase === 'eccentric'
                ? '① نزول بطيء وتحكم 3ث ↓'
                : currentPhase === 'hold'
                ? '② ثبات وتمدد 1ث ⏸'
                : '③ دفع انفجاري 1ث ↑'}
            </span>
          </div>

          <span className="hidden sm:inline-flex items-center px-2 py-0.5 rounded-md bg-white/5 border border-white/10 text-[11px] text-zinc-400 font-mono">
            {Math.round(currentProgress * 100)}% انقباض
          </span>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-1.5 pointer-events-auto">
          <button
            onClick={() => setShowMuscles(!showMuscles)}
            className={`p-1.5 rounded-lg border transition-all ${
              showMuscles
                ? 'bg-[#ff3d5a]/20 border-[#ff3d5a]/40 text-[#ff758c]'
                : 'bg-white/5 border-white/10 text-zinc-400'
            }`}
            title="تفعيل/تعطيل توهج العضلات المستهدفة"
          >
            <Flame className="w-4 h-4" />
          </button>

          <button
            onClick={() => setShowArrows(!showArrows)}
            className={`p-1.5 rounded-lg border transition-all ${
              showArrows
                ? 'bg-[#00f59b]/20 border-[#00f59b]/40 text-[#00f59b]'
                : 'bg-white/5 border-white/10 text-zinc-400'
            }`}
            title="تفعيل/تعطيل مسارات واتجاهات الحركة"
          >
            <ArrowUpRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* SVG Canvas Arena */}
      <div className="relative w-full flex items-center justify-center" style={{ height }}>
        <svg
          viewBox="0 0 320 220"
          className="w-full h-full object-contain overflow-visible"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            {/* Background Studio Lighting */}
            <radialGradient id="studioLighting" cx="50%" cy="45%" r="65%">
              <stop offset="0%" stopColor="#1a2521" />
              <stop offset="60%" stopColor="#0d1412" />
              <stop offset="100%" stopColor="#070b09" />
            </radialGradient>

            {/* Muscle highlight neon glow filter */}
            <filter id="muscleGlow" x="-30%" y="-30%" width="160%" height="160%">
              <feGaussianBlur in="SourceGraphic" stdDeviation="3.5" result="blur1" />
              <feGaussianBlur in="SourceGraphic" stdDeviation="1.5" result="blur2" />
              <feMerge>
                <feMergeNode in="blur1" />
                <feMergeNode in="blur2" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>

            {/* Floor shadow filter */}
            <filter id="floorShadow" x="-20%" y="-40%" width="140%" height="180%">
              <feGaussianBlur in="SourceGraphic" stdDeviation="4" />
            </filter>

            {/* Arrowhead marker */}
            <marker
              id="arrowHead"
              viewBox="0 0 10 10"
              refX="6"
              refY="5"
              markerWidth="6"
              markerHeight="6"
              orient="auto-start-reverse"
            >
              <path d="M 0 1 L 10 5 L 0 9 z" fill="#00f59b" />
            </marker>

            {/* Muscle Crimson Gradient */}
            <linearGradient id="muscleCrimson" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#ff5277" />
              <stop offset="50%" stopColor="#ff2d55" />
              <stop offset="100%" stopColor="#d9003b" />
            </linearGradient>
          </defs>

          {/* Studio Backdrop */}
          <rect width="320" height="220" fill="url(#studioLighting)" />

          {/* Perspective Studio Floor Line */}
          <line x1="10" y1="175" x2="310" y2="175" stroke="#1f2f27" strokeWidth="1.5" strokeDasharray="3 3" />

          {/* Dynamic Floor Shadow */}
          <ellipse
            cx={lerp(currentPose.hip[0], currentPose.shoulder[0], 0.4)}
            cy="176"
            rx={Math.max(25, Math.abs(currentPose.nearFoot[0] - currentPose.shoulder[0]) * 0.4 + 20)}
            ry="6"
            fill="rgba(0,0,0,0.65)"
            filter="url(#floorShadow)"
          />

          {/* Equipment Props (Benches, Chairs, Bars) */}
          {currentPose.prop && (
            <g className="equipment-layer">
              {currentPose.prop.rects.map((r, i) => (
                <rect
                  key={i}
                  x={r.x}
                  y={r.y}
                  width={r.w}
                  height={r.h}
                  rx={r.rx || 3}
                  fill="#18232c"
                  stroke="#334155"
                  strokeWidth="1.5"
                  className="shadow-lg"
                />
              ))}
              {/* Bench highlight bar */}
              {currentPose.prop.rects[0] && (
                <line
                  x1={currentPose.prop.rects[0].x}
                  y1={currentPose.prop.rects[0].y + 1}
                  x2={currentPose.prop.rects[0].x + currentPose.prop.rects[0].w}
                  y2={currentPose.prop.rects[0].y + 1}
                  stroke="#00f59b"
                  strokeWidth="2"
                  strokeLinecap="round"
                  opacity="0.8"
                />
              )}
            </g>
          )}

          {/* ------------------------------------------------------------- */}
          {/* 1. FAR LAYER (Depth Limbs in Background)                      */}
          {/* ------------------------------------------------------------- */}
          <g className="far-layer" opacity="0.6">
            {/* Far Thigh */}
            {renderLimb(currentPose.hip, currentPose.farKnee, 7.5, 5.5, true)}
            {/* Far Calf */}
            {renderLimb(currentPose.farKnee, currentPose.farFoot, 5.5, 4, true)}
            {/* Far Shoe */}
            {renderShoe(currentPose.farFoot, true)}

            {/* Far Upper Arm */}
            {renderLimb(currentPose.shoulder, currentPose.farElbow, 5.5, 4.5, true)}
            {/* Far Forearm */}
            {renderLimb(currentPose.farElbow, currentPose.farHand, 4.5, 3.5, true)}
            {/* Far Hand */}
            {renderHand(currentPose.farHand, true)}
          </g>

          {/* ------------------------------------------------------------- */}
          {/* 2. TORSO & CORE (Athletic Compression Tank & Shorts)          */}
          {/* ------------------------------------------------------------- */}
          <g className="torso-layer">
            {/* Exposed Neck Column */}
            <line
              x1={currentPose.neck[0]}
              y1={currentPose.neck[1]}
              x2={currentPose.head[0]}
              y2={currentPose.head[1]}
              stroke={SKIN_NEAR}
              strokeWidth="6"
              strokeLinecap="round"
            />

            {/* Compression Tank Top */}
            <polygon
              points={torsoShape.points}
              fill={SHIRT_BG}
              stroke={SHIRT_STROKE}
              strokeWidth="1.5"
              strokeLinejoin="round"
            />
            {/* Athletic Tank Collar / Trim */}
            <line
              x1={currentPose.neck[0] + fn[0] * 5}
              y1={currentPose.neck[1] + fn[1] * 5}
              x2={currentPose.neck[0] - fn[0] * 3}
              y2={currentPose.neck[1] - fn[1] * 3}
              stroke="#ff3d5a"
              strokeWidth="2"
              strokeLinecap="round"
            />

            {/* Athletic Gym Shorts */}
            <polygon
              points={shortsShape}
              fill={SHORTS_BG}
              stroke="#1e293b"
              strokeWidth="1.2"
              strokeLinejoin="round"
            />
            {/* Shorts Emerald Stripe */}
            <line
              x1={currentPose.hip[0]}
              y1={currentPose.hip[1]}
              x2={currentPose.hip[0] - su[0] * 12}
              y2={currentPose.hip[1] - su[1] * 12}
              stroke={SHORTS_TRIM}
              strokeWidth="1.5"
              strokeLinecap="round"
            />
          </g>

          {/* ------------------------------------------------------------- */}
          {/* 3. ATHLETIC HEAD & PROFILE                                    */}
          {/* ------------------------------------------------------------- */}
          <g className="head-layer">
            {/* Head Cranium */}
            <circle
              cx={headElements.center[0]}
              cy={headElements.center[1]}
              r="8"
              fill={SKIN_NEAR}
              stroke={SKIN_STROKE}
              strokeWidth="1"
            />
            {/* Stylized Hair Cap */}
            <path
              d={`M ${headElements.center[0] - 8} ${headElements.center[1]} ` +
                `A 8 8 0 0 1 ${headElements.center[0] + 8} ${headElements.center[1]} ` +
                `Q ${headElements.center[0]} ${headElements.center[1] - 4} ${headElements.center[0] - 8} ${headElements.center[1]} Z`}
              fill="#0f172a"
            />
            {/* Gaze / Visor Dot */}
            <circle
              cx={headElements.gazeEye[0]}
              cy={headElements.gazeEye[1]}
              r="1.2"
              fill="#00f59b"
            />
          </g>

          {/* ------------------------------------------------------------- */}
          {/* 4. NEAR LAYER (Foreground Athletic Limbs)                     */}
          {/* ------------------------------------------------------------- */}
          <g className="near-layer">
            {/* Near Thigh with Quad Sweep */}
            {renderLimb(currentPose.hip, currentPose.nearKnee, 8.5, 6, false)}
            {/* Knee Patella Cap */}
            <circle cx={currentPose.nearKnee[0]} cy={currentPose.nearKnee[1]} r="4.5" fill="#f8fafc" stroke={SKIN_STROKE} strokeWidth="1" />

            {/* Near Calf with Muscular Gastrocnemius */}
            {renderLimb(currentPose.nearKnee, currentPose.nearFoot, 6, 4.2, false)}
            {/* Near Training Sneaker */}
            {renderShoe(currentPose.nearFoot, false)}

            {/* Deltoid Cap over Glenohumeral Joint */}
            <ellipse
              cx={currentPose.shoulder[0]}
              cy={currentPose.shoulder[1]}
              rx="7.5"
              ry="6.5"
              fill={SKIN_NEAR}
              stroke={SKIN_STROKE}
              strokeWidth="1"
            />

            {/* Near Upper Arm (Bicep / Tricep) */}
            {renderLimb(currentPose.shoulder, currentPose.nearElbow, 6.5, 5, false)}
            {/* Elbow Pivot Joint */}
            <circle cx={currentPose.nearElbow[0]} cy={currentPose.nearElbow[1]} r="4" fill="#f8fafc" stroke={SKIN_STROKE} strokeWidth="1" />

            {/* Near Forearm */}
            {renderLimb(currentPose.nearElbow, currentPose.nearHand, 5, 3.8, false)}
            {/* Near Hand / Fist */}
            {renderHand(currentPose.nearHand, false)}
          </g>

          {/* ------------------------------------------------------------- */}
          {/* 5. TARGET MUSCLE NEON HEATMAP OVERLAYS                        */}
          {/* ------------------------------------------------------------- */}
          {showMuscles && (
            <g className="muscle-glow-layer" filter="url(#muscleGlow)">
              {/* Chest / Pecs Glow */}
              {hasChest && (
                <ellipse
                  cx={currentPose.shoulder[0] + fn[0] * 7}
                  cy={currentPose.shoulder[1] + fn[1] * 7}
                  rx="7"
                  ry="5.5"
                  fill="url(#muscleCrimson)"
                  opacity={muscleGlowOpacity}
                />
              )}

              {/* Deltoids Glow */}
              {hasDelts && (
                <circle
                  cx={currentPose.shoulder[0]}
                  cy={currentPose.shoulder[1]}
                  r="7.5"
                  fill="url(#muscleCrimson)"
                  opacity={muscleGlowOpacity}
                />
              )}

              {/* Triceps Glow (Posterior upper arm) */}
              {hasTriceps && (
                <line
                  x1={currentPose.shoulder[0] + bn[0] * 3}
                  y1={currentPose.shoulder[1] + bn[1] * 3}
                  x2={currentPose.nearElbow[0] + bn[0] * 3}
                  y2={currentPose.nearElbow[1] + bn[1] * 3}
                  stroke="url(#muscleCrimson)"
                  strokeWidth="5"
                  strokeLinecap="round"
                  opacity={muscleGlowOpacity}
                />
              )}

              {/* Biceps Glow (Anterior upper arm) */}
              {hasBiceps && (
                <line
                  x1={currentPose.shoulder[0] + fn[0] * 3}
                  y1={currentPose.shoulder[1] + fn[1] * 3}
                  x2={currentPose.nearElbow[0] + fn[0] * 3}
                  y2={currentPose.nearElbow[1] + fn[1] * 3}
                  stroke="url(#muscleCrimson)"
                  strokeWidth="5"
                  strokeLinecap="round"
                  opacity={muscleGlowOpacity}
                />
              )}

              {/* Quads Glow (Anterior thigh) */}
              {hasQuads && (
                <line
                  x1={currentPose.hip[0] + fn[0] * 4}
                  y1={currentPose.hip[1] + fn[1] * 4}
                  x2={currentPose.nearKnee[0] + fn[0] * 4}
                  y2={currentPose.nearKnee[1] + fn[1] * 4}
                  stroke="url(#muscleCrimson)"
                  strokeWidth="7"
                  strokeLinecap="round"
                  opacity={muscleGlowOpacity}
                />
              )}

              {/* Hamstrings Glow (Posterior thigh) */}
              {hasHamstrings && (
                <line
                  x1={currentPose.hip[0] + bn[0] * 4}
                  y1={currentPose.hip[1] + bn[1] * 4}
                  x2={currentPose.nearKnee[0] + bn[0] * 4}
                  y2={currentPose.nearKnee[1] + bn[1] * 4}
                  stroke="url(#muscleCrimson)"
                  strokeWidth="6"
                  strokeLinecap="round"
                  opacity={muscleGlowOpacity}
                />
              )}

              {/* Lats / Back Glow */}
              {hasBack && (
                <line
                  x1={currentPose.neck[0] + bn[0] * 6}
                  y1={currentPose.neck[1] + bn[1] * 6}
                  x2={currentPose.hip[0] + bn[0] * 4}
                  y2={currentPose.hip[1] + bn[1] * 4}
                  stroke="url(#muscleCrimson)"
                  strokeWidth="6"
                  strokeLinecap="round"
                  opacity={muscleGlowOpacity}
                />
              )}

              {/* Abs / Core Glow */}
              {hasAbs && (
                <ellipse
                  cx={torsoShape.midTorso[0] + fn[0] * 4}
                  cy={torsoShape.midTorso[1] + fn[1] * 4}
                  rx="6"
                  ry="8"
                  fill="url(#muscleCrimson)"
                  opacity={muscleGlowOpacity}
                />
              )}
            </g>
          )}

          {/* ------------------------------------------------------------- */}
          {/* 6. DYNAMIC RESISTANCE BAND                                    */}
          {/* ------------------------------------------------------------- */}
          {bandPath && currentPose.bandAnchor && (
            <g className="resistance-band-layer">
              <circle
                cx={currentPose.bandAnchor[0]}
                cy={currentPose.bandAnchor[1]}
                r="4.5"
                fill="#1e293b"
                stroke="#00f59b"
                strokeWidth="2"
              />
              <path
                d={bandPath}
                fill="none"
                stroke="#00f59b"
                strokeWidth={3 - currentProgress * 0.8}
                strokeLinecap="round"
                opacity="0.9"
                filter="url(#muscleGlow)"
              />
            </g>
          )}

          {/* ------------------------------------------------------------- */}
          {/* 7. DYNAMIC MOTION ARROW & MOVEMENT VECTORS                    */}
          {/* ------------------------------------------------------------- */}
          {showArrows && arrow && (
            <g className="motion-arrow-layer">
              <line
                x1={arrow.start[0]}
                y1={arrow.start[1]}
                x2={arrow.end[0]}
                y2={arrow.end[1]}
                stroke="#00f59b"
                strokeWidth="2.5"
                strokeDasharray="4 3"
                markerEnd="url(#arrowHead)"
                opacity="0.85"
                className="animate-pulse"
              />

              <g
                transform={`translate(${
                  (arrow.start[0] + arrow.end[0]) / 2 - 35
                }, ${
                  (arrow.start[1] + arrow.end[1]) / 2 - 18
                })`}
              >
                <rect
                  width="70"
                  height="16"
                  rx="4"
                  fill="rgba(10, 15, 13, 0.9)"
                  stroke="rgba(0, 245, 155, 0.4)"
                  strokeWidth="1"
                />
                <text
                  x="35"
                  y="11.5"
                  textAnchor="middle"
                  fill="#00f59b"
                  fontSize="8.5"
                  fontWeight="bold"
                  fontFamily="system-ui, sans-serif"
                >
                  {arrow.label}
                </text>
              </g>
            </g>
          )}
        </svg>
      </div>

      {/* Bottom Interactive Control Deck */}
      <div className="bg-[#101714] border-t border-white/10 p-3 flex flex-col gap-2.5">
        {/* Interactive Scrub Slider */}
        <div className="flex items-center gap-3">
          <span className="text-[10px] text-zinc-400 font-medium whitespace-nowrap">
            أقصى إطالة 0%
          </span>
          <input
            type="range"
            min="0"
            max="1"
            step="0.01"
            value={currentProgress}
            onChange={(e) => {
              setIsPlaying(false);
              setManualScrub(parseFloat(e.target.value));
            }}
            className="flex-1 h-1.5 bg-zinc-700 rounded-lg appearance-none cursor-pointer accent-[#ff3d5a]"
          />
          <span className="text-[10px] text-zinc-400 font-medium whitespace-nowrap">
            أقصى انقباض 100%
          </span>
        </div>

        {/* Buttons Row */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {/* Play/Pause Button */}
            <button
              onClick={() => {
                if (manualScrub !== null) setManualScrub(null);
                setIsPlaying(!isPlaying);
              }}
              className={`p-2 rounded-xl border flex items-center justify-center transition-all shadow-md ${
                isPlaying
                  ? 'bg-white/10 hover:bg-white/15 border-white/15 text-white'
                  : 'bg-[#ff3d5a] hover:bg-[#ff5277] border-[#ff3d5a] text-white'
              }`}
              title={isPlaying ? 'إيقاف مؤقت' : 'تشغيل الحركة'}
            >
              {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 fill-white" />}
            </button>

            {/* Reset / Loop Button */}
            <button
              onClick={() => {
                setPhaseTime(0);
                setManualScrub(null);
                setIsPlaying(true);
              }}
              className="p-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-zinc-300 transition-colors"
              title="إعادة التكرار من البداية"
            >
              <RotateCcw className="w-4 h-4" />
            </button>

            {/* Speed Toggle (1x / 0.5x Slow-Motion) */}
            <button
              onClick={() => setSpeed(speed === 1 ? 0.5 : 1)}
              className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-mono text-zinc-300 transition-colors"
              title="تغيير سرعة العرض للتدقيق الحركي"
            >
              <Gauge className="w-3.5 h-3.5 text-[#00f59b]" />
              <span>{speed === 1 ? '1.0x (3-1-1)' : '0.5x بطيء'}</span>
            </button>
          </div>

          {/* Biomechanical Note */}
          <div className="text-[11px] text-zinc-400 flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-[#ff3d5a] animate-ping" />
            <span className="hidden sm:inline">تحكّم بـ 3 ثوانٍ نزولاً لتضخيم أقصى</span>
            <span className="sm:hidden">إيقاع 3-1-1</span>
          </div>
        </div>
      </div>
    </div>
  );
};
