import { NextRequest, NextResponse } from 'next/server';
import { getSupabaseAdmin } from '@/lib/supabase/admin';

export async function POST(request: NextRequest) {
  try {
    const payload = await request.json();
    
    // Calendly webhook payload structure
    const { event, payload: calendlyPayload } = payload;
    
    if (event === 'invitee.created') {
      const invitee = calendlyPayload?.invitee;
      
      if (invitee?.email && invitee?.event?.start_time) {
        // Calculate reminder time (24 hours before)
        const eventTime = new Date(invitee.event.start_time);
        const reminderTime = new Date(eventTime.getTime() - 24 * 60 * 60 * 1000);
        
        // Store appointment data for reminder
        const supabase = getSupabaseAdmin();
        const { error } = await supabase.from('appointments').upsert({
          email: invitee.email,
          event_time: eventTime.toISOString(),
          reminder_time: reminderTime.toISOString(),
          meeting_url: invitee.location?.join_url || invitee.location?.url || '',
          calendly_event_uri: invitee.uri,
          status: 'scheduled',
        }, {
          onConflict: 'calendly_event_uri'
        });

        if (error) {
          console.error('Error storing appointment:', error);
          return NextResponse.json(
            { error: 'Failed to store appointment' },
            { status: 500 }
          );
        }

        return NextResponse.json(
          { message: 'Appointment stored successfully' },
          { status: 200 }
        );
      }
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error('Error in Calendly webhook:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
