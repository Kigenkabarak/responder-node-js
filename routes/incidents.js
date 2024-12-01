const express = require('express');
const router = express.Router();
const upload = require('../middleware/upload');
const {
  createIncident,
  getAllIncidents,
  getIncidentById,
  updateIncidentStatus,
  deleteIncident
} = require('../controllers/incidentController');

// GET all incidents
router.get('/', getAllIncidents);

// GET single incident by ID
router.get('/:id', getIncidentById);

// POST create a new incident
router.post('/', upload.array('media_files', 5), createIncident);

// PATCH update incident status
router.patch('/:id', updateIncidentStatus);

// DELETE an incident
router.delete('/:id', deleteIncident);

module.exports = router;