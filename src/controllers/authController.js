const authService = require('../services/authService');

const authController = {
  login(req, res) {
    try {
      const { email, senha } = req.body;

      if (!email || !senha) {
        return res.status(400).json({ erro: 'Os campos email e senha são obrigatórios.' });
      }

      const result = authService.login(email, senha);
      return res.status(200).json(result);
    } catch (error) {
      const status = error.status || 500;
      const mensagem = error.mensagem || 'Erro interno do servidor.';
      return res.status(status).json({ erro: mensagem });
    }
  }
};

module.exports = authController;
