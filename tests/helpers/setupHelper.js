const { request: apiRequest } = require('@playwright/test');
const AuthPage = require('../pages/AuthPage');
const PatientPage = require('../pages/PatientPage');
const DoctorPage = require('../pages/DoctorPage');

const BASE_URL = 'http://127.0.0.1:3000';

/**
 * Cria um contexto de API independente para uso em beforeAll.
 * Lembre-se de chamar ctx.dispose() ao final do setup.
 */
async function createApiContext() {
  return apiRequest.newContext({ baseURL: BASE_URL });
}

/**
 * Obtém o token do Admin.
 * @param {APIRequestContext} ctx
 * @returns {Promise<string>} Token JWT do admin
 */
async function getAdminToken(ctx) {
  const authPage = new AuthPage(ctx);
  return authPage.loginAsAdmin();
}

/**
 * Cria um paciente e retorna seu token JWT.
 * @param {APIRequestContext} ctx
 * @param {object} [overrides] - Campos opcionais para sobrescrever os dados padrão
 * @returns {Promise<{token: string, email: string, id: string}>}
 */
async function createPatientAndLogin(ctx, overrides = {}) {
  const authPage = new AuthPage(ctx);
  const patientPage = new PatientPage(ctx);

  const timestamp = Date.now();
  const data = {
    nome: overrides.nome || `Paciente Teste ${timestamp}`,
    cpf: overrides.cpf || `cpf-${timestamp}`,
    email: overrides.email || `paciente.${timestamp}@email.com`,
    telefone: overrides.telefone || '(11) 99999-0000',
    senha: overrides.senha || 'Paciente@123',
  };

  const registerResp = await patientPage.register(data);
  const registerBody = await registerResp.json();

  const loginResp = await authPage.login(data.email, data.senha);
  const loginBody = await loginResp.json();

  return {
    token: loginBody.token,
    email: data.email,
    id: registerBody.id,
  };
}

/**
 * Cria um médico (requer token admin) e retorna seus dados.
 * @param {APIRequestContext} ctx
 * @param {string} adminToken
 * @param {object} [overrides] - Campos opcionais para sobrescrever os dados padrão
 * @returns {Promise<{id: string, nome: string, crm: string, especialidade: string}>}
 */
async function createDoctor(ctx, adminToken, overrides = {}) {
  const doctorPage = new DoctorPage(ctx);

  const timestamp = Date.now();
  const data = {
    nome: overrides.nome || `Dr. Teste ${timestamp}`,
    crm: overrides.crm || `CRM/SP ${timestamp}`,
    especialidade: overrides.especialidade || 'Clínico Geral',
    email: overrides.email || `medico.${timestamp}@clinica.com`,
    senha: overrides.senha || 'Medico@123',
  };

  const response = await doctorPage.register(data, adminToken);
  const body = await response.json();

  return {
    id: body.id,
    nome: data.nome,
    crm: data.crm,
    especialidade: data.especialidade,
  };
}

module.exports = {
  createApiContext,
  getAdminToken,
  createPatientAndLogin,
  createDoctor,
  BASE_URL,
};
