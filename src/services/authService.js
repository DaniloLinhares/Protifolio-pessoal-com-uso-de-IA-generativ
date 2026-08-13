const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const userModel = require('../models/userModel');
const doctorModel = require('../models/doctorModel');
const { JWT_SECRET } = require('../middlewares/authMiddleware');

const authService = {
  login(email, senha) {
    // Busca em users (admin e pacientes)
    let user = userModel.findByEmail(email);
    let role = user ? user.role : null;

    // Busca em doctors
    if (!user) {
      const doctor = doctorModel.findAll().find(d => d.email === email);
      if (doctor) {
        user = doctor;
        role = 'MEDICO';
      }
    }

    if (!user) {
      throw { status: 401, mensagem: 'E-mail ou senha inválidos.' };
    }

    const senhaValida = bcrypt.compareSync(senha, user.senha);
    if (!senhaValida) {
      throw { status: 401, mensagem: 'E-mail ou senha inválidos.' };
    }

    const token = jwt.sign(
      { id: user.id, email: user.email, role: role },
      JWT_SECRET,
      { expiresIn: '8h' }
    );

    return {
      token,
      usuario: {
        id: user.id,
        nome: user.nome,
        email: user.email,
        role: role
      }
    };
  }
};

module.exports = authService;
