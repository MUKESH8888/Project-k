import { guard, readJson } from "../../../../lib/request";
import { createSession } from "../../../../lib/session";
import { NextResponse } from "next/server";
import { Db } from "../../../../lib/db";

export async function POST(request) {
  const rejected = guard(request);
  if (rejected) return rejected;

  try {
    const body = await readJson(request);
    const { name, email, phone, password } = body;

    if (!name || !email || !password) {
      return NextResponse.json(
        { error: "Name, email, and password are required" },
        { status: 400 },
      );
    }

    const user = await Db.registerUser({ name, email, phone, password });

    const response = NextResponse.json({
      success: true,
      message: `Account created successfully. Welcome to Kalyanam, ${user.name}!`,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });

    response.cookies.set("kalyanam_session", createSession(user), {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 7,
    });

    return response;
  } catch (error) {
    return NextResponse.json(
      { error: error.message || "Registration failed" },
      { status: 400 },
    );
  }
}
