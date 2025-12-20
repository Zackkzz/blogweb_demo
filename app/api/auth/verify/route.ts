import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';

const JWT_SECRET = 'your-secret-key';

export async function POST(request: NextRequest) {
  const { token } = await request.json();

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    return NextResponse.json({ valid: true, user: decoded });
  } catch (error) {
    return NextResponse.json({ valid: false }, { status: 401 });
  }
}