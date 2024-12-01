const mongoose = require('mongoose');

const IncidentSchema = new mongoose.Schema({
  description: {
    type: String,
    required: true,
    trim: true
  },
  latitude: {
    type: Number,
    required: true
  },
  longitude: {
    type: Number,
    required: true
  },
  type: {
    type: String,
    default: 'Fire',
    enum: ['Fire', 'Accident', 'Medical', 'Other']
  },
  severity: {
    type: String,
    default: 'Medium',
    enum: ['Low', 'Medium', 'High']
  },
  status: {
    type: String,
    default: 'Pending',
    enum: ['Pending', 'In Progress', 'Resolved']
  },
  timestamp: {
    type: Date,
    default: Date.now
  },
  media_files: [{
    file_name: String,
    url: String,
    content_type: String
  }]
}, {
  timestamps: true
});

module.exports = mongoose.model('Incident', IncidentSchema);