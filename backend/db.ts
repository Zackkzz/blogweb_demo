import mysql from 'mysql2/promise';
import bcrypt from 'bcryptjs';

let connectionPromise: Promise<mysql.Connection> | null = null;

export async function getDb() {
  const host = process.env.DB_HOST;
  const port = process.env.DB_PORT ? Number(process.env.DB_PORT) : 3306;
  const user = process.env.DB_USER;
  const password = process.env.DB_PASSWORD || '';
  const database = process.env.DB_NAME;

  // Defer connection when env is not configured (e.g. during build)
  if (!host || !user || !database) {
    throw new Error('Database environment not configured');
  }

  if (!connectionPromise) {
    connectionPromise = mysql.createConnection({ host, port, user, password, database });
  }
  return connectionPromise;
}

// Initialize database and table (call manually at runtime if needed)
export async function initDB() {
  try {
    const conn = await getDb();

    await conn.execute(`CREATE TABLE IF NOT EXISTS zack (
      id INT AUTO_INCREMENT PRIMARY KEY,
      username VARCHAR(255) UNIQUE NOT NULL,
      password_hash VARCHAR(255) NOT NULL,
      email VARCHAR(255) UNIQUE
    )`);

    const hash = bcrypt.hashSync('admin123', 10);
    await conn.execute('INSERT INTO zack (username, password_hash, email) VALUES (?, ?, ?) ON DUPLICATE KEY UPDATE password_hash = VALUES(password_hash), email = VALUES(email)', 
      ['admin', hash, 'admin@example.com']);
  } catch (error) {
    console.error('Database initialization error:', error);
  }
}
