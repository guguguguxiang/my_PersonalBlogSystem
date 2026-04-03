const db = require('../config/db');

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

module.exports = {
  findByUsername,
  findByEmail,
  createUser,
};
