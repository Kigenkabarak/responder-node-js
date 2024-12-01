const Incident = require('../models/Incident');
const fs = require('fs');
const path = require('path');

exports.createIncident = async (req, res) => {
  try {
    const { description, latitude, longitude, type, severity, timestamp } = req.body;
    
    // Prepare media files
    const mediaFiles = req.files ? req.files.map(file => ({
      file_name: file.filename,
      url: `${req.protocol}://${req.get('host')}/uploads/${file.filename}`,
      content_type: file.mimetype
    })) : [];

    // Create new incident
    const incident = new Incident({
      description,
      latitude: parseFloat(latitude),
      longitude: parseFloat(longitude),
      type,
      severity,
      timestamp: timestamp ? new Date(timestamp) : new Date(),
      media_files: mediaFiles
    });

    // Save incident
    await incident.save();

    res.status(201).json(incident);
  } catch (error) {
    console.error('Create incident error:', error);
    res.status(500).json({ message: 'Error creating incident', error: error.message });
  }
};

exports.getAllIncidents = async (req, res) => {
  try {
    // Sort by most recent first
    const incidents = await Incident.find().sort({ createdAt: -1 });
    res.json(incidents);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching incidents', error: error.message });
  }
};

exports.getIncidentById = async (req, res) => {
  try {
    const incident = await Incident.findById(req.params.id);
    
    if (!incident) {
      return res.status(404).json({ message: 'Incident not found' });
    }
    
    res.json(incident);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching incident', error: error.message });
  }
};

exports.updateIncidentStatus = async (req, res) => {
  try {
    const { status } = req.body;
    
    const incident = await Incident.findByIdAndUpdate(
      req.params.id, 
      { status }, 
      { new: true, runValidators: true }
    );
    
    if (!incident) {
      return res.status(404).json({ message: 'Incident not found' });
    }
    
    res.json(incident);
  } catch (error) {
    res.status(500).json({ message: 'Error updating incident status', error: error.message });
  }
};

exports.deleteIncident = async (req, res) => {
  try {
    const incident = await Incident.findByIdAndDelete(req.params.id);
    
    if (!incident) {
      return res.status(404).json({ message: 'Incident not found' });
    }
    
    // Clean up media files
    incident.media_files.forEach(media => {
      const filePath = path.join(process.cwd(), 'uploads', media.file_name);
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
    });
    
    res.json({ message: 'Incident deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting incident', error: error.message });
  }
};