const { getAgenda } = require('../config/agenda');

// Schedule an email
exports.scheduleEmail = async (req, res, next) => {
  try {
    const { to, subject, body, delay } = req.body;
    
    // Validate required fields
    if (!to || !subject || !body) {
      return res.status(400).json({
        success: false,
        message: 'Please provide to, subject, and body fields'
      });
    }
    
    // Default delay is 1 hour if not specified
    const delayTime = delay || 60;
    
    // Get agenda instance
    const agenda = getAgenda();
    
    // Schedule the email job
    const job = await agenda.schedule(
      `in ${delayTime} minutes`,
      'send email',
      {
        to,
        subject,
        body,
        userId: req.user.id
      }
    );
    
    res.status(200).json({
      success: true,
      data: {
        jobId: job.attrs._id,
        scheduledAt: job.attrs.nextRunAt
      }
    });
  } catch (error) {
    next(error);
  }
};

// Get all scheduled emails for a user
exports.getScheduledEmails = async (req, res, next) => {
  try {
    const agenda = getAgenda();
    
    const jobs = await agenda.jobs({
      'data.userId': req.user.id,
      name: 'send email'
    });
    
    const formattedJobs = jobs.map(job => ({
      id: job.attrs._id,
      to: job.attrs.data.to,
      subject: job.attrs.data.subject,
      scheduledAt: job.attrs.nextRunAt
    }));
    
    res.status(200).json({
      success: true,
      count: formattedJobs.length,
      data: formattedJobs
    });
  } catch (error) {
    next(error);
  }
};

// Cancel a scheduled email
exports.cancelScheduledEmail = async (req, res, next) => {
  try {
    const { jobId } = req.params;
    const agenda = getAgenda();
    
    // Get the job
    const jobs = await agenda.jobs({
      _id: agenda.mongo.ObjectId(jobId),
      'data.userId': req.user.id
    });
    
    if (jobs.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Scheduled email not found or not authorized'
      });
    }
    
    // Cancel the job
    await jobs[0].remove();
    
    res.status(200).json({
      success: true,
      data: {}
    });
  } catch (error) {
    next(error);
  }
};

module.exports = exports;