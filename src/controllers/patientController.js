const patientService = require('../services/patientService');

const patientController = {
  register(req, res) {
    try {
      const patient = patientService.register(req.body);
      return res.status(201).json(patient);
    } catch (error) {
      const status = error.status || 500;
      const mensagem = error.mensagem || 'Erro interno do servidor.';
      return res.status(status).json({ erro: mensagem });
    }
  }
};

module.exports = patientController;
