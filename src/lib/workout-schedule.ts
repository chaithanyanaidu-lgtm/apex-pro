import { generateWorkoutSession, getPersonalizedSplit } from './workout-engine';
import { Goal, ExperienceLevel, Equipment, WorkoutSession } from '../types/fitness';

// --- Get user's personalized schedule for today ---
export interface DaySchedule {
    dayIndex: number;
    dayName: string;
    dayShort: string;
    focus: string;
    label: string;
}

const DAY_NAMES = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
const DAY_SHORTS = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];

export function getWeeklySchedule(level: ExperienceLevel): DaySchedule[] {
    const split = getPersonalizedSplit(level);
    return split.map(day => ({
        dayIndex: day.dayIndex,
        dayName: DAY_NAMES[day.dayIndex],
        dayShort: DAY_SHORTS[day.dayIndex],
        focus: day.focus,
        label: day.label,
    }));
}

export function getTodaysSchedule(level: ExperienceLevel): DaySchedule {
    const schedule = getWeeklySchedule(level);
    const todayIndex = new Date().getDay();
    return schedule.find(d => d.dayIndex === todayIndex) || schedule[0];
}

export function getTodaysWorkoutSession(
    goal: Goal,
    level: ExperienceLevel,
    equipment: Equipment
): WorkoutSession | null {
    const schedule = getTodaysSchedule(level);
    if (schedule.focus === 'rest') return null;
    return generateWorkoutSession(goal, level, equipment, schedule.focus);
}

export function getWorkoutForDay(
    dayIndex: number,
    goal: Goal,
    level: ExperienceLevel,
    equipment: Equipment
): WorkoutSession | null {
    const schedule = getWeeklySchedule(level);
    const day = schedule.find(d => d.dayIndex === dayIndex);
    if (!day || day.focus === 'rest') return null;
    return generateWorkoutSession(goal, level, equipment, day.focus);
}

// --- Muscle-group-specific stretching ---
export const STRETCHING_BY_GROUP: Record<string, string[]> = {
    chest: ['Chest Doorway Stretch (30s each side)', 'Pec Wall Stretch (30s each)', 'Cross-Body Arm Stretch (30s each)', 'Cobra Pose (45s)'],
    back: ['Cat-Cow Stretch (60s)', 'Childs Pose (45s)', 'Seated Spinal Twist (30s each)', 'Lat Side Stretch (30s each)'],
    legs: ['Standing Quad Stretch (30s each)', 'Hamstring Stretch (45s each)', 'Pigeon Pose (45s each)', 'Calf Stretch (30s each)'],
    shoulders: ['Cross-Body Shoulder Stretch (30s each)', 'Overhead Tricep Stretch (30s each)', 'Thread the Needle (30s each)', 'Shoulder Circles (60s)'],
    biceps: ['Bicep Wall Stretch (30s each)', 'Reverse Prayer Stretch (30s)', 'Doorway Bicep Stretch (30s each)', 'Wrist Flexor Stretch (30s each)'],
    triceps: ['Overhead Tricep Stretch (30s each)', 'Cross-Body Stretch (30s each)', 'Wrist Extensor Stretch (30s each)', 'Arm Circles (60s)'],
    push: ['Chest Doorway Stretch (30s each)', 'Overhead Tricep Stretch (30s each)', 'Shoulder Circles (60s)', 'Wrist Flexor Stretch (30s each)'],
    pull: ['Lat Side Stretch (30s each)', 'Cat-Cow Stretch (60s)', 'Bicep Wall Stretch (30s each)', 'Reverse Prayer Stretch (30s)'],
    full_body: ['World\'s Greatest Stretch (30s each)', 'Downward Dog (45s)', 'Pigeon Pose (30s each)', 'Cat-Cow (60s)', 'Standing Forward Fold (45s)'],
};

// --- Exercise Details for Modal ---
export interface ExerciseDetail {
    name: string;
    targetMuscle: string;
    difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
    instructions: string[];
    variations: { name: string; difficulty: 'Beginner' | 'Intermediate' | 'Advanced' }[];
}

export const EXERCISE_DETAILS: Record<string, ExerciseDetail> = {
    'Barbell Bench Press': {
        name: 'Barbell Bench Press', targetMuscle: 'Chest (Pectoralis Major)', difficulty: 'Intermediate',
        instructions: ['Lie flat on bench, feet on floor', 'Grip bar slightly wider than shoulders', 'Lower bar to mid-chest', 'Press up explosively to lockout'],
        variations: [{ name: 'Flat Bench', difficulty: 'Intermediate' }, { name: 'Incline Bench', difficulty: 'Intermediate' }, { name: 'Close-Grip', difficulty: 'Advanced' }]
    },
    'Dumbbell Bench Press': {
        name: 'Dumbbell Bench Press', targetMuscle: 'Chest', difficulty: 'Intermediate',
        instructions: ['Lie flat holding dumbbells at chest', 'Press up until arms extended', 'Lower slowly with control'],
        variations: [{ name: 'Flat DB Press', difficulty: 'Intermediate' }, { name: 'Incline DB Press', difficulty: 'Intermediate' }, { name: 'Single-Arm Press', difficulty: 'Advanced' }]
    },
    'Incline Dumbbell Press': {
        name: 'Incline Dumbbell Press', targetMuscle: 'Upper Chest', difficulty: 'Intermediate',
        instructions: ['Set bench to 30-45 degrees', 'Hold dumbbells at chest level', 'Press up at an angle', 'Lower with control'],
        variations: [{ name: 'Low Incline', difficulty: 'Intermediate' }, { name: 'High Incline', difficulty: 'Intermediate' }]
    },
    'Cable Fly': {
        name: 'Cable Fly', targetMuscle: 'Chest (Inner)', difficulty: 'Intermediate',
        instructions: ['Set cables at chest height', 'Step forward with slight lean', 'Bring handles together in arc motion', 'Squeeze at center'],
        variations: [{ name: 'High Cable Fly', difficulty: 'Intermediate' }, { name: 'Low Cable Fly', difficulty: 'Intermediate' }]
    },
    'Pec Deck Machine': {
        name: 'Pec Deck Machine', targetMuscle: 'Chest', difficulty: 'Beginner',
        instructions: ['Sit with back flat against pad', 'Grip handles at chest level', 'Bring arms together', 'Squeeze and return slowly'],
        variations: [{ name: 'Standard Pec Deck', difficulty: 'Beginner' }, { name: 'Reverse Pec Deck', difficulty: 'Beginner' }]
    },
    'Push Ups': {
        name: 'Push Ups', targetMuscle: 'Chest, Triceps, Shoulders', difficulty: 'Beginner',
        instructions: ['High plank, hands shoulder-width', 'Lower chest to floor', 'Push back up', 'Keep core tight'],
        variations: [{ name: 'Standard', difficulty: 'Beginner' }, { name: 'Incline', difficulty: 'Beginner' }, { name: 'Decline', difficulty: 'Intermediate' }, { name: 'Diamond', difficulty: 'Advanced' }]
    },
    'Chest Dips': {
        name: 'Chest Dips', targetMuscle: 'Lower Chest, Triceps', difficulty: 'Intermediate',
        instructions: ['Grip parallel bars', 'Lean forward slightly', 'Lower body bending elbows', 'Push back up'],
        variations: [{ name: 'Bodyweight Dips', difficulty: 'Intermediate' }, { name: 'Weighted Dips', difficulty: 'Advanced' }]
    },
    'Barbell Deadlift': {
        name: 'Barbell Deadlift', targetMuscle: 'Back, Hamstrings, Glutes', difficulty: 'Advanced',
        instructions: ['Stand with feet hip-width, bar over mid-foot', 'Hinge at hips, grip bar', 'Drive through floor keeping back flat', 'Lock out at top'],
        variations: [{ name: 'Conventional', difficulty: 'Intermediate' }, { name: 'Sumo', difficulty: 'Intermediate' }, { name: 'Romanian', difficulty: 'Intermediate' }]
    },
    'Pull Ups': {
        name: 'Pull Ups', targetMuscle: 'Lats, Biceps', difficulty: 'Intermediate',
        instructions: ['Grab bar overhand, slightly wider than shoulders', 'Pull up until chin clears bar', 'Lower with control'],
        variations: [{ name: 'Standard', difficulty: 'Intermediate' }, { name: 'Chin Up', difficulty: 'Intermediate' }, { name: 'Wide-Grip', difficulty: 'Advanced' }]
    },
    'Lat Pulldown': {
        name: 'Lat Pulldown', targetMuscle: 'Lats, Biceps', difficulty: 'Beginner',
        instructions: ['Sit at machine, thighs secured', 'Grip bar wide', 'Pull to upper chest', 'Release slowly'],
        variations: [{ name: 'Wide-Grip', difficulty: 'Beginner' }, { name: 'Close-Grip', difficulty: 'Beginner' }, { name: 'Reverse-Grip', difficulty: 'Intermediate' }]
    },
    'Dumbbell Rows': {
        name: 'Dumbbell Rows', targetMuscle: 'Upper Back, Lats', difficulty: 'Beginner',
        instructions: ['One knee and hand on bench', 'Hold dumbbell, arm hanging', 'Pull to hip, squeeze shoulder blade', 'Lower with control'],
        variations: [{ name: 'Single-Arm', difficulty: 'Beginner' }, { name: 'Bent-Over', difficulty: 'Intermediate' }]
    },
    'Barbell Bent-Over Row': {
        name: 'Barbell Bent-Over Row', targetMuscle: 'Upper Back, Lats', difficulty: 'Intermediate',
        instructions: ['Hinge forward holding barbell', 'Pull bar to lower chest', 'Squeeze shoulder blades', 'Lower with control'],
        variations: [{ name: 'Overhand Grip', difficulty: 'Intermediate' }, { name: 'Underhand Grip', difficulty: 'Intermediate' }]
    },
    'Face Pulls': {
        name: 'Face Pulls', targetMuscle: 'Rear Delts, Upper Back', difficulty: 'Beginner',
        instructions: ['Set cable at face height', 'Pull rope toward face', 'Rotate hands outward at peak', 'Return slowly'],
        variations: [{ name: 'Standing', difficulty: 'Beginner' }, { name: 'Seated', difficulty: 'Beginner' }]
    },
    'Barbell Squat': {
        name: 'Barbell Squat', targetMuscle: 'Quads, Glutes, Hamstrings', difficulty: 'Intermediate',
        instructions: ['Bar on upper traps, feet shoulder-width', 'Brace core, descend to parallel', 'Drive through heels to stand'],
        variations: [{ name: 'Back Squat', difficulty: 'Intermediate' }, { name: 'Front Squat', difficulty: 'Advanced' }, { name: 'Pause Squat', difficulty: 'Advanced' }]
    },
    'Machine Leg Press': {
        name: 'Machine Leg Press', targetMuscle: 'Quads, Glutes', difficulty: 'Beginner',
        instructions: ['Feet shoulder-width on platform', 'Lower weight bending knees', 'Push through heels', 'Dont lock out knees'],
        variations: [{ name: 'Standard', difficulty: 'Beginner' }, { name: 'Narrow Stance', difficulty: 'Intermediate' }, { name: 'Single-Leg', difficulty: 'Advanced' }]
    },
    'Walking Lunges': {
        name: 'Walking Lunges', targetMuscle: 'Quads, Glutes', difficulty: 'Beginner',
        instructions: ['Stand tall, step forward', 'Lower until both knees at 90°', 'Push off front foot', 'Alternate legs'],
        variations: [{ name: 'Forward', difficulty: 'Beginner' }, { name: 'Reverse', difficulty: 'Beginner' }, { name: 'Walking', difficulty: 'Intermediate' }]
    },
    'Overhead Press': {
        name: 'Overhead Press', targetMuscle: 'Shoulders (Deltoids)', difficulty: 'Intermediate',
        instructions: ['Bar at shoulder height', 'Brace core, press overhead', 'Lock out arms', 'Lower with control'],
        variations: [{ name: 'Standing', difficulty: 'Intermediate' }, { name: 'Seated', difficulty: 'Intermediate' }, { name: 'Push Press', difficulty: 'Advanced' }]
    },
    'Dumbbell Shoulder Press': {
        name: 'Dumbbell Shoulder Press', targetMuscle: 'Shoulders', difficulty: 'Beginner',
        instructions: ['Sit/stand with DBs at shoulders', 'Press overhead', 'Lower back to shoulders'],
        variations: [{ name: 'Seated DB Press', difficulty: 'Beginner' }, { name: 'Arnold Press', difficulty: 'Intermediate' }]
    },
    'Dumbbell Lateral Raises': {
        name: 'Dumbbell Lateral Raises', targetMuscle: 'Side Deltoids', difficulty: 'Beginner',
        instructions: ['Stand with DBs at sides', 'Raise arms out to parallel', 'Slight bend in elbows', 'Lower slowly'],
        variations: [{ name: 'Standing', difficulty: 'Beginner' }, { name: 'Seated', difficulty: 'Beginner' }, { name: 'Leaning', difficulty: 'Intermediate' }]
    },
    'Dumbbell Bicep Curls': {
        name: 'Dumbbell Bicep Curls', targetMuscle: 'Biceps', difficulty: 'Beginner',
        instructions: ['Stand with DBs at sides, palms forward', 'Curl up bending at elbow', 'Squeeze at top', 'Lower with control'],
        variations: [{ name: 'Standard', difficulty: 'Beginner' }, { name: 'Hammer', difficulty: 'Beginner' }, { name: 'Concentration', difficulty: 'Intermediate' }]
    },
    'Hammer Curls': {
        name: 'Hammer Curls', targetMuscle: 'Biceps, Brachialis', difficulty: 'Beginner',
        instructions: ['Hold DBs with neutral grip (palms facing)', 'Curl up keeping wrists neutral', 'Squeeze at top', 'Lower slowly'],
        variations: [{ name: 'Standing', difficulty: 'Beginner' }, { name: 'Alternating', difficulty: 'Beginner' }]
    },
    'Barbell Curls': {
        name: 'Barbell Curls', targetMuscle: 'Biceps', difficulty: 'Beginner',
        instructions: ['Stand with barbell, shoulder-width grip', 'Curl to shoulders', 'Squeeze at top', 'Lower slowly'],
        variations: [{ name: 'Straight Bar', difficulty: 'Beginner' }, { name: 'EZ-Bar', difficulty: 'Beginner' }]
    },
    'Tricep Pushdowns': {
        name: 'Tricep Pushdowns', targetMuscle: 'Triceps', difficulty: 'Beginner',
        instructions: ['Stand at cable machine', 'Push bar down extending elbows', 'Keep upper arms stationary', 'Return slowly'],
        variations: [{ name: 'Bar', difficulty: 'Beginner' }, { name: 'Rope', difficulty: 'Beginner' }, { name: 'Single-Arm', difficulty: 'Intermediate' }]
    },
    'Overhead Tricep Extensions': {
        name: 'Overhead Tricep Extensions', targetMuscle: 'Triceps', difficulty: 'Beginner',
        instructions: ['Hold DB overhead with both hands', 'Lower behind head bending elbows', 'Extend back up', 'Keep upper arms close to ears'],
        variations: [{ name: 'Two-Hand', difficulty: 'Beginner' }, { name: 'Single-Arm', difficulty: 'Intermediate' }]
    },
    'Skull Crushers': {
        name: 'Skull Crushers', targetMuscle: 'Triceps', difficulty: 'Intermediate',
        instructions: ['Lie on bench holding bar/DBs above chest', 'Lower weight toward forehead bending elbows', 'Extend back up', 'Keep upper arms vertical'],
        variations: [{ name: 'EZ-Bar', difficulty: 'Intermediate' }, { name: 'Dumbbell', difficulty: 'Intermediate' }]
    },
    'Dumbbell Goblet Squat': {
        name: 'Dumbbell Goblet Squat', targetMuscle: 'Quads, Glutes', difficulty: 'Beginner',
        instructions: ['Hold DB vertically at chest', 'Squat down keeping elbows inside knees', 'Push through heels to stand'],
        variations: [{ name: 'Standard', difficulty: 'Beginner' }, { name: 'Pulse', difficulty: 'Intermediate' }]
    },
    'Dumbbell RDL': {
        name: 'Dumbbell RDL', targetMuscle: 'Hamstrings, Glutes', difficulty: 'Intermediate',
        instructions: ['Hold DBs in front of thighs', 'Hinge at hips, slight knee bend', 'Lower until hamstring stretch', 'Drive hips forward to stand'],
        variations: [{ name: 'Standard', difficulty: 'Intermediate' }, { name: 'Single-Leg', difficulty: 'Advanced' }]
    },
    'Leg Curl Machine': {
        name: 'Leg Curl Machine', targetMuscle: 'Hamstrings', difficulty: 'Beginner',
        instructions: ['Lie face down on machine', 'Curl weight toward glutes', 'Squeeze at top', 'Lower slowly'],
        variations: [{ name: 'Lying', difficulty: 'Beginner' }, { name: 'Seated', difficulty: 'Beginner' }]
    },
    'Leg Extension': {
        name: 'Leg Extension', targetMuscle: 'Quadriceps', difficulty: 'Beginner',
        instructions: ['Sit on machine, shins behind pad', 'Extend legs until straight', 'Squeeze quads', 'Lower with control'],
        variations: [{ name: 'Standard', difficulty: 'Beginner' }, { name: 'Single-Leg', difficulty: 'Intermediate' }]
    },
    'Calf Raises': {
        name: 'Calf Raises', targetMuscle: 'Calves', difficulty: 'Beginner',
        instructions: ['Stand on edge of step', 'Rise up on toes', 'Hold at top', 'Lower slowly below step level'],
        variations: [{ name: 'Standing', difficulty: 'Beginner' }, { name: 'Seated', difficulty: 'Beginner' }]
    },
    'Glute Bridges': {
        name: 'Glute Bridges', targetMuscle: 'Glutes, Hamstrings', difficulty: 'Beginner',
        instructions: ['Lie on back, knees bent, feet flat', 'Push hips up squeezing glutes', 'Lower with control'],
        variations: [{ name: 'Bodyweight', difficulty: 'Beginner' }, { name: 'Single-Leg', difficulty: 'Intermediate' }]
    },
    'Dumbbell Shrugs': {
        name: 'Dumbbell Shrugs', targetMuscle: 'Traps', difficulty: 'Beginner',
        instructions: ['Stand with DBs at sides', 'Shrug shoulders up toward ears', 'Hold at top', 'Lower slowly'],
        variations: [{ name: 'Standard', difficulty: 'Beginner' }, { name: 'Behind-Back', difficulty: 'Intermediate' }]
    },
    'Seated Cable Row': {
        name: 'Seated Cable Row', targetMuscle: 'Mid Back, Lats', difficulty: 'Beginner',
        instructions: ['Sit at cable machine, feet on platform', 'Pull handle to torso', 'Squeeze shoulder blades', 'Return slowly'],
        variations: [{ name: 'Close-Grip', difficulty: 'Beginner' }, { name: 'Wide-Grip', difficulty: 'Intermediate' }]
    },
    'T-Bar Row': {
        name: 'T-Bar Row', targetMuscle: 'Mid Back, Lats', difficulty: 'Intermediate',
        instructions: ['Straddle the T-bar', 'Hinge forward, grip handles', 'Pull to chest', 'Lower with control'],
        variations: [{ name: 'Standard', difficulty: 'Intermediate' }, { name: 'Chest-Supported', difficulty: 'Beginner' }]
    },
    'Bulgarian Split Squat': {
        name: 'Bulgarian Split Squat', targetMuscle: 'Quads, Glutes', difficulty: 'Intermediate',
        instructions: ['Rear foot on bench behind you', 'Lower front knee to 90°', 'Push through front heel', 'Keep torso upright'],
        variations: [{ name: 'Bodyweight', difficulty: 'Intermediate' }, { name: 'Weighted', difficulty: 'Advanced' }]
    },
    'Pike Push Ups': {
        name: 'Pike Push Ups', targetMuscle: 'Shoulders, Triceps', difficulty: 'Intermediate',
        instructions: ['Downward dog position with hips high', 'Bend elbows lowering head to floor', 'Push back up'],
        variations: [{ name: 'Standard', difficulty: 'Intermediate' }, { name: 'Elevated', difficulty: 'Advanced' }]
    },
    'Cable Lateral Raises': {
        name: 'Cable Lateral Raises', targetMuscle: 'Side Deltoids', difficulty: 'Intermediate',
        instructions: ['Stand sideways to cable at low position', 'Raise arm to parallel', 'Lower slowly'],
        variations: [{ name: 'Standard', difficulty: 'Intermediate' }, { name: 'Behind-Back', difficulty: 'Advanced' }]
    },
    'Front Raises': {
        name: 'Front Raises', targetMuscle: 'Front Deltoids', difficulty: 'Beginner',
        instructions: ['Hold DBs at thighs', 'Raise arms forward to shoulder height', 'Lower with control'],
        variations: [{ name: 'Dumbbell', difficulty: 'Beginner' }, { name: 'Plate', difficulty: 'Beginner' }]
    },
    'Concentration Curls': {
        name: 'Concentration Curls', targetMuscle: 'Biceps', difficulty: 'Beginner',
        instructions: ['Sit on bench, elbow against inner thigh', 'Curl dumbbell up', 'Squeeze at top', 'Lower slowly'],
        variations: [{ name: 'Standard', difficulty: 'Beginner' }, { name: 'Standing', difficulty: 'Intermediate' }]
    },
    'Preacher Curls': {
        name: 'Preacher Curls', targetMuscle: 'Biceps', difficulty: 'Intermediate',
        instructions: ['Rest arms on preacher pad', 'Curl weight up', 'Lower with control', 'Dont swing'],
        variations: [{ name: 'EZ-Bar', difficulty: 'Intermediate' }, { name: 'Dumbbell', difficulty: 'Intermediate' }]
    },
    'Tricep Dips': {
        name: 'Tricep Dips', targetMuscle: 'Triceps', difficulty: 'Intermediate',
        instructions: ['Grip parallel bars, keep torso upright', 'Lower body bending elbows', 'Extend arms to push up'],
        variations: [{ name: 'Bodyweight', difficulty: 'Intermediate' }, { name: 'Weighted', difficulty: 'Advanced' }]
    },
    'Bench Dips': {
        name: 'Bench Dips', targetMuscle: 'Triceps', difficulty: 'Beginner',
        instructions: ['Hands on bench behind you', 'Lower body bending elbows', 'Push back up'],
        variations: [{ name: 'Feet on Floor', difficulty: 'Beginner' }, { name: 'Feet Elevated', difficulty: 'Intermediate' }]
    },
    'Rope Pushdowns': {
        name: 'Rope Pushdowns', targetMuscle: 'Triceps', difficulty: 'Beginner',
        instructions: ['Grip rope at cable machine', 'Push down splitting rope at bottom', 'Squeeze triceps', 'Return slowly'],
        variations: [{ name: 'Standard', difficulty: 'Beginner' }, { name: 'Overhead Rope', difficulty: 'Intermediate' }]
    },
    'Cable Curls': {
        name: 'Cable Curls', targetMuscle: 'Biceps', difficulty: 'Beginner',
        instructions: ['Face cable machine with handle low', 'Curl handle up', 'Keep elbows stationary', 'Lower slowly'],
        variations: [{ name: 'Standard', difficulty: 'Beginner' }, { name: 'Rope', difficulty: 'Beginner' }]
    },
    'Bodyweight Squat': {
        name: 'Bodyweight Squat', targetMuscle: 'Quads, Glutes', difficulty: 'Beginner',
        instructions: ['Feet shoulder-width', 'Lower by bending knees', 'Go as deep as possible', 'Push through heels'],
        variations: [{ name: 'Standard', difficulty: 'Beginner' }, { name: 'Jump Squat', difficulty: 'Intermediate' }]
    },
    'Barbell Hip Thrust': {
        name: 'Barbell Hip Thrust', targetMuscle: 'Glutes', difficulty: 'Intermediate',
        instructions: ['Upper back against bench, bar on hips', 'Drive hips up squeezing glutes', 'Lower with control'],
        variations: [{ name: 'Barbell', difficulty: 'Intermediate' }, { name: 'Single-Leg', difficulty: 'Advanced' }]
    },
    'Superman Hold': {
        name: 'Superman Hold', targetMuscle: 'Lower Back', difficulty: 'Beginner',
        instructions: ['Lie face down, arms extended', 'Lift arms and legs off floor', 'Hold for time', 'Lower with control'],
        variations: [{ name: 'Standard Hold', difficulty: 'Beginner' }, { name: 'Flutter', difficulty: 'Intermediate' }]
    },
    'Back Extension': {
        name: 'Back Extension', targetMuscle: 'Lower Back', difficulty: 'Beginner',
        instructions: ['Position on back extension bench', 'Lower torso bending at hips', 'Raise until body straight'],
        variations: [{ name: 'Bodyweight', difficulty: 'Beginner' }, { name: 'Weighted', difficulty: 'Intermediate' }]
    },
    'Rear Delt Fly': {
        name: 'Rear Delt Fly', targetMuscle: 'Rear Deltoids', difficulty: 'Beginner',
        instructions: ['Bend forward holding DBs', 'Raise arms out to sides', 'Squeeze shoulder blades', 'Lower slowly'],
        variations: [{ name: 'Bent-Over', difficulty: 'Beginner' }, { name: 'Machine', difficulty: 'Beginner' }]
    },
    'Incline Barbell Press': {
        name: 'Incline Barbell Press', targetMuscle: 'Upper Chest', difficulty: 'Intermediate',
        instructions: ['Set bench to 30-45 degrees', 'Unrack barbell', 'Lower to upper chest', 'Press to lockout'],
        variations: [{ name: 'Standard', difficulty: 'Intermediate' }, { name: 'Close-Grip Incline', difficulty: 'Advanced' }]
    },
    'Dumbbell Fly': {
        name: 'Dumbbell Fly', targetMuscle: 'Chest', difficulty: 'Intermediate',
        instructions: ['Lie flat holding DBs above chest', 'Lower arms in wide arc', 'Stretch chest at bottom', 'Bring back up'],
        variations: [{ name: 'Flat', difficulty: 'Intermediate' }, { name: 'Incline', difficulty: 'Intermediate' }]
    },
    'Machine Chest Press': {
        name: 'Machine Chest Press', targetMuscle: 'Chest', difficulty: 'Beginner',
        instructions: ['Sit with back against pad', 'Press handles forward', 'Return slowly'],
        variations: [{ name: 'Standard', difficulty: 'Beginner' }, { name: 'Incline Machine', difficulty: 'Beginner' }]
    },
    'Knee Push Ups': {
        name: 'Knee Push Ups', targetMuscle: 'Chest, Triceps', difficulty: 'Beginner',
        instructions: ['Push up position with knees on ground', 'Lower chest to floor', 'Push back up'],
        variations: [{ name: 'Standard', difficulty: 'Beginner' }, { name: 'Wide', difficulty: 'Beginner' }]
    },
    'Plate Front Raise': {
        name: 'Plate Front Raise', targetMuscle: 'Front Deltoids', difficulty: 'Beginner',
        instructions: ['Hold plate with both hands', 'Raise to shoulder height', 'Lower with control'],
        variations: [{ name: 'Standard', difficulty: 'Beginner' }]
    },
    'Barbell Shrugs': {
        name: 'Barbell Shrugs', targetMuscle: 'Traps', difficulty: 'Intermediate',
        instructions: ['Hold barbell at thighs', 'Shrug shoulders up', 'Hold, then lower'],
        variations: [{ name: 'Standard', difficulty: 'Intermediate' }]
    },
};
