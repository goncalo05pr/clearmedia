import { NextRequest, NextResponse } from 'next/server';
import { sendPurchaseConfirmationEmail } from '@/lib/email-service';

export async function POST(request: NextRequest) {
  try {
    const { email, formationTitle, formationId } = await request.json();

    if (!email || !formationTitle || !formationId) {
      return NextResponse.json(
        { error: 'Email, formation title, and formation ID are required' },
        { status: 400 }
      );
    }

    const result = await sendPurchaseConfirmationEmail(email, formationTitle, formationId);

    if (result.success) {
      return NextResponse.json(
        { message: 'Purchase confirmation email sent successfully' },
        { status: 200 }
      );
    } else {
      return NextResponse.json(
        { error: 'Failed to send purchase confirmation email' },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error('Error in purchase confirmation email API:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
