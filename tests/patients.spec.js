const { test, expect } = require('@playwright/test');
const PatientPage = require('./pages/PatientPage');

test.describe('Autocadastro de Paciente', () => {
  let patientPage;

  test.beforeEach(async ({ request }) => {
    patientPage = new PatientPage(request);
  });

  test('CT008 - Cadastro de paciente com dados válidos', async () => {
    const cpf = `${Date.now()}`;
    const email = `paciente.${Date.now()}@email.com`;

    const response = await patientPage.register({
      nome: 'João Silva',
      cpf,
      email,
      telefone: '(11) 99999-0000',
      senha: 'Joao@123',
    });
    const body = await response.json();

    expect(response.status()).toBe(201);
    expect(body.id).toBeTruthy();
    expect(body.role).toBe('PACIENTE');
    expect(body.nome).toBe('João Silva');
    expect(body.senha).toBeUndefined();
  });

  test('CT009 - Cadastro com e-mail já existente', async () => {
    const email = `duplicado.${Date.now()}@email.com`;

    await patientPage.register({
      nome: 'Primeiro',
      cpf: `cpf-${Date.now()}-1`,
      email,
      telefone: '(11) 99999-0001',
      senha: 'Teste@123',
    });

    const response = await patientPage.register({
      nome: 'Segundo',
      cpf: `cpf-${Date.now()}-2`,
      email,
      telefone: '(11) 99999-0002',
      senha: 'Teste@123',
    });
    const body = await response.json();

    expect(response.status()).toBe(409);
    expect(body.erro).toBe('E-mail já cadastrado no sistema.');
  });

  test('CT010 - Cadastro com CPF já existente', async () => {
    const cpf = `cpf-dup-${Date.now()}`;

    await patientPage.register({
      nome: 'Primeiro',
      cpf,
      email: `email1-${Date.now()}@email.com`,
      telefone: '(11) 99999-0001',
      senha: 'Teste@123',
    });

    const response = await patientPage.register({
      nome: 'Segundo',
      cpf,
      email: `email2-${Date.now()}@email.com`,
      telefone: '(11) 99999-0002',
      senha: 'Teste@123',
    });
    const body = await response.json();

    expect(response.status()).toBe(409);
    expect(body.erro).toBe('CPF já cadastrado no sistema.');
  });

  test('CT011 - Cadastro sem campo nome', async () => {
    const response = await patientPage.register({
      cpf: '111.111.111-11',
      email: 'sem.nome@email.com',
      telefone: '(11) 99999-0000',
      senha: 'Teste@123',
    });
    const body = await response.json();

    expect(response.status()).toBe(400);
    expect(body.erro).toBe('Todos os campos são obrigatórios: nome, cpf, email, telefone, senha.');
  });

  test('CT012 - Cadastro sem campo cpf', async () => {
    const response = await patientPage.register({
      nome: 'Sem CPF',
      email: 'sem.cpf@email.com',
      telefone: '(11) 99999-0000',
      senha: 'Teste@123',
    });
    const body = await response.json();

    expect(response.status()).toBe(400);
    expect(body.erro).toBe('Todos os campos são obrigatórios: nome, cpf, email, telefone, senha.');
  });

  test('CT013 - Cadastro sem campo email', async () => {
    const response = await patientPage.register({
      nome: 'Sem Email',
      cpf: '222.222.222-22',
      telefone: '(11) 99999-0000',
      senha: 'Teste@123',
    });
    const body = await response.json();

    expect(response.status()).toBe(400);
    expect(body.erro).toBe('Todos os campos são obrigatórios: nome, cpf, email, telefone, senha.');
  });

  test('CT014 - Cadastro sem campo telefone', async () => {
    const response = await patientPage.register({
      nome: 'Sem Telefone',
      cpf: '333.333.333-33',
      email: 'sem.telefone@email.com',
      senha: 'Teste@123',
    });
    const body = await response.json();

    expect(response.status()).toBe(400);
    expect(body.erro).toBe('Todos os campos são obrigatórios: nome, cpf, email, telefone, senha.');
  });

  test('CT015 - Cadastro sem campo senha', async () => {
    const response = await patientPage.register({
      nome: 'Sem Senha',
      cpf: '444.444.444-44',
      email: 'sem.senha@email.com',
      telefone: '(11) 99999-0000',
    });
    const body = await response.json();

    expect(response.status()).toBe(400);
    expect(body.erro).toBe('Todos os campos são obrigatórios: nome, cpf, email, telefone, senha.');
  });
});
