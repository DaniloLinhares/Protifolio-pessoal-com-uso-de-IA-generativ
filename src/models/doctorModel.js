const { database } = require('./database');
const { v4: uuidv4 } = require('uuid');

const doctorModel = {
  findAll() {
    return database.doctors;
  },

  findById(id) {
    return database.doctors.find(d => d.id === id);
  },

  findByCrm(crm) {
    return database.doctors.find(d => d.crm === crm);
  },

  create(doctorData) {
    const doctor = {
      id: uuidv4(),
      ...doctorData,
      criadoEm: new Date().toISOString()
    };
    database.doctors.push(doctor);
    return doctor;
  }
};

module.exports = doctorModel;
