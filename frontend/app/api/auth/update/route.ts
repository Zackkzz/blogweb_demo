import { NextRequest, NextResponse } from 'next/server';
import db from '../../../../../backend/db';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'change-me-in-env';

export async function POST(request: NextRequest) {
  try {
    const { currentPassword, newUsername, newPassword, newEmail } = await request.json();
    const token = request.headers.get('authorization')?.replace('Bearer ', '');
    if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const decoded: any = jwt.verify(token, JWT_SECRET);
    const conn = await db;

    const [rows] = await conn.execute('SELECT * FROM zack WHERE id = ?', [decoded.id]);
    const user = (rows as any[])[0];
    if (!user || !bcrypt.compareSync(currentPassword, user.password_hash)) {
      return NextResponse.json({ error: 'Invalid current password' }, { status: 400 });
    }

    const updates = [] as string[];
    const values = [] as any[];
    if (newUsername) {
      updates.push('username = ?');
      values.push(newUsername);
    }
    if (newPassword) {
      const hash = bcrypt.hashSync(newPassword, 10);
      updates.push('password_hash = ?');
      values.push(hash);
    }
    if (newEmail) {
      updates.push('email = ?');
      values.push(newEmail);
    }

    if (updates.length > 0) {
      values.push(decoded.id);
      await conn.execute(`UPDATE zack SET ${updates.join(', ')} WHERE id = ?`, values);
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Update failed' }, { status: 500 });
  }
}
