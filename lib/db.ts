import mysql from 'mysql2/promise';
import bcrypt from 'bcryptjs';

const connection = mysql.createConnection({
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT ? Number(process.env.DB_PORT) : 3306,
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'personal_website'
});

export default connection;

// Initialize database and table
async function initDB() {
  try {
    const conn = await connection;
    
    // Create table if not exists
    await conn.execute(`CREATE TABLE IF NOT EXISTS zack (
      id INT AUTO_INCREMENT PRIMARY KEY,
      username VARCHAR(255) UNIQUE NOT NULL,
      password_hash VARCHAR(255) NOT NULL,
      email VARCHAR(255) UNIQUE
    )`);

    // Insert or update default admin
    const hash = bcrypt.hashSync('admin123', 10);
    await conn.execute('INSERT INTO zack (username, password_hash, email) VALUES (?, ?, ?) ON DUPLICATE KEY UPDATE password_hash = VALUES(password_hash), email = VALUES(email)', 
      ['admin', hash, 'admin@example.com']);
    
    console.log('Database initialized successfully');
  } catch (error) {
    console.error('Database initialization error:', error);
  }
}

initDB();