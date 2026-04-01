import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

interface EmailData {
  to: string;
  subject: string;
  html: string;
}

export async function sendEmail({ to, subject, html }: EmailData) {
  try {
    const { data, error } = await resend.emails.send({
      from: 'KLIQZ <noreply@kliqz.vercel.app>',
      to: [to],
      subject,
      html,
    });

    if (error) {
      console.error('Error sending email:', error);
      return { success: false, error };
    }

    console.log('Email sent successfully:', data);
    return { success: true, data };
  } catch (error) {
    console.error('Error in sendEmail:', error);
    return { success: false, error };
  }
}

export async function sendWelcomeEmail(email: string, userName?: string) {
  const subject = 'Bienvenue chez KLIQZ ! 🚀';
  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Bienvenue chez KLIQZ</title>
      <style>
        body { font-family: Arial, sans-serif; background-color: #0a0a0a; color: #ffffff; margin: 0; padding: 20px; }
        .container { max-width: 600px; margin: 0 auto; background-color: #1a1a1a; border-radius: 10px; overflow: hidden; }
        .header { background: linear-gradient(135deg, #8B5CF6 0%, #EC4899 25%, #FF4D2E 50%); padding: 30px; text-align: center; }
        .content { padding: 30px; }
        .button { display: inline-block; background-color: #FF4D2E; color: white; padding: 12px 24px; text-decoration: none; border-radius: 25px; margin: 20px 0; }
        .footer { background-color: #0a0a0a; padding: 20px; text-align: center; font-size: 12px; color: #888; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1 style="margin: 0; font-size: 32px;">KLIQZ</h1>
          <p style="margin: 10px 0 0 0; font-size: 18px;">Performance Marketing Agency</p>
        </div>
        <div class="content">
          <h2 style="color: #FF4D2E;">Bienvenue ${userName ? userName + ',' : ''} !</h2>
          <p>Nous sommes ravis de vous accueillir dans la communauté KLIQZ !</p>
          <p>Vous venez de faire le premier pas vers une transformation digitale de votre business.</p>
          
          <h3 style="color: #8B5CF6; margin-top: 30px;">Prochaines étapes :</h3>
          <ul style="line-height: 1.6;">
            <li>Explorez nos formations disponibles</li>
            <li>Prenez rendez-vous pour un appel stratégique gratuit</li>
            <li>Accédez à votre espace personnel pour suivre vos progrès</li>
          </ul>
          
          <div style="text-align: center; margin: 30px 0;">
            <a href="https://kliqz.vercel.app/formations" class="button">
              Découvrir les formations
            </a>
          </div>
          
          <p style="font-size: 14px; color: #888;">
            Si vous avez des questions, n'hésitez pas à nous contacter à support@kliqz.vercel.app
          </p>
        </div>
        <div class="footer">
          <p>© 2024 KLIQZ - Performance Marketing Agency</p>
          <p>Tous droits réservés</p>
        </div>
      </div>
    </body>
    </html>
  `;

  return sendEmail({ to: email, subject, html });
}

export async function sendPurchaseConfirmationEmail(email: string, formationTitle: string, formationId: string) {
  const subject = 'Confirmation d\'achat - Formation KLIQZ 🎉';
  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Confirmation d'achat</title>
      <style>
        body { font-family: Arial, sans-serif; background-color: #0a0a0a; color: #ffffff; margin: 0; padding: 20px; }
        .container { max-width: 600px; margin: 0 auto; background-color: #1a1a1a; border-radius: 10px; overflow: hidden; }
        .header { background: linear-gradient(135deg, #8B5CF6 0%, #EC4899 25%, #FF4D2E 50%); padding: 30px; text-align: center; }
        .content { padding: 30px; }
        .success-box { background-color: #10b981; color: white; padding: 20px; border-radius: 8px; text-align: center; margin: 20px 0; }
        .button { display: inline-block; background-color: #FF4D2E; color: white; padding: 12px 24px; text-decoration: none; border-radius: 25px; margin: 20px 0; }
        .footer { background-color: #0a0a0a; padding: 20px; text-align: center; font-size: 12px; color: #888; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1 style="margin: 0; font-size: 32px;">KLIQZ</h1>
          <p style="margin: 10px 0 0 0; font-size: 18px;">Performance Marketing Agency</p>
        </div>
        <div class="content">
          <div class="success-box">
            <h2 style="margin: 0; font-size: 24px;">🎉 Achat confirmé !</h2>
            <p style="margin: 10px 0 0 0;">Félicitations pour votre investissement</p>
          </div>
          
          <h3 style="color: #FF4D2E; margin-top: 30px;">Formation achetée :</h3>
          <div style="background-color: #2a2a2a; padding: 20px; border-radius: 8px; margin: 15px 0;">
            <h4 style="margin: 0 0 10px 0; color: #ffffff;">${formationTitle}</h4>
            <p style="margin: 0; color: #888; font-size: 14px;">ID: ${formationId}</p>
          </div>
          
          <h3 style="color: #8B5CF6; margin-top: 30px;">Accès immédiat :</h3>
          <p>Votre formation est maintenant disponible dans votre espace membre.</p>
          
          <div style="text-align: center; margin: 30px 0;">
            <a href="https://kliqz.vercel.app/espace-membre" class="button">
              Accéder à ma formation
            </a>
          </div>
          
          <h3 style="color: #8B5CF6; margin-top: 30px;">Prochaines étapes :</h3>
          <ul style="line-height: 1.6;">
            <li>Connectez-vous à votre espace membre</li>
            <li>Commencez le premier module</li>
            <li>Participez à la communauté</li>
            <li>Planifiez un appel de suivi si besoin</li>
          </ul>
          
          <p style="font-size: 14px; color: #888; margin-top: 30px;">
            Pour toute question technique, contactez-nous à support@kliqz.vercel.app
          </p>
        </div>
        <div class="footer">
          <p>© 2024 KLIQZ - Performance Marketing Agency</p>
          <p>Tous droits réservés</p>
        </div>
      </div>
    </body>
    </html>
  `;

  return sendEmail({ to: email, subject, html });
}

export async function sendReminderEmail(email: string, appointmentTime: string, appointmentLink: string) {
  const subject = 'Rappel de votre rendez-vous KLIQZ 🔔';
  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Rappel de rendez-vous</title>
      <style>
        body { font-family: Arial, sans-serif; background-color: #0a0a0a; color: #ffffff; margin: 0; padding: 20px; }
        .container { max-width: 600px; margin: 0 auto; background-color: #1a1a1a; border-radius: 10px; overflow: hidden; }
        .header { background: linear-gradient(135deg, #8B5CF6 0%, #EC4899 25%, #FF4D2E 50%); padding: 30px; text-align: center; }
        .content { padding: 30px; }
        .reminder-box { background-color: #f59e0b; color: white; padding: 20px; border-radius: 8px; text-align: center; margin: 20px 0; }
        .appointment-details { background-color: #2a2a2a; padding: 20px; border-radius: 8px; margin: 15px 0; }
        .button { display: inline-block; background-color: #FF4D2E; color: white; padding: 12px 24px; text-decoration: none; border-radius: 25px; margin: 20px 0; }
        .footer { background-color: #0a0a0a; padding: 20px; text-align: center; font-size: 12px; color: #888; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1 style="margin: 0; font-size: 32px;">KLIQZ</h1>
          <p style="margin: 10px 0 0 0; font-size: 18px;">Performance Marketing Agency</p>
        </div>
        <div class="content">
          <div class="reminder-box">
            <h2 style="margin: 0; font-size: 24px;">🔔 Rappel de rendez-vous</h2>
            <p style="margin: 10px 0 0 0;">Votre appel stratégique est prévu demain</p>
          </div>
          
          <h3 style="color: #FF4D2E; margin-top: 30px;">Détails du rendez-vous :</h3>
          <div class="appointment-details">
            <p style="margin: 0 0 10px 0;"><strong>Date et heure :</strong> ${appointmentTime}</p>
            <p style="margin: 0;"><strong>Type :</strong> Appel stratégique gratuit (30 minutes)</p>
          </div>
          
          <h3 style="color: #8B5CF6; margin-top: 30px;">Comment rejoindre l'appel :</h3>
          <p>Cliquez sur le lien ci-dessous pour rejoindre votre rendez-vous :</p>
          
          <div style="text-align: center; margin: 30px 0;">
            <a href="${appointmentLink}" class="button">
              Rejoindre l'appel
            </a>
          </div>
          
          <h3 style="color: #8B5CF6; margin-top: 30px;">Préparation recommandée :</h3>
          <ul style="line-height: 1.6;">
            <li>Préparez vos objectifs actuels</li>
            <li>Notez vos questions principales</li>
            <li>Ayez accès à vos analytics si possible</li>
            <li>Assurez-vous d'être dans un endroit calme</li>
          </ul>
          
          <div style="background-color: #1e40af; padding: 15px; border-radius: 8px; margin: 20px 0;">
            <p style="margin: 0; font-size: 14px;">
              <strong>Important :</strong> Si vous devez annuler ou reporter, utilisez le lien de modification dans votre email de confirmation Calendly.
            </p>
          </div>
          
          <p style="font-size: 14px; color: #888; margin-top: 30px;">
            En cas de problème technique, contactez-nous à support@kliqz.vercel.app
          </p>
        </div>
        <div class="footer">
          <p>© 2024 KLIQZ - Performance Marketing Agency</p>
          <p>Tous droits réservés</p>
        </div>
      </div>
    </body>
    </html>
  `;

  return sendEmail({ to: email, subject, html });
}
