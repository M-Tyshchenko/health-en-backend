const compileFoodIntakeSuccesResponse = (
  result,
  responseType,
  transfomedResult = null
) => {
    console.log(responseType)
  if (!result || !result.dates) {
    throw new Error("invalid result type");
  }
 
  if (responseType !== "create" && responseType !== "update") {
    throw new Error('invalid response type. Available types" create, update');
  }
     
  const message =
    responseType === "create"
      ? "Food intake successfuly added"
      : "Update successful";

  return {
    message,
    foodIntake:
      responseType === "create"
        ? result.dates[result.dates.length - 1].stats.foodIntake
        : transfomedResult[0],
    totalCalories: result.dates[result.dates.length - 1].stats.totalCalories,
    totalCarbohidrates: result.dates[result.dates.length - 1].stats.totalCarbohidrates,
    totalProtein: result.dates[result.dates.length - 1].stats.totalProtein,
    totalFat: result.dates[result.dates.length - 1].stats.totalFat,
  };
};

module.exports = {
  compileFoodIntakeSuccesResponse,
};
