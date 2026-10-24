import { NextResponse } from 'next/server';
import { Db } from '../../../../lib/db';

export async function POST(request) {
  try {
    const body = await request.json();
    const { email, password } = body;

    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password are required' },
        { status: 400 }
      );
    }

    const user = await Db.authenticate(email, password);

    if (!user) {
      return NextResponse.json(
        { error: 'Invalid credentials. Please verify your email and password.' },
        { status: 401 }
      );
    }

    const response = NextResponse.json({
      success: true,
      message: `Welcome, ${user.name}!`,
      user,
    });

    // Set cookie
    response.cookies.set('kalyanam_session', JSON.stringify({ id: user.id, role: user.role }), {
      httpOnly: false,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24 * 7, // 7 days
    });

    return response;
  } catch (error) {
    return NextResponse.json(
      { error: error.message || 'Authentication error' },
      { status: 500 }
    );
  }
}
