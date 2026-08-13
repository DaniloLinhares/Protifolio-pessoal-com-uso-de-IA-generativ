const express = require('express');
const router = express.Router();
const patientController = require('../controllers/patientController');

// POST /api/v1/pacientes - Autocadastro de paciente (público)
router.post('/', patientController.register);

module.exports = router;
