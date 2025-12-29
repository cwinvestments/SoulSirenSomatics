const fs = require('fs');
const path = require('path');
const { pool } = require('./database');

const initDb = async () => {
  console.log('Initializing database...');

  try {
    // Read schema file
    const schemaPath = path.join(__dirname, 'schema.sql');
    const schema = fs.readFileSync(schemaPath, 'utf8');

    // Execute schema
    await pool.query(schema);

    console.log('Database initialized successfully');
    return true;
  } catch (error) {
    console.error('Error initializing database:', error.message);
    throw error;
  }
};

// Run standalone if called directly
if (require.main === module) {
  initDb()
    .then(() => {
      console.log('Database initialization complete');
      process.exit(0);
    })
    .catch((error) => {
      console.error('Database initialization failed:', error.message);
      process.exit(1);
    });
}

module.exports = { initDb };
