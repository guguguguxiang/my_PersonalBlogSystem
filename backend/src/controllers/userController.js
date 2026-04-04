const userModel = require('../models/userModel');

const USERNAME_REGEX = /^[a-zA-Z0-9_]{3,20}$/;

async function updateProfile(req, res, next) {
  try {
    const { username, avatar } = req.body;

    if (!username || !USERNAME_REGEX.test(username)) {
      return res.status(400).json({
        code: 4013,
        message: '用户名需为3-20位，仅支持字母、数字和下划线',
        data: null,
      });
    }

    const existedByUsername = await userModel.findByUsername(username);
    if (existedByUsername && Number(existedByUsername.id) !== Number(req.user.id)) {
      return res.status(409).json({
        code: 4091,
        message: '用户名已存在',
        data: null,
      });
    }

    await userModel.updateUserProfile({
      id: req.user.id,
      username,
      avatar: typeof avatar === 'string' && avatar.trim() ? avatar.trim() : null,
    });

    const user = await userModel.findById(req.user.id);

    return res.json({
      code: 0,
      message: 'success',
      data: {
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
  updateProfile,
};
