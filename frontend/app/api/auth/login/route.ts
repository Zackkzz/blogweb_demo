import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '@/lib/db';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'change-me-in-env';

export async function POST(request: NextRequest) {
  try {
    const { username, password } = await request.json();
    
    // Check environment variables first
    if (!process.env.DB_HOST || !process.env.DB_USER || !process.env.DB_NAME) {
      console.error('Database environment variables not configured');
      return NextResponse.json({ 
        error: 'Database configuration error. Please check environment variables.' 
      }, { status: 500 });
    }
    
    const conn = await getDb();
    
    // Check if table exists, if not, create it
    try {
      await conn.execute('SELECT 1 FROM zack LIMIT 1');
    } catch (tableError: any) {
      // Table doesn't exist, initialize it
      console.log('Table zack does not exist, initializing...');
      const { initDB } = await import('@/lib/db');
      await initDB();
    }
    
    const [rows] = await conn.execute('SELECT * FROM zack WHERE username = ? OR email = ?', [username, username]);
    const user = (rows as any[])[0];
    
    if (!user || !bcrypt.compareSync(password, user.password_hash)) {
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
    }
    
    const token = jwt.sign({ id: user.id, username: user.username }, JWT_SECRET);
    return NextResponse.json({ token });
  } catch (error: any) {
    console.error('Login error:', error);
    
    // Provide more specific error messages
    let errorMessage = 'Database error';
    if (error.message?.includes('ECONNREFUSED')) {
      errorMessage = 'Cannot connect to database server. Please check your database configuration.';
    } else if (error.message?.includes('Access denied')) {
      errorMessage = 'Database authentication failed. Please check your credentials.';
    } else if (error.message?.includes('Unknown database')) {
      errorMessage = 'Database not found. Please check your database name.';
    } else if (error.message?.includes('Database environment not configured')) {
      errorMessage = 'Database environment variables are not set. Please configure them in Netlify.';
    }
    
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
