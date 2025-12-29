const { Pool } = require('pg');
const dotenv = require('dotenv');

dotenv.config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  }
});

// Test database connection
const testConnection = async () => {
  const client = await pool.connect();
  try {
    const result = await client.query('SELECT NOW()');
    console.log('Database connection test:', result.rows[0].now);
    return true;
  } finally {
    client.release();
  }
};

module.exports = { pool, testConnection };
