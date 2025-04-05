const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Agenda = require('agenda');
const { errorHandler } = require('./utils/errorHandler');

// Load environment variables
dotenv.config();

// Import routes
const authRoutes = require('./routes/authRoutes');
const sequenceRoutes = require('./routes/sequenceRoutes');
const emailRoutes = require('./routes/emailRoutes');

// Initialize Express app
const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('MongoDB connection error:', err));

// Initialize Agenda
const agenda = new Agenda({
  db: {
    address: process.env.MONGODB_URI,
    collection: 'jobs'
  },
  processEvery: '1 minute'
});

// Make agenda available to route handlers
app.use((req, res, next) => {
  req.agenda = agenda;
  next();
});

// Define routes
app.use('/api/auth', authRoutes);
app.use('/api/sequences', sequenceRoutes);
app.use('/api/emails', emailRoutes);

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).send('Server is running');
});

// Error handling middleware
app.use(errorHandler);

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

// Start Agenda
(async function() {
  await agenda.start();
  console.log('Agenda started');
})();

module.exports = app;