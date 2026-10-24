import { NextResponse } from 'next/server';

export async function POST() {
  const response = NextResponse.json({
    success: true,
    message: 'Logged out successfully from Kalyanam Shopping Mall.',
  });

  response.cookies.set('kalyanam_session', '', {
    httpOnly: false,
    path: '/',
    maxAge: 0,
  });

  return response;
}
