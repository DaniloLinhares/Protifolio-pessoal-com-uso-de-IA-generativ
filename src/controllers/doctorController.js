const doctorService = require('../services/doctorService');

const doctorController = {
  register(req, res) {
    try {
      const doctor = doctorService.register(req.body);
      return res.status(201).json(doctor);
    } catch (error) {
      const status = error.status || 500;
      const mensagem = error.mensagem || 'Erro interno do servidor.';
      return res.status(status).json({ erro: mensagem });
    }
  },

  listAll(req, res) {
    try {
      const doctors = doctorService.listAll();
      return res.status(200).json(doctors);
    } catch (error) {
      return res.status(500).json({ erro: 'Erro interno do servidor.' });
    }
  }
};

module.exports = doctorController;
