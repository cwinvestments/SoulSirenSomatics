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

module.exports = { sendEmail };
