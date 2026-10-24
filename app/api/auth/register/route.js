import { NextResponse } from 'next/server';
import { Db } from '../../../../lib/db';

export async function POST(request) {
  try {
    const body = await request.json();
    const { name, email, phone, password } = body;

    if (!name || !email || !password) {
      return NextResponse.json(
        { error: 'Name, email, and password are required' },
        { status: 400 }
      );
    }

    const user = await Db.registerUser({ name, email, phone, password });

    const response = NextResponse.json({
      success: true,
      message: `Account created successfully. Welcome to Kalyanam, ${user.name}!`,
      user,
    });

    response.cookies.set('kalyanam_session', JSON.stringify({ id: user.id, role: user.role }), {
      httpOnly: false,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24 * 7,
    });

    return response;
  } catch (error) {
    return NextResponse.json(
      { error: error.message || 'Registration failed' },
      { status: 400 }
    );
  }
}
