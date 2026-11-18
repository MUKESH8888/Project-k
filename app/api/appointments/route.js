import { guard, readJson } from "../../../lib/request";
import { requireAdmin } from "../../../lib/session";
import { NextResponse } from "next/server";
import { Db } from "../../../lib/db";

export async function GET(request) {
  const denied = requireAdmin(request);
  if (denied) return denied;
  try {
    const appointments = await Db.getAppointments();
    return NextResponse.json({
      success: true,
      count: appointments.length,
      appointments,
    });
  } catch (error) {
    return NextResponse.json(
      { error: error.message || "Failed to fetch appointments" },
      { status: 500 },
    );
  }
}

export async function POST(request) {
  const rejected = guard(request);
  if (rejected) return rejected;

  try {
    const body = await readJson(request);

    if (!body.phone && !body.customerPhone) {
      return NextResponse.json(
        { error: "WhatsApp mobile number is required" },
        { status: 400 },
      );
    }

    const appt = await Db.createAppointment(body);
    return NextResponse.json(
      {
        success: true,
        message: "Bridal video shopping session scheduled successfully!",
        appointment: appt,
      },
      { status: 201 },
    );
  } catch (error) {
    return NextResponse.json(
      { error: error.message || "Failed to schedule appointment" },
      { status: 500 },
    );
  }
}
