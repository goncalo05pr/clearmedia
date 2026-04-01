import { NextRequest, NextResponse } from 'next/server';
import { checkAndSendReminders } from '@/lib/email-reminder-cron';

export async function GET(request: NextRequest) {
  try {
    // Simple authentication check (you might want to add a secret key)
    const authHeader = request.headers.get('authorization');
    const cronSecret = process.env.CRON_SECRET;

    if (!cronSecret || authHeader !== `Bearer ${cronSecret}`) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    await checkAndSendReminders();

    return NextResponse.json(
      { message: 'Reminder check completed successfully' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error in reminder cron endpoint:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
