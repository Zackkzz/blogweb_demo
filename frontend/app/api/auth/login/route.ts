import { NextRequest, NextResponse } from 'next/server';
import { getAdmin, verifyPassword } from '@/lib/admin';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'change-me-in-env';

export async function POST(request: NextRequest) {
  try {
    const { username, password } = await request.json();
    
    const admin = getAdmin();
    
    // Debug logging (remove in production)
    console.log('Login attempt:', { username, adminUsername: admin.username, adminEmail: admin.email });
    
    // Check if username or email matches
    if (username !== admin.username && username !== admin.email) {
      console.log('Username/email mismatch');
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
    }
    
    // Verify password
    const passwordValid = verifyPassword(password, admin.passwordHash);
    console.log('Password verification:', passwordValid);
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
    return NextResponse.json({ error: 'Login failed' }, { status: 500 });
  }
}
