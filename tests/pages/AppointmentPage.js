class AppointmentPage {
  constructor(request) {
    this.request = request;
    this.baseEndpoint = '/api/v1/agendamentos';
  }

  async getAvailability(medicoId, data, token) {
    const params = new URLSearchParams();
    if (medicoId) params.append('medicoId', medicoId);
    if (data) params.append('data', data);
    const query = params.toString();
    const url = `${this.baseEndpoint}/disponibilidade${query ? '?' + query : ''}`;

    return this.request.get(url, {
      headers: { Authorization: `Bearer ${token}` },
    });
  }

  async create(data, token) {
    return this.request.post(this.baseEndpoint, {
      data,
      headers: { Authorization: `Bearer ${token}` },
    });
  }

  async getMyAppointments(token) {
    return this.request.get(this.baseEndpoint, {
      headers: { Authorization: `Bearer ${token}` },
    });
  }

  async cancel(appointmentId, data, token) {
    return this.request.patch(`${this.baseEndpoint}/${appointmentId}/cancelar`, {
      data,
      headers: { Authorization: `Bearer ${token}` },
    });
  }
}

module.exports = AppointmentPage;
