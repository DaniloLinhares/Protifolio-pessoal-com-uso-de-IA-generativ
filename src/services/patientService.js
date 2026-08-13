const bcrypt = require('bcryptjs');
const userModel = require('../models/userModel');

const patientService = {
  register(data) {
    const { nome, cpf, email, telefone, senha } = data;

    if (!nome || !cpf || !email || !telefone || !senha) {
      throw { status: 400, mensagem: 'Todos os campos são obrigatórios: nome, cpf, email, telefone, senha.' };
    }

    // Verifica unicidade de e-mail
    const emailExiste = userModel.findByEmail(email);
    if (emailExiste) {
      throw { status: 409, mensagem: 'E-mail já cadastrado no sistema.' };
    }

    // Verifica unicidade de CPF
    const cpfExiste = userModel.findByCpf(cpf);
    if (cpfExiste) {
      throw { status: 409, mensagem: 'CPF já cadastrado no sistema.' };
    }

    const hashedPassword = bcrypt.hashSync(senha, 10);

    const patient = userModel.create({
      nome,
      cpf,
      email,
      telefone,
      senha: hashedPassword,
      role: 'PACIENTE'
    });

    // Retorna sem a senha
    const { senha: _, ...patientWithoutPassword } = patient;
    return patientWithoutPassword;
  }
};

module.exports = patientService;
