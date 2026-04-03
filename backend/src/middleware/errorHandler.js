function errorHandler(err, req, res, next) {
  const status = err.status || 500;
  const code = err.code && err.code !== 0 ? err.code : 5000;

  res.status(status).json({
    code,
    message: err.message || 'server error',
    data: null,
  });
}

module.exports = errorHandler;
