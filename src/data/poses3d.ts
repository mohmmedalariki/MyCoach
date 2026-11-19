export interface JointPose {
  hipsPos: [number, number, number];
  hipsRot: [number, number, number];
  torsoRot: [number, number, number];
  headRot: [number, number, number];
  
  // Left arm (Euler angles in radians)
  lShoulderRot: [number, number, number];
  lElbowRot: [number, number, number];
  
  // Right arm
  rShoulderRot: [number, number, number];
  rElbowRot: [number, number, number];
  
  // Left leg
  lHipRot: [number, number, number];
  lKneeRot: [number, number, number];
  
  // Right leg
  rHipRot: [number, number, number];
  rKneeRot: [number, number, number];

  // Optional props in 3D
  propType?: 'chair' | 'table' | 'box' | 'mat';
  propPos?: [number, number, number];
  propScale?: [number, number, number];

  // Band in 3D
  bandAnchor?: [number, number, number];
}

export interface Exercise3DPose {
  cameraDefaultPos: [number, number, number];
  cameraTarget: [number, number, number];
  motionType: 'vertical' | 'lateral_arcs' | 'curl_arcs' | 'horizontal_pull' | 'squat_vertical' | 'hinge';
  start: JointPose; // eccentric stretch / lowered
  end: JointPose;   // peak contraction
}

// Angles in Radians
const deg = (degrees: number) => (degrees * Math.PI) / 180;

export const POSES_3D: Record<string, Exercise3DPose> = {
  // Banded Decline Pushup (Feet elevated on bench behind, horizontal pushup plank)
  pushup_decline: {
    cameraDefaultPos: [1.8, 0.9, 1.8],
    cameraTarget: [0, 0.35, -0.2],
    motionType: 'vertical',
    start: { // Chest touching floor (deep stretch)
      hipsPos: [0, 0.28, -0.15],
      hipsRot: [deg(75), 0, 0], // tilted forward in decline plank
      torsoRot: [0, 0, 0],
      headRot: [deg(-25), 0, 0],
      lShoulderRot: [deg(15), deg(-35), deg(-55)],
      lElbowRot: [deg(95), 0, 0], // elbows deeply bent
      rShoulderRot: [deg(15), deg(35), deg(55)],
      rElbowRot: [deg(95), 0, 0],
      lHipRot: [deg(-15), 0, 0],
      lKneeRot: [deg(5), 0, 0],
      rHipRot: [deg(-15), 0, 0],
      rKneeRot: [deg(5), 0, 0],
      propType: 'box',
      propPos: [0, 0.35, -0.95],
      propScale: [0.65, 0.35, 0.45],
    },
    end: { // Pushed all the way up (straight arms)
      hipsPos: [0, 0.58, -0.15],
      hipsRot: [deg(75), 0, 0],
      torsoRot: [0, 0, 0],
      headRot: [deg(-20), 0, 0],
      lShoulderRot: [deg(15), deg(-10), deg(-20)],
      lElbowRot: [deg(10), 0, 0], // straight arms
      rShoulderRot: [deg(15), deg(10), deg(20)],
      rElbowRot: [deg(10), 0, 0],
      lHipRot: [deg(-15), 0, 0],
      lKneeRot: [deg(5), 0, 0],
      rHipRot: [deg(-15), 0, 0],
      rKneeRot: [deg(5), 0, 0],
      propType: 'box',
      propPos: [0, 0.35, -0.95],
      propScale: [0.65, 0.35, 0.45],
    }
  },

  // Pike Pushup (Inverted V)
  pike_pushup: {
    cameraDefaultPos: [1.9, 1.0, 1.7],
    cameraTarget: [0, 0.55, 0],
    motionType: 'vertical',
    start: { // Head lowered close to floor
      hipsPos: [0, 0.72, -0.1],
      hipsRot: [deg(95), 0, 0],
      torsoRot: [deg(-10), 0, 0],
      headRot: [deg(-35), 0, 0],
      lShoulderRot: [deg(45), deg(-25), deg(-45)],
      lElbowRot: [deg(95), 0, 0],
      rShoulderRot: [deg(45), deg(25), deg(45)],
      rElbowRot: [deg(95), 0, 0],
      lHipRot: [deg(-85), 0, 0],
      lKneeRot: [deg(10), 0, 0],
      rHipRot: [deg(-85), 0, 0],
      rKneeRot: [deg(10), 0, 0],
    },
    end: { // Pushed up into steep V
      hipsPos: [0, 1.05, -0.1],
      hipsRot: [deg(105), 0, 0],
      torsoRot: [deg(-5), 0, 0],
      headRot: [deg(-45), 0, 0],
      lShoulderRot: [deg(75), deg(-10), deg(-20)],
      lElbowRot: [deg(10), 0, 0],
      rShoulderRot: [deg(75), deg(10), deg(20)],
      rElbowRot: [deg(10), 0, 0],
      lHipRot: [deg(-95), 0, 0],
      lKneeRot: [deg(10), 0, 0],
      rHipRot: [deg(-95), 0, 0],
      rKneeRot: [deg(10), 0, 0],
    }
  },

  // Chair Dips
  chair_dips: {
    cameraDefaultPos: [1.8, 1.0, 1.6],
    cameraTarget: [0, 0.5, 0],
    motionType: 'vertical',
    start: { // Deep dip, 90° elbows
      hipsPos: [0, 0.32, 0.15],
      hipsRot: [0, 0, 0],
      torsoRot: [deg(5), 0, 0],
      headRot: [0, 0, 0],
      lShoulderRot: [deg(-30), 0, deg(15)],
      lElbowRot: [deg(95), 0, 0],
      rShoulderRot: [deg(-30), 0, deg(-15)],
      rElbowRot: [deg(95), 0, 0],
      lHipRot: [deg(65), 0, 0],
      lKneeRot: [deg(45), 0, 0],
      rHipRot: [deg(65), 0, 0],
      rKneeRot: [deg(45), 0, 0],
      propType: 'chair',
      propPos: [0, 0.42, -0.28],
      propScale: [0.75, 0.45, 0.35]
    },
    end: { // Pushed up, locked triceps
      hipsPos: [0, 0.65, 0.15],
      hipsRot: [0, 0, 0],
      torsoRot: [0, 0, 0],
      headRot: [0, 0, 0],
      lShoulderRot: [deg(-15), 0, deg(10)],
      lElbowRot: [deg(10), 0, 0],
      rShoulderRot: [deg(-15), 0, deg(-10)],
      rElbowRot: [deg(10), 0, 0],
      lHipRot: [deg(50), 0, 0],
      lKneeRot: [deg(35), 0, 0],
      rHipRot: [deg(50), 0, 0],
      rKneeRot: [deg(35), 0, 0],
      propType: 'chair',
      propPos: [0, 0.42, -0.28],
      propScale: [0.75, 0.45, 0.35]
    }
  },

  // Lateral Raise (Side raises: arms sweep from sides up to 90° T-pose)
  lateral_raise: {
    cameraDefaultPos: [0, 1.1, 2.3],
    cameraTarget: [0, 0.95, 0],
    motionType: 'lateral_arcs',
    start: { // Arms down at sides
      hipsPos: [0, 0.95, 0],
      hipsRot: [0, 0, 0],
      torsoRot: [0, 0, 0],
      headRot: [0, 0, 0],
      lShoulderRot: [0, 0, deg(-12)],
      lElbowRot: [deg(12), 0, 0],
      rShoulderRot: [0, 0, deg(12)],
      rElbowRot: [deg(12), 0, 0],
      lHipRot: [0, 0, 0],
      lKneeRot: [deg(5), 0, 0],
      rHipRot: [0, 0, 0],
      rKneeRot: [deg(5), 0, 0],
    },
    end: { // Arms raised to full horizontal 90°
      hipsPos: [0, 0.95, 0],
      hipsRot: [0, 0, 0],
      torsoRot: [0, 0, 0],
      headRot: [0, 0, 0],
      lShoulderRot: [0, 0, deg(-88)],
      lElbowRot: [deg(15), 0, 0],
      rShoulderRot: [0, 0, deg(88)],
      rElbowRot: [deg(15), 0, 0],
      lHipRot: [0, 0, 0],
      lKneeRot: [deg(5), 0, 0],
      rHipRot: [0, 0, 0],
      rKneeRot: [deg(5), 0, 0],
    }
  },

  // Overhead Triceps Extension (Arms held vertically, forearms bend/extend)
  overhead_triceps: {
    cameraDefaultPos: [1.6, 1.2, 1.8],
    cameraTarget: [0, 1.05, 0],
    motionType: 'vertical',
    start: { // Forearms dropped behind head (deep stretch)
      hipsPos: [0, 0.95, 0],
      hipsRot: [0, 0, 0],
      torsoRot: [0, 0, 0],
      headRot: [0, 0, 0],
      lShoulderRot: [deg(168), 0, deg(-12)],
      lElbowRot: [deg(128), 0, 0],
      rShoulderRot: [deg(168), 0, deg(12)],
      rElbowRot: [deg(128), 0, 0],
      lHipRot: [0, 0, 0],
      lKneeRot: [deg(5), 0, 0],
      rHipRot: [0, 0, 0],
      rKneeRot: [deg(5), 0, 0],
    },
    end: { // Arms extended straight up above head
      hipsPos: [0, 0.95, 0],
      hipsRot: [0, 0, 0],
      torsoRot: [0, 0, 0],
      headRot: [0, 0, 0],
      lShoulderRot: [deg(175), 0, deg(-8)],
      lElbowRot: [deg(10), 0, 0],
      rShoulderRot: [deg(175), 0, deg(8)],
      rElbowRot: [deg(10), 0, 0],
      lHipRot: [0, 0, 0],
      lKneeRot: [deg(5), 0, 0],
      rHipRot: [0, 0, 0],
      rKneeRot: [deg(5), 0, 0],
    }
  },

  // Bicep Curl (Elbows fixed, forearms curl up to shoulders)
  bicep_curl: {
    cameraDefaultPos: [1.4, 1.1, 1.8],
    cameraTarget: [0, 0.95, 0],
    motionType: 'curl_arcs',
    start: { // Arms straight down (stretched)
      hipsPos: [0, 0.95, 0],
      hipsRot: [0, 0, 0],
      torsoRot: [0, 0, 0],
      headRot: [0, 0, 0],
      lShoulderRot: [deg(5), 0, deg(-8)],
      lElbowRot: [deg(10), 0, 0],
      rShoulderRot: [deg(5), 0, deg(8)],
      rElbowRot: [deg(10), 0, 0],
      lHipRot: [0, 0, 0],
      lKneeRot: [deg(5), 0, 0],
      rHipRot: [0, 0, 0],
      rKneeRot: [deg(5), 0, 0],
    },
    end: { // Forearms curled fully up to 135°
      hipsPos: [0, 0.95, 0],
      hipsRot: [0, 0, 0],
      torsoRot: [0, 0, 0],
      headRot: [0, 0, 0],
      lShoulderRot: [deg(10), 0, deg(-8)],
      lElbowRot: [deg(135), 0, 0],
      rShoulderRot: [deg(10), 0, deg(8)],
      rElbowRot: [deg(135), 0, 0],
      lHipRot: [0, 0, 0],
      lKneeRot: [deg(5), 0, 0],
      rHipRot: [0, 0, 0],
      rKneeRot: [deg(5), 0, 0],
    }
  },

  // Bulgarian Split Squat
  bulgarian_squat: {
    cameraDefaultPos: [2.0, 1.1, 1.6],
    cameraTarget: [0, 0.65, 0],
    motionType: 'squat_vertical',
    start: { // Deep split lunge: front knee 90°, hips low
      hipsPos: [0, 0.42, 0.05],
      hipsRot: [deg(5), 0, 0],
      torsoRot: [deg(8), 0, 0],
      headRot: [0, 0, 0],
      lShoulderRot: [0, 0, deg(-8)],
      lElbowRot: [deg(15), 0, 0],
      rShoulderRot: [0, 0, deg(8)],
      rElbowRot: [deg(15), 0, 0],
      lHipRot: [deg(85), 0, 0],  // Front leg deep bend
      lKneeRot: [deg(88), 0, 0],
      rHipRot: [deg(-38), 0, 0], // Rear leg back on box
      rKneeRot: [deg(85), 0, 0],
      propType: 'chair',
      propPos: [0, 0.45, -0.65],
      propScale: [0.55, 0.45, 0.4]
    },
    end: { // Standing up tall
      hipsPos: [0, 0.85, 0],
      hipsRot: [0, 0, 0],
      torsoRot: [0, 0, 0],
      headRot: [0, 0, 0],
      lShoulderRot: [0, 0, deg(-8)],
      lElbowRot: [deg(15), 0, 0],
      rShoulderRot: [0, 0, deg(8)],
      rElbowRot: [deg(15), 0, 0],
      lHipRot: [deg(15), 0, 0],
      lKneeRot: [deg(10), 0, 0],
      rHipRot: [deg(-32), 0, 0],
      rKneeRot: [deg(55), 0, 0],
      propType: 'chair',
      propPos: [0, 0.45, -0.65],
      propScale: [0.55, 0.45, 0.4]
    }
  },

  // Romanian Deadlift (Hinge: hips push back, torso tilts forward to 75°)
  romanian_deadlift: {
    cameraDefaultPos: [2.1, 1.1, 1.5],
    cameraTarget: [0, 0.65, 0],
    motionType: 'hinge',
    start: { // Deep hip hinge back, hamstrings stretched
      hipsPos: [0, 0.68, -0.32],
      hipsRot: [deg(75), 0, 0],
      torsoRot: [0, 0, 0],
      headRot: [deg(-30), 0, 0],
      lShoulderRot: [deg(35), 0, 0],
      lElbowRot: [deg(10), 0, 0],
      rShoulderRot: [deg(35), 0, 0],
      rElbowRot: [deg(10), 0, 0],
      lHipRot: [deg(-70), 0, 0],
      lKneeRot: [deg(22), 0, 0],
      rHipRot: [deg(-70), 0, 0],
      rKneeRot: [deg(22), 0, 0],
    },
    end: { // Standing tall lockout
      hipsPos: [0, 0.95, 0],
      hipsRot: [0, 0, 0],
      torsoRot: [0, 0, 0],
      headRot: [0, 0, 0],
      lShoulderRot: [0, 0, deg(-5)],
      lElbowRot: [deg(10), 0, 0],
      rShoulderRot: [0, 0, deg(5)],
      rElbowRot: [deg(10), 0, 0],
      lHipRot: [0, 0, 0],
      lKneeRot: [deg(5), 0, 0],
      rHipRot: [0, 0, 0],
      rKneeRot: [deg(5), 0, 0],
    }
  },

  // Seated Row
  seated_row: {
    cameraDefaultPos: [1.8, 1.0, 1.6],
    cameraTarget: [0, 0.45, 0],
    motionType: 'horizontal_pull',
    start: { // Arms stretched forward
      hipsPos: [0, 0.15, 0],
      hipsRot: [deg(85), 0, 0],
      torsoRot: [deg(15), 0, 0],
      headRot: [0, 0, 0],
      lShoulderRot: [deg(80), 0, 0],
      lElbowRot: [deg(10), 0, 0],
      rShoulderRot: [deg(80), 0, 0],
      rElbowRot: [deg(10), 0, 0],
      lHipRot: [deg(-85), 0, 0],
      lKneeRot: [deg(15), 0, 0],
      rHipRot: [deg(-85), 0, 0],
      rKneeRot: [deg(15), 0, 0],
    },
    end: { // Elbows pulled tight back behind torso
      hipsPos: [0, 0.15, 0],
      hipsRot: [deg(85), 0, 0],
      torsoRot: [deg(-5), 0, 0],
      headRot: [0, 0, 0],
      lShoulderRot: [deg(-25), 0, deg(-12)],
      lElbowRot: [deg(100), 0, 0],
      rShoulderRot: [deg(-25), 0, deg(12)],
      rElbowRot: [deg(100), 0, 0],
      lHipRot: [deg(-85), 0, 0],
      lKneeRot: [deg(15), 0, 0],
      rHipRot: [deg(-85), 0, 0],
      rKneeRot: [deg(15), 0, 0],
    }
  },

  // Banded Lat Pulldown
  lat_pulldown: {
    cameraDefaultPos: [1.6, 1.1, 1.8],
    cameraTarget: [0, 0.75, 0],
    motionType: 'vertical',
    start: { // Arms high in wide V
      hipsPos: [0, 0.45, 0],
      hipsRot: [deg(40), 0, 0],
      torsoRot: [deg(-10), 0, 0],
      headRot: [deg(20), 0, 0],
      lShoulderRot: [deg(160), 0, deg(-32)],
      lElbowRot: [deg(15), 0, 0],
      rShoulderRot: [deg(160), 0, deg(32)],
      rElbowRot: [deg(15), 0, 0],
      lHipRot: [deg(-40), 0, 0],
      lKneeRot: [deg(90), 0, 0],
      rHipRot: [deg(-40), 0, 0],
      rKneeRot: [deg(90), 0, 0],
    },
    end: { // Elbows pulled down into ribs
      hipsPos: [0, 0.45, 0],
      hipsRot: [deg(40), 0, 0],
      torsoRot: [deg(-15), 0, 0],
      headRot: [deg(15), 0, 0],
      lShoulderRot: [deg(35), deg(-30), deg(-75)],
      lElbowRot: [deg(110), 0, 0],
      rShoulderRot: [deg(35), deg(30), deg(75)],
      rElbowRot: [deg(110), 0, 0],
      lHipRot: [deg(-40), 0, 0],
      lKneeRot: [deg(90), 0, 0],
      rHipRot: [deg(-40), 0, 0],
      rKneeRot: [deg(90), 0, 0],
    }
  },

  // Fallback default
  default: {
    cameraDefaultPos: [0, 1.1, 2.3],
    cameraTarget: [0, 0.95, 0],
    motionType: 'vertical',
    start: {
      hipsPos: [0, 0.95, 0],
      hipsRot: [0, 0, 0],
      torsoRot: [0, 0, 0],
      headRot: [0, 0, 0],
      lShoulderRot: [0, 0, deg(-12)],
      lElbowRot: [deg(15), 0, 0],
      rShoulderRot: [0, 0, deg(12)],
      rElbowRot: [deg(15), 0, 0],
      lHipRot: [0, 0, 0],
      lKneeRot: [deg(5), 0, 0],
      rHipRot: [0, 0, 0],
      rKneeRot: [deg(5), 0, 0],
    },
    end: {
      hipsPos: [0, 0.95, 0],
      hipsRot: [0, 0, 0],
      torsoRot: [0, 0, 0],
      headRot: [0, 0, 0],
      lShoulderRot: [deg(25), 0, deg(-20)],
      lElbowRot: [deg(45), 0, 0],
      rShoulderRot: [deg(25), 0, deg(20)],
      rElbowRot: [deg(45), 0, 0],
      lHipRot: [0, 0, 0],
      lKneeRot: [deg(5), 0, 0],
      rHipRot: [0, 0, 0],
      rKneeRot: [deg(5), 0, 0],
    }
  }
};
