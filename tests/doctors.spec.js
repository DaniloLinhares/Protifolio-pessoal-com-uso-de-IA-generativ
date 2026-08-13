const { test, expect } = require('@playwright/test');
const AuthPage = require('./pages/AuthPage');
const DoctorPage = require('./pages/DoctorPage');
const PatientPage = require('./pages/PatientPage');

test.describe('Cadastro de Médicos', () => {
  let authPage;
  let doctorPage;
  let adminToken;

  test.beforeEach(async ({ request }) => {
    authPage = new AuthPage(request);
    doctorPage = new DoctorPage(request);
    adminToken = await authPage.loginAsAdmin();
  });

  test('CT016 - Cadastro de médico com dados válidos pelo Admin', async () => {
    const response = await doctorPage.register({
      nome: 'Dra. Maria',
      crm: `CRM/SP ${Date.now()}`,
      especialidade: 'Cardiologia',
      email: `maria.${Date.now()}@clinica.com`,
      senha: 'Medica@123',
    }, adminToken);
    const body = await response.json();

    expect(response.status()).toBe(201);
    expect(body.id).toBeTruthy();
    expect(body.role).toBe('MEDICO');
    expect(body.nome).toBe('Dra. Maria');
    expect(body.senha).toBeUndefined();
  });

  test('CT017 - Cadastro com CRM já existente', async () => {
    const crm = `CRM/SP DUP-${Date.now()}`;

    await doctorPage.register({
      nome: 'Dr. Primeiro',
      crm,
      especialidade: 'Ortopedia',
      email: `primeiro.${Date.now()}@clinica.com`,
      senha: 'Medico@123',
    }, adminToken);

    const response = await doctorPage.register({
      nome: 'Dr. Segundo',
      crm,
      especialidade: 'Neurologia',
      email: `segundo.${Date.now()}@clinica.com`,
      senha: 'Medico@123',
    }, adminToken);
    const body = await response.json();

    expect(response.status()).toBe(409);
    expect(body.erro).toBe('CRM já cadastrado no sistema.');
  });

  test('CT018 - Cadastro com e-mail já existente', async () => {
    const email = `email.dup.${Date.now()}@clinica.com`;

    await doctorPage.register({
      nome: 'Dr. Primeiro',
      crm: `CRM/SP A-${Date.now()}`,
      especialidade: 'Ortopedia',
      email,
      senha: 'Medico@123',
    }, adminToken);

    const response = await doctorPage.register({
      nome: 'Dr. Segundo',
      crm: `CRM/SP B-${Date.now()}`,
      especialidade: 'Neurologia',
      email,
      senha: 'Medico@123',
    }, adminToken);
    const body = await response.json();

    expect(response.status()).toBe(409);
    expect(body.erro).toBe('E-mail já cadastrado no sistema.');
  });

  test('CT019 - Cadastro sem campo obrigatório', async () => {
    const response = await doctorPage.register({
      nome: 'Dr. Incompleto',
      crm: `CRM/SP ${Date.now()}`,
      email: `incompleto.${Date.now()}@clinica.com`,
      senha: 'Medico@123',
    }, adminToken);
    const body = await response.json();

    expect(response.status()).toBe(400);
    expect(body.erro).toBe('Todos os campos são obrigatórios: nome, crm, especialidade, email, senha.');
  });

  test('CT020 - Paciente tenta cadastrar médico (RBAC)', async ({ request }) => {
    const patientPage = new PatientPage(request);
    const cpf = `rbac-${Date.now()}`;
    const email = `rbac.${Date.now()}@email.com`;

    await patientPage.register({
      nome: 'Paciente RBAC',
      cpf,
      email,
      telefone: '(11) 99999-0000',
      senha: 'Paciente@123',
    });

    const loginResponse = await authPage.login(email, 'Paciente@123');
    const { token } = await loginResponse.json();

    const response = await doctorPage.register({
      nome: 'Dr. Ilegal',
      crm: `CRM/SP IL-${Date.now()}`,
      especialidade: 'Teste',
      email: `ilegal.${Date.now()}@clinica.com`,
      senha: 'Medico@123',
    }, token);
    const body = await response.json();

    expect(response.status()).toBe(403);
    expect(body.erro).toBe('Acesso negado. Permissão insuficiente.');
  });

  test('CT021 - Cadastro sem autenticação', async ({ request }) => {
    const response = await request.post('/api/v1/medicos', {
      data: {
        nome: 'Dr. Sem Token',
        crm: 'CRM/SP 999999',
        especialidade: 'Teste',
        email: 'semtoken@clinica.com',
        senha: 'Medico@123',
      },
    });
    const body = await response.json();

    expect(response.status()).toBe(401);
    expect(body.erro).toBe('Token não fornecido.');
  });

  test('CT022 - Cadastro com token inválido', async ({ request }) => {
    const response = await request.post('/api/v1/medicos', {
      data: {
        nome: 'Dr. Token Invalido',
        crm: 'CRM/SP 888888',
        especialidade: 'Teste',
        email: 'tokeninvalido@clinica.com',
        senha: 'Medico@123',
      },
      headers: { Authorization: 'Bearer token.invalido.aqui' },
    });
    const body = await response.json();

    expect(response.status()).toBe(401);
    expect(body.erro).toBe('Token inválido ou expirado.');
  });
});

test.describe('Listar Médicos', () => {
  let authPage;
  let doctorPage;

  test.beforeEach(async ({ request }) => {
    authPage = new AuthPage(request);
    doctorPage = new DoctorPage(request);
  });

  test('CT023 - Listar médicos com autenticação válida', async () => {
    const adminToken = await authPage.loginAsAdmin();

    const response = await doctorPage.listAll(adminToken);
    const body = await response.json();

    expect(response.status()).toBe(200);
    expect(Array.isArray(body)).toBe(true);
    if (body.length > 0) {
      expect(body[0].senha).toBeUndefined();
      expect(body[0].id).toBeTruthy();
      expect(body[0].nome).toBeTruthy();
    }
  });

  test('CT024 - Listar médicos sem autenticação', async () => {
    const response = await doctorPage.listWithoutToken();
    const body = await response.json();

    expect(response.status()).toBe(401);
    expect(body.erro).toBe('Token não fornecido.');
  });
});
