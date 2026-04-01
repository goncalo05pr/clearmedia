import { NextRequest, NextResponse } from 'next/server';
import { sendReminderEmail } from '@/lib/email-service';

export async function POST(request: NextRequest) {
  try {
    const { email, appointmentTime, appointmentLink } = await request.json();

    if (!email || !appointmentTime || !appointmentLink) {
      return NextResponse.json(
        { error: 'Email, appointment time, and appointment link are required' },
        { status: 400 }
      );
    }

    const result = await sendReminderEmail(email, appointmentTime, appointmentLink);

    if (result.success) {
      return NextResponse.json(
        { message: 'Reminder email sent successfully' },
        { status: 200 }
      );
    } else {
      return NextResponse.json(
        { error: 'Failed to send reminder email' },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error('Error in reminder email API:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
