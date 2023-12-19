const calories = (gender, age, height, weight, activity) => {
  return gender === "Male"
    ? Math.round(
        (88.362 + 13.397 * weight + 4.799 * height - 5.677 * age) * activity
      )
    : Math.round(
        (447.593 + 9.247 * weight + 3.098 * height - 4.33 * age) * activity
      );
};

const drink = (weight, activity) => {
  const basicWater = weight * 0.03;
  let water;

  switch (activity) {
    case 1.375:
      water = (basicWater + 0.35) * 1000;
      break;
    case 1.55:
      water = (basicWater + 0.35) * 1000;
      break;
    case 1.725:
      water = (basicWater + 0.35) * 1000;
      break;
    case 1.9:
      water = (basicWater + 0.7) * 1000;
      break;
    default:
      water = basicWater * 1000;
  }

  return water;
};

const elements = (goal, bmr) => {
  const nutrients = {
    protein: 0,
    fat: 0,
    carbonohidrates: 0,
  };

  switch (goal) {
    case "Lose fat":
      nutrients.protein = Math.round(bmr * 0.25);
      nutrients.fat = Math.round(bmr * 0.2);
      nutrients.carbonohidrates = Math.round(bmr * 0.55);
      break;
    case "Gain muscle":
      nutrients.protein = Math.round(bmr * 0.3);
      nutrients.fat = Math.round(bmr * 0.2);
      nutrients.carbonohidrates = Math.round(bmr * 0.5);
      break;
    case "Maintain":
      nutrients.protein = Math.round(bmr * 0.2);
      nutrients.fat = Math.round(bmr * 0.25);
      nutrients.carbonohidrates = Math.round(bmr * 0.55);
  }
  console.log(nutrients.carbonohidrates);
  return nutrients;
};

module.exports = { calories, drink, elements };
