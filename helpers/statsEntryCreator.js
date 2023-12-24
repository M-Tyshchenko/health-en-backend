// generate mealEntry object for 1 separate food intake
const generateMealEntry = ({ carbohidrates, protein, fat, dish, calories }) => {
  const x = { carbohidrates, protein, fat, dish, calories };

  return x;
};


// creates instance matching Stats dailySchema requirments. Function recieve params incoming from request.body and request.user
// properties and returns an object that can be pushed into [instance].dates array and assigned ad [date].stats property (stats collection)
const generateDailyConsumptionEntry = (params, mealUnitGenerator) => {
  const {
    waterIntake = 0,
    carbohidrates = 0,
    protein = 0,
    fat = 0,
    dish = null,
    type = "breakfast",
    calories = 0,
    weight = 0,
    date,
    totalCalories = calories || 0,
    totalCarbohidrates = carbohidrates || 0,
    totalProtein = protein || 0,
    totalFat = fat || 0,
  } = params;

  const mealObject = mealUnitGenerator({
    carbohidrates,
    protein,
    fat,
    dish,
    calories,
  });

  const x = {
    date,
    stats: {
      waterIntake,
      foodIntake: {
        [type]: [mealObject],
      },
      totalCalories,
      totalCarbohidrates,
      totalProtein,
      totalFat,
      weight,
    },
  };

  return x;
};

// creates instance matching statsSchema requirments. Should be used whether instance with corresponding owner propery
// has not already present in stats collection, to create new one. Don't use this function in opposite case,
// otherwise it may result object duplicate in database
const createNewStatsEntry = (dailyEntry, owner) => {
  return {
    dates: [dailyEntry],
    owner,
  };
};

module.exports = {
  generateDailyConsumptionEntry,
  createNewStatsEntry,
  generateMealEntry,

};
