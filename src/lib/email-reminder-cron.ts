import { getSupabaseAdmin } from '@/lib/supabase/admin';
import { sendReminderEmail } from '@/lib/email-service';

export async function checkAndSendReminders() {
  try {
    const supabase = getSupabaseAdmin();
    
    // Get appointments that need reminders (reminder_time <= now and not sent)
    const { data: appointments, error } = await supabase
      .from('appointments')
      .select('*')
      .lte('reminder_time', new Date().toISOString())
      .eq('reminder_sent', false)
      .eq('status', 'scheduled');

    if (error) {
      console.error('Error fetching appointments:', error);
      return;
    }

    if (!appointments || appointments.length === 0) {
      console.log('No appointments to remind');
      return;
    }

    // Send reminders for each appointment
    for (const appointment of appointments) {
      try {
        const formattedTime = new Date(appointment.event_time).toLocaleString('fr-FR', {
          weekday: 'long',
          year: 'numeric',
          month: 'long',
          day: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
          timeZone: 'Europe/Paris'
        });

        const result = await sendReminderEmail(
          appointment.email,
          formattedTime,
          appointment.meeting_url
        );

        if (result.success) {
          // Mark reminder as sent
          await supabase
            .from('appointments')
            .update({ reminder_sent: true })
            .eq('id', appointment.id);

          console.log(`Reminder sent to ${appointment.email}`);
        } else {
          console.error(`Failed to send reminder to ${appointment.email}:`, result.error);
        }
      } catch (error) {
        console.error(`Error processing reminder for ${appointment.email}:`, error);
      }
    }
  } catch (error) {
    console.error('Error in reminder cron job:', error);
  }
}
