import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '../../../../../backend/db';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'change-me-in-env';

export async function POST(request: NextRequest) {
  try {
    const { username, password } = await request.json();
    const conn = await getDb();
    
    const [rows] = await conn.execute('SELECT * FROM zack WHERE username = ? OR email = ?', [username, username]);
    const user = (rows as any[])[0];
    
    if (!user || !bcrypt.compareSync(password, user.password_hash)) {
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
    }
    
    const token = jwt.sign({ id: user.id, username: user.username }, JWT_SECRET);
    return NextResponse.json({ token });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Database error' }, { status: 500 });
  }
}
