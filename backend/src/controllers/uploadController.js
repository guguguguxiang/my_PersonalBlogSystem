async function uploadImage(req, res, next) {
  try {
    if (!req.file) {
      return res.status(400).json({
        code: 4009,
        message: '请先选择要上传的图片',
        data: null,
      });
    }

    const fileUrl = `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`;

    return res.json({
      code: 0,
      message: 'success',
      data: {
        url: fileUrl,
      },
    });
  } catch (error) {
    return next(error);
  }
}

module.exports = {
  uploadImage,
};
