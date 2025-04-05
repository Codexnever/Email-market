const nodemailer = require('../config/nodemailer');

// Send an email
exports.sendEmail = async (emailData) => {
  try {
    const { to, subject, body, cc, bcc } = emailData;
    
    // Prepare mail options
    const mailOptions = {
      to,
      subject,
      html: body
    };
    
    // Add cc and bcc if provided
    if (cc) mailOptions.cc = cc;
    if (bcc) mailOptions.bcc = bcc;
    
    // Send email
    const result = await nodemailer.sendMail(mailOptions);
    return result;
  } catch (error) {
    console.error('Error sending email:', error);
    throw error;
  }
};

// Parse HTML email templates
exports.parseTemplate = (template, data) => {
  let result = template;
  
  // Replace variables in template
  Object.keys(data).forEach(key => {
    const regex = new RegExp(`{{${key}}}`, 'g');
    result = result.replace(regex, data[key]);
  });
  
  return result;
};

module.exports = exports;