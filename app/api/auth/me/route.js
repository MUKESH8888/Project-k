import { NextResponse } from 'next/server';
import { Db } from '../../../../lib/db';

export async function GET(request) {
  try {
    const cookie = request.cookies.get('kalyanam_session');

    if (!cookie || !cookie.value) {
      return NextResponse.json({ authenticated: false, user: null });
    }

    let sessionData;
    try {
      sessionData = JSON.parse(decodeURIComponent(cookie.value));
    } catch {
      try {
        sessionData = JSON.parse(cookie.value);
      } catch {
        return NextResponse.json({ authenticated: false, user: null });
      }
    }
    const user = await Db.findUserById(sessionData?.id);

    if (!user) {
      return NextResponse.json({ authenticated: false, user: null });
    }

    const { password: _, ...safeUser } = user;
    return NextResponse.json({
      authenticated: true,
      user: safeUser,
    });
  } catch {
    return NextResponse.json({ authenticated: false, user: null });
  }
}
