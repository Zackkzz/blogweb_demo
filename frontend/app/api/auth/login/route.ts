import { NextRequest, NextResponse } from 'next/server';
import { getAdmin, verifyPassword } from '@/lib/admin';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'change-me-in-env';

export async function POST(request: NextRequest) {
  try {
    const { username, password } = await request.json();
    
    const admin = getAdmin();
    
    // Check if username or email matches
    if (username !== admin.username && username !== admin.email) {
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
    }
    
    // Verify password
    if (!verifyPassword(password, admin.passwordHash)) {
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
    }
    
    // Generate token
    const token = jwt.sign({ 
      id: 1, 
      username: admin.username,
      email: admin.email 
    }, JWT_SECRET);
    
    return NextResponse.json({ token });
  } catch (error: any) {
    console.error('Login error:', error);
    return NextResponse.json({ error: 'Login failed' }, { status: 500 });
  }
}
