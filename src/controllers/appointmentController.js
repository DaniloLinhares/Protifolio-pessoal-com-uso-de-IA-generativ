const appointmentService = require('../services/appointmentService');

const appointmentController = {
  getAvailability(req, res) {
    try {
      const { medicoId, data } = req.query;
      const result = appointmentService.getAvailability(medicoId, data);
      return res.status(200).json(result);
    } catch (error) {
      const status = error.status || 500;
      const mensagem = error.mensagem || 'Erro interno do servidor.';
      return res.status(status).json({ erro: mensagem });
    }
  },

  create(req, res) {
    try {
      const pacienteId = req.user.id;
      const appointment = appointmentService.createAppointment(pacienteId, req.body);
      return res.status(201).json(appointment);
    } catch (error) {
      const status = error.status || 500;
      const mensagem = error.mensagem || 'Erro interno do servidor.';
      return res.status(status).json({ erro: mensagem });
    }
  },

  getMyAppointments(req, res) {
    try {
      const pacienteId = req.user.id;
      const appointments = appointmentService.getPatientAppointments(pacienteId);
      return res.status(200).json(appointments);
    } catch (error) {
      return res.status(500).json({ erro: 'Erro interno do servidor.' });
    }
  },

  cancel(req, res) {
    try {
      const pacienteId = req.user.id;
      const { id } = req.params;
      const { motivo } = req.body;
      const appointment = appointmentService.cancelAppointment(id, pacienteId, motivo);
      return res.status(200).json(appointment);
    } catch (error) {
      const status = error.status || 500;
      const mensagem = error.mensagem || 'Erro interno do servidor.';
      return res.status(status).json({ erro: mensagem });
    }
  }
};

module.exports = appointmentController;
