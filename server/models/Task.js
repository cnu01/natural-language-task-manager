const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
  task_name: {
    type: String,
    required: true,
    trim: true
  },
  assignee: {
    type: String,
    trim: true,
    default: null
  },
  due_datetime: {
    type: Date,
    default: null
  },
  priority: {
    type: String,
    enum: ['P1', 'P2', 'P3', 'P4'],
    default: 'P3'
  },
  natural_text: {
    type: String,
    required: true
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Task', taskSchema);
