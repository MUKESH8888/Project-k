import { guard, readJson } from "../../../../lib/request";
import { createSession } from "../../../../lib/session";
import { NextResponse } from "next/server";
import { Db } from "../../../../lib/db";

export async function POST(request) {
  const rejected = guard(request);
  if (rejected) return rejected;

  try {
    const body = await readJson(request);
    const { email, password } = body;

    if (!email || !password) {
      return NextResponse.json(
        { error: "Email and password are required" },
        { status: 400 },
      );
    }

    const user = await Db.authenticate(email, password);

    if (!user) {
      return NextResponse.json(
        {
          error: "Invalid credentials. Please verify your email and password.",
        },
        { status: 401 },
      );
    }

    const response = NextResponse.json({
      success: true,
      message: `Welcome, ${user.name}!`,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });

    // Set cookie
    response.cookies.set("kalyanam_session", createSession(user), {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 7, // 7 days
    });

    return response;
  } catch (error) {
    return NextResponse.json(
      { error: error.message || "Authentication error" },
      { status: 500 },
    );
  }
}
