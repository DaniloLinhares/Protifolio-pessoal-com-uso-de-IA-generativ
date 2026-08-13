const { database } = require('./database');
const { v4: uuidv4 } = require('uuid');

const appointmentModel = {
  findAll() {
    return database.appointments;
  },

  findById(id) {
    return database.appointments.find(a => a.id === id);
  },

  findByPatientId(pacienteId) {
    return database.appointments.filter(a => a.pacienteId === pacienteId);
  },

  findByDoctorAndDate(medicoId, data) {
    return database.appointments.filter(
      a => a.medicoId === medicoId && a.data === data && a.status === 'AGENDADA'
    );
  },

  findByPatientAndDateTime(pacienteId, data, horario) {
    return database.appointments.find(
      a => a.pacienteId === pacienteId && a.data === data && a.horario === horario && a.status === 'AGENDADA'
    );
  },

  findByDoctorAndDateTime(medicoId, data, horario) {
    return database.appointments.find(
      a => a.medicoId === medicoId && a.data === data && a.horario === horario && a.status === 'AGENDADA'
    );
  },

  create(appointmentData) {
    const appointment = {
      id: uuidv4(),
      ...appointmentData,
      status: 'AGENDADA',
      criadoEm: new Date().toISOString()
    };
    database.appointments.push(appointment);
    return appointment;
  },

  cancel(id, motivo) {
    const appointment = database.appointments.find(a => a.id === id);
    if (appointment) {
      appointment.status = 'CANCELADA';
      appointment.motivoCancelamento = motivo;
      appointment.canceladoEm = new Date().toISOString();
    }
    return appointment;
  }
};

module.exports = appointmentModel;
