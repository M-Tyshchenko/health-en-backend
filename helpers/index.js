const { handleMongooseError } = require("../helpers/handleMongooseError");
const { ctrlWrapper } = require("../helpers/ctrlWrapper");
const { HTTPError } = require("../helpers/HTTPError");
const { calories, drink, elements } = require("../helpers/calculations");
const {
  generateDailyConsumptionEntry,
  createNewStatsEntry, generateMealEntry,
} = require("../helpers/statsEntryCreator");

const {compileFoodIntakeSuccesResponse} = require("../helpers/responseComplier")
const {
  createFormattedDateString,
  parseAndTransformDate,
} = require("../helpers/dateFormatter");

const {createFirstFoodUpdateQuery, createFoodIntakeQuery, createFoodIntakeSecondUpdateQuery} = require("../helpers/queryGenetator")
module.exports = {
  handleMongooseError,
  ctrlWrapper,
  HTTPError,
  calories,
  drink,
  elements,
  generateDailyConsumptionEntry,
  createNewStatsEntry,
  createFormattedDateString,
  parseAndTransformDate, generateMealEntry,
  compileFoodIntakeSuccesResponse, createFirstFoodUpdateQuery, createFoodIntakeQuery, createFoodIntakeSecondUpdateQuery
};
