const { test, expect } = require('@playwright/test');
const AppointmentPage = require('./pages/AppointmentPage');
const PatientPage = require('./pages/PatientPage');
const DoctorPage = require('./pages/DoctorPage');
const AuthPage = require('./pages/AuthPage');
const { getNextWeekday, getNextSaturday, getNextSunday } = require('./helpers/dateHelper');
const { createApiContext, getAdminToken, createPatientAndLogin, createDoctor } = require('./helpers/setupHelper');

test.describe('Consulta Disponibilidade', () => {
  let medicoId;
  let pacienteToken;

  test.beforeAll(async () => {
    const ctx = await createApiContext();
    const adminToken = await getAdminToken(ctx);
    const doctor = await createDoctor(ctx, adminToken, { nome: 'Dr. Disponibilidade' });
    medicoId = doctor.id;
    const patient = await createPatientAndLogin(ctx);
    pacienteToken = patient.token;
    await ctx.dispose();
  });

  test('CT025 - Consultar disponibilidade em dia útil sem agendamentos', async ({ request }) => {
    const appointmentPage = new AppointmentPage(request);
    const data = getNextWeekday(14);
    const response = await appointmentPage.getAvailability(medicoId, data, pacienteToken);
    const body = await response.json();

    expect(response.status()).toBe(200);
    expect(body.horariosDisponiveis).toHaveLength(12);
    expect(body.medico).toBe('Dr. Disponibilidade');
  });

  test('CT026 - Disponibilidade com horário já agendado', async ({ request }) => {
    const appointmentPage = new AppointmentPage(request);
    const data = getNextWeekday(15);

    await appointmentPage.create({ medicoId, data, horario: '10:00' }, pacienteToken);

    const response = await appointmentPage.getAvailability(medicoId, data, pacienteToken);
    const body = await response.json();

    expect(response.status()).toBe(200);
    expect(body.horariosDisponiveis).toHaveLength(11);
    expect(body.horariosDisponiveis).not.toContain('10:00');
  });

  test('CT027 - Consultar disponibilidade em sábado', async ({ request }) => {
    const appointmentPage = new AppointmentPage(request);
    const response = await appointmentPage.getAvailability(medicoId, getNextSaturday(), pacienteToken);
    const body = await response.json();

    expect(response.status()).toBe(400);
    expect(body.erro).toBe('Agendamentos permitidos apenas de segunda a sexta-feira.');
  });

  test('CT028 - Consultar disponibilidade em domingo', async ({ request }) => {
    const appointmentPage = new AppointmentPage(request);
    const response = await appointmentPage.getAvailability(medicoId, getNextSunday(), pacienteToken);
    const body = await response.json();

    expect(response.status()).toBe(400);
    expect(body.erro).toBe('Agendamentos permitidos apenas de segunda a sexta-feira.');
  });

  test('CT029 - Consultar disponibilidade com médico inexistente', async ({ request }) => {
    const appointmentPage = new AppointmentPage(request);
    const response = await appointmentPage.getAvailability('id-nao-existente', getNextWeekday(), pacienteToken);
    const body = await response.json();

    expect(response.status()).toBe(404);
    expect(body.erro).toBe('Médico não encontrado.');
  });

  test('CT030 - Consultar disponibilidade sem medicoId', async ({ request }) => {
    const appointmentPage = new AppointmentPage(request);
    const response = await appointmentPage.getAvailability(null, getNextWeekday(), pacienteToken);
    const body = await response.json();

    expect(response.status()).toBe(400);
    expect(body.erro).toBe('Os campos medicoId e data são obrigatórios.');
  });

  test('CT031 - Consultar disponibilidade sem data', async ({ request }) => {
    const appointmentPage = new AppointmentPage(request);
    const response = await appointmentPage.getAvailability(medicoId, null, pacienteToken);
    const body = await response.json();

    expect(response.status()).toBe(400);
    expect(body.erro).toBe('Os campos medicoId e data são obrigatórios.');
  });
});

test.describe('Criar Agendamento', () => {
  let medicoId;
  let medicoId2;
  let pacienteToken;
  let pacienteToken2;
  let adminToken;

  test.beforeAll(async () => {
    const ctx = await createApiContext();
    adminToken = await getAdminToken(ctx);

    const doctor1 = await createDoctor(ctx, adminToken, { nome: 'Dr. Agendamento', especialidade: 'Dermatologia' });
    medicoId = doctor1.id;

    const doctor2 = await createDoctor(ctx, adminToken, { nome: 'Dra. Segunda', especialidade: 'Pediatria' });
    medicoId2 = doctor2.id;

    const patient1 = await createPatientAndLogin(ctx);
    pacienteToken = patient1.token;

    const patient2 = await createPatientAndLogin(ctx);
    pacienteToken2 = patient2.token;

    await ctx.dispose();
  });

  test('CT032 - Criar agendamento com dados válidos', async ({ request }) => {
    const appointmentPage = new AppointmentPage(request);
    const response = await appointmentPage.create({ medicoId, data: getNextWeekday(16), horario: '10:00' }, pacienteToken);
    const body = await response.json();

    expect(response.status()).toBe(201);
    expect(body.status).toBe('AGENDADA');
    expect(body.id).toBeTruthy();
    expect(body.medicoNome).toBe('Dr. Agendamento');
  });

  test('CT033 - Criar agendamento com médico inexistente', async ({ request }) => {
    const appointmentPage = new AppointmentPage(request);
    const response = await appointmentPage.create({ medicoId: 'id-fake', data: getNextWeekday(), horario: '10:00' }, pacienteToken);
    const body = await response.json();

    expect(response.status()).toBe(404);
    expect(body.erro).toBe('Médico não encontrado.');
  });

  test('CT034 - Criar agendamento em horário fora do expediente', async ({ request }) => {
    const appointmentPage = new AppointmentPage(request);
    const response = await appointmentPage.create({ medicoId, data: getNextWeekday(), horario: '06:00' }, pacienteToken);
    const body = await response.json();

    expect(response.status()).toBe(400);
    expect(body.erro).toBe('Horário inválido. Horários permitidos: 07:00 às 18:00 (intervalos de 1 hora).');
  });

  test('CT035 - Criar agendamento em fim de semana', async ({ request }) => {
    const appointmentPage = new AppointmentPage(request);
    const response = await appointmentPage.create({ medicoId, data: getNextSaturday(), horario: '10:00' }, pacienteToken);
    const body = await response.json();

    expect(response.status()).toBe(400);
    expect(body.erro).toBe('Agendamentos permitidos apenas de segunda a sexta-feira.');
  });

  test('CT037 - Conflito de horário do médico', async ({ request }) => {
    const appointmentPage = new AppointmentPage(request);
    const data = getNextWeekday(17);

    await appointmentPage.create({ medicoId, data, horario: '14:00' }, pacienteToken);
    const response = await appointmentPage.create({ medicoId, data, horario: '14:00' }, pacienteToken2);
    const body = await response.json();

    expect(response.status()).toBe(409);
    expect(body.erro).toBe('O médico já possui uma consulta agendada neste horário.');
  });

  test('CT038 - Conflito de horário do paciente', async ({ request }) => {
    const appointmentPage = new AppointmentPage(request);
    const data = getNextWeekday(18);

    await appointmentPage.create({ medicoId, data, horario: '09:00' }, pacienteToken);
    const response = await appointmentPage.create({ medicoId: medicoId2, data, horario: '09:00' }, pacienteToken);
    const body = await response.json();

    expect(response.status()).toBe(409);
    expect(body.erro).toBe('Você já possui uma consulta agendada neste horário.');
  });

  test('CT039 - Criar agendamento sem campo obrigatório', async ({ request }) => {
    const appointmentPage = new AppointmentPage(request);
    const response = await appointmentPage.create({ medicoId, data: getNextWeekday() }, pacienteToken);
    const body = await response.json();

    expect(response.status()).toBe(400);
    expect(body.erro).toBe('Os campos medicoId, data e horario são obrigatórios.');
  });

  test('CT040 - Admin tenta criar agendamento (RBAC)', async ({ request }) => {
    const appointmentPage = new AppointmentPage(request);
    const response = await appointmentPage.create({ medicoId, data: getNextWeekday(), horario: '11:00' }, adminToken);
    const body = await response.json();

    expect(response.status()).toBe(403);
    expect(body.erro).toBe('Acesso negado. Permissão insuficiente.');
  });

  test('CT041 - Criar agendamento sem autenticação', async ({ request }) => {
    const response = await request.post('/api/v1/agendamentos', {
      data: { medicoId, data: getNextWeekday(), horario: '11:00' },
    });
    const body = await response.json();

    expect(response.status()).toBe(401);
    expect(body.erro).toBe('Token não fornecido.');
  });
});

test.describe('Consultar Agendamentos do Paciente', () => {
  let pacienteToken;
  let adminToken;

  test.beforeAll(async () => {
    const ctx = await createApiContext();
    adminToken = await getAdminToken(ctx);

    const patient = await createPatientAndLogin(ctx);
    pacienteToken = patient.token;

    const doctor = await createDoctor(ctx, adminToken);
    const appointmentPage = new AppointmentPage(ctx);
    await appointmentPage.create({ medicoId: doctor.id, data: getNextWeekday(20), horario: '08:00' }, pacienteToken);

    await ctx.dispose();
  });

  test('CT042 - Consultar agendamentos do paciente autenticado', async ({ request }) => {
    const appointmentPage = new AppointmentPage(request);
    const response = await appointmentPage.getMyAppointments(pacienteToken);
    const body = await response.json();

    expect(response.status()).toBe(200);
    expect(Array.isArray(body)).toBe(true);
    expect(body.length).toBeGreaterThanOrEqual(1);
    expect(body[0].medicoNome).toBeTruthy();
    expect(body[0].status).toBeTruthy();
  });

  test('CT043 - Paciente sem agendamentos recebe array vazio', async ({ request }) => {
    const patientPage = new PatientPage(request);
    const authPage = new AuthPage(request);
    const appointmentPage = new AppointmentPage(request);

    const pacEmail = `pac.vazio.${Date.now()}@email.com`;
    await patientPage.register({
      nome: 'Paciente Vazio',
      cpf: `vazio-${Date.now()}`,
      email: pacEmail,
      telefone: '(11) 99999-0000',
      senha: 'Paciente@123',
    });
    const loginResp = await authPage.login(pacEmail, 'Paciente@123');
    const token = (await loginResp.json()).token;

    const response = await appointmentPage.getMyAppointments(token);
    const body = await response.json();

    expect(response.status()).toBe(200);
    expect(body).toEqual([]);
  });

  test('CT044 - Admin tenta consultar agendamentos (RBAC)', async ({ request }) => {
    const appointmentPage = new AppointmentPage(request);
    const response = await appointmentPage.getMyAppointments(adminToken);
    const body = await response.json();

    expect(response.status()).toBe(403);
    expect(body.erro).toBe('Acesso negado. Permissão insuficiente.');
  });

  test('CT045 - Isolamento de dados entre pacientes', async ({ request }) => {
    const patientPage = new PatientPage(request);
    const authPage = new AuthPage(request);
    const doctorPage = new DoctorPage(request);
    const appointmentPage = new AppointmentPage(request);

    // Paciente A
    const emailA = `pac.iso.a.${Date.now()}@email.com`;
    await patientPage.register({ nome: 'Paciente A', cpf: `iso-a-${Date.now()}`, email: emailA, telefone: '(11) 99999-0001', senha: 'Paciente@123' });
    const tokenA = (await (await authPage.login(emailA, 'Paciente@123')).json()).token;

    // Paciente B
    const emailB = `pac.iso.b.${Date.now()}@email.com`;
    await patientPage.register({ nome: 'Paciente B', cpf: `iso-b-${Date.now()}`, email: emailB, telefone: '(11) 99999-0002', senha: 'Paciente@123' });
    const tokenB = (await (await authPage.login(emailB, 'Paciente@123')).json()).token;

    // Médico
    const docResp = await doctorPage.register({ nome: 'Dr. Isolamento', crm: `CRM/SP ISO-${Date.now()}`, especialidade: 'Clínico', email: `iso.${Date.now()}@clinica.com`, senha: 'Medico@123' }, adminToken);
    const medicoId = (await docResp.json()).id;

    const dataA = getNextWeekday(21);
    const dataB = getNextWeekday(22);

    await appointmentPage.create({ medicoId, data: dataA, horario: '07:00' }, tokenA);
    await appointmentPage.create({ medicoId, data: dataB, horario: '08:00' }, tokenB);

    const bodyA = await (await appointmentPage.getMyAppointments(tokenA)).json();
    expect(bodyA).toHaveLength(1);
    expect(bodyA[0].data).toBe(dataA);

    const bodyB = await (await appointmentPage.getMyAppointments(tokenB)).json();
    expect(bodyB).toHaveLength(1);
    expect(bodyB[0].data).toBe(dataB);
  });
});

test.describe('Cancelar Agendamento', () => {
  let medicoId;
  let pacienteToken;
  let pacienteToken2;

  test.beforeAll(async () => {
    const ctx = await createApiContext();
    const adminToken = await getAdminToken(ctx);

    const doctor = await createDoctor(ctx, adminToken, { nome: 'Dr. Cancelamento' });
    medicoId = doctor.id;

    const patient1 = await createPatientAndLogin(ctx);
    pacienteToken = patient1.token;

    const patient2 = await createPatientAndLogin(ctx);
    pacienteToken2 = patient2.token;

    await ctx.dispose();
  });

  test('CT046 - Cancelar agendamento com mais de 24h de antecedência', async ({ request }) => {
    const appointmentPage = new AppointmentPage(request);
    const createResp = await appointmentPage.create({ medicoId, data: getNextWeekday(25), horario: '10:00' }, pacienteToken);
    const { id } = await createResp.json();

    const response = await appointmentPage.cancel(id, { motivo: 'Imprevisto pessoal' }, pacienteToken);
    const body = await response.json();

    expect(response.status()).toBe(200);
    expect(body.status).toBe('CANCELADA');
    expect(body.motivoCancelamento).toBe('Imprevisto pessoal');
    expect(body.canceladoEm).toBeTruthy();
  });

  test('CT047 - Cancelar agendamento sem informar motivo', async ({ request }) => {
    const appointmentPage = new AppointmentPage(request);
    const createResp = await appointmentPage.create({ medicoId, data: getNextWeekday(26), horario: '11:00' }, pacienteToken);
    const { id } = await createResp.json();

    const response = await appointmentPage.cancel(id, {}, pacienteToken);
    const body = await response.json();

    expect(response.status()).toBe(400);
    expect(body.erro).toBe('O motivo do cancelamento é obrigatório.');
  });

  test('CT049 - Cancelar agendamento já cancelado', async ({ request }) => {
    const appointmentPage = new AppointmentPage(request);
    const createResp = await appointmentPage.create({ medicoId, data: getNextWeekday(27), horario: '12:00' }, pacienteToken);
    const { id } = await createResp.json();

    await appointmentPage.cancel(id, { motivo: 'Primeira vez' }, pacienteToken);
    const response = await appointmentPage.cancel(id, { motivo: 'Segunda vez' }, pacienteToken);
    const body = await response.json();

    expect(response.status()).toBe(400);
    expect(body.erro).toBe('Este agendamento já foi cancelado.');
  });

  test('CT050 - Cancelar agendamento inexistente', async ({ request }) => {
    const appointmentPage = new AppointmentPage(request);
    const response = await appointmentPage.cancel('id-inexistente', { motivo: 'Qualquer' }, pacienteToken);
    const body = await response.json();

    expect(response.status()).toBe(404);
    expect(body.erro).toBe('Agendamento não encontrado.');
  });

  test('CT051 - Paciente tenta cancelar agendamento de outro', async ({ request }) => {
    const appointmentPage = new AppointmentPage(request);
    const createResp = await appointmentPage.create({ medicoId, data: getNextWeekday(28), horario: '13:00' }, pacienteToken);
    const { id } = await createResp.json();

    const response = await appointmentPage.cancel(id, { motivo: 'Tentativa' }, pacienteToken2);
    const body = await response.json();

    expect(response.status()).toBe(403);
    expect(body.erro).toBe('Você não tem permissão para cancelar este agendamento.');
  });

  test('CT052 - Cancelar agendamento sem autenticação', async ({ request }) => {
    const response = await request.patch('/api/v1/agendamentos/qualquer-id/cancelar', {
      data: { motivo: 'Teste' },
    });
    const body = await response.json();

    expect(response.status()).toBe(401);
    expect(body.erro).toBe('Token não fornecido.');
  });
});
