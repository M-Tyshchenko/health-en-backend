const { isValidObjectId } = require("mongoose");

const isValidId = (req, res, next) => {
  const { id } = req.params;
  if (!isValidObjectId(id)) {
    return res.status(404).json({ message: "id in request params is not valid" });
  }
  next();
};

module.exports = isValidId;
