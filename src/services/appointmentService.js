const appointmentModel = require('../models/appointmentModel');
const doctorModel = require('../models/doctorModel');

const HORARIOS_DISPONIVEIS = [
  '07:00', '08:00', '09:00', '10:00', '11:00', '12:00',
  '13:00', '14:00', '15:00', '16:00', '17:00', '18:00'
];

const appointmentService = {
  getAvailability(medicoId, data) {
    if (!medicoId || !data) {
      throw { status: 400, mensagem: 'Os campos medicoId e data são obrigatórios.' };
    }

    const doctor = doctorModel.findById(medicoId);
    if (!doctor) {
      throw { status: 404, mensagem: 'Médico não encontrado.' };
    }

    // Verifica se a data é dia útil (segunda a sexta)
    const dataObj = new Date(data + 'T12:00:00');
    const diaSemana = dataObj.getDay();
    if (diaSemana === 0 || diaSemana === 6) {
      throw { status: 400, mensagem: 'Agendamentos permitidos apenas de segunda a sexta-feira.' };
    }

    // Busca consultas já agendadas para o médico nessa data
    const consultasAgendadas = appointmentModel.findByDoctorAndDate(medicoId, data);
    const horariosOcupados = consultasAgendadas.map(c => c.horario);

    // Retorna horários livres
    const horariosLivres = HORARIOS_DISPONIVEIS.filter(h => !horariosOcupados.includes(h));

    return {
      medicoId,
      medico: doctor.nome,
      especialidade: doctor.especialidade,
      data,
      horariosDisponiveis: horariosLivres
    };
  },

  createAppointment(pacienteId, data) {
    const { medicoId, data: dataConsulta, horario } = data;

    if (!medicoId || !dataConsulta || !horario) {
      throw { status: 400, mensagem: 'Os campos medicoId, data e horario são obrigatórios.' };
    }

    // Verifica se o médico existe
    const doctor = doctorModel.findById(medicoId);
    if (!doctor) {
      throw { status: 404, mensagem: 'Médico não encontrado.' };
    }

    // Verifica se o horário é válido
    if (!HORARIOS_DISPONIVEIS.includes(horario)) {
      throw { status: 400, mensagem: 'Horário inválido. Horários permitidos: 07:00 às 18:00 (intervalos de 1 hora).' };
    }

    // Verifica se é dia útil (segunda a sexta)
    const dataObj = new Date(dataConsulta + 'T12:00:00');
    const diaSemana = dataObj.getDay();
    if (diaSemana === 0 || diaSemana === 6) {
      throw { status: 400, mensagem: 'Agendamentos permitidos apenas de segunda a sexta-feira.' };
    }

    // Verifica antecedência mínima de 30 minutos
    const agora = new Date();
    const dataHoraConsulta = new Date(`${dataConsulta}T${horario}:00`);
    const diffMinutos = (dataHoraConsulta - agora) / (1000 * 60);
    if (diffMinutos < 30) {
      throw { status: 400, mensagem: 'Consultas devem ser agendadas com no mínimo 30 minutos de antecedência.' };
    }

    // Verifica conflito de horário do médico (RN006)
    const conflitMedico = appointmentModel.findByDoctorAndDateTime(medicoId, dataConsulta, horario);
    if (conflitMedico) {
      throw { status: 409, mensagem: 'O médico já possui uma consulta agendada neste horário.' };
    }

    // Verifica conflito de horário do paciente (RN007)
    const conflitPaciente = appointmentModel.findByPatientAndDateTime(pacienteId, dataConsulta, horario);
    if (conflitPaciente) {
      throw { status: 409, mensagem: 'Você já possui uma consulta agendada neste horário.' };
    }

    const appointment = appointmentModel.create({
      pacienteId,
      medicoId,
      medicoNome: doctor.nome,
      especialidade: doctor.especialidade,
      data: dataConsulta,
      horario
    });

    return appointment;
  },

  getPatientAppointments(pacienteId) {
    return appointmentModel.findByPatientId(pacienteId);
  },

  cancelAppointment(appointmentId, pacienteId, motivo) {
    if (!motivo) {
      throw { status: 400, mensagem: 'O motivo do cancelamento é obrigatório.' };
    }

    const appointment = appointmentModel.findById(appointmentId);
    if (!appointment) {
      throw { status: 404, mensagem: 'Agendamento não encontrado.' };
    }

    if (appointment.pacienteId !== pacienteId) {
      throw { status: 403, mensagem: 'Você não tem permissão para cancelar este agendamento.' };
    }

    if (appointment.status === 'CANCELADA') {
      throw { status: 400, mensagem: 'Este agendamento já foi cancelado.' };
    }

    // Verifica antecedência mínima de 24 horas para cancelamento (RN010)
    const agora = new Date();
    const dataHoraConsulta = new Date(`${appointment.data}T${appointment.horario}:00`);
    const diffHoras = (dataHoraConsulta - agora) / (1000 * 60 * 60);
    if (diffHoras < 24) {
      throw { status: 400, mensagem: 'O cancelamento só é permitido com no mínimo 24 horas de antecedência.' };
    }

    return appointmentModel.cancel(appointmentId, motivo);
  }
};

module.exports = appointmentService;
