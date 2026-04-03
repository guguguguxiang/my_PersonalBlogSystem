const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const userModel = require('../models/userModel');

const USERNAME_REGEX = /^[a-zA-Z0-9_]{3,20}$/;
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

async function register(req, res, next) {
  try {
    const { username, email, password } = req.body;

    if (!username || !USERNAME_REGEX.test(username)) {
      return res.status(400).json({
        code: 4001,
        message: '用户名需为3-20位，仅支持字母、数字和下划线',
        data: null,
      });
    }

    if (!email || !EMAIL_REGEX.test(email)) {
      return res.status(400).json({
        code: 4002,
        message: '邮箱格式不正确',
        data: null,
      });
    }

    if (!password || password.length < 6) {
      return res.status(400).json({
        code: 4003,
        message: '密码长度不能少于6位',
        data: null,
      });
    }

    const existedByUsername = await userModel.findByUsername(username);
    if (existedByUsername) {
      return res.status(409).json({
        code: 4091,
        message: '用户名已存在',
        data: null,
      });
    }

    const existedByEmail = await userModel.findByEmail(email);
    if (existedByEmail) {
      return res.status(409).json({
        code: 4092,
        message: '邮箱已存在',
        data: null,
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const userId = await userModel.createUser({
      username,
      email,
      password: hashedPassword,
    });

    return res.status(201).json({
      code: 0,
      message: 'success',
      data: {
        id: userId,
        username,
        email,
      },
    });
  } catch (error) {
    return next(error);
  }
}

async function login(req, res, next) {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({
        code: 4004,
        message: '用户名和密码不能为空',
        data: null,
      });
    }

    const user = await userModel.findByUsername(username);
    if (!user) {
      return res.status(401).json({
        code: 4011,
        message: '用户名或密码错误',
        data: null,
      });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({
        code: 4012,
        message: '用户名或密码错误',
        data: null,
      });
    }

    // JWT 载荷仅放必要身份信息，便于后续鉴权中间件解析
    const token = jwt.sign(
      { id: user.id, username: user.username },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    return res.json({
      code: 0,
      message: 'success',
      data: {
        token,
        user: {
          id: user.id,
          username: user.username,
          email: user.email,
          avatar: user.avatar,
        },
      },
    });
  } catch (error) {
    return next(error);
  }
}

module.exports = {
  register,
  login,
};
