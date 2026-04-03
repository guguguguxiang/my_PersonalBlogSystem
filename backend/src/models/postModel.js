const db = require('../config/db');

async function createPost({ title, content, category_id, tags, cover, author_id, status = 'published' }) {
  const sql = `
    INSERT INTO posts (title, content, category_id, tags, cover, author_id, status)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `;
  const tagsValue = Array.isArray(tags) ? JSON.stringify(tags) : tags || null;
  const [result] = await db.execute(sql, [title, content, category_id, tagsValue, cover || null, author_id, status]);
  return result.insertId;
}

async function getPosts({ page = 1, pageSize = 10, categoryId, keyword }) {
  const currentPage = Number.isInteger(page) && page > 0 ? page : 1;
  const size = Number.isInteger(pageSize) && pageSize > 0 ? pageSize : 10;
  const offset = (currentPage - 1) * size;

  const conditions = [];
  const filterParams = [];

  if (Number.isInteger(categoryId) && categoryId > 0) {
    conditions.push('p.category_id = ?');
    filterParams.push(categoryId);
  }

  if (typeof keyword === 'string' && keyword.trim()) {
    conditions.push('(p.title LIKE ? OR p.content LIKE ?)');
    const fuzzy = `%${keyword.trim()}%`;
    filterParams.push(fuzzy, fuzzy);
  }

  conditions.push("p.status = 'published'");

  const whereClause = conditions.length ? `WHERE ${conditions.join(' AND ')}` : '';

  const listSql = `
    SELECT
      p.id,
      p.title,
      p.cover,
      p.tags,
      p.views,
      p.status,
      p.created_at,
      p.updated_at,
      u.id AS author_id,
      u.username AS author_name,
      c.id AS category_id,
      c.name AS category_name
    FROM posts p
    INNER JOIN users u ON p.author_id = u.id
    INNER JOIN categories c ON p.category_id = c.id
    ${whereClause}
    ORDER BY p.created_at DESC
    LIMIT ?, ?
  `;

  const countSql = `
    SELECT COUNT(*) AS total
    FROM posts p
    INNER JOIN users u ON p.author_id = u.id
    INNER JOIN categories c ON p.category_id = c.id
    ${whereClause}
  `;

  const listParams = [...filterParams, offset, size];
  const countParams = [...filterParams];

  const [rows] = await db.query(listSql, listParams);
  const [countRows] = await db.execute(countSql, countParams);

  return {
    list: rows,
    total: countRows[0]?.total || 0,
    page: currentPage,
    pageSize: size,
  };
}

async function getPostById(id) {
  const sql = `
    SELECT
      p.id,
      p.title,
      p.content,
      p.cover,
      p.tags,
      p.views,
      p.status,
      p.created_at,
      p.updated_at,
      p.author_id,
      u.username AS author_name,
      p.category_id,
      c.name AS category_name
    FROM posts p
    INNER JOIN users u ON p.author_id = u.id
    INNER JOIN categories c ON p.category_id = c.id
    WHERE p.id = ?
    LIMIT 1
  `;

  const [rows] = await db.execute(sql, [id]);
  return rows[0] || null;
}

async function incrementViews(id) {
  const sql = 'UPDATE posts SET views = views + 1 WHERE id = ?';
  await db.execute(sql, [id]);
}

async function updatePost({ id, author_id, title, content, category_id, tags, cover, status }) {
  const sql = `
    UPDATE posts
    SET title = ?, content = ?, category_id = ?, tags = ?, cover = ?, status = ?, updated_at = CURRENT_TIMESTAMP
    WHERE id = ? AND author_id = ?
  `;
  const tagsValue = Array.isArray(tags) ? JSON.stringify(tags) : tags || null;
  const [result] = await db.execute(sql, [title, content, category_id, tagsValue, cover || null, status || 'published', id, author_id]);
  return result.affectedRows;
}

async function deletePost({ id, author_id }) {
  const sql = 'DELETE FROM posts WHERE id = ? AND author_id = ?';
  const [result] = await db.execute(sql, [id, author_id]);
  return result.affectedRows;
}

module.exports = {
  createPost,
  getPosts,
  getPostById,
  incrementViews,
  updatePost,
  deletePost,
};
