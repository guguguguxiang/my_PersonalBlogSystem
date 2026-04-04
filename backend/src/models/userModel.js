const db = require('../config/db');

async function findById(id) {
  const sql = 'SELECT id, username, email, password, avatar, created_at, updated_at FROM users WHERE id = ? LIMIT 1';
  const [rows] = await db.execute(sql, [id]);
  return rows[0] || null;
}

async function findByUsername(username) {
  const sql = 'SELECT id, username, email, password, avatar, created_at, updated_at FROM users WHERE username = ? LIMIT 1';
  const [rows] = await db.execute(sql, [username]);
  return rows[0] || null;
}

async function findByEmail(email) {
  const sql = 'SELECT id, username, email, password, avatar, created_at, updated_at FROM users WHERE email = ? LIMIT 1';
  const [rows] = await db.execute(sql, [email]);
  return rows[0] || null;
}

async function createUser({ username, email, password }) {
  const sql = 'INSERT INTO users (username, email, password) VALUES (?, ?, ?)';
  const [result] = await db.execute(sql, [username, email, password]);
  return result.insertId;
}

async function updateUserProfile({ id, username, avatar }) {
  const sql = 'UPDATE users SET username = ?, avatar = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?';
  const [result] = await db.execute(sql, [username, avatar, id]);
  return result.affectedRows;
}

module.exports = {
  findById,
  findByUsername,
  findByEmail,
  createUser,
  updateUserProfile,
};
