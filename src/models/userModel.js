const { database } = require('./database');
const { v4: uuidv4 } = require('uuid');

const userModel = {
  findAll() {
    return database.users;
  },

  findById(id) {
    return database.users.find(u => u.id === id);
  },

  findByEmail(email) {
    return database.users.find(u => u.email === email);
  },

  findByCpf(cpf) {
    return database.users.find(u => u.cpf === cpf);
  },

  create(userData) {
    const user = {
      id: uuidv4(),
      ...userData,
      criadoEm: new Date().toISOString()
    };
    database.users.push(user);
    return user;
  }
};

module.exports = userModel;
