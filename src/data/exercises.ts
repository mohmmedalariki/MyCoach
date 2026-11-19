export interface Exercise {
  id: string;
  nameAr: string;
  nameEn: string;
  targetGroup: 'chest' | 'back' | 'shoulders' | 'arms' | 'legs' | 'abs';
  primaryMuscles: string[];
  secondaryMuscles: string[];
  stabilizerMuscles: string[];
  sets: number;
  reps: string;
  restSeconds: number;
  note?: string;
  cue: string;
  setupInstructions: string[];
  biomechanicsNote: string;
  poseId: string;
  bandAnchor?: 'floor' | 'high' | 'face' | 'none';
}

export const EXERCISES: Record<string, Exercise> = {
  p1: {
    id: 'p1',
    nameAr: 'ضغط مائل لأعلى بالباند',
    nameEn: 'Banded Decline Push-ups',
    targetGroup: 'chest',
    primaryMuscles: ['chest', 'front-deltoids'],
    secondaryMuscles: ['triceps'],
    stabilizerMuscles: ['abs'],
    sets: 4,
    reps: '8-12',
    restSeconds: 120,
    cue: 'ارفع قدميك على كرسي ولف الباند خلف ظهرك وتحت كفيك',
    biomechanicsNote: 'ميل الجسم للأسفل (القدمان مرفوعتان) يحمّل الجزء العلوي من الصدر وزوايا الدفع العلوية.',
    setupInstructions: [
      'القدمان على كرسي والباند خلف الظهر وتحت الكفين، الجسم في خط مستقيم.',
      'انزل 3 ثوانٍ حتى يقترب الصدر من الأرض والمرفقان بزاوية ~45° عن الجذع.',
      'اثبت ثانية واحدة في أقصى تمدد لمنع الارتداد، ثم ادفع بقوة للأعلى.',
      'تجنّب تقوّس أسفل الظهر أو فتح المرفقين 90° للخارج.'
    ],
    poseId: 'pushup_decline',
    bandAnchor: 'floor'
  },
  p2: {
    id: 'p2',
    nameAr: 'ضغط بايك للكتف',
    nameEn: 'Pike Push-ups',
    targetGroup: 'shoulders',
    primaryMuscles: ['front-deltoids'],
    secondaryMuscles: ['triceps', 'trapezius'],
    stabilizerMuscles: ['abs'],
    sets: 4,
    reps: '8-12',
    restSeconds: 120,
    cue: 'ارفع الورك على شكل V لتركيز الحمل مباشرة على الأكتاف',
    biomechanicsNote: 'الورك العالي بزاوية V يحوّل متجه الجاذبية والدفع بالكامل نحو الرأسين الأمامي والجانبي للكتف.',
    setupInstructions: [
      'ارفع الورك لأعلى شكل V واجعل رأسك بين الذراعين.',
      'انزل برأسك للأمام والأسفل قليلاً باتجاه مثلث بين يديك في 3 ثوانٍ.',
      'اثبت ثانية ثم ادفع بقوة للعودة لوضع الـ V.',
      'تجنّب دفع الورك للخلف حتى لا يتحول التمرين لضغط صدري عادي.'
    ],
    poseId: 'pike_pushup',
    bandAnchor: 'none'
  },
  p3: {
    id: 'p3',
    nameAr: 'غطس بين كرسيين',
    nameEn: 'Chair Dips',
    targetGroup: 'arms',
    primaryMuscles: ['triceps', 'chest'],
    secondaryMuscles: ['front-deltoids'],
    stabilizerMuscles: ['abs'],
    sets: 3,
    reps: '10-15',
    restSeconds: 90,
    cue: 'انزل حتى يتمدد الصدر السفلي والترايسبس ثم ادفع بقوة',
    biomechanicsNote: 'الميل للأمام قليلاً يزيد تفعيل الصدر السفلي، بينما استقامة الجذع تضع الحمل الأكبر على الترايسبس.',
    setupInstructions: [
      'ادعم يديك على كرسيين متوازيين وثابتين، والقدمان أمامك على الأرض.',
      'انزل ببطء 3 ثوانٍ حتى زاوية 90 درجة للمرفقين مع عصر وتمدد الترايسبس.',
      'اثبت ثانية في القاع ثم ادفع للأعلى واقفل المرفقين بنعومة.',
      'تجنّب الهبوط العميق المبالغ فيه لحماية كبسولة مفصل الكتف.'
    ],
    poseId: 'chair_dips',
    bandAnchor: 'none'
  },
  p4: {
    id: 'p4',
    nameAr: 'رفرفة جانبية بالباند',
    nameEn: 'Single-Arm Lateral Raises',
    targetGroup: 'shoulders',
    primaryMuscles: ['front-deltoids'],
    secondaryMuscles: ['trapezius'],
    stabilizerMuscles: ['abs'],
    sets: 4,
    reps: '12-15',
    restSeconds: 60,
    note: 'لكل يد',
    cue: 'قف على طرف الباند وارفع حتى مستوى الكتف فقط مع ثبات الجذع',
    biomechanicsNote: 'الرأس الجانبي للكتف هو المسؤول الرئيسي عن عرض الهيكل وتأثير الـ V-Taper.',
    setupInstructions: [
      'قف بقدم واحدة على طرف الباند وأمسك المقبض باليد المقابلة.',
      'المرفق مثني بدرجة بسيطة (10-15°)، ارفع الذراع للجانب حتى موازاة الكتف.',
      'انزل ببطء وتحكم سلبي كامل لمدة 3 ثوانٍ لمقاومة شد الباند.',
      'تجنّب تأرجح الظهر أو رفع الكتف نحو الأذن بالترابيس.'
    ],
    poseId: 'lateral_raise',
    bandAnchor: 'floor'
  },
  p5: {
    id: 'p5',
    nameAr: 'تمديد ترايسبس فوق الرأس',
    nameEn: 'Overhead Triceps Extension',
    targetGroup: 'arms',
    primaryMuscles: ['triceps'],
    secondaryMuscles: ['front-deltoids'],
    stabilizerMuscles: ['abs'],
    sets: 3,
    reps: '10-15',
    restSeconds: 60,
    cue: 'ثبّت المرفقين بجانب الرأس لاستهداف الرأس الطويل المتمدد',
    biomechanicsNote: 'وضع الذراع المرفوع فوق الرأس يضع الرأس الطويل لعضلة الترايسبس في أقصى استطالة تشريحية.',
    setupInstructions: [
      'ثبّت الباند تحت القدمين أو خلف الظهر واسحبه لأعلى خلف رأسك.',
      'المرفقان موجهان للأمام وللأعلى بجوار الأذنين.',
      'مدّ الذراعين للأعلى حتى استقامة الترايسبس ثم انزل ببطء 3 ثوانٍ خلف الرأس.',
      'تجنّب فتح المرفقين للخارج أو تقوس أسفل الظهر.'
    ],
    poseId: 'overhead_triceps',
    bandAnchor: 'floor'
  },
  q1: {
    id: 'q1',
    nameAr: 'سحب أفقي تحت طاولة',
    nameEn: 'Inverted Rows',
    targetGroup: 'back',
    primaryMuscles: ['upper-back', 'trapezius'],
    secondaryMuscles: ['biceps', 'back-deltoids', 'forearm'],
    stabilizerMuscles: ['abs', 'lower-back'],
    sets: 4,
    reps: '8-12',
    restSeconds: 120,
    cue: 'اسحب صدرك نحو حافة الطاولة مع عصر لوحي الكتف معاً',
    biomechanicsNote: 'سحب أفقي أساسي لبناء سُمك الظهر والألياف المتوسطة للترابيس والمعينات.',
    setupInstructions: [
      'استلقِ تحت طاولة قوية ومستقرة، أمسك الحافة بقبضة أوسع قليلاً من الكتفين.',
      'الجسم مستقيم كلوح خشبي مدعوم على الكعبين.',
      'اسحب صدرك نحو الطاولة مع ضم لوحي الكتف واثبت ثانية في القمة.',
      'انزل ببطء وتحكم 3 ثوانٍ حتى تستطيل ألياف الظهر تماماً.'
    ],
    poseId: 'inverted_row',
    bandAnchor: 'none'
  },
  q2: {
    id: 'q2',
    nameAr: 'تجديف جلوساً بالباند',
    nameEn: 'Seated Band Rows',
    targetGroup: 'back',
    primaryMuscles: ['upper-back', 'trapezius'],
    secondaryMuscles: ['biceps', 'back-deltoids', 'forearm'],
    stabilizerMuscles: ['lower-back'],
    sets: 4,
    reps: '10-15',
    restSeconds: 90,
    cue: 'ظهر مستقيم بزاوية قائمة، اسحب نحو أسفل البطن واعصر ثانيتين',
    biomechanicsNote: 'التوقف في أقصى نقطة انقباض يضاعف من تأثير الباند المطاطي في أعلى نقطة شد.',
    setupInstructions: [
      'اجلس على الأرض بساقين شبه ممدودتين، ولف الباند حول باطن القدمين.',
      'الظهر مستقيم والصدر مرفوع للأمام.',
      'اسحب المرفقين للخلف بمحاذاة الخصر حتى أسفل البطن.',
      'اعصر لوحي الكتف بقوة ثانيتين، ثم ارجع ببطء 3 ثوانٍ.'
    ],
    poseId: 'seated_row',
    bandAnchor: 'floor'
  },
  q3: {
    id: 'q3',
    nameAr: 'سحب علوي بالباند (لات بولداون)',
    nameEn: 'Banded Lat Pulldowns',
    targetGroup: 'back',
    primaryMuscles: ['upper-back'],
    secondaryMuscles: ['biceps', 'back-deltoids', 'forearm'],
    stabilizerMuscles: ['abs'],
    sets: 3,
    reps: '12-15',
    restSeconds: 90,
    cue: 'ثبّت الباند عالياً واسحب المرفقين لأسفل نحو أعلى الصدر',
    biomechanicsNote: 'السحب الرأسي يستهدف العضلة العريضة (Latissimus Dorsi) التي تمنح الظهر عرضه المميز.',
    setupInstructions: [
      'ثبّت الباند في نقطة مرتفعة (أعلى الباب مثلاً)، واجلس أو اركع تحته.',
      'أمسك طرفي الباند بذراعين ممدودتين للأعلى.',
      'اسحب نحو الأسفل بتوجيه المرفقين لجانبي الجذع حتى يصل الباند لمستوى الترقوة.',
      'اثبت ثانية في القاع ثم عد للأعلى ببطء 3 ثوانٍ مع تمدد المجنص.'
    ],
    poseId: 'lat_pulldown',
    bandAnchor: 'high'
  },
  q4: {
    id: 'q4',
    nameAr: 'سحب للوجه بالباند (فيس بول)',
    nameEn: 'Banded Face Pulls',
    targetGroup: 'shoulders',
    primaryMuscles: ['back-deltoids'],
    secondaryMuscles: ['trapezius', 'upper-back'],
    stabilizerMuscles: ['abs'],
    sets: 3,
    reps: '15',
    restSeconds: 60,
    cue: 'اسحب نحو العينين مع تدوير اليدين للخارج ورفع المرفقين عالياً',
    biomechanicsNote: 'تمرين ذهبي لصحة الكتف واستقامته وتطوير الرأس الخلفي المهمل في أغلب التمارين.',
    setupInstructions: [
      'ثبّت الباند بمستوى العين أو الجبهة.',
      'أمسك الباند بقبضة إبهامية متقابلة.',
      'اسحب نحو جانبي الوجه مع فتح المرفقين للخارج وتدوير القبضتين للخلف.',
      'اثبت ثانية مع عصر أعلى الظهر وخلفية الكتف، ثم تراجع ببطء.'
    ],
    poseId: 'face_pull',
    bandAnchor: 'face'
  },
  q5: {
    id: 'q5',
    nameAr: 'بايسبس كيرل ثقيل بالباند',
    nameEn: 'Heavy Band Curls',
    targetGroup: 'arms',
    primaryMuscles: ['biceps'],
    secondaryMuscles: ['forearm'],
    stabilizerMuscles: ['abs'],
    sets: 4,
    reps: '8-12',
    restSeconds: 90,
    cue: 'ثبّت المرفقين بجانب الخصر تماماً وانزل ببطء شديد 3 ثوانٍ',
    biomechanicsNote: 'عزل حركة ثني المرفق مع ثبات مفصل الكتف يركز كامل الحمل الميكانيكي على رأسَي البايسبس.',
    setupInstructions: [
      'قف بقدميك على منتصف الباند وأمسك المقبضين وذراعاك ممدودتان.',
      'ثبّت المرفقين بمحاذاة جانبي الخصر ولا تسمح لهما بالتقدم للأمام.',
      'اثنِ الذراعين للأعلى واضغط بقوة في القمة ثانية كاملة.',
      'قاوم شد الباند أثناء الهبوط السلبي 3 ثوانٍ حتى الاستقامة الكاملة.'
    ],
    poseId: 'bicep_curl',
    bandAnchor: 'floor'
  },
  l1: {
    id: 'l1',
    nameAr: 'سكوات بلغاري منفرد',
    nameEn: 'Bulgarian Split Squats',
    targetGroup: 'legs',
    primaryMuscles: ['quadriceps', 'gluteal'],
    secondaryMuscles: ['hamstring', 'abductors'],
    stabilizerMuscles: ['abs', 'calves'],
    sets: 4,
    reps: '8-12',
    restSeconds: 120,
    note: 'لكل رجل',
    cue: 'قدم خلفية على كرسي وانزل بالركبة الخلفية ببطء نحو الأرض',
    biomechanicsNote: 'تحميل رجل واحدة يضاعف الحمل الفعلي على الفخذ الأمامي والأرداف مع تحسين توازن الحوض.',
    setupInstructions: [
      'ضع مشط قدمك الخلفية على كرسي وثبّت القدم الأمامية على مسافة مناسبة للأمام.',
      'انزل عمودياً ببطء 3 ثوانٍ حتى تقترب الركبة الخلفية من الأرض.',
      'ادفع بكعب القدم الأمامية بقوة للصعود للأعلى.',
      'حافظ على استقامة الجذع وتجنب ميل الركبة الأمامية للداخل.'
    ],
    poseId: 'bulgarian_squat',
    bandAnchor: 'floor'
  },
  l2: {
    id: 'l2',
    nameAr: 'رفعة ميتة رومانية بالباند (RDL)',
    nameEn: 'Banded RDL',
    targetGroup: 'legs',
    primaryMuscles: ['hamstring', 'gluteal'],
    secondaryMuscles: ['lower-back'],
    stabilizerMuscles: ['forearm', 'abs'],
    sets: 4,
    reps: '10-12',
    restSeconds: 90,
    cue: 'ادفع الورك للخلف مع استقامة الظهر حتى يتمدد الفخذ الخلفي',
    biomechanicsNote: 'حركة مفصل الورك (Hip Hinge) تعطي أقصى استطالة وتحفيز لأوتار الركبة والعضلات الإليوية.',
    setupInstructions: [
      'قف بقدميك على الباند المزدوج، وامسك الطرفين بيديك.',
      'الظهر مستقيم، الكتفان مشدودان للخلف، والركبتان فيهما انثناء خفيف مرن.',
      'ادفع الورك للخلف وكأنك تغلق باباً خلفك، حتى تشعر بشد قوي في الفخذ الخلفي.',
      'ادفع الورك للأمام بقوة للصعود مع عصر الأرداف في القمة.'
    ],
    poseId: 'romanian_deadlift',
    bandAnchor: 'floor'
  },
  l3: {
    id: 'l3',
    nameAr: 'رفع بطات برجل واحدة',
    nameEn: 'Single-Leg Calf Raises',
    targetGroup: 'legs',
    primaryMuscles: ['calves'],
    secondaryMuscles: [],
    stabilizerMuscles: ['abs', 'quadriceps'],
    sets: 3,
    reps: '15',
    restSeconds: 60,
    note: 'لكل رجل',
    cue: 'انزل بالكعب بالكامل تحت مستوى الدرجة للتمدد ثم ارفع لأعلى نقطة',
    biomechanicsNote: 'التمدد الكامل في القاع مع الثبات ثانيتين يلغي الارتداد المرن لوتر أخيليس ويجبر العضلة على العمل.',
    setupInstructions: [
      'قف بمقدمة قدم واحدة على حافة درجة أو كتاب سميك، مع الإمساك بجدار للتوازن.',
      'انزل بالكعب إلى أقصى نقطة ممكنة تحت مستوى الحافة واثبت ثانية.',
      'ارفع جسمك بقوة على أصابع القدم لأعلى نقطة واثبت ثانية في قمة الانقباض.',
      'انزل ببطء 3 ثوانٍ لتحقيق الاستفادة الكاملة.'
    ],
    poseId: 'calf_raise',
    bandAnchor: 'none'
  },
  l4: {
    id: 'l4',
    nameAr: 'رفع الأرجل مستلقياً',
    nameEn: 'Lying Leg Raises',
    targetGroup: 'abs',
    primaryMuscles: ['abs'],
    secondaryMuscles: ['obliques', 'quadriceps'],
    stabilizerMuscles: ['lower-back'],
    sets: 3,
    reps: '12-15',
    restSeconds: 60,
    cue: 'ارفع الرجلين حتى زاوية 90° وانزل ببطء دون أن تلمس كعوبك الأرض',
    biomechanicsNote: 'تثبيت أسفل الظهر ملاصقاً للأرض يشغل الألياف السفلية للعضلة المستقيمة للبطن بكفاءة عالية.',
    setupInstructions: [
      'استلقِ على ظهرك ويداك بجانب وركك، مع ضغط أسفل الظهر تماماً على الأرض.',
      'ارفع رجليك باستقامة معاً حتى تشكلا زاوية 90 درجة مع الجذع.',
      'انزل برفق وتحكم في 3 ثوانٍ وتوقف قبل ملامسة الأرض ببضع سنتيمترات.',
      'تجنّب تقوّس أسفل الظهر عند النزول لحماية الفقرات.'
    ],
    poseId: 'leg_raise',
    bandAnchor: 'none'
  },
  u1: {
    id: 'u1',
    nameAr: 'ضغط آرتشر الجانبي',
    nameEn: 'Archer Push-ups',
    targetGroup: 'chest',
    primaryMuscles: ['chest'],
    secondaryMuscles: ['front-deltoids', 'triceps'],
    stabilizerMuscles: ['abs', 'obliques'],
    sets: 3,
    reps: '8-10',
    restSeconds: 120,
    note: 'لكل جهة',
    cue: 'باعد يديك، انزل بكامل وزنك نحو يد واحدة وأبقِ الأخرى ممدودة كالرمح',
    biomechanicsNote: 'تحميل جانب واحد برفع الرافعة الميكانيكية يقارب حمل وزن الجسم الكامل على جهة واحدة.',
    setupInstructions: [
      'اتخذ وضعية الضغط مع مباعدة اليدين بمسافة عريضة جداً.',
      'انزل بجذعك نحو الذراع اليمنى مع ثني مرفقها، بينما تبقى الذراع اليسرى مستقيمة تماماً.',
      'ادفع بقوة من الذراع اليمنى للعودة للمنتصف، ثم كرر للجهة المقابلة.',
      'حافظ على استقامة الحوض دون التمايل للجانبين.'
    ],
    poseId: 'archer_pushup',
    bandAnchor: 'none'
  },
  u2: {
    id: 'u2',
    nameAr: 'تجديف بذراع واحدة بالباند',
    nameEn: 'Single-Arm Band Row',
    targetGroup: 'back',
    primaryMuscles: ['upper-back', 'trapezius'],
    secondaryMuscles: ['back-deltoids', 'biceps', 'forearm'],
    stabilizerMuscles: ['lower-back', 'abs'],
    sets: 3,
    reps: '10-12',
    restSeconds: 90,
    note: 'لكل جهة',
    cue: 'اسحب المرفق عالياً خلف الجذع بأقصى مدى حركي مع ثبات الجذع',
    biomechanicsNote: 'العمل المنفرد لكل ذراع يسمح بمدى حركي أطول وعصر أعمق للوح الكتف مقارنة بالتجديف الثنائي.',
    setupInstructions: [
      'قف بقدم واحدة متقدمة على الباند، وانحنِ بجذع مستقيم بزاوية 45 درجة.',
      'أمسك الباند بيد واحدة والذراع ممدودة للأسفل.',
      'اسحب المرفق للأعلى والخلف بمحاذاة القفص الصدري حتى يتجاوز الجذع.',
      'اثبت ثانية في القمة وانزل ببطء 3 ثوانٍ دون لف الجذع.'
    ],
    poseId: 'single_arm_row',
    bandAnchor: 'floor'
  },
  u3: {
    id: 'u3',
    nameAr: 'سوبر ست أكتاف (رفرفة + ضغط)',
    nameEn: 'Shoulder Superset',
    targetGroup: 'shoulders',
    primaryMuscles: ['front-deltoids'],
    secondaryMuscles: ['triceps', 'trapezius'],
    stabilizerMuscles: ['abs'],
    sets: 3,
    reps: '12+10',
    restSeconds: 90,
    note: 'جولات متتالية بلا راحة',
    cue: 'رفرفة جانبية ×12 ثم مباشرة ضغط كتف فوق الرأس ×10 بلا أي توقف',
    biomechanicsNote: 'إجهاد مسبق للرأس الجانبي يليه تمرين مركب لدفع الأكتاف لأقصى ضخ دموي واستجابة تضخيمية.',
    setupInstructions: [
      'أولاً: أداء 12 تكرار رفرفة جانبية بالباند حتى الإجهاد.',
      'مباشرة ودون راحة: ضع الباند تحت القدمين وارفعه للأكتاف.',
      'ادفع 10 تكرارات ضغط كتف رأسي فوق الرأس بقوة.',
      'ارتاح 90 ثانية بعد إنهاء الحركتين معاً.'
    ],
    poseId: 'shoulder_superset',
    bandAnchor: 'floor'
  },
  u4: {
    id: 'u4',
    nameAr: 'سوبر ست ذراعين (بايسبس + ترايسبس)',
    nameEn: 'Arm Superset',
    targetGroup: 'arms',
    primaryMuscles: ['biceps', 'triceps'],
    secondaryMuscles: ['forearm'],
    stabilizerMuscles: ['abs'],
    sets: 3,
    reps: '12+12',
    restSeconds: 90,
    note: 'جولات متتالية بلا راحة',
    cue: 'مطرقة هامر بالباند ×12 ثم فوراً ترايسبس بوش داون ×12',
    biomechanicsNote: 'تدريب العضلات المتضادة (Antagonistic pairing) يحسن تدفق الدم واستشفاء المفصل ويوفر وقتاً كبيراً.',
    setupInstructions: [
      'أولاً: أداء 12 تكرار هامر كيرل بالباند (قبضة محايدة تستهدف العضلة العضدية والساعد).',
      'مباشرة: ثبّت الباند عالياً وادفع 12 تكرار ترايسبس بوش داون للأسفل.',
      'تحكم كامل في مرحلة النزول والرجوع في كل حركة.',
      'ارتاح 90 ثانية بعد إتمام الذراعين معاً.'
    ],
    poseId: 'arm_superset',
    bandAnchor: 'floor'
  }
};

export interface DayPlan {
  dayIndex: number;
  nameAr: string;
  isRest: boolean;
  exerciseIds: string[];
  focus: string;
}

export const WORKOUT_DAYS: DayPlan[] = [
  { dayIndex: 0, nameAr: 'دفع', isRest: false, exerciseIds: ['p1', 'p2', 'p3', 'p4', 'p5'], focus: 'الصدر، مقدمة وجانب الكتف، الترايسبس' },
  { dayIndex: 1, nameAr: 'سحب', isRest: false, exerciseIds: ['q1', 'q2', 'q3', 'q4', 'q5'], focus: 'سُمك وعرض الظهر، خلفية الكتف، البايسبس والساعد' },
  { dayIndex: 2, nameAr: 'أرجل وبطن', isRest: false, exerciseIds: ['l1', 'l2', 'l3', 'l4'], focus: 'الفخذ الأمامي، الفخذ الخلفي، الأرداف، السمانة، عضلات البطن' },
  { dayIndex: 3, nameAr: 'استشفاء ونمو', isRest: true, exerciseIds: [], focus: 'راحة، بناء الألياف العضلية، تغذية وامتلاء الجليكوجين' },
  { dayIndex: 4, nameAr: 'علوي مركب', isRest: false, exerciseIds: ['u1', 'u2', 'u3', 'u4'], focus: 'صدر جانبي، ظهر انفرادي، سوبر ست أكتاف، سوبر ست ذراعين' },
  { dayIndex: 5, nameAr: 'استشفاء', isRest: true, exerciseIds: [], focus: 'راحة نشطة، مشي خفيف، ترطيب' },
  { dayIndex: 6, nameAr: 'استشفاء', isRest: true, exerciseIds: [], focus: 'راحة كاملة استعداداً لدورة الأسبوع القادم' }
];

export const MUSCLE_NAMES: Record<string, { ar: string; en: string }> = {
  chest: { ar: 'الصدر', en: 'Pectoralis major' },
  'front-deltoids': { ar: 'الكتف (أمامي/جانبي)', en: 'Anterior & Lateral Deltoid' },
  'back-deltoids': { ar: 'الكتف الخلفي', en: 'Posterior Deltoid' },
  biceps: { ar: 'البايسبس', en: 'Biceps brachii' },
  triceps: { ar: 'الترايسبس', en: 'Triceps brachii' },
  forearm: { ar: 'الساعد', en: 'Forearm flexors' },
  abs: { ar: 'عضلات البطن', en: 'Rectus abdominis' },
  obliques: { ar: 'الجوانب (المائلة)', en: 'Obliques' },
  trapezius: { ar: 'الترابيس', en: 'Trapezius' },
  'upper-back': { ar: 'الظهر (العريضة والمعينات)', en: 'Latissimus & Rhomboids' },
  'lower-back': { ar: 'أسفل الظهر', en: 'Erector spinae' },
  gluteal: { ar: 'الأرداف (الألية)', en: 'Gluteus maximus' },
  quadriceps: { ar: 'الفخذ الأمامي', en: 'Quadriceps' },
  hamstring: { ar: 'الفخذ الخلفي', en: 'Hamstrings' },
  calves: { ar: 'السمانة', en: 'Gastrocnemius & Soleus' },
  abductors: { ar: 'الورك الجانبي', en: 'Hip abductors' }
};
