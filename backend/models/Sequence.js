const mongoose = require('mongoose');

const SequenceSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please provide a sequence name'],
    trim: true
  },
  nodes: {
    type: Array,
    required: [true, 'Sequence nodes are required']
  },
  edges: {
    type: Array,
    required: [true, 'Sequence edges are required']
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  active: {
    type: Boolean,
    default: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Update the updatedAt field
SequenceSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('Sequence', SequenceSchema);