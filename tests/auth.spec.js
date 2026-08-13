const { test, expect } = require('@playwright/test');
const AuthPage = require('./pages/AuthPage');

test.describe('Autenticação (Login)', () => {
  let authPage;

  test.beforeEach(async ({ request }) => {
    authPage = new AuthPage(request);
  });

  test('CT001 - Login com credenciais válidas do Admin', async () => {
    const response = await authPage.login('admin@clinica.com', 'Admin@123');
    const body = await response.json();

    expect(response.status()).toBe(200);
    expect(body.token).toBeTruthy();
    expect(body.usuario.role).toBe('ADMIN');
    expect(body.usuario.email).toBe('admin@clinica.com');
  });

  test('CT002 - Login com credenciais válidas de Paciente', async ({ request }) => {
    const PatientPage = require('./pages/PatientPage');
    const patientPage = new PatientPage(request);

    await patientPage.register({
      nome: 'Paciente Login',
      cpf: '000.000.000-01',
      email: 'paciente.login@email.com',
      telefone: '(11) 99999-0001',
      senha: 'Paciente@123',
    });

    const response = await authPage.login('paciente.login@email.com', 'Paciente@123');
    const body = await response.json();

    expect(response.status()).toBe(200);
    expect(body.token).toBeTruthy();
    expect(body.usuario.role).toBe('PACIENTE');
  });

  test('CT003 - Login com credenciais válidas de Médico', async ({ request }) => {
    const DoctorPage = require('./pages/DoctorPage');
    const doctorPage = new DoctorPage(request);
    const adminToken = await authPage.loginAsAdmin();

    await doctorPage.register({
      nome: 'Dr. Login Teste',
      crm: 'CRM/SP 000001',
      especialidade: 'Clínico Geral',
      email: 'medico.login@clinica.com',
      senha: 'Medico@123',
    }, adminToken);

    const response = await authPage.login('medico.login@clinica.com', 'Medico@123');
    const body = await response.json();

    expect(response.status()).toBe(200);
    expect(body.token).toBeTruthy();
    expect(body.usuario.role).toBe('MEDICO');
  });

  test('CT004 - Login com e-mail inexistente', async () => {
    const response = await authPage.login('inexistente@email.com', 'qualquer123');
    const body = await response.json();

    expect(response.status()).toBe(401);
    expect(body.erro).toBe('E-mail ou senha inválidos.');
  });

  test('CT005 - Login com senha incorreta', async () => {
    const response = await authPage.login('admin@clinica.com', 'SenhaErrada');
    const body = await response.json();

    expect(response.status()).toBe(401);
    expect(body.erro).toBe('E-mail ou senha inválidos.');
  });

  test('CT006 - Login sem informar e-mail', async ({ request }) => {
    const response = await request.post('/api/v1/login', {
      data: { senha: 'Admin@123' },
    });
    const body = await response.json();

    expect(response.status()).toBe(400);
    expect(body.erro).toBe('Os campos email e senha são obrigatórios.');
  });

  test('CT007 - Login sem informar senha', async ({ request }) => {
    const response = await request.post('/api/v1/login', {
      data: { email: 'admin@clinica.com' },
    });
    const body = await response.json();

    expect(response.status()).toBe(400);
    expect(body.erro).toBe('Os campos email e senha são obrigatórios.');
  });
});
