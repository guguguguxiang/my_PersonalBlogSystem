const jwt = require('jsonwebtoken');

function authMiddleware(req, res, next) {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      const error = new Error('未授权，请先登录');
      error.status = 401;
      error.code = 4010;
      throw error;
    }

    const token = authHeader.split(' ')[1];
    if (!token) {
      const error = new Error('Token 无效');
      error.status = 401;
      error.code = 4010;
      throw error;
    }

    // 校验 JWT 并将用户身份挂载到请求对象，供后续受保护接口使用
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;

    return next();
  } catch (err) {
    const error = new Error('登录状态已失效，请重新登录');
    error.status = 401;
    error.code = 4010;
    return next(error);
  }
}

module.exports = authMiddleware;
