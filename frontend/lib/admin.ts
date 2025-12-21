import bcrypt from 'bcryptjs';
import fs from 'fs';
import path from 'path';

const adminFilePath = path.join(process.cwd(), 'data', 'admin.json');

// Default admin credentials
// Using a fixed hash for 'admin123' password
const defaultAdmin = {
  username: 'admin',
  passwordHash: '$2a$10$spJGo2SF4h.gLVKDkkVKdeGUwX1xdts8ZI5mmyGWms4bYrHx6Laj.',
  email: 'admin@example.com'
};

export interface AdminUser {
  username: string;
  passwordHash: string;
  email: string;
}

// Get admin user from file or return default
export function getAdmin(): AdminUser {
  try {
    if (fs.existsSync(adminFilePath)) {
      const data = fs.readFileSync(adminFilePath, 'utf8');
      return JSON.parse(data);
    }
  } catch (error) {
    console.error('Error reading admin file:', error);
  }
  
  // Return default and create file if it doesn't exist
  saveAdmin(defaultAdmin);
  return defaultAdmin;
}

// Save admin user to file
export function saveAdmin(admin: AdminUser): void {
  try {
    const dir = path.dirname(adminFilePath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    fs.writeFileSync(adminFilePath, JSON.stringify(admin, null, 2));
  } catch (error) {
    console.error('Error saving admin file:', error);
    throw error;
  }
}

// Verify password
export function verifyPassword(password: string, hash: string): boolean {
  return bcrypt.compareSync(password, hash);
}

// Hash password
export function hashPassword(password: string): string {
  return bcrypt.hashSync(password, 10);
}

