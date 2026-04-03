const fs = require('fs');
const path = require('path');
const mysql = require('mysql2/promise');
require('dotenv').config();

async function initDatabase() {
  const schemaPath = path.resolve(__dirname, 'schema.sql');
  const schemaSql = fs.readFileSync(schemaPath, 'utf-8');

  const connection = await mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    multipleStatements: true,
  });

  try {
    const dbName = process.env.DB_NAME;
    if (!dbName) {
      throw new Error('DB_NAME is required in .env');
    }

    const finalSql = schemaSql
      .replace(/`personal_blog`/g, `\`${dbName}\``)
      .replace(/USE\s+`[^`]+`;/i, `USE \`${dbName}\`;`);

    await connection.query(finalSql);
    console.log('Database schema initialized successfully.');
  } finally {
    await connection.end();
  }
}

initDatabase().catch((error) => {
  console.error('Failed to initialize database schema:', error.message);
  process.exit(1);
});
