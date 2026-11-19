import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { POSES_3D } from '../../data/poses3d';

interface Humanoid3DProps {
  poseId: string;
  targetMuscles: string[];
  playbackSpeed?: number;
  isPaused?: boolean;
  manualProgress?: number; // 0 to 1 if user is scrubbing
}

// Helper to lerp 3D coordinate tuples
const lerp3 = (
  a: [number, number, number],
  b: [number, number, number],
  t: number
): [number, number, number] => {
  return [
    a[0] + (b[0] - a[0]) * t,
    a[1] + (b[1] - a[1]) * t,
    a[2] + (b[2] - a[2]) * t,
  ];
};

// 3-1-1 Tempo interpolation curve:
// 0.0 - 0.6 (3 seconds): Eccentric descent (0 -> 1)
// 0.6 - 0.8 (1 second): Isometric stretch hold at bottom (1)
// 0.8 - 1.0 (1 second): Concentric explosive drive (1 -> 0)
const calculateTempoU = (cycleTimeSeconds: number): number => {
  const t = (cycleTimeSeconds % 5.0) / 5.0;
  if (t < 0.6) {
    const sub = t / 0.6;
    return sub * sub * (3 - 2 * sub);
  } else if (t < 0.8) {
    return 1.0;
  } else {
    const sub = (t - 0.8) / 0.2;
    return 1.0 - sub * sub * (3 - 2 * sub);
  }
};

export const Humanoid3D: React.FC<Humanoid3DProps> = ({
  poseId,
  targetMuscles,
  isPaused = false,
  manualProgress,
}) => {
  const rootGroupRef = useRef<THREE.Group>(null);

  const poseData = useMemo(() => {
    return POSES_3D[poseId] || POSES_3D.default;
  }, [poseId]);

  // Bright, high-contrast, clean athletic mannequin materials
  const mannequinBodyMaterial = useMemo(() => {
    return new THREE.MeshStandardMaterial({
      color: '#edf2f7', // Clean bright pearl white
      roughness: 0.28,
      metalness: 0.12,
    });
  }, []);

  const jointAccentMaterial = useMemo(() => {
    return new THREE.MeshStandardMaterial({
      color: '#1a222d', // Sleek dark titanium accent
      roughness: 0.35,
      metalness: 0.5,
    });
  }, []);

  const clothesShortsMaterial = useMemo(() => {
    return new THREE.MeshStandardMaterial({
      color: '#1f2937',
      roughness: 0.5,
      metalness: 0.2,
    });
  }, []);

  const shoesMaterial = useMemo(() => {
    return new THREE.MeshStandardMaterial({
      color: '#0f172a',
      roughness: 0.3,
      metalness: 0.4,
    });
  }, []);

  const propMaterial = useMemo(() => {
    return new THREE.MeshStandardMaterial({
      color: '#334155', // Slate bench/box
      roughness: 0.4,
      metalness: 0.2,
    });
  }, []);

  const trajectoryGuideMaterial = useMemo(() => {
    return new THREE.LineDashedMaterial({
      color: '#00f59b',
      dashSize: 0.05,
      gapSize: 0.03,
      linewidth: 2,
    });
  }, []);

  // Check target muscles
  const isChestActive = targetMuscles.includes('chest');
  const isDeltoidsActive = targetMuscles.includes('front-deltoids') || targetMuscles.includes('back-deltoids');
  const isBicepsActive = targetMuscles.includes('biceps');
  const isTricepsActive = targetMuscles.includes('triceps');
  const isBackActive = targetMuscles.includes('upper-back') || targetMuscles.includes('trapezius');
  const isQuadsActive = targetMuscles.includes('quadriceps') || targetMuscles.includes('gluteal');
  const isHamstringsActive = targetMuscles.includes('hamstring');
  const isCalvesActive = targetMuscles.includes('calves');
  const isAbsActive = targetMuscles.includes('abs');

  // Luminous High-Contrast Muscle Glow Material
  const createMuscleMaterial = (isActive: boolean) => {
    if (!isActive) {
      return mannequinBodyMaterial;
    }
    return new THREE.MeshStandardMaterial({
      color: '#ff1744',
      emissive: '#ff1744',
      emissiveIntensity: 1.2,
      roughness: 0.2,
      metalness: 0.1,
    });
  };

  const chestMat = useMemo(() => createMuscleMaterial(isChestActive), [isChestActive, mannequinBodyMaterial]);
  const deltoidMat = useMemo(() => createMuscleMaterial(isDeltoidsActive), [isDeltoidsActive, mannequinBodyMaterial]);
  const bicepMat = useMemo(() => createMuscleMaterial(isBicepsActive), [isBicepsActive, mannequinBodyMaterial]);
  const tricepMat = useMemo(() => createMuscleMaterial(isTricepsActive), [isTricepsActive, mannequinBodyMaterial]);
  const backMat = useMemo(() => createMuscleMaterial(isBackActive), [isBackActive, mannequinBodyMaterial]);
  const absMat = useMemo(() => createMuscleMaterial(isAbsActive), [isAbsActive, mannequinBodyMaterial]);
  const quadsMat = useMemo(() => createMuscleMaterial(isQuadsActive), [isQuadsActive, mannequinBodyMaterial]);
  const hamsMat = useMemo(() => createMuscleMaterial(isHamstringsActive), [isHamstringsActive, mannequinBodyMaterial]);
  const calvesMat = useMemo(() => createMuscleMaterial(isCalvesActive), [isCalvesActive, mannequinBodyMaterial]);

  // Joint References
  const hipsRef = useRef<THREE.Group>(null);
  const torsoRef = useRef<THREE.Group>(null);
  const headRef = useRef<THREE.Group>(null);
  const lShoulderRef = useRef<THREE.Group>(null);
  const lElbowRef = useRef<THREE.Group>(null);
  const rShoulderRef = useRef<THREE.Group>(null);
  const rElbowRef = useRef<THREE.Group>(null);
  const lHipRef = useRef<THREE.Group>(null);
  const lKneeRef = useRef<THREE.Group>(null);
  const rHipRef = useRef<THREE.Group>(null);
  const rKneeRef = useRef<THREE.Group>(null);

  const timeRef = useRef(0);

  useFrame((_, delta) => {
    if (!isPaused && manualProgress === undefined) {
      timeRef.current += delta;
    }

    const u = manualProgress !== undefined ? manualProgress : calculateTempoU(timeRef.current);

    const s = poseData.start;
    const e = poseData.end;

    // Smooth Joint Interpolation
    const hipsPos = lerp3(s.hipsPos, e.hipsPos, u);
    const hipsRot = lerp3(s.hipsRot, e.hipsRot, u);
    const torsoRot = lerp3(s.torsoRot, e.torsoRot, u);
    const headRot = lerp3(s.headRot, e.headRot, u);

    const lSR = lerp3(s.lShoulderRot, e.lShoulderRot, u);
    const lER = lerp3(s.lElbowRot, e.lElbowRot, u);
    const rSR = lerp3(s.rShoulderRot, e.rShoulderRot, u);
    const rER = lerp3(s.rElbowRot, e.rElbowRot, u);

    const lHR = lerp3(s.lHipRot, e.lHipRot, u);
    const lKR = lerp3(s.lKneeRot, e.lKneeRot, u);
    const rHR = lerp3(s.rHipRot, e.rHipRot, u);
    const rKR = lerp3(s.rKneeRot, e.rKneeRot, u);

    if (hipsRef.current) {
      hipsRef.current.position.set(...hipsPos);
      hipsRef.current.rotation.set(...hipsRot);
    }
    if (torsoRef.current) torsoRef.current.rotation.set(...torsoRot);
    if (headRef.current) headRef.current.rotation.set(...headRot);

    if (lShoulderRef.current) lShoulderRef.current.rotation.set(...lSR);
    if (lElbowRef.current) lElbowRef.current.rotation.set(...lER);
    if (rShoulderRef.current) rShoulderRef.current.rotation.set(...rSR);
    if (rElbowRef.current) rElbowRef.current.rotation.set(...rER);

    if (lHipRef.current) lHipRef.current.rotation.set(...lHR);
    if (lKneeRef.current) lKneeRef.current.rotation.set(...lKR);
    if (rHipRef.current) rHipRef.current.rotation.set(...rHR);
    if (rKneeRef.current) rKneeRef.current.rotation.set(...rKR);

    // Dynamic emissive pulsing on peak tension
    const pulseFactor = 0.8 + 0.4 * Math.sin(timeRef.current * 5);
    if (isChestActive) chestMat.emissiveIntensity = (0.8 + 0.7 * u) * pulseFactor;
    if (isDeltoidsActive) deltoidMat.emissiveIntensity = (0.8 + 0.7 * u) * pulseFactor;
    if (isBicepsActive) bicepMat.emissiveIntensity = (0.8 + 0.7 * u) * pulseFactor;
    if (isTricepsActive) tricepMat.emissiveIntensity = (0.8 + 0.7 * u) * pulseFactor;
    if (isBackActive) backMat.emissiveIntensity = (0.8 + 0.7 * u) * pulseFactor;
    if (isQuadsActive) quadsMat.emissiveIntensity = (0.8 + 0.7 * u) * pulseFactor;
  });

  const prop = poseData.start.propType;

  return (
    <group ref={rootGroupRef}>
      {/* Exercise Bench/Box Prop */}
      {prop && (
        <mesh
          position={poseData.start.propPos || [0, 0, 0]}
          scale={poseData.start.propScale || [0.5, 0.5, 0.5]}
          material={propMaterial}
          castShadow
          receiveShadow
        >
          <boxGeometry args={[1, 1, 1]} />
        </mesh>
      )}

      {/* Human Skeleton Root (Hips) */}
      <group ref={hipsRef}>
        {/* Pelvis & Athletic Shorts */}
        <mesh material={clothesShortsMaterial} castShadow>
          <cylinderGeometry args={[0.16, 0.14, 0.18, 20]} />
        </mesh>

        {/* Torso Chain */}
        <group position={[0, 0.14, 0]} ref={torsoRef}>
          {/* Lower Torso / Abs */}
          <mesh position={[0, 0.08, 0]} material={absMat} castShadow>
            <cylinderGeometry args={[0.18, 0.16, 0.16, 20]} />
          </mesh>

          {/* Upper Chest / Pectorals */}
          <mesh position={[0, 0.24, 0.01]} material={chestMat} castShadow>
            <cylinderGeometry args={[0.22, 0.18, 0.18, 20]} />
          </mesh>

          {/* Upper Back / Lats */}
          <mesh position={[0, 0.24, -0.02]} material={backMat}>
            <boxGeometry args={[0.34, 0.17, 0.15]} />
          </mesh>

          {/* Spine Accent Ring */}
          <mesh position={[0, 0.15, 0]} material={jointAccentMaterial}>
            <cylinderGeometry args={[0.17, 0.17, 0.02, 20]} />
          </mesh>

          {/* Neck & Head */}
          <group position={[0, 0.36, 0]} ref={headRef}>
            {/* Neck */}
            <mesh position={[0, 0.04, 0]} material={mannequinBodyMaterial}>
              <cylinderGeometry args={[0.065, 0.075, 0.09, 16]} />
            </mesh>

            {/* Clean Athletic Mannequin Head */}
            <mesh position={[0, 0.15, 0.01]} material={mannequinBodyMaterial} castShadow>
              <sphereGeometry args={[0.115, 24, 24]} />
            </mesh>
            {/* Visor / Face accent band */}
            <mesh position={[0, 0.16, 0.08]} material={jointAccentMaterial}>
              <boxGeometry args={[0.16, 0.04, 0.06]} />
            </mesh>
          </group>

          {/* Left Arm Chain (Viewer's right if facing) */}
          <group position={[-0.23, 0.28, 0]} ref={lShoulderRef}>
            {/* Shoulder Deltoid Sphere */}
            <mesh material={deltoidMat} castShadow>
              <sphereGeometry args={[0.08, 18, 18]} />
            </mesh>
            <mesh material={jointAccentMaterial}>
              <torusGeometry args={[0.082, 0.012, 8, 16]} />
            </mesh>

            {/* Upper Arm (Biceps / Triceps) */}
            <group position={[0, -0.13, 0]}>
              <mesh material={bicepMat} castShadow>
                <capsuleGeometry args={[0.055, 0.14, 8, 16]} />
              </mesh>

              {/* Left Forearm */}
              <group position={[0, -0.13, 0]} ref={lElbowRef}>
                {/* Elbow Joint */}
                <mesh material={jointAccentMaterial}>
                  <sphereGeometry args={[0.042, 12, 12]} />
                </mesh>
                <mesh position={[0, -0.11, 0]} material={mannequinBodyMaterial} castShadow>
                  <capsuleGeometry args={[0.045, 0.14, 8, 16]} />
                </mesh>
                {/* Hand */}
                <mesh position={[0, -0.22, 0]} material={jointAccentMaterial}>
                  <sphereGeometry args={[0.04, 12, 12]} />
                </mesh>
              </group>
            </group>
          </group>

          {/* Right Arm Chain */}
          <group position={[0.23, 0.28, 0]} ref={rShoulderRef}>
            {/* Shoulder Deltoid */}
            <mesh material={deltoidMat} castShadow>
              <sphereGeometry args={[0.08, 18, 18]} />
            </mesh>
            <mesh material={jointAccentMaterial}>
              <torusGeometry args={[0.082, 0.012, 8, 16]} />
            </mesh>

            {/* Upper Arm */}
            <group position={[0, -0.13, 0]}>
              <mesh material={tricepMat} castShadow>
                <capsuleGeometry args={[0.055, 0.14, 8, 16]} />
              </mesh>

              {/* Right Forearm */}
              <group position={[0, -0.13, 0]} ref={rElbowRef}>
                {/* Elbow Joint */}
                <mesh material={jointAccentMaterial}>
                  <sphereGeometry args={[0.042, 12, 12]} />
                </mesh>
                <mesh position={[0, -0.11, 0]} material={mannequinBodyMaterial} castShadow>
                  <capsuleGeometry args={[0.045, 0.14, 8, 16]} />
                </mesh>
                {/* Hand */}
                <mesh position={[0, -0.22, 0]} material={jointAccentMaterial}>
                  <sphereGeometry args={[0.04, 12, 12]} />
                </mesh>
              </group>
            </group>
          </group>
        </group>

        {/* Left Leg Chain */}
        <group position={[-0.1, -0.06, 0]} ref={lHipRef}>
          {/* Thigh */}
          <mesh position={[0, -0.18, 0]} material={quadsMat} castShadow>
            <capsuleGeometry args={[0.075, 0.22, 8, 16]} />
          </mesh>

          {/* Knee Joint */}
          <group position={[0, -0.34, 0]} ref={lKneeRef}>
            <mesh material={jointAccentMaterial}>
              <sphereGeometry args={[0.05, 12, 12]} />
            </mesh>
            <mesh position={[0, -0.17, 0]} material={calvesMat} castShadow>
              <capsuleGeometry args={[0.06, 0.21, 8, 16]} />
            </mesh>
            {/* Shoe */}
            <mesh position={[0, -0.31, 0.04]} material={shoesMaterial} castShadow>
              <boxGeometry args={[0.09, 0.08, 0.2]} />
            </mesh>
          </group>
        </group>

        {/* Right Leg Chain */}
        <group position={[0.1, -0.06, 0]} ref={rHipRef}>
          {/* Thigh */}
          <mesh position={[0, -0.18, 0]} material={hamsMat} castShadow>
            <capsuleGeometry args={[0.075, 0.22, 8, 16]} />
          </mesh>

          {/* Knee Joint */}
          <group position={[0, -0.34, 0]} ref={rKneeRef}>
            <mesh material={jointAccentMaterial}>
              <sphereGeometry args={[0.05, 12, 12]} />
            </mesh>
            <mesh position={[0, -0.17, 0]} material={calvesMat} castShadow>
              <capsuleGeometry args={[0.06, 0.21, 8, 16]} />
            </mesh>
            {/* Shoe */}
            <mesh position={[0, -0.31, 0.04]} material={shoesMaterial} castShadow>
              <boxGeometry args={[0.09, 0.08, 0.2]} />
            </mesh>
          </group>
        </group>
      </group>
    </group>
  );
};
