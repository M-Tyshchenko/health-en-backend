const ctrlWrapper = (ctrlFunc) => {
  const exec = async (req, res, next) => {
    try {
      await ctrlFunc(req, res, next);
    } catch (error) {
      next(error);
    }
  };
  return exec;
};

module.exports = {ctrlWrapper};