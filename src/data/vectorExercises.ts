export interface VectorPoseKeyframe {
  // Head & Neck
  head: [number, number]; // [x, y]
  neck: [number, number];

  // Torso
  shoulder: [number, number];
  hip: [number, number];

  // Near Arm (front layer)
  nearElbow: [number, number];
  nearHand: [number, number];

  // Far Arm (back layer)
  farElbow: [number, number];
  farHand: [number, number];

  // Near Leg (front layer)
  nearKnee: [number, number];
  nearFoot: [number, number];

  // Far Leg (back layer)
  farKnee: [number, number];
  farFoot: [number, number];

  // Equipment & Props
  prop?: {
    type: 'bench' | 'chair' | 'table' | 'bar';
    rects: { x: number; y: number; w: number; h: number; rx?: number }[];
  };

  // Resistance Band anchor point
  bandAnchor?: [number, number];
}

export interface VectorExerciseConfig {
  id: string;
  poseType: 'horizontal' | 'standing' | 'seated' | 'inverted' | 'lunge';
  cameraZoom?: number;
  // Two keyframes:
  // start = maximum stretch / eccentric lowest point
  // end = peak contraction / concentric highest point
  start: VectorPoseKeyframe;
  end: VectorPoseKeyframe;
  // Motion path arrow description
  motionArrow: {
    start: [number, number];
    end: [number, number];
    label: string;
  };
}

export const VECTOR_EXERCISES: Record<string, VectorExerciseConfig> = {
  // p1: Banded Decline Push-ups (Feet elevated on bench behind, horizontal pushup)
  p1: {
    id: 'p1',
    poseType: 'horizontal',
    start: { // Chest touching floor, elbows flexed 90°
      head: [225, 148],
      neck: [215, 150],
      shoulder: [200, 152],
      hip: [130, 136],
      nearElbow: [195, 126],
      nearHand: [205, 172],
      farElbow: [210, 128],
      farHand: [218, 172],
      nearKnee: [95, 128],
      nearFoot: [60, 120],
      farKnee: [90, 125],
      farFoot: [55, 118],
      prop: {
        type: 'bench',
        rects: [
          { x: 35, y: 122, w: 38, h: 50, rx: 3 },
          { x: 30, y: 118, w: 48, h: 6, rx: 2 }
        ]
      },
      bandAnchor: [205, 172]
    },
    end: { // Pushed all the way up, straight arms
      head: [225, 108],
      neck: [215, 112],
      shoulder: [200, 116],
      hip: [130, 126],
      nearElbow: [202, 144],
      nearHand: [205, 172],
      farElbow: [212, 146],
      farHand: [218, 172],
      nearKnee: [95, 125],
      nearFoot: [60, 120],
      farKnee: [90, 122],
      farFoot: [55, 118],
      prop: {
        type: 'bench',
        rects: [
          { x: 35, y: 122, w: 38, h: 50, rx: 3 },
          { x: 30, y: 118, w: 48, h: 6, rx: 2 }
        ]
      },
      bandAnchor: [205, 172]
    },
    motionArrow: {
      start: [200, 155],
      end: [200, 115],
      label: 'دفع الصدر للأعلى'
    }
  },

  // p2: Pike Push-ups (Inverted V shoulder push)
  p2: {
    id: 'p2',
    poseType: 'inverted',
    start: { // Head lowered close to floor between hands
      head: [195, 152],
      neck: [188, 144],
      shoulder: [180, 134],
      hip: [135, 88],
      nearElbow: [198, 124],
      nearHand: [185, 172],
      farElbow: [205, 126],
      farHand: [195, 172],
      nearKnee: [120, 128],
      nearFoot: [105, 172],
      farKnee: [115, 128],
      farFoot: [100, 172],
    },
    end: { // Pushed up in steep V
      head: [175, 112],
      neck: [170, 104],
      shoulder: [165, 96],
      hip: [135, 80],
      nearElbow: [175, 134],
      nearHand: [185, 172],
      farElbow: [185, 136],
      farHand: [195, 172],
      nearKnee: [120, 124],
      nearFoot: [105, 172],
      farKnee: [115, 124],
      farFoot: [100, 172],
    },
    motionArrow: {
      start: [190, 145],
      end: [170, 105],
      label: 'دفع الكتف الرأسي'
    }
  },

  // p3: Chair Dips (Between chairs)
  p3: {
    id: 'p3',
    poseType: 'seated',
    start: { // Deep dip, 90° elbows
      head: [150, 88],
      neck: [150, 100],
      shoulder: [150, 110],
      hip: [148, 148],
      nearElbow: [172, 118],
      nearHand: [168, 138],
      farElbow: [132, 118],
      farHand: [136, 138],
      nearKnee: [115, 152],
      nearFoot: [95, 172],
      farKnee: [115, 152],
      farFoot: [95, 172],
      prop: {
        type: 'chair',
        rects: [
          { x: 162, y: 138, w: 22, h: 36, rx: 2 },
          { x: 120, y: 138, w: 22, h: 36, rx: 2 }
        ]
      }
    },
    end: { // Pushed up, triceps lockout
      head: [150, 62],
      neck: [150, 74],
      shoulder: [150, 84],
      hip: [148, 122],
      nearElbow: [164, 112],
      nearHand: [168, 138],
      farElbow: [138, 112],
      farHand: [136, 138],
      nearKnee: [120, 136],
      nearFoot: [95, 172],
      farKnee: [120, 136],
      farFoot: [95, 172],
      prop: {
        type: 'chair',
        rects: [
          { x: 162, y: 138, w: 22, h: 36, rx: 2 },
          { x: 120, y: 138, w: 22, h: 36, rx: 2 }
        ]
      }
    },
    motionArrow: {
      start: [150, 140],
      end: [150, 95],
      label: 'دفع الترايسبس للأعلى'
    }
  },

  // p4: Single-Arm Lateral Raises (Standing side raise)
  p4: {
    id: 'p4',
    poseType: 'standing',
    start: { // Hand down at side
      head: [160, 50],
      neck: [160, 62],
      shoulder: [160, 72],
      hip: [160, 115],
      nearElbow: [175, 102],
      nearHand: [180, 130],
      farElbow: [146, 98],
      farHand: [144, 126],
      nearKnee: [164, 144],
      nearFoot: [166, 174],
      farKnee: [156, 144],
      farFoot: [154, 174],
      bandAnchor: [166, 174]
    },
    end: { // Arm elevated to horizontal 90° T-pose
      head: [160, 50],
      neck: [160, 62],
      shoulder: [160, 72],
      hip: [160, 115],
      nearElbow: [205, 68],
      nearHand: [235, 72],
      farElbow: [146, 98],
      farHand: [144, 126],
      nearKnee: [164, 144],
      nearFoot: [166, 174],
      farKnee: [156, 144],
      farFoot: [154, 174],
      bandAnchor: [166, 174]
    },
    motionArrow: {
      start: [180, 125],
      end: [230, 75],
      label: 'رفع الكتف الجانبي'
    }
  },

  // p5: Overhead Triceps Extension (Standing with band overhead)
  p5: {
    id: 'p5',
    poseType: 'standing',
    start: { // Forearms bent behind head
      head: [160, 68],
      neck: [160, 80],
      shoulder: [160, 90],
      hip: [160, 128],
      nearElbow: [172, 54],
      nearHand: [155, 78],
      farElbow: [148, 54],
      farHand: [150, 78],
      nearKnee: [164, 150],
      nearFoot: [166, 174],
      farKnee: [156, 150],
      farFoot: [154, 174],
      bandAnchor: [160, 174]
    },
    end: { // Arms extended straight up above head
      head: [160, 68],
      neck: [160, 80],
      shoulder: [160, 90],
      hip: [160, 128],
      nearElbow: [168, 48],
      nearHand: [165, 20],
      farElbow: [152, 48],
      farHand: [155, 20],
      nearKnee: [164, 150],
      nearFoot: [166, 174],
      farKnee: [156, 150],
      farFoot: [154, 174],
      bandAnchor: [160, 174]
    },
    motionArrow: {
      start: [155, 75],
      end: [165, 25],
      label: 'تمديد الترايسبس للأعلى'
    }
  },

  // q1: Inverted Rows (Horizontal pull under table)
  q1: {
    id: 'q1',
    poseType: 'horizontal',
    start: { // Arms straight hanging under table
      head: [205, 122],
      neck: [195, 124],
      shoulder: [180, 126],
      hip: [120, 138],
      nearElbow: [180, 100],
      nearHand: [180, 76],
      farElbow: [185, 100],
      farHand: [185, 76],
      nearKnee: [80, 152],
      nearFoot: [50, 172],
      farKnee: [75, 152],
      farFoot: [45, 172],
      prop: {
        type: 'table',
        rects: [
          { x: 160, y: 72, w: 90, h: 6, rx: 2 },
          { x: 245, y: 72, w: 6, h: 100, rx: 2 }
        ]
      }
    },
    end: { // Chest pulled up to table edge
      head: [205, 96],
      neck: [195, 98],
      shoulder: [180, 100],
      hip: [120, 122],
      nearElbow: [160, 114],
      nearHand: [180, 76],
      farElbow: [165, 114],
      farHand: [185, 76],
      nearKnee: [80, 146],
      nearFoot: [50, 172],
      farKnee: [75, 146],
      farFoot: [45, 172],
      prop: {
        type: 'table',
        rects: [
          { x: 160, y: 72, w: 90, h: 6, rx: 2 },
          { x: 245, y: 72, w: 6, h: 100, rx: 2 }
        ]
      }
    },
    motionArrow: {
      start: [180, 128],
      end: [180, 95],
      label: 'سحب الصدر للحافة'
    }
  },

  // q2: Seated Band Rows (Sitting on floor with band around feet)
  q2: {
    id: 'q2',
    poseType: 'seated',
    start: { // Arms stretched forward toward feet
      head: [125, 105],
      neck: [130, 115],
      shoulder: [135, 124],
      hip: [130, 162],
      nearElbow: [175, 128],
      nearHand: [210, 134],
      farElbow: [172, 126],
      farHand: [205, 132],
      nearKnee: [185, 160],
      nearFoot: [225, 162],
      farKnee: [180, 158],
      farFoot: [220, 160],
      bandAnchor: [225, 162]
    },
    end: { // Elbows pulled back tight behind waist
      head: [120, 105],
      neck: [125, 115],
      shoulder: [130, 124],
      hip: [130, 162],
      nearElbow: [100, 132],
      nearHand: [132, 134],
      farElbow: [95, 130],
      farHand: [128, 132],
      nearKnee: [185, 160],
      nearFoot: [225, 162],
      farKnee: [180, 158],
      farFoot: [220, 160],
      bandAnchor: [225, 162]
    },
    motionArrow: {
      start: [210, 134],
      end: [115, 134],
      label: 'سحب المرفقين للخلف'
    }
  },

  // q3: Banded Lat Pulldowns (Kneeling with band from high anchor)
  q3: {
    id: 'q3',
    poseType: 'seated',
    start: { // Arms reaching high in wide V
      head: [160, 95],
      neck: [160, 105],
      shoulder: [160, 115],
      hip: [160, 148],
      nearElbow: [185, 65],
      nearHand: [205, 25],
      farElbow: [135, 65],
      farHand: [115, 25],
      nearKnee: [175, 172],
      nearFoot: [155, 172],
      farKnee: [145, 172],
      farFoot: [165, 172],
      bandAnchor: [160, 10]
    },
    end: { // Elbows pulled down and wide to ribs
      head: [160, 95],
      neck: [160, 105],
      shoulder: [160, 115],
      hip: [160, 148],
      nearElbow: [195, 125],
      nearHand: [180, 95],
      farElbow: [125, 125],
      farHand: [140, 95],
      nearKnee: [175, 172],
      nearFoot: [155, 172],
      farKnee: [145, 172],
      farFoot: [165, 172],
      bandAnchor: [160, 10]
    },
    motionArrow: {
      start: [200, 35],
      end: [190, 110],
      label: 'سحب المرفقين للأسفل'
    }
  },

  // q4: Banded Face Pulls (Standing with band at eye level)
  q4: {
    id: 'q4',
    poseType: 'standing',
    start: { // Arms straight forward toward band
      head: [135, 65],
      neck: [135, 76],
      shoulder: [135, 86],
      hip: [135, 126],
      nearElbow: [175, 86],
      nearHand: [215, 86],
      farElbow: [170, 84],
      farHand: [210, 84],
      nearKnee: [138, 150],
      nearFoot: [140, 174],
      farKnee: [130, 150],
      farFoot: [128, 174],
      bandAnchor: [240, 86]
    },
    end: { // Hands pulled to ears/eyes, elbows high and back
      head: [135, 65],
      neck: [135, 76],
      shoulder: [135, 86],
      hip: [135, 126],
      nearElbow: [110, 72],
      nearHand: [148, 70],
      farElbow: [105, 70],
      farHand: [142, 68],
      nearKnee: [138, 150],
      nearFoot: [140, 174],
      farKnee: [130, 150],
      farFoot: [128, 174],
      bandAnchor: [240, 86]
    },
    motionArrow: {
      start: [215, 86],
      end: [145, 70],
      label: 'سحب نحـو الوجه'
    }
  },

  // q5: Heavy Band Curls (Bicep curls)
  q5: {
    id: 'q5',
    poseType: 'standing',
    start: { // Arms straight down at thighs
      head: [160, 52],
      neck: [160, 64],
      shoulder: [160, 74],
      hip: [160, 118],
      nearElbow: [162, 102],
      nearHand: [164, 134],
      farElbow: [158, 102],
      farHand: [156, 134],
      nearKnee: [164, 146],
      nearFoot: [166, 174],
      farKnee: [156, 146],
      farFoot: [154, 174],
      bandAnchor: [160, 174]
    },
    end: { // Forearms curled fully up to shoulders (135° flex)
      head: [160, 52],
      neck: [160, 64],
      shoulder: [160, 74],
      hip: [160, 118],
      nearElbow: [164, 104],
      nearHand: [170, 76],
      farElbow: [156, 104],
      farHand: [150, 76],
      nearKnee: [164, 146],
      nearFoot: [166, 174],
      farKnee: [156, 146],
      farFoot: [154, 174],
      bandAnchor: [160, 174]
    },
    motionArrow: {
      start: [165, 130],
      end: [170, 80],
      label: 'ثني البايسبس للأعلى'
    }
  },

  // l1: Bulgarian Split Squats (Rear leg on chair)
  l1: {
    id: 'l1',
    poseType: 'lunge',
    start: { // Deep split squat: front knee 90°, hips low
      head: [160, 88],
      neck: [160, 98],
      shoulder: [160, 108],
      hip: [155, 138],
      nearElbow: [158, 126],
      nearHand: [155, 144],
      farElbow: [162, 126],
      farHand: [165, 144],
      nearKnee: [195, 146],
      nearFoot: [195, 174], // Front foot forward
      farKnee: [115, 154],
      farFoot: [80, 134],  // Rear foot on bench
      prop: {
        type: 'bench',
        rects: [
          { x: 55, y: 136, w: 32, h: 38, rx: 2 }
        ]
      }
    },
    end: { // Standing up tall
      head: [160, 54],
      neck: [160, 64],
      shoulder: [160, 74],
      hip: [155, 112],
      nearElbow: [158, 92],
      nearHand: [155, 110],
      farElbow: [162, 92],
      farHand: [165, 110],
      nearKnee: [180, 142],
      nearFoot: [195, 174],
      farKnee: [120, 136],
      farFoot: [80, 134],
      prop: {
        type: 'bench',
        rects: [
          { x: 55, y: 136, w: 32, h: 38, rx: 2 }
        ]
      }
    },
    motionArrow: {
      start: [160, 135],
      end: [160, 85],
      label: 'دفع الفخذ الأمامي للأعلى'
    }
  },

  // l2: Banded RDL (Romanian Deadlift, hip hinge)
  l2: {
    id: 'l2',
    poseType: 'standing',
    start: { // Hips hinged back, torso at 70° forward
      head: [215, 118],
      neck: [205, 120],
      shoulder: [190, 122],
      hip: [130, 124],
      nearElbow: [185, 142],
      nearHand: [180, 164],
      farElbow: [190, 142],
      farHand: [185, 164],
      nearKnee: [142, 148],
      nearFoot: [150, 174],
      farKnee: [136, 148],
      farFoot: [144, 174],
      bandAnchor: [150, 174]
    },
    end: { // Standing tall lockout
      head: [150, 52],
      neck: [150, 64],
      shoulder: [150, 74],
      hip: [150, 118],
      nearElbow: [152, 98],
      nearHand: [150, 122],
      farElbow: [148, 98],
      farHand: [146, 122],
      nearKnee: [152, 146],
      nearFoot: [150, 174],
      farKnee: [146, 146],
      farFoot: [144, 174],
      bandAnchor: [150, 174]
    },
    motionArrow: {
      start: [190, 125],
      end: [150, 80],
      label: 'دفع الورك للأمام'
    }
  },

  // l3: Single-Leg Calf Raises (Standing on ledge)
  l3: {
    id: 'l3',
    poseType: 'standing',
    start: { // Heel dropped below step
      head: [150, 52],
      neck: [150, 64],
      shoulder: [150, 74],
      hip: [150, 118],
      nearElbow: [155, 96],
      nearHand: [160, 116],
      farElbow: [145, 96],
      farHand: [140, 116],
      nearKnee: [150, 146],
      nearFoot: [150, 176], // Dropped below ledge
      farKnee: [138, 142],
      farFoot: [136, 158], // Hanging free
      prop: {
        type: 'bench',
        rects: [
          { x: 135, y: 168, w: 45, h: 8, rx: 2 }
        ]
      }
    },
    end: { // Peak calf plantarflexion
      head: [150, 42],
      neck: [150, 54],
      shoulder: [150, 64],
      hip: [150, 108],
      nearElbow: [155, 86],
      nearHand: [160, 106],
      farElbow: [145, 86],
      farHand: [140, 106],
      nearKnee: [150, 136],
      nearFoot: [150, 166], // Elevated high on toes
      farKnee: [138, 132],
      farFoot: [136, 148],
      prop: {
        type: 'bench',
        rects: [
          { x: 135, y: 168, w: 45, h: 8, rx: 2 }
        ]
      }
    },
    motionArrow: {
      start: [150, 174],
      end: [150, 158],
      label: 'رفع كعب السمانة'
    }
  },

  // l4: Lying Leg Raises (Flat on back)
  l4: {
    id: 'l4',
    poseType: 'horizontal',
    start: { // Legs lowered just above ground
      head: [65, 168],
      neck: [75, 168],
      shoulder: [85, 168],
      hip: [145, 168],
      nearElbow: [115, 168],
      nearHand: [135, 168],
      farElbow: [115, 168],
      farHand: [135, 168],
      nearKnee: [195, 166],
      nearFoot: [245, 164],
      farKnee: [195, 166],
      farFoot: [245, 164],
    },
    end: { // Legs raised straight up to 90°
      head: [65, 168],
      neck: [75, 168],
      shoulder: [85, 168],
      hip: [145, 168],
      nearElbow: [115, 168],
      nearHand: [135, 168],
      farElbow: [115, 168],
      farHand: [135, 168],
      nearKnee: [150, 120],
      nearFoot: [152, 70], // 90 degrees up
      farKnee: [150, 120],
      farFoot: [152, 70],
    },
    motionArrow: {
      start: [240, 160],
      end: [160, 75],
      label: 'رفع عضلات البطن'
    }
  },

  // u1: Archer Push-ups (Wide stance, leaning to one side)
  u1: {
    id: 'u1',
    poseType: 'horizontal',
    start: { // Low over right arm, left arm extended straight
      head: [225, 150],
      neck: [215, 152],
      shoulder: [200, 154],
      hip: [130, 154],
      nearElbow: [210, 134],
      nearHand: [220, 172], // Bent arm
      farElbow: [145, 156],
      farHand: [110, 172], // Straight arrow arm
      nearKnee: [95, 160],
      nearFoot: [60, 172],
      farKnee: [95, 160],
      farFoot: [60, 172],
    },
    end: { // Pushed up in center
      head: [215, 116],
      neck: [205, 118],
      shoulder: [190, 122],
      hip: [130, 138],
      nearElbow: [195, 146],
      nearHand: [200, 172],
      farElbow: [155, 146],
      farHand: [150, 172],
      nearKnee: [95, 152],
      nearFoot: [60, 172],
      farKnee: [95, 152],
      farFoot: [60, 172],
    },
    motionArrow: {
      start: [215, 150],
      end: [195, 120],
      label: 'دفع الصدر الأحادي'
    }
  },

  // u2: Single-Arm Band Row
  u2: {
    id: 'u2',
    poseType: 'standing',
    start: { // Arm straight down, lat stretched
      head: [185, 92],
      neck: [178, 100],
      shoulder: [170, 108],
      hip: [125, 124],
      nearElbow: [175, 136],
      nearHand: [180, 162],
      farElbow: [145, 128],
      farHand: [150, 148],
      nearKnee: [152, 148],
      nearFoot: [165, 174],
      farKnee: [115, 152],
      farFoot: [95, 174],
      bandAnchor: [165, 174]
    },
    end: { // Elbow pulled high behind ribcage
      head: [185, 92],
      neck: [178, 100],
      shoulder: [170, 108],
      hip: [125, 124],
      nearElbow: [135, 95], // High back elbow
      nearHand: [160, 115],
      farElbow: [145, 128],
      farHand: [150, 148],
      nearKnee: [152, 148],
      nearFoot: [165, 174],
      farKnee: [115, 152],
      farFoot: [95, 174],
      bandAnchor: [165, 174]
    },
    motionArrow: {
      start: [180, 160],
      end: [135, 100],
      label: 'سحب الظهر الأحادي'
    }
  },

  // u3: Shoulder Superset
  u3: {
    id: 'u3',
    poseType: 'standing',
    start: {
      head: [160, 52],
      neck: [160, 64],
      shoulder: [160, 74],
      hip: [160, 118],
      nearElbow: [175, 102],
      nearHand: [180, 130],
      farElbow: [145, 102],
      farHand: [140, 130],
      nearKnee: [164, 146],
      nearFoot: [166, 174],
      farKnee: [156, 146],
      farFoot: [154, 174],
      bandAnchor: [160, 174]
    },
    end: {
      head: [160, 52],
      neck: [160, 64],
      shoulder: [160, 74],
      hip: [160, 118],
      nearElbow: [205, 68],
      nearHand: [235, 72],
      farElbow: [115, 68],
      farHand: [85, 72],
      nearKnee: [164, 146],
      nearFoot: [166, 174],
      farKnee: [156, 146],
      farFoot: [154, 174],
      bandAnchor: [160, 174]
    },
    motionArrow: {
      start: [180, 125],
      end: [230, 75],
      label: 'رفرفة الكتف للأعلى'
    }
  },

  // u4: Arm Superset
  u4: {
    id: 'u4',
    poseType: 'standing',
    start: {
      head: [160, 52],
      neck: [160, 64],
      shoulder: [160, 74],
      hip: [160, 118],
      nearElbow: [162, 102],
      nearHand: [164, 134],
      farElbow: [158, 102],
      farHand: [156, 134],
      nearKnee: [164, 146],
      nearFoot: [166, 174],
      farKnee: [156, 146],
      farFoot: [154, 174],
      bandAnchor: [160, 174]
    },
    end: {
      head: [160, 52],
      neck: [160, 64],
      shoulder: [160, 74],
      hip: [160, 118],
      nearElbow: [164, 104],
      nearHand: [170, 76],
      farElbow: [156, 104],
      farHand: [150, 76],
      nearKnee: [164, 146],
      nearFoot: [166, 174],
      farKnee: [156, 146],
      farFoot: [154, 174],
      bandAnchor: [160, 174]
    },
    motionArrow: {
      start: [165, 130],
      end: [170, 80],
      label: 'سوبر ست البايسبس والترايسبس'
    }
  }
};
