const bcrypt = require('bcryptjs');
const doctorModel = require('../models/doctorModel');
const userModel = require('../models/userModel');

const doctorService = {
  register(data) {
    const { nome, crm, especialidade, email, senha } = data;

    if (!nome || !crm || !especialidade || !email || !senha) {
      throw { status: 400, mensagem: 'Todos os campos são obrigatórios: nome, crm, especialidade, email, senha.' };
    }

    // Verifica unicidade de CRM
    const crmExiste = doctorModel.findByCrm(crm);
    if (crmExiste) {
      throw { status: 409, mensagem: 'CRM já cadastrado no sistema.' };
    }

    // Verifica unicidade de e-mail (em users e doctors)
    const emailEmUsers = userModel.findByEmail(email);
    const emailEmDoctors = doctorModel.findAll().find(d => d.email === email);
    if (emailEmUsers || emailEmDoctors) {
      throw { status: 409, mensagem: 'E-mail já cadastrado no sistema.' };
    }

    const hashedPassword = bcrypt.hashSync(senha, 10);

    const doctor = doctorModel.create({
      nome,
      crm,
      especialidade,
      email,
      senha: hashedPassword,
      role: 'MEDICO'
    });

    // Retorna sem a senha
    const { senha: _, ...doctorWithoutPassword } = doctor;
    return doctorWithoutPassword;
  },

  listAll() {
    return doctorModel.findAll().map(d => {
      const { senha, ...doctorWithoutPassword } = d;
      return doctorWithoutPassword;
    });
  }
};

module.exports = doctorService;
