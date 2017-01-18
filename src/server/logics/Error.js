const logError = (err, req, res, next) => {
  console.error(err.stack);
  next(err);
};
const clientErrorHandler = (err, req, res, next) => {
  if (req.xhr) {
    res.status(500).json({error: err});
  } else {
    next(err);
  }
};
const errorHandler = (err, req, res, next) => {
  res.status(501);
  res.render('error', {error: err});
};
module.exports = {logError, clientErrorHandler, errorHandler};