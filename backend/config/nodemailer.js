const nodemailer = require('nodemailer');

let transporter;

// Create reusable transporter using SMTP transport
const createTransporter = () => {
  if (transporter) return transporter;

  transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    secure: process.env.EMAIL_SECURE === 'true',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASSWORD,
    },
  });

  return transporter;
};

const sendMail = async (mailOptions) => {
  const transport = createTransporter();
  
  // Add from address if not specified
  if (!mailOptions.from) {
    mailOptions.from = process.env.EMAIL_FROM || process.env.EMAIL_USER;
  }
  
  try {
    const info = await transport.sendMail(mailOptions);
    return info;
  } catch (error) {
    console.error('Error sending email:', error);
    throw error;
  }
};

module.exports = {
  createTransporter,
  sendMail
};