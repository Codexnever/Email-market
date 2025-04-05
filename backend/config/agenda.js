const Agenda = require('agenda');
const nodemailer = require('./nodemailer');

let agenda = null;

const initAgenda = async (mongoConnectionString) => {
  if (agenda) return agenda;

  agenda = new Agenda({
    db: {
      address: mongoConnectionString,
      collection: 'jobs',
      options: { useUnifiedTopology: true }
    },
    processEvery: '1 minute'
  });

  // Define jobs
  agenda.define('send email', async (job) => {
    const { to, subject, body } = job.attrs.data;
    
    try {
      console.log(`Sending email to ${to}`);
      await nodemailer.sendMail({
        to,
        subject,
        html: body
      });
      console.log(`Email sent successfully to ${to}`);
    } catch (error) {
      console.error('Failed to send email:', error);
      throw error;
    }
  });

  await agenda.start();
  console.log('Agenda started');
  return agenda;
};

module.exports = {
  initAgenda,
  getAgenda: () => agenda
};