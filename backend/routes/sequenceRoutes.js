const express = require('express');
const {
  getSequences,
  getSequence,
  createSequence,
  updateSequence,
  deleteSequence
} = require('../controllers/sequenceController');
const { protect } = require('../middleware/auth');

const router = express.Router();

router.use(protect); // Protect all routes

router.route('/')
  .get(getSequences)
  .post(createSequence);

router.route('/:id')
  .get(getSequence)
  .put(updateSequence)
  .delete(deleteSequence);

module.exports = router;