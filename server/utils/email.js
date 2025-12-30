const sgMail = require('@sendgrid/mail');
const dotenv = require('dotenv');

dotenv.config();

// Initialize SendGrid
if (process.env.SENDGRID_API_KEY) {
  sgMail.setApiKey(process.env.SENDGRID_API_KEY);
}

const sendEmail = async (to, subject, html) => {
  if (!process.env.SENDGRID_API_KEY) {
    console.log('SendGrid not configured - email not sent');
    console.log('To:', to);
    console.log('Subject:', subject);
    return { success: false, message: 'SendGrid not configured' };
  }

  try {
    const msg = {
      to,
      from: process.env.SENDGRID_FROM_EMAIL || 'hello@soulsirensomatics.com',
      subject,
      html
    };

    await sgMail.send(msg);
    console.log('Email sent successfully to:', to);
    return { success: true };
  } catch (error) {
    console.error('Error sending email:', error.message);
    if (error.response) {
      console.error('SendGrid error details:', error.response.body);
    }
    return { success: false, message: error.message };
  }
};

/**
 * Send email notification when scan results are ready
 * @param {string} userEmail - Client's email address
 * @param {string} userName - Client's name (first name or full name)
 * @param {string} scanDate - Date of the scan
 * @returns {Promise<{success: boolean, message?: string}>}
 */
const sendScanReadyEmail = async (userEmail, userName, scanDate) => {
  // Format the scan date nicely
  const formattedDate = new Date(scanDate).toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  const portalUrl = process.env.CLIENT_URL || 'https://soulsirensomatics.com';
  const scansUrl = `${portalUrl}/portal/scans`;

  const subject = 'Your Energetic Scan Results Are Ready - Soul Siren Somatics';

  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
    </head>
    <body style="margin: 0; padding: 0; font-family: 'Helvetica Neue', Arial, sans-serif; background-color: #f8f5f2;">
      <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f8f5f2; padding: 40px 20px;">
        <tr>
          <td align="center">
            <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 20px rgba(0,0,0,0.1);">
              <!-- Header -->
              <tr>
                <td style="background: linear-gradient(135deg, #2a1f35, #1a1225); padding: 40px 30px; text-align: center;">
                  <h1 style="margin: 0; color: #d4af7d; font-size: 28px; font-weight: 500; font-family: Georgia, serif;">Soul Siren Somatics</h1>
                  <p style="margin: 10px 0 0 0; color: rgba(255,255,255,0.8); font-size: 14px;">Energetic Healing & Transformation</p>
                </td>
              </tr>

              <!-- Gold Accent Line -->
              <tr>
                <td style="height: 4px; background: linear-gradient(90deg, #d4af7d, #e8c9a0);"></td>
              </tr>

              <!-- Content -->
              <tr>
                <td style="padding: 40px 30px;">
                  <h2 style="margin: 0 0 20px 0; color: #2a1f35; font-size: 24px; font-weight: 500; font-family: Georgia, serif;">
                    Your Scan Results Are Ready ✨
                  </h2>

                  <p style="margin: 0 0 20px 0; color: #6b5b7a; font-size: 16px; line-height: 1.6;">
                    Dear ${userName || 'Beautiful Soul'},
                  </p>

                  <p style="margin: 0 0 20px 0; color: #6b5b7a; font-size: 16px; line-height: 1.6;">
                    Your energetic scan from <strong style="color: #2a1f35;">${formattedDate}</strong> has been completed, and your personalized results are now available in your portal.
                  </p>

                  <p style="margin: 0 0 30px 0; color: #6b5b7a; font-size: 16px; line-height: 1.6;">
                    Your scan provides valuable insights into your current energetic state across physical, nervous system, and energetic dimensions. Use these insights to guide your healing journey.
                  </p>

                  <!-- CTA Button -->
                  <table width="100%" cellpadding="0" cellspacing="0">
                    <tr>
                      <td align="center">
                        <a href="${scansUrl}" style="display: inline-block; padding: 16px 40px; background: linear-gradient(135deg, #d4af7d, #e8c9a0); color: #2a1f35; text-decoration: none; font-weight: 600; font-size: 16px; border-radius: 30px;">
                          View Your Results
                        </a>
                      </td>
                    </tr>
                  </table>

                  <p style="margin: 30px 0 0 0; color: #9b7bb8; font-size: 14px; line-height: 1.6; text-align: center;">
                    <em>Questions about your scan? Reply to this email or book a session to discuss your results.</em>
                  </p>
                </td>
              </tr>

              <!-- Footer -->
              <tr>
                <td style="background-color: #f8f5f2; padding: 30px; text-align: center; border-top: 1px solid rgba(42,31,53,0.1);">
                  <p style="margin: 0 0 10px 0; color: #6b5b7a; font-size: 14px;">
                    With love and light,<br>
                    <strong style="color: #2a1f35;">Timberly @ Soul Siren Somatics</strong>
                  </p>
                  <p style="margin: 15px 0 0 0; color: #9b7bb8; font-size: 12px;">
                    <a href="${portalUrl}" style="color: #9b7bb8; text-decoration: none;">soulsirensomatics.com</a>
                  </p>
                </td>
              </tr>
            </table>
          </td>
        </tr>
      </table>
    </body>
    </html>
  `;

  // Log for development/debugging
  console.log(`[Email] Sending scan ready notification to: ${userEmail}`);
  console.log(`[Email] User: ${userName}, Scan Date: ${formattedDate}`);

  return sendEmail(userEmail, subject, html);
};

module.exports = { sendEmail, sendScanReadyEmail };
