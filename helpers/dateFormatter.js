const createFormattedDateString = (ISODate) => {
  const date = ISODate ? new Date(ISODate) : new Date();
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;

}
const parseAndTransformDate = (date, parser) => {
  const parsedDate = Date.parse(date);
  const newDate = new Date(parsedDate)
  return parser(newDate);

} 

module.exports = {
createFormattedDateString, parseAndTransformDate,
}