// creates instance matching Stats dailySchema requirments. Function recieve params incoming from request.body and request.user
// properties and returns an object that can be pushed into [instance].dates array and assigned ad [date].stats property (stats collection)
const generateDailyConsumptionEntry = (params) => {
  const {
    waterIntake = 0,
    foodIntake: { carbohidrates = 0, protein = 0, fat = 0 } = {},
    calories = 0,
    weight = 0,
    date,
  } = params;

  return {
    date,
    stats: {
      waterIntake,
      foodIntake: {
        carbohidrates,
        protein,
        fat,
      },
      calories,
      weight,
    },
  };
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
    generateDailyConsumptionEntry, createNewStatsEntry
}