const { sql } = require('@vercel/postgres');
require('dotenv').config({ path: '.env.local' });

async function init() {
  try {
    const result = await sql`
      CREATE TABLE IF NOT EXISTS articles (
        id SERIAL PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        category VARCHAR(100),
        read_time VARCHAR(50),
        img_url TEXT,
        content TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `;
    console.log('Table created or verified successfully!');
  } catch (e) {
    console.error('Error creating table:', e);
  }
}

init();
