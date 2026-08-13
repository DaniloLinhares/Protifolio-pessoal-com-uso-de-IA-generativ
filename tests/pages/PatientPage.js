class PatientPage {
  constructor(request) {
    this.request = request;
    this.endpoint = '/api/v1/pacientes';
  }

  async register(data) {
    return this.request.post(this.endpoint, {
      data,
    });
  }
}

module.exports = PatientPage;
