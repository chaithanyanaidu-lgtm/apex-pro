import { Goal, ExperienceLevel, Equipment, Exercise, WorkoutSession, WorkoutProgram } from '../types/fitness';

// --- Exercise Categories ---
type ExerciseCategory = 'chest' | 'back' | 'legs' | 'shoulders' | 'biceps' | 'triceps' | 'core' | 'full_body';
type IntensityType = 'heavy' | 'moderate' | 'isolation';

interface ExerciseDef {
    id: string;
    name: string;
    category: ExerciseCategory;
    equipment: Equipment[];
    intensity: IntensityType;
    alternatives: string[];
}

// --- Expanded Exercise Library (6-7+ per group) ---
const EXERCISE_LIBRARY: Record<string, ExerciseDef> = {
    // CHEST (8 exercises)
    'bench_press': { id: 'bench_press', name: 'Barbell Bench Press', category: 'chest', equipment: ['full_gym'], intensity: 'heavy', alternatives: ['db_bench_press', 'machine_chest_press'] },
    'db_bench_press': { id: 'db_bench_press', name: 'Dumbbell Bench Press', category: 'chest', equipment: ['full_gym', 'dumbbells_only'], intensity: 'heavy', alternatives: ['bench_press', 'pushups'] },
    'incline_db_press': { id: 'incline_db_press', name: 'Incline Dumbbell Press', category: 'chest', equipment: ['full_gym', 'dumbbells_only'], intensity: 'moderate', alternatives: ['incline_bench_press'] },
    'incline_bench_press': { id: 'incline_bench_press', name: 'Incline Barbell Press', category: 'chest', equipment: ['full_gym'], intensity: 'heavy', alternatives: ['incline_db_press'] },
    'cable_fly': { id: 'cable_fly', name: 'Cable Fly', category: 'chest', equipment: ['full_gym'], intensity: 'isolation', alternatives: ['db_fly', 'pec_deck'] },
    'db_fly': { id: 'db_fly', name: 'Dumbbell Fly', category: 'chest', equipment: ['full_gym', 'dumbbells_only'], intensity: 'isolation', alternatives: ['cable_fly', 'pec_deck'] },
    'pec_deck': { id: 'pec_deck', name: 'Pec Deck Machine', category: 'chest', equipment: ['full_gym'], intensity: 'isolation', alternatives: ['cable_fly', 'db_fly'] },
    'machine_chest_press': { id: 'machine_chest_press', name: 'Machine Chest Press', category: 'chest', equipment: ['full_gym'], intensity: 'moderate', alternatives: ['db_bench_press'] },
    'pushups': { id: 'pushups', name: 'Push Ups', category: 'chest', equipment: ['full_gym', 'dumbbells_only', 'home_workout'], intensity: 'moderate', alternatives: ['knee_pushups'] },
    'knee_pushups': { id: 'knee_pushups', name: 'Knee Push Ups', category: 'chest', equipment: ['full_gym', 'dumbbells_only', 'home_workout'], intensity: 'isolation', alternatives: ['pushups'] },
    'dips': { id: 'dips', name: 'Chest Dips', category: 'chest', equipment: ['full_gym', 'home_workout'], intensity: 'moderate', alternatives: ['pushups'] },

    // BACK (8 exercises)
    'deadlift': { id: 'deadlift', name: 'Barbell Deadlift', category: 'back', equipment: ['full_gym'], intensity: 'heavy', alternatives: ['db_rdl'] },
    'barbell_row': { id: 'barbell_row', name: 'Barbell Bent-Over Row', category: 'back', equipment: ['full_gym'], intensity: 'heavy', alternatives: ['db_rows', 't_bar_row'] },
    'pullups': { id: 'pullups', name: 'Pull Ups', category: 'back', equipment: ['full_gym', 'home_workout'], intensity: 'heavy', alternatives: ['lat_pulldown'] },
    'lat_pulldown': { id: 'lat_pulldown', name: 'Lat Pulldown', category: 'back', equipment: ['full_gym'], intensity: 'moderate', alternatives: ['pullups'] },
    'db_rows': { id: 'db_rows', name: 'Dumbbell Rows', category: 'back', equipment: ['full_gym', 'dumbbells_only'], intensity: 'moderate', alternatives: ['barbell_row'] },
    't_bar_row': { id: 't_bar_row', name: 'T-Bar Row', category: 'back', equipment: ['full_gym'], intensity: 'heavy', alternatives: ['barbell_row', 'db_rows'] },
    'cable_row': { id: 'cable_row', name: 'Seated Cable Row', category: 'back', equipment: ['full_gym'], intensity: 'moderate', alternatives: ['db_rows'] },
    'face_pulls': { id: 'face_pulls', name: 'Face Pulls', category: 'back', equipment: ['full_gym'], intensity: 'isolation', alternatives: ['rear_delt_fly'] },
    'rear_delt_fly': { id: 'rear_delt_fly', name: 'Rear Delt Fly', category: 'back', equipment: ['full_gym', 'dumbbells_only'], intensity: 'isolation', alternatives: ['face_pulls'] },
    'back_extension': { id: 'back_extension', name: 'Back Extension', category: 'back', equipment: ['full_gym'], intensity: 'isolation', alternatives: ['superman_hold'] },
    'superman_hold': { id: 'superman_hold', name: 'Superman Hold', category: 'back', equipment: ['full_gym', 'dumbbells_only', 'home_workout'], intensity: 'isolation', alternatives: ['back_extension'] },

    // LEGS (9 exercises)
    'squat': { id: 'squat', name: 'Barbell Squat', category: 'legs', equipment: ['full_gym'], intensity: 'heavy', alternatives: ['db_goblet_squat', 'leg_press'] },
    'db_goblet_squat': { id: 'db_goblet_squat', name: 'Dumbbell Goblet Squat', category: 'legs', equipment: ['full_gym', 'dumbbells_only'], intensity: 'moderate', alternatives: ['squat', 'bodyweight_squat'] },
    'leg_press': { id: 'leg_press', name: 'Machine Leg Press', category: 'legs', equipment: ['full_gym'], intensity: 'heavy', alternatives: ['squat'] },
    'bodyweight_squat': { id: 'bodyweight_squat', name: 'Bodyweight Squat', category: 'legs', equipment: ['full_gym', 'dumbbells_only', 'home_workout'], intensity: 'moderate', alternatives: ['lunges'] },
    'lunges': { id: 'lunges', name: 'Walking Lunges', category: 'legs', equipment: ['full_gym', 'dumbbells_only', 'home_workout'], intensity: 'moderate', alternatives: ['bulgarian_split_squat'] },
    'bulgarian_split_squat': { id: 'bulgarian_split_squat', name: 'Bulgarian Split Squat', category: 'legs', equipment: ['full_gym', 'dumbbells_only', 'home_workout'], intensity: 'moderate', alternatives: ['lunges'] },
    'db_rdl': { id: 'db_rdl', name: 'Dumbbell RDL', category: 'legs', equipment: ['full_gym', 'dumbbells_only'], intensity: 'moderate', alternatives: ['leg_curl'] },
    'leg_curl': { id: 'leg_curl', name: 'Leg Curl Machine', category: 'legs', equipment: ['full_gym'], intensity: 'isolation', alternatives: ['db_rdl'] },
    'leg_extension': { id: 'leg_extension', name: 'Leg Extension', category: 'legs', equipment: ['full_gym'], intensity: 'isolation', alternatives: ['bodyweight_squat'] },
    'calf_raises': { id: 'calf_raises', name: 'Calf Raises', category: 'legs', equipment: ['full_gym', 'dumbbells_only', 'home_workout'], intensity: 'isolation', alternatives: [] },
    'glute_bridges': { id: 'glute_bridges', name: 'Glute Bridges', category: 'legs', equipment: ['full_gym', 'dumbbells_only', 'home_workout'], intensity: 'isolation', alternatives: ['hip_thrust'] },
    'hip_thrust': { id: 'hip_thrust', name: 'Barbell Hip Thrust', category: 'legs', equipment: ['full_gym'], intensity: 'heavy', alternatives: ['glute_bridges'] },

    // SHOULDERS (7 exercises)
    'overhead_press': { id: 'overhead_press', name: 'Overhead Press', category: 'shoulders', equipment: ['full_gym'], intensity: 'heavy', alternatives: ['db_shoulder_press'] },
    'db_shoulder_press': { id: 'db_shoulder_press', name: 'Dumbbell Shoulder Press', category: 'shoulders', equipment: ['full_gym', 'dumbbells_only'], intensity: 'heavy', alternatives: ['overhead_press', 'pike_pushups'] },
    'pike_pushups': { id: 'pike_pushups', name: 'Pike Push Ups', category: 'shoulders', equipment: ['full_gym', 'dumbbells_only', 'home_workout'], intensity: 'moderate', alternatives: ['db_shoulder_press'] },
    'lateral_raises': { id: 'lateral_raises', name: 'Dumbbell Lateral Raises', category: 'shoulders', equipment: ['full_gym', 'dumbbells_only'], intensity: 'isolation', alternatives: ['cable_lateral_raises'] },
    'cable_lateral_raises': { id: 'cable_lateral_raises', name: 'Cable Lateral Raises', category: 'shoulders', equipment: ['full_gym'], intensity: 'isolation', alternatives: ['lateral_raises'] },
    'front_raises': { id: 'front_raises', name: 'Front Raises', category: 'shoulders', equipment: ['full_gym', 'dumbbells_only'], intensity: 'isolation', alternatives: ['plate_front_raise'] },
    'plate_front_raise': { id: 'plate_front_raise', name: 'Plate Front Raise', category: 'shoulders', equipment: ['full_gym'], intensity: 'isolation', alternatives: ['front_raises'] },
    'shrugs': { id: 'shrugs', name: 'Dumbbell Shrugs', category: 'shoulders', equipment: ['full_gym', 'dumbbells_only'], intensity: 'moderate', alternatives: ['barbell_shrugs'] },
    'barbell_shrugs': { id: 'barbell_shrugs', name: 'Barbell Shrugs', category: 'shoulders', equipment: ['full_gym'], intensity: 'moderate', alternatives: ['shrugs'] },

    // BICEPS (6 exercises)
    'bicep_curls': { id: 'bicep_curls', name: 'Dumbbell Bicep Curls', category: 'biceps', equipment: ['full_gym', 'dumbbells_only'], intensity: 'moderate', alternatives: ['barbell_curls'] },
    'barbell_curls': { id: 'barbell_curls', name: 'Barbell Curls', category: 'biceps', equipment: ['full_gym'], intensity: 'moderate', alternatives: ['bicep_curls'] },
    'hammer_curls': { id: 'hammer_curls', name: 'Hammer Curls', category: 'biceps', equipment: ['full_gym', 'dumbbells_only'], intensity: 'moderate', alternatives: ['bicep_curls'] },
    'cable_curls': { id: 'cable_curls', name: 'Cable Curls', category: 'biceps', equipment: ['full_gym'], intensity: 'isolation', alternatives: ['bicep_curls'] },
    'preacher_curls': { id: 'preacher_curls', name: 'Preacher Curls', category: 'biceps', equipment: ['full_gym'], intensity: 'isolation', alternatives: ['concentration_curls'] },
    'concentration_curls': { id: 'concentration_curls', name: 'Concentration Curls', category: 'biceps', equipment: ['full_gym', 'dumbbells_only'], intensity: 'isolation', alternatives: ['preacher_curls'] },

    // TRICEPS (6 exercises)
    'tricep_pushdowns': { id: 'tricep_pushdowns', name: 'Tricep Pushdowns', category: 'triceps', equipment: ['full_gym'], intensity: 'moderate', alternatives: ['tricep_extensions'] },
    'tricep_extensions': { id: 'tricep_extensions', name: 'Overhead Tricep Extensions', category: 'triceps', equipment: ['full_gym', 'dumbbells_only'], intensity: 'moderate', alternatives: ['tricep_pushdowns'] },
    'skull_crushers': { id: 'skull_crushers', name: 'Skull Crushers', category: 'triceps', equipment: ['full_gym'], intensity: 'moderate', alternatives: ['tricep_extensions'] },
    'tricep_dips': { id: 'tricep_dips', name: 'Tricep Dips', category: 'triceps', equipment: ['full_gym', 'home_workout'], intensity: 'moderate', alternatives: ['bench_dips'] },
    'bench_dips': { id: 'bench_dips', name: 'Bench Dips', category: 'triceps', equipment: ['full_gym', 'dumbbells_only', 'home_workout'], intensity: 'isolation', alternatives: ['tricep_dips'] },
    'rope_pushdowns': { id: 'rope_pushdowns', name: 'Rope Pushdowns', category: 'triceps', equipment: ['full_gym'], intensity: 'isolation', alternatives: ['tricep_pushdowns'] },
};

// --- Intensity-Based Rep Schemes ---
const REP_SCHEMES_BY_INTENSITY = {
    heavy: { sets: 4, reps: '6-8', rest: '3m' },
    moderate: { sets: 3, reps: '10-12', rest: '90s' },
    isolation: { sets: 3, reps: '12-15', rest: '60s' },
};

// Goal-based adjustments
const GOAL_ADJUSTMENTS: Record<string, { setsBonus: number; restAdjust: string }> = {
    muscle_gain: { setsBonus: 1, restAdjust: '90s' },
    fat_loss: { setsBonus: 0, restAdjust: '45s' },
    strength: { setsBonus: 1, restAdjust: '3-4m' },
    endurance: { setsBonus: 0, restAdjust: '30s' },
};

// --- Warm-up System ---
const WARMUP_LIBRARY = [
    'Jumping Jacks (60s)',
    'Arm Circles (30s forward, 30s backward)',
    'Bodyweight Squats (15 reps)',
    'Hip Openers (10 each leg)',
    'Light Pushups (10 reps)',
    'High Knees (45s)',
    'Walking Lunges (20 steps)',
    'Plank to Downward Dog (10 reps)',
    'Band Pull-Aparts (15 reps)',
    'Shoulder Dislocates (10 reps)',
];

export function generateWarmupRoutine(count = 4): string[] {
    const shuffled = [...WARMUP_LIBRARY].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, count);
}

// --- Rest Day Recovery ---
const STRETCH_LIBRARY = [
    'Hamstring Stretch (60s each)',
    'Quad Stretch (60s each)',
    'Cobra Stretch (60s)',
    'Spinal Twist (60s each)',
    'Childs Pose (2 mins)',
    'Pigeon Pose (60s each)',
    'Calf Stretch (45s each)',
    'Butterfly Stretch (60s)',
];

export function generateRecoveryRoutine(): WorkoutSession {
    const shuffled = [...STRETCH_LIBRARY].sort(() => 0.5 - Math.random());
    return {
        id: `recovery-${Date.now()}`,
        name: 'Active Recovery & Mobility',
        type: 'recovery',
        warmup: [],
        exercises: shuffled.map(s => ({
            name: s, sets: 1, reps: 'time based', rest: '0s', alternatives: []
        }))
    };
}

// --- Main Workout Engine ---
export function generateWorkoutSession(
    goal: Goal,
    experience_level: ExperienceLevel,
    equipment: Equipment,
    focus: string,
    isStrengthPhase: boolean = false
): WorkoutSession {
    // Filter exercises by equipment and focus
    const available = Object.values(EXERCISE_LIBRARY).filter(ex =>
        ex.equipment.includes(equipment) &&
        (focus === 'full_body' ? true : focus === 'push' ? ['chest', 'shoulders', 'triceps'].includes(ex.category)
            : focus === 'pull' ? ['back', 'biceps'].includes(ex.category)
                : ex.category === focus)
    );

    // Target 6-7 exercises: sort by intensity (heavy first) then shuffle within groups
    const heavyExercises = available.filter(e => e.intensity === 'heavy').sort(() => 0.5 - Math.random());
    const moderateExercises = available.filter(e => e.intensity === 'moderate').sort(() => 0.5 - Math.random());
    const isolationExercises = available.filter(e => e.intensity === 'isolation').sort(() => 0.5 - Math.random());

    // Build the final list: 2 heavy + 2-3 moderate + 2-3 isolation = 6-7 total
    const numTotal = experience_level === 'beginner' ? 6 : 7;
    const selected: ExerciseDef[] = [];

    // Heavy first (max 2-3)
    selected.push(...heavyExercises.slice(0, Math.min(2, heavyExercises.length)));
    // Moderate next
    const modCount = Math.min(3, moderateExercises.length);
    selected.push(...moderateExercises.slice(0, modCount));
    // Fill remaining with isolation
    const remaining = numTotal - selected.length;
    selected.push(...isolationExercises.slice(0, Math.max(remaining, 0)));

    // If we still don't have enough, pull more from moderate
    if (selected.length < numTotal) {
        const extra = moderateExercises.slice(modCount, modCount + (numTotal - selected.length));
        selected.push(...extra);
    }

    const goalAdj = GOAL_ADJUSTMENTS[goal] || GOAL_ADJUSTMENTS.muscle_gain;

    const sessionExercises: Exercise[] = selected.slice(0, numTotal).map(ex => {
        let scheme = isStrengthPhase
            ? { sets: 5, reps: '3-5', rest: '3-4m' }
            : { ...REP_SCHEMES_BY_INTENSITY[ex.intensity] };

        // Apply goal bonus
        if (!isStrengthPhase && goal === 'muscle_gain') scheme.sets += 1;
        if (!isStrengthPhase && goal === 'fat_loss') scheme.rest = goalAdj.restAdjust;

        const alts = ex.alternatives
            .filter(altId => EXERCISE_LIBRARY[altId]?.equipment.includes(equipment))
            .map(altId => EXERCISE_LIBRARY[altId].name);

        return {
            name: ex.name,
            sets: scheme.sets,
            reps: scheme.reps,
            rest: scheme.rest,
            alternatives: alts,
            recommended_weight_progression: ex.intensity === 'heavy' ? '+2.5kg' : '+1kg or 1 extra rep'
        };
    });

    const focusLabel = focus === 'push' ? 'PUSH' : focus === 'pull' ? 'PULL' : focus.replace('_', ' ').toUpperCase();

    return {
        id: `workout-${Date.now()}`,
        name: `${focusLabel} ${isStrengthPhase ? 'Strength' : goal === 'muscle_gain' ? 'Hypertrophy' : 'Workout'}`,
        type: isStrengthPhase ? 'strength' : 'hypertrophy',
        warmup: generateWarmupRoutine(),
        exercises: sessionExercises
    };
}

// --- Weekly Program ---
export function generateWeeklyProgram(
    profile: { goal: Goal; experience_level: ExperienceLevel; equipment: Equipment; focus_area: string },
    weekNumber: number
): WorkoutProgram {
    const isStrengthPhase = weekNumber % 6 === 0;
    const schedule = getPersonalizedSplit(profile.experience_level);
    const sessions: WorkoutSession[] = [];

    for (const day of schedule) {
        if (day.focus === 'rest') continue;
        sessions.push(generateWorkoutSession(
            profile.goal, profile.experience_level, profile.equipment, day.focus, isStrengthPhase
        ));
    }

    return { week: weekNumber, sessions };
}

// --- Personalized Split Lookup ---
interface SplitDay { dayIndex: number; focus: string; label: string }

export function getPersonalizedSplit(level: ExperienceLevel): SplitDay[] {
    switch (level) {
        case 'beginner':
            return [
                { dayIndex: 1, focus: 'push', label: 'Push Day' },
                { dayIndex: 2, focus: 'rest', label: 'Rest' },
                { dayIndex: 3, focus: 'pull', label: 'Pull Day' },
                { dayIndex: 4, focus: 'rest', label: 'Rest' },
                { dayIndex: 5, focus: 'legs', label: 'Leg Day' },
                { dayIndex: 6, focus: 'rest', label: 'Rest' },
                { dayIndex: 0, focus: 'rest', label: 'Rest' },
            ];
        case 'intermediate':
            return [
                { dayIndex: 1, focus: 'chest', label: 'Chest Day' },
                { dayIndex: 2, focus: 'back', label: 'Back Day' },
                { dayIndex: 3, focus: 'rest', label: 'Rest' },
                { dayIndex: 4, focus: 'legs', label: 'Leg Day' },
                { dayIndex: 5, focus: 'shoulders', label: 'Shoulder Day' },
                { dayIndex: 6, focus: 'biceps', label: 'Arms Day' },
                { dayIndex: 0, focus: 'rest', label: 'Rest' },
            ];
        case 'advanced':
            return [
                { dayIndex: 1, focus: 'chest', label: 'Chest Day' },
                { dayIndex: 2, focus: 'back', label: 'Back Day' },
                { dayIndex: 3, focus: 'legs', label: 'Leg Day' },
                { dayIndex: 4, focus: 'shoulders', label: 'Shoulder Day' },
                { dayIndex: 5, focus: 'biceps', label: 'Biceps Day' },
                { dayIndex: 6, focus: 'triceps', label: 'Triceps Day' },
                { dayIndex: 0, focus: 'rest', label: 'Rest' },
            ];
        default:
            return getPersonalizedSplit('intermediate');
    }
}

// --- Swap Exercise Utility ---
export function swapExercise(currentName: string, equipment: Equipment): Exercise | null {
    const currentDef = Object.values(EXERCISE_LIBRARY).find(e => e.name === currentName);
    if (!currentDef) return null;

    const available = currentDef.alternatives
        .map(id => EXERCISE_LIBRARY[id])
        .filter(e => e && e.equipment.includes(equipment));

    if (available.length === 0) return null;
    const alt = available[Math.floor(Math.random() * available.length)];
    const scheme = REP_SCHEMES_BY_INTENSITY[alt.intensity];

    return {
        name: alt.name,
        sets: scheme.sets,
        reps: scheme.reps,
        rest: scheme.rest,
        alternatives: alt.alternatives
            .filter(id => EXERCISE_LIBRARY[id]?.equipment.includes(equipment))
            .map(id => EXERCISE_LIBRARY[id].name),
    };
}
