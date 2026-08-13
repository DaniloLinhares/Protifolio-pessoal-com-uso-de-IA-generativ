const express = require('express');
const router = express.Router();
const appointmentController = require('../controllers/appointmentController');
const { authMiddleware } = require('../middlewares/authMiddleware');
const { authorize } = require('../middlewares/rbacMiddleware');

// GET /api/v1/agendamentos/disponibilidade - Consultar disponibilidade (autenticado)
router.get('/disponibilidade', authMiddleware, appointmentController.getAvailability);

// POST /api/v1/agendamentos - Criar agendamento (somente PACIENTE)
router.post('/', authMiddleware, authorize('PACIENTE'), appointmentController.create);

// GET /api/v1/agendamentos - Consultar meus agendamentos (somente PACIENTE)
router.get('/', authMiddleware, authorize('PACIENTE'), appointmentController.getMyAppointments);

// PATCH /api/v1/agendamentos/:id/cancelar - Cancelar agendamento (somente PACIENTE)
router.patch('/:id/cancelar', authMiddleware, authorize('PACIENTE'), appointmentController.cancel);

module.exports = router;
