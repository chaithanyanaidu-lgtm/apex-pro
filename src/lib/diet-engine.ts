export type BodyAnalysis = {
    bmi: number
    bodyType: 'Skinny' | 'Athletic / Normal' | 'Fat' | 'Obese'
    goal: 'Muscle Gain' | 'Maintenance' | 'Fat Loss'
}

export type UserData = {
    age: number
    height: number
    weight: number
    activityLevel: 'Low' | 'Moderate' | 'High'
    dietType: 'Veg' | 'Non-Veg'
    budget?: 'Low' | 'Medium' | 'High'
}

export type DietPlan = {
    calories: number
    protein: number
    weeklyPlan: {
        day: number
        emptyStomach: string
        breakfast: string
        lunch: string
        snack: string
        dinner: string
    }[]
}

// --- Budget-aware Food Database ---
type BudgetTier = 'Low' | 'Medium' | 'High'

interface FoodPool {
    veg: string[]
    nonVeg: string[]
}

const FOOD_DATABASE: Record<string, Record<BudgetTier, FoodPool>> = {
    emptyStomach: {
        Low: {
            veg: ['Warm Lemon Water', 'Jeera Water', 'Ginger Water', 'Warm Water + Honey', 'Methi Soaked Water', 'Ajwain Water'],
            nonVeg: ['Warm Lemon Water', 'Jeera Water', 'Ginger Water', 'Warm Water + Honey', 'Methi Soaked Water', 'Ajwain Water'],
        },
        Medium: {
            veg: ['Warm Lemon Water', 'Jeera Water', 'Ginger Water', 'Apple Cider Vinegar Drink', 'Soaked Almonds + Warm Water', 'Chia Seeds Water', 'Methi Soaked Water'],
            nonVeg: ['Warm Lemon Water', 'Jeera Water', 'Ginger Water', 'Apple Cider Vinegar Drink', 'Soaked Almonds + Warm Water', 'Chia Seeds Water', 'Methi Soaked Water'],
        },
        High: {
            veg: ['Warm Lemon Water', 'Apple Cider Vinegar + Honey', 'Soaked Almonds + Walnuts', 'Green Tea + Lemon', 'Chia Seeds + Flax Water', 'Turmeric Latte (warm)', 'Amla Juice'],
            nonVeg: ['Warm Lemon Water', 'Apple Cider Vinegar + Honey', 'Soaked Almonds + Walnuts', 'Green Tea + Lemon', 'Chia Seeds + Flax Water', 'Turmeric Latte (warm)', 'Amla Juice'],
        },
    },
    breakfast: {
        Low: {
            veg: ['Oats + Banana', 'Poha + Peanuts', 'Upma + Curd', 'Bread + Peanut Butter', 'Ragi Dosa', 'Idli + Chutney', 'Rice Flakes + Milk'],
            nonVeg: ['Eggs (3) + Toast', 'Oats + Boiled Eggs', 'Egg Bhurji + Bread', 'Poha + Boiled Eggs', 'Idli + Egg Curry'],
        },
        Medium: {
            veg: ['Oats + Banana + Milk', 'Paneer Paratha + Curd', 'Poha + Sprouts', 'Dosa + Paneer', 'Muesli + Yogurt + Fruits', 'Upma + Vegetable Curry', 'Besan Chilla + Chutney'],
            nonVeg: ['Eggs (4) + Toast + Banana', 'Omelette + Oats', 'Egg Paratha + Curd', 'Chicken Sandwich + Banana', 'Boiled Eggs + Muesli'],
        },
        High: {
            veg: ['Smoothie Bowl + Granola + Nuts', 'Avocado Toast + Greek Yogurt', 'Paneer Bhurji + Multigrain Toast', 'Muesli + Protein Shake', 'Quinoa Bowl + Fruits'],
            nonVeg: ['Egg White Omelette + Avocado Toast', 'Chicken Sausage + Eggs + Toast', 'Protein Pancakes + Banana', 'Smoked Salmon + Eggs', 'Chicken Keema + Paratha'],
        },
    },
    lunch: {
        Low: {
            veg: ['Rice + Dal + Vegetable', 'Rice + Rajma', 'Roti + Chole', 'Rice + Sambar', 'Khichdi + Curd', 'Roti + Aloo Curry + Dal'],
            nonVeg: ['Rice + Egg Curry', 'Rice + Chicken Curry', 'Roti + Dal + Egg', 'Rice + Fish Curry', 'Chicken Biryani (simple)'],
        },
        Medium: {
            veg: ['Rice + Paneer Curry + Salad', 'Roti + Dal + Sabzi + Raita', 'Rajma Rice + Salad', 'Chole Rice + Curd', 'Rice + Mixed Veg + Dal'],
            nonVeg: ['Rice + Chicken Curry + Salad', 'Roti + Egg Curry + Dal', 'Chicken Rice Bowl + Raita', 'Fish Curry + Rice + Vegetables', 'Egg Fried Rice + Salad'],
        },
        High: {
            veg: ['Brown Rice + Paneer + Grilled Veggies', 'Quinoa Bowl + Tofu + Avocado', 'Multigrain Roti + Palak Paneer + Salad', 'Buddha Bowl + Hummus', 'Protein-Rich Thali'],
            nonVeg: ['Grilled Chicken + Brown Rice + Salad', 'Chicken Breast + Quinoa + Veggies', 'Salmon + Rice + Greens', 'Turkey Wrap + Greek Yogurt', 'Lean Meat Thali'],
        },
    },
    snack: {
        Low: {
            veg: ['Roasted Peanuts', 'Banana', 'Roasted Chana', 'Buttermilk', 'Sprouts', 'Popcorn (plain)', 'Curd'],
            nonVeg: ['Boiled Eggs (2)', 'Peanuts + Banana', 'Egg Whites (4)'],
        },
        Medium: {
            veg: ['Peanut Butter Toast', 'Fruit Bowl + Yogurt', 'Sprouts Salad', 'Trail Mix', 'Paneer Cubes', 'Makhana', 'Protein Shake (plant)'],
            nonVeg: ['Boiled Eggs (3)', 'Chicken Sandwich', 'Protein Shake + Banana', 'Egg Salad', 'Tuna Sandwich'],
        },
        High: {
            veg: ['Protein Bar', 'Greek Yogurt + Berries + Granola', 'Almond Butter + Apple', 'Smoothie + Protein Powder', 'Avocado + Nuts'],
            nonVeg: ['Protein Shake + Peanut Butter', 'Chicken Wrap', 'Boiled Eggs + Avocado', 'Protein Bar + Banana', 'Greek Yogurt + Nuts'],
        },
    },
    dinner: {
        Low: {
            veg: ['Roti + Dal + Sabzi', 'Rice + Sambhar', 'Khichdi + Curd', 'Roti + Aloo Curry', 'Dosa + Chutney', 'Upma + Vegetable'],
            nonVeg: ['Roti + Egg Curry', 'Rice + Dal + Egg', 'Chicken Curry + Roti', 'Egg Bhurji + Roti', 'Fish Curry + Rice'],
        },
        Medium: {
            veg: ['Paneer Curry + Roti + Salad', 'Dal + Rice + Raita', 'Vegetable Pulao + Raita', 'Chole + Roti + Salad', 'Palak Paneer + Roti'],
            nonVeg: ['Grilled Chicken + Roti + Salad', 'Egg Curry + Rice + Vegetables', 'Chicken Tikka + Roti', 'Fish + Roti + Salad', 'Chicken Soup + Bread'],
        },
        High: {
            veg: ['Grilled Paneer + Multigrain Roti + Soup', 'Tofu Stir Fry + Brown Rice', 'Protein-Rich Salad Bowl', 'Quinoa + Grilled Vegetables', 'Mushroom + Paneer Wrap'],
            nonVeg: ['Grilled Chicken Breast + Veggies + Soup', 'Salmon + Sweet Potato + Greens', 'Lean Chicken + Brown Rice + Salad', 'Baked Fish + Roasted Veggies', 'Chicken Steak + Mashed Potatoes'],
        },
    },
}

// --- Food Alternatives ---
export const FOOD_ALTERNATIVES: Record<string, { alternatives: string[]; reason: string }> = {
    'Chicken': { alternatives: ['Eggs (4)', 'Paneer 100g', 'Soya Chunks', 'Tofu', 'Fish'], reason: 'Similar protein content' },
    'Eggs': { alternatives: ['Paneer 80g', 'Soya Chunks', 'Tofu', 'Cottage Cheese'], reason: 'Similar protein content' },
    'Paneer': { alternatives: ['Tofu', 'Cottage Cheese', 'Soya Chunks', 'Greek Yogurt'], reason: 'Similar protein content' },
    'Oats': { alternatives: ['Ragi', 'Whole Wheat Bread', 'Muesli', 'Poha', 'Daliya'], reason: 'Similar carb/fiber content' },
    'Rice': { alternatives: ['Brown Rice', 'Quinoa', 'Millets', 'Roti', 'Sweet Potato'], reason: 'Similar carb content' },
    'Banana': { alternatives: ['Apple', 'Papaya', 'Mango', 'Sweet Potato'], reason: 'Similar carbs and energy' },
    'Milk': { alternatives: ['Soy Milk', 'Almond Milk', 'Curd', 'Buttermilk'], reason: 'Similar calcium/protein' },
    'Peanut Butter': { alternatives: ['Almond Butter', 'Roasted Peanuts', 'Seeds Mix'], reason: 'Similar healthy fats' },
    'Dal': { alternatives: ['Rajma', 'Chole', 'Sprouts', 'Soya Chunks'], reason: 'Similar protein content' },
    'Fish': { alternatives: ['Chicken', 'Eggs (4)', 'Paneer', 'Tofu'], reason: 'Similar protein content' },
    'Roti': { alternatives: ['Rice', 'Multigrain Bread', 'Quinoa', 'Millets'], reason: 'Similar carb content' },
    'Curd': { alternatives: ['Greek Yogurt', 'Buttermilk', 'Raita', 'Lassi'], reason: 'Similar probiotics' },
    'Avocado': { alternatives: ['Peanut Butter', 'Nuts Mix', 'Seeds Mix'], reason: 'Similar healthy fats' },
}

// --- Food Details (calories, protein, instructions) ---
export interface FoodDetail {
    calories: number
    protein: number
    carbs: number
    fat: number
    prepTime: string
    instructions: string[]
}

export const FOOD_DETAILS: Record<string, FoodDetail> = {
    'Warm Lemon Water': { calories: 5, protein: 0, carbs: 1, fat: 0, prepTime: '2 min', instructions: ['Warm a glass of water', 'Squeeze half a lemon', 'Drink on empty stomach'] },
    'Jeera Water': { calories: 7, protein: 0, carbs: 1, fat: 0, prepTime: '5 min', instructions: ['Soak 1 tsp jeera in water overnight', 'Or boil in water for 5 min', 'Strain and drink warm'] },
    'Ginger Water': { calories: 5, protein: 0, carbs: 1, fat: 0, prepTime: '5 min', instructions: ['Grate 1 inch ginger', 'Boil in water for 5 min', 'Strain and drink warm'] },
    'Soaked Almonds + Warm Water': { calories: 70, protein: 3, carbs: 2, fat: 6, prepTime: '1 min (soak overnight)', instructions: ['Soak 5-7 almonds overnight', 'Peel skin in morning', 'Eat with warm water'] },
    'Oats + Banana': { calories: 350, protein: 12, carbs: 60, fat: 6, prepTime: '5 min', instructions: ['Cook 1 cup oats with water/milk', 'Slice 1 banana on top', 'Add honey if desired'] },
    'Eggs (3) + Toast': { calories: 380, protein: 24, carbs: 30, fat: 18, prepTime: '10 min', instructions: ['Boil or scramble 3 eggs', 'Toast 2 slices of bread', 'Season with salt and pepper'] },
    'Eggs (4) + Toast + Banana': { calories: 480, protein: 32, carbs: 45, fat: 22, prepTime: '10 min', instructions: ['Prepare 4 eggs as desired', 'Toast bread', 'Have banana on side'] },
    'Rice + Chicken Curry': { calories: 550, protein: 35, carbs: 65, fat: 14, prepTime: '30 min', instructions: ['Cook 1 cup rice', 'Prepare chicken curry with spices', 'Serve with salad'] },
    'Rice + Dal + Vegetable': { calories: 450, protein: 15, carbs: 75, fat: 8, prepTime: '25 min', instructions: ['Cook rice and dal separately', 'Prepare a simple vegetable', 'Serve together with pickle'] },
    'Grilled Chicken + Brown Rice + Salad': { calories: 520, protein: 42, carbs: 55, fat: 12, prepTime: '25 min', instructions: ['Season chicken breast with spices', 'Grill or pan-fry', 'Serve with brown rice and fresh salad'] },
    'Boiled Eggs (2)': { calories: 140, protein: 12, carbs: 1, fat: 10, prepTime: '10 min', instructions: ['Boil 2 eggs for 8-10 minutes', 'Cool and peel', 'Season with salt and pepper'] },
    'Roasted Peanuts': { calories: 170, protein: 7, carbs: 6, fat: 14, prepTime: '0 min', instructions: ['Grab a handful (~30g)', 'Best unsalted for health'] },
    'Roti + Dal + Sabzi': { calories: 400, protein: 14, carbs: 60, fat: 10, prepTime: '25 min', instructions: ['Make 2-3 rotis', 'Prepare dal with turmeric and spices', 'Cook a seasonal vegetable'] },
    'Paneer Curry + Roti + Salad': { calories: 500, protein: 22, carbs: 50, fat: 22, prepTime: '25 min', instructions: ['Cube paneer and cook in gravy', 'Make 2-3 rotis', 'Serve with cucumber-tomato salad'] },
    'Protein Shake + Banana': { calories: 300, protein: 30, carbs: 35, fat: 5, prepTime: '3 min', instructions: ['Blend 1 scoop whey with milk/water', 'Add banana', 'Blend until smooth'] },
    'Peanut Butter Toast': { calories: 250, protein: 8, carbs: 28, fat: 14, prepTime: '3 min', instructions: ['Toast 2 slices of bread', 'Spread peanut butter evenly', 'Optional: add banana slices'] },
}

// --- Core Functions ---

export function analyzeBody(data: UserData): BodyAnalysis {
    const heightInMeters = data.height / 100
    const bmi = data.weight / (heightInMeters * heightInMeters)

    let bodyType: BodyAnalysis['bodyType']
    let goal: BodyAnalysis['goal']

    if (bmi < 18.5) {
        bodyType = 'Skinny'
        goal = 'Muscle Gain'
    } else if (bmi < 25) {
        bodyType = 'Athletic / Normal'
        goal = 'Maintenance'
    } else if (bmi < 30) {
        bodyType = 'Fat'
        goal = 'Fat Loss'
    } else {
        bodyType = 'Obese'
        goal = 'Fat Loss'
    }

    return { bmi, bodyType, goal }
}

export function calculateTargets(data: UserData, goal: BodyAnalysis['goal']) {
    const bmr = 10 * data.weight + 6.25 * data.height - 5 * data.age + 5
    let calories = bmr
    let proteinFactor = 1.2

    if (goal === 'Muscle Gain') {
        calories = bmr + 400
        proteinFactor = 1.8
    } else if (goal === 'Fat Loss') {
        calories = bmr - 400
        proteinFactor = 1.5
    }

    const protein = data.weight * proteinFactor
    return { calories, protein }
}

export function generateWeeklyDiet(
    userData: UserData,
    goal: BodyAnalysis['goal'],
    weekNumber: number
): DietPlan {
    const { calories, protein } = calculateTargets(userData, goal)

    const weeklyPlan = []
    const isNonVeg = userData.dietType === 'Non-Veg'
    const budget: BudgetTier = userData.budget || 'Medium'

    for (let day = 1; day <= 7; day++) {
        const seed = weekNumber * 7 + day

        const getOption = (mealType: string) => {
            const pool = FOOD_DATABASE[mealType]?.[budget]
            if (!pool) return ''
            const combined = isNonVeg ? [...pool.veg, ...pool.nonVeg] : pool.veg
            return combined[seed % combined.length]
        }

        weeklyPlan.push({
            day,
            emptyStomach: getOption('emptyStomach'),
            breakfast: getOption('breakfast'),
            lunch: getOption('lunch'),
            snack: getOption('snack'),
            dinner: getOption('dinner'),
        })
    }

    return { calories, protein, weeklyPlan }
}
