class DoctorPage {
  constructor(request) {
    this.request = request;
    this.endpoint = '/api/v1/medicos';
  }

  async register(data, token) {
    return this.request.post(this.endpoint, {
      data,
      headers: { Authorization: `Bearer ${token}` },
    });
  }

  async listAll(token) {
    return this.request.get(this.endpoint, {
      headers: { Authorization: `Bearer ${token}` },
    });
  }

  async listWithoutToken() {
    return this.request.get(this.endpoint);
  }
}

module.exports = DoctorPage;
