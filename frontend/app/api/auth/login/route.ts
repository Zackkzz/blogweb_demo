import { NextRequest, NextResponse } from 'next/server';
import { getAdmin, verifyPassword } from '@/lib/admin';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'change-me-in-env';

export async function POST(request: NextRequest) {
  try {
    const { username, password } = await request.json();
    
    if (!username || !password) {
      return NextResponse.json({ error: 'Username and password are required' }, { status: 400 });
    }
    
    let admin;
    try {
      admin = getAdmin();
    } catch (error: any) {
      console.error('Error getting admin:', error);
      return NextResponse.json({ error: 'Server configuration error' }, { status: 500 });
    }
    
    // Check if username or email matches
    if (username !== admin.username && username !== admin.email) {
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
    }
    
    // Verify password
    let passwordValid = false;
    try {
      passwordValid = verifyPassword(password, admin.passwordHash);
    } catch (error: any) {
      console.error('Error verifying password:', error);
      return NextResponse.json({ error: 'Password verification failed' }, { status: 500 });
    }
    
    if (!passwordValid) {
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
    return NextResponse.json({ error: 'Login failed', details: error.message }, { status: 500 });
  }
}
