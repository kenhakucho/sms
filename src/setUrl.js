
module.exports = function(req, res, next) {
  res.locals.query = req.query;
  res.locals.url   = req.originalUrl;
  next();
};

