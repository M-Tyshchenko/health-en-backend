// creates query for model findOneAndUpdate mehod. Use this function to generate query for updateFoodIntakeInfo
// or resetFoodIntakeStats to manage decreasing total calories, total carbohidrates, total protein and total fat
// by a value of deleted (changed) product
const createFirstFoodUpdateQuery = (modelObj) => {
  const {
    calories: prevCaloriesValue,
    carbohidrates: prevCarbohidratesValue,
    protein: prevProteinValue,
    fat: prevFatValue,
  } = modelObj;
  return {
    $inc: {
      [`dates.$[dateElement].stats.totalCalories`]: -prevCaloriesValue,
      [`dates.$[dateElement].stats.totalCarbohidrates`]:
        -prevCarbohidratesValue,
      [`dates.$[dateElement].stats.totalProtein`]: -prevProteinValue,
      [`dates.$[dateElement].stats.totalFat`]: -prevFatValue,
    },
  };
};
const createDeleteFoodArrayQuery = (totalValues, type) => {
   const {
    calories: prevCaloriesValue,
    carbohidrates: prevCarbohidratesValue,
    protein: prevProteinValue,
    fat: prevFatValue,
  } = totalValues;
  return {
    $inc: {
      [`dates.$.stats.totalCalories`]: -prevCaloriesValue,
      [`dates.$.stats.totalCarbohidrates`]:
        -prevCarbohidratesValue,
      [`dates.$.stats.totalProtein`]: -prevProteinValue,
      [`dates.$.stats.totalFat`]: -prevFatValue,
    },
    [`dates.$.stats.foodIntake.${type}`]: []
  }
}

// creates query finding desired mealIntake
const createFoodIntakeQuery = ({
  type,
  mealEntry,
  calories,
  carbohidrates,
  protein,
  fat,
}) => {
  const query = {
    $push: { [`dates.$.stats.foodIntake.${type}`]: mealEntry },
    $inc: {
      "dates.$.stats.totalCalories": calories,
      "dates.$.stats.totalCarbohidrates": carbohidrates,
      "dates.$.stats.totalProtein": protein,
      "dates.$.stats.totalFat": fat,
    },
  };

  return query;
};

const createFoodIntakeSecondUpdateQuery = (params) => {
  const { type, carbohidrates, protein, dish, fat, calories } = params;

  return {
    $set: {
      [`dates.$[dateElement].stats.foodIntake.${type}.$[foodIntakeElement].carbohidrates`]:
        carbohidrates,
      [`dates.$[dateElement].stats.foodIntake.${type}.$[foodIntakeElement].protein`]:
        protein,
      [`dates.$[dateElement].stats.foodIntake.${type}.$[foodIntakeElement].fat`]:
        fat,
      [`dates.$[dateElement].stats.foodIntake.${type}.$[foodIntakeElement].dish`]:
        dish,
      [`dates.$[dateElement].stats.foodIntake.${type}.$[foodIntakeElement].calories`]:
        calories,
    },

    $inc: {
      [`dates.$[dateElement].stats.totalCalories`]: calories,
      [`dates.$[dateElement].stats.totalCarbohidrates`]: carbohidrates,
      [`dates.$[dateElement].stats.totalProtein`]: protein,
      [`dates.$[dateElement].stats.totalFat`]: fat,
    },
  };
};

const createFoodIntakeQueryIfNotPresent = (params) => {
  const { type, calories, carbohidrates, protein, fat, mealEntry } = params;

  return {
    [`dates.$.stats.foodIntake.${type}`]: mealEntry,
    $inc: {
      "dates.$.stats.totalCalories": calories,
      "dates.$.stats.totalCarbohidrates": carbohidrates,
      "dates.$.stats.totalProtein": protein,
      "dates.$.stats.totalFat": fat,
    },
  };
};

module.exports = {
  createFirstFoodUpdateQuery,
  createFoodIntakeQuery,
  createFoodIntakeSecondUpdateQuery,
  createFoodIntakeQueryIfNotPresent,
  createDeleteFoodArrayQuery
};
