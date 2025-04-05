const Sequence = require('../models/Sequence');
const { getAgenda } = require('../config/agenda');

// Get all sequences for a user
exports.getSequences = async (req, res, next) => {
  try {
    const sequences = await Sequence.find({ user: req.user.id });

    res.status(200).json({
      success: true,
      count: sequences.length,
      data: sequences
    });
  } catch (error) {
    next(error);
  }
};

// Get a single sequence
exports.getSequence = async (req, res, next) => {
  try {
    const sequence = await Sequence.findById(req.params.id);

    if (!sequence) {
      return res.status(404).json({
        success: false,
        message: 'Sequence not found'
      });
    }

    // Check user owns sequence
    if (sequence.user.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to access this sequence'
      });
    }

    res.status(200).json({
      success: true,
      data: sequence
    });
  } catch (error) {
    next(error);
  }
};

// Create a new sequence
exports.createSequence = async (req, res, next) => {
  try {
    // Add user to request body
    req.body.user = req.user.id;
    
    // Extract data from ReactFlow
    const { nodes, edges } = req.body;
    
    const name = req.body.name || `Sequence ${Date.now()}`;

    // Create sequence
    const sequence = await Sequence.create({
      name,
      nodes,
      edges,
      user: req.user.id
    });

    // Process and schedule emails
    processSequenceEmails(sequence, req.user.email);

    res.status(201).json({
      success: true,
      data: sequence
    });
  } catch (error) {
    next(error);
  }
};

// Update a sequence
exports.updateSequence = async (req, res, next) => {
  try {
    let sequence = await Sequence.findById(req.params.id);

    if (!sequence) {
      return res.status(404).json({
        success: false,
        message: 'Sequence not found'
      });
    }

    // Check user owns sequence
    if (sequence.user.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this sequence'
      });
    }

    sequence = await Sequence.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });

    // Process and reschedule emails
    processSequenceEmails(sequence, req.user.email);

    res.status(200).json({
      success: true,
      data: sequence
    });
  } catch (error) {
    next(error);
  }
};

// Delete a sequence
exports.deleteSequence = async (req, res, next) => {
  try {
    const sequence = await Sequence.findById(req.params.id);

    if (!sequence) {
      return res.status(404).json({
        success: false,
        message: 'Sequence not found'
      });
    }

    // Check user owns sequence
    if (sequence.user.toString() !== req.user.id) {
      return res.status(403).json
      // Continued from the previous code...
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete this sequence'
      });
    }

    // Remove scheduled jobs for this sequence
    const agenda = getAgenda();
    await agenda.cancel({ 'data.sequenceId': sequence._id.toString() });

    await sequence.remove();

    res.status(200).json({
      success: true,
      data: {}
    });
  } catch (error) {
    next(error);
  }
};

// Helper function to process and schedule emails from a sequence flow
const processSequenceEmails = async (sequence, testEmail) => {
  try {
    const agenda = getAgenda();
    const { nodes, edges } = sequence;
    
    // Cancel any existing jobs for this sequence
    await agenda.cancel({ 'data.sequenceId': sequence._id.toString() });

    // Find start nodes (with no incoming edges)
    const startNodeIds = nodes
      .filter(node => !edges.some(edge => edge.target === node.id))
      .map(node => node.id);
    
    // Process each start node
    for (const startNodeId of startNodeIds) {
      await traverseAndSchedule(startNodeId, nodes, edges, 0, agenda, sequence._id, testEmail);
    }
  } catch (error) {
    console.error('Error processing sequence emails:', error);
  }
};

// Recursive function to traverse flow and schedule emails
const traverseAndSchedule = async (nodeId, nodes, edges, delayMinutes, agenda, sequenceId, testEmail) => {
  const node = nodes.find(n => n.id === nodeId);
  
  if (!node) return;
  
  // For Cold Email nodes
  if (node.type === 'coldEmail') {
    // Schedule this email
    await agenda.schedule(
      `in ${delayMinutes} minutes`,
      'send email',
      {
        to: testEmail, // In production, this would come from the lead source
        subject: node.data.subject,
        body: node.data.body,
        sequenceId: sequenceId.toString(),
        nodeId: node.id
      }
    );
  }
  
  // Add delay for Wait/Delay nodes
  if (node.type === 'delay') {
    const duration = node.data.duration || 0;
    const unit = node.data.unit || 'minutes';
    
    // Convert to minutes
    let additionalDelay = duration;
    if (unit === 'hours') additionalDelay *= 60;
    if (unit === 'days') additionalDelay *= 60 * 24;
    
    delayMinutes += additionalDelay;
  }
  
  // Find next nodes by looking at outgoing edges
  const outgoingEdges = edges.filter(edge => edge.source === node.id);
  
  // Traverse to each next node
  for (const edge of outgoingEdges) {
    await traverseAndSchedule(
      edge.target, 
      nodes, 
      edges, 
      delayMinutes, 
      agenda, 
      sequenceId, 
      testEmail
    );
  }
};

module.exports = exports;