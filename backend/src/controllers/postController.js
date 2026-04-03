const postModel = require('../models/postModel');

async function create(req, res, next) {
  try {
    const { title, content, category_id, tags, cover, status } = req.body;

    if (!title || !content || !category_id) {
      return res.status(400).json({
        code: 4005,
        message: '标题、内容和分类为必填项',
        data: null,
      });
    }

    const postId = await postModel.createPost({
      title,
      content,
      category_id,
      tags,
      cover,
      author_id: req.user.id,
      status,
    });

    return res.status(201).json({
      code: 0,
      message: 'success',
      data: { id: postId },
    });
  } catch (error) {
    return next(error);
  }
}

async function getList(req, res, next) {
  try {
    const page = Number.parseInt(req.query.page, 10);
    const pageSize = Number.parseInt(req.query.pageSize, 10);
    const categoryId = Number.parseInt(req.query.categoryId, 10);
    const keyword = typeof req.query.keyword === 'string' ? req.query.keyword.trim() : '';

    const result = await postModel.getPosts({
      page: Number.isInteger(page) && page > 0 ? page : 1,
      pageSize: Number.isInteger(pageSize) && pageSize > 0 ? pageSize : 10,
      categoryId: Number.isInteger(categoryId) && categoryId > 0 ? categoryId : undefined,
      keyword,
    });

    return res.json({
      code: 0,
      message: 'success',
      data: result,
    });
  } catch (error) {
    return next(error);
  }
}

async function getDetail(req, res, next) {
  try {
    const id = Number(req.params.id);
    const post = await postModel.getPostById(id);

    if (!post) {
      return res.status(404).json({
        code: 4041,
        message: '文章不存在',
        data: null,
      });
    }

    postModel.incrementViews(id).catch(() => {});

    return res.json({
      code: 0,
      message: 'success',
      data: post,
    });
  } catch (error) {
    return next(error);
  }
}

async function update(req, res, next) {
  try {
    const id = Number(req.params.id);
    const { title, content, category_id, tags, cover, status } = req.body;

    const existedPost = await postModel.getPostById(id);
    if (!existedPost) {
      return res.status(404).json({
        code: 4041,
        message: '文章不存在',
        data: null,
      });
    }

    if (Number(existedPost.author_id) !== Number(req.user.id)) {
      return res.status(403).json({
        code: 4031,
        message: '无权限操作该文章',
        data: null,
      });
    }

    const affectedRows = await postModel.updatePost({
      id,
      author_id: req.user.id,
      title,
      content,
      category_id,
      tags,
      cover,
      status,
    });

    if (!affectedRows) {
      return res.status(400).json({
        code: 4006,
        message: '更新失败',
        data: null,
      });
    }

    return res.json({
      code: 0,
      message: 'success',
      data: { id },
    });
  } catch (error) {
    return next(error);
  }
}

async function remove(req, res, next) {
  try {
    const id = Number(req.params.id);

    const existedPost = await postModel.getPostById(id);
    if (!existedPost) {
      return res.status(404).json({
        code: 4041,
        message: '文章不存在',
        data: null,
      });
    }

    if (Number(existedPost.author_id) !== Number(req.user.id)) {
      return res.status(403).json({
        code: 4031,
        message: '无权限操作该文章',
        data: null,
      });
    }

    const affectedRows = await postModel.deletePost({
      id,
      author_id: req.user.id,
    });

    if (!affectedRows) {
      return res.status(400).json({
        code: 4007,
        message: '删除失败',
        data: null,
      });
    }

    return res.json({
      code: 0,
      message: 'success',
      data: { id },
    });
  } catch (error) {
    return next(error);
  }
}

module.exports = {
  create,
  getList,
  getDetail,
  update,
  delete: remove,
};
