import { NextRequest, NextResponse } from 'next/server';
import { getAdmin, saveAdmin, verifyPassword, hashPassword } from '@/lib/admin';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'change-me-in-env';

export async function POST(request: NextRequest) {
  try {
    const { currentPassword, newUsername, newPassword, newEmail } = await request.json();
    const token = request.headers.get('authorization')?.replace('Bearer ', '');
    if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const decoded: any = jwt.verify(token, JWT_SECRET);
    const admin = getAdmin();

    // Verify current password
    if (!verifyPassword(currentPassword, admin.passwordHash)) {
      return NextResponse.json({ error: 'Invalid current password' }, { status: 400 });
    }

    // Update admin info
    const updatedAdmin = { ...admin };
    
    if (newUsername) {
      updatedAdmin.username = newUsername;
    }
    if (newPassword) {
      updatedAdmin.passwordHash = hashPassword(newPassword);
    }
    if (newEmail) {
      updatedAdmin.email = newEmail;
    }

    // Save updated admin
    saveAdmin(updatedAdmin);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Update failed' }, { status: 500 });
  }
}
