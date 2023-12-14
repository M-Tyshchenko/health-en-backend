const bmr = (gender, age, height, weight, activity) => {
  return gender === "Male"
    ? (88.362 + 13.397 * weight + 4.799 * height - 5.677 * age) * activity
    : (447.593 + 9.247 * weight + 3.098 * height - 4.33 * age) * activity;
};

const water = (weight, activity) => {
  const basicWater = weight * 0.03;
  let water;

  switch (activity) {
    case 1.375:
      water = basicWater + 0.35;
      break;
    case 1.55:
      water = basicWater + 0.35;
      break;
    case 1.725:
      water = basicWater + 0.35;
      break;
    case 1.9:
      water = basicWater + 0.7;
      break;
    default:
      water = basicWater;
  }

  return water;
};

const nutrients = (goal, bmr) => {
  const nutrients = {
    protein: 0,
    fat: 0,
    carbonohidrates: 0,
  };

  switch (goal) {
    case "Loose fat":
      nutrients.protein = bmr * 0.25;
      nutrients.fat = bmr * 0.2;
      nutrients.carbonohidrates = bmr * 0.55;
      break;
    case "Gain muscle":
      nutrients.protein = bmr * 0.3;
      nutrients.fat = bmr * 0.2;
      nutrients.carbonohidrates = bmr * 0.5;
      break;
    case "Maintain":
      nutrients.protein = bmr * 0.2;
      nutrients.fat = bmr * 0.25;
      nutrients.carbonohidrates = bmr * 0.55;
  }

  return nutrients;
};

module.exports = { bmr, water, nutrients };
