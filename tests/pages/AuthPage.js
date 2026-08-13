class AuthPage {
  constructor(request) {
    this.request = request;
    this.endpoint = '/api/v1/login';
  }

  async login(email, senha) {
    return this.request.post(this.endpoint, {
      data: { email, senha },
    });
  }

  async loginAsAdmin() {
    const response = await this.login('admin@clinica.com', 'Admin@123');
    const body = await response.json();
    return body.token;
  }

  async loginAsPaciente(email = 'paciente.teste@email.com', senha = 'Paciente@123') {
    const response = await this.login(email, senha);
    const body = await response.json();
    return body.token;
  }
}

module.exports = AuthPage;
