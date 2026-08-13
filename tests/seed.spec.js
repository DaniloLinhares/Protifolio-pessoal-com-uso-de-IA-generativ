const { test, expect } = require('@playwright/test');
const AuthPage = require('./pages/AuthPage');

test.describe('Carga Inicial (Seed)', () => {
  let authPage;

  test.beforeEach(async ({ request }) => {
    authPage = new AuthPage(request);
  });

  test('CT058 - Admin é criado automaticamente na inicialização', async () => {
    const response = await authPage.login('admin@clinica.com', 'Admin@123');
    const body = await response.json();

    expect(response.status()).toBe(200);
    expect(body.token).toBeTruthy();
    expect(body.usuario.nome).toBe('Administrador do Sistema');
    expect(body.usuario.role).toBe('ADMIN');
    expect(body.usuario.email).toBe('admin@clinica.com');
  });
});
