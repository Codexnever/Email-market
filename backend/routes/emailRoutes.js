const express = require('express');
const {
  scheduleEmail,
  getScheduledEmails,
  cancelScheduledEmail
} = require('../controllers/emailController');
const { protect } = require('../middleware/auth');

const router = express.Router();

router.use(protect); // Protect all routes

router.route('/schedule')
  .post(scheduleEmail);

router.route('/')
  .get(getScheduledEmails);

router.route('/:jobId')
  .delete(cancelScheduledEmail);

module.exports = router;