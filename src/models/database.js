const bcrypt = require('bcryptjs');
const { v4: uuidv4 } = require('uuid');

// Banco de dados em memória
const database = {
  users: [],
  doctors: [],
  appointments: []
};

// Carga inicial (Seed) - Usuário ADMIN
const seedAdmin = () => {
  const adminExists = database.users.find(u => u.email === 'admin@clinica.com');
  if (!adminExists) {
    const hashedPassword = bcrypt.hashSync('Admin@123', 10);
    database.users.push({
      id: uuidv4(),
      nome: 'Administrador do Sistema',
      email: 'admin@clinica.com',
      senha: hashedPassword,
      role: 'ADMIN',
      criadoEm: new Date().toISOString()
    });
    console.log('✔ Usuário ADMIN criado com sucesso (Seed).');
  }
};

module.exports = { database, seedAdmin };
