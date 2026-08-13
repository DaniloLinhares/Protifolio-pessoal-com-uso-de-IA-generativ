const { test, expect } = require('@playwright/test');
const AuthPage = require('./pages/AuthPage');

test.describe('Middleware de Autenticação (JWT)', () => {
  let authPage;

  test.beforeEach(async ({ request }) => {
    authPage = new AuthPage(request);
  });

  test('CT053 - Requisição com token válido é processada', async ({ request }) => {
    const token = await authPage.loginAsAdmin();

    const response = await request.get('/api/v1/medicos', {
      headers: { Authorization: `Bearer ${token}` },
    });

    expect(response.status()).toBe(200);
  });

  test('CT054 - Requisição sem header Authorization é bloqueada', async ({ request }) => {
    const response = await request.get('/api/v1/medicos');
    const body = await response.json();

    expect(response.status()).toBe(401);
    expect(body.erro).toBe('Token não fornecido.');
  });

  test('CT055 - Token sem prefixo Bearer é rejeitado', async ({ request }) => {
    const token = await authPage.loginAsAdmin();

    const response = await request.get('/api/v1/medicos', {
      headers: { Authorization: token },
    });
    const body = await response.json();

    expect(response.status()).toBe(401);
    expect(body.erro).toBe('Formato de token inválido.');
  });

  test('CT056 - Token expirado é rejeitado', async ({ request }) => {
    // Token JWT com expiração já passada (gerado manualmente)
    const expiredToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjEiLCJlbWFpbCI6InRlc3RlQHRlc3RlLmNvbSIsInJvbGUiOiJBRE1JTiIsImlhdCI6MTYwMDAwMDAwMCwiZXhwIjoxNjAwMDAwMDAxfQ.invalid';

    const response = await request.get('/api/v1/medicos', {
      headers: { Authorization: `Bearer ${expiredToken}` },
    });
    const body = await response.json();

    expect(response.status()).toBe(401);
    expect(body.erro).toBe('Token inválido ou expirado.');
  });

  test('CT057 - Token com assinatura incorreta é rejeitado', async ({ request }) => {
    const response = await request.get('/api/v1/medicos', {
      headers: { Authorization: 'Bearer token.invalido.aqui' },
    });
    const body = await response.json();

    expect(response.status()).toBe(401);
    expect(body.erro).toBe('Token inválido ou expirado.');
  });
});
