import bcrypt from 'bcryptjs';
import fs from 'fs';
import path from 'path';

const adminFilePath = path.join(process.cwd(), 'data', 'admin.json');

// Generate a consistent hash for 'admin123'
// This function ensures the hash is generated correctly
function generateAdminHash(): string {
  const hash = bcrypt.hashSync('admin123', 10);
  // Verify it works
  if (!bcrypt.compareSync('admin123', hash)) {
    throw new Error('Failed to generate valid password hash');
  }
  return hash;
}

// Default admin credentials
// Generate hash lazily to avoid issues in serverless environments
let cachedDefaultAdmin: AdminUser | null = null;

function getDefaultAdmin(): AdminUser {
  if (!cachedDefaultAdmin) {
    cachedDefaultAdmin = {
      username: 'admin',
      passwordHash: generateAdminHash(),
      email: 'admin@example.com'
    };
  }
  return cachedDefaultAdmin;
}

export interface AdminUser {
  username: string;
  passwordHash: string;
  email: string;
}

// Get admin user from file or return default
// In serverless environments (Netlify), file system is read-only
// So we skip file operations and always return the default admin
export function getAdmin(): AdminUser {
  // Check if we're in a serverless environment (Netlify uses /var/task)
  const isServerless = process.cwd().includes('/var/task') || process.env.NETLIFY === 'true';
  
  if (isServerless) {
    // In serverless, skip all file operations and return default
    return getDefaultAdmin();
  }
  
  // Only try to read file in non-serverless environments
  try {
    if (fs.existsSync(adminFilePath)) {
      const data = fs.readFileSync(adminFilePath, 'utf8');
      const admin = JSON.parse(data);
      // Return admin from file if it has required fields
      if (admin.username && admin.passwordHash && admin.email) {
        return admin;
      }
    }
  } catch (error: any) {
    // If read fails, just use default
    if (error.code !== 'EROFS') {
      console.error('Error reading admin file:', error);
    }
  }
  
  // Return default (never try to save file in getAdmin())
  return getDefaultAdmin();
}

// Save admin user to file
// Note: In serverless environments (Netlify), file system may be read-only
// This function will fail silently in such environments
export function saveAdmin(admin: AdminUser): void {
  try {
    const dir = path.dirname(adminFilePath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    fs.writeFileSync(adminFilePath, JSON.stringify(admin, null, 2));
  } catch (error) {
    // Silently fail in serverless/read-only environments
    console.warn('Could not save admin file (this is normal in serverless environments):', error);
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

