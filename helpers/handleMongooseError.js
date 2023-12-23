const handleMongooseError = async (error, __, next) => {
  const { name, code } = error;
  const status = name === "MongoServerError" && code === 11000 ? 409 : 400;
  error.status = status;

  if (error.status === 409) {
    error.message = "Email in use";
  }

  next();
};

module.exports = {
  handleMongooseError,
};
