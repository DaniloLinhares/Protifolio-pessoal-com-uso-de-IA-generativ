const express = require('express');
const router = express.Router();

const authRoutes = require('./authRoutes');
const patientRoutes = require('./patientRoutes');
const doctorRoutes = require('./doctorRoutes');
const appointmentRoutes = require('./appointmentRoutes');

router.use('/', authRoutes);
router.use('/pacientes', patientRoutes);
router.use('/medicos', doctorRoutes);
router.use('/agendamentos', appointmentRoutes);

module.exports = router;
