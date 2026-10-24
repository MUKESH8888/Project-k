import { NextResponse } from 'next/server';
import { Db } from '../../../lib/db';

export async function GET() {
  try {
    const appointments = Db.getAppointments();
    return NextResponse.json({
      success: true,
      count: appointments.length,
      appointments,
    });
  } catch (error) {
    return NextResponse.json(
      { error: error.message || 'Failed to fetch appointments' },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  try {
    const body = await request.json();

    if (!body.phone && !body.customerPhone) {
      return NextResponse.json(
        { error: 'WhatsApp mobile number is required' },
        { status: 400 }
      );
    }

    const appt = Db.createAppointment(body);
    return NextResponse.json(
      {
        success: true,
        message: 'Bridal video shopping session scheduled successfully!',
        appointment: appt,
      },
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json(
      { error: error.message || 'Failed to schedule appointment' },
      { status: 500 }
    );
  }
}
