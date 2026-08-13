# Prompt para Criação dos Testes Automatizados

**Papel:** Atue como um QA Engineer Senior especializado em automação de testes de API.

**Objetivo:** Criar testes automatizados para a API REST de Agendamento Médico utilizando Playwright Test, aplicando o padrão Page Object para organização, sem uso de mocks (testes contra a API real).

**Contexto:**

- A API é construída em Node.js/Express com banco de dados em memória.
- A autenticação utiliza JWT com três perfis: ADMIN, PACIENTE e MEDICO.
- O servidor inicia na porta 3000 com um Admin pré-cadastrado via Seed (admin@clinica.com / Admin@123).
- Os testes devem cobrir os casos de teste CT001 a CT058 documentados no arquivo `casos-de-teste.md`.
- A estratégia de teste segue a heurística VADER (Verbs, Authorization, Data, Errors, Responsiveness).

---

### Requisitos Técnicos

1. **Framework:** Playwright Test (`@playwright/test`)
2. **Padrão de Projeto:** Page Object — cada grupo de endpoints encapsulado em uma classe.
3. **Sem mocks:** Os testes devem rodar contra a API real. O Playwright deve iniciar o servidor automaticamente via configuração `webServer`.
4. **Helpers:** Criar funções auxiliares reutilizáveis para:
   - Geração de datas futuras (dia útil, sábado, domingo)
   - Factory functions para criação de dados de teste (paciente, médico, obtenção de tokens)
5. **Isolamento:** Cada teste deve criar seus próprios dados usando identificadores únicos (ex: `Date.now()`) para evitar conflitos entre execuções.
6. **Independência:** Os testes não devem depender de ordem de execução entre arquivos diferentes.

---

### Estrutura Esperada

```
tests/
├── helpers/
│   ├── dateHelper.js         # Funções de geração de datas
│   └── setupHelper.js        # Factory functions para setup de dados
├── pages/
│   ├── AuthPage.js           # POST /api/v1/login
│   ├── PatientPage.js        # POST /api/v1/pacientes
│   ├── DoctorPage.js         # POST e GET /api/v1/medicos
│   └── AppointmentPage.js    # Endpoints de agendamento
├── auth.spec.js              # CT001 a CT007
├── patients.spec.js          # CT008 a CT015
├── doctors.spec.js           # CT016 a CT024
├── appointments.spec.js      # CT025 a CT052
├── middleware.spec.js        # CT053 a CT057
└── seed.spec.js              # CT058
```

---

### Regras

- Não use mocks ou stubs. Todos os testes devem fazer requisições HTTP reais.
- Use `test.beforeAll` com `apiRequest.newContext()` para preparar dados compartilhados entre testes do mesmo describe.
- Use a fixture `{ request }` do Playwright dentro de cada `test()` para as chamadas HTTP do teste em si.
- Cada Page Object deve receber o `request` no construtor e expor métodos semânticos (ex: `login()`, `register()`, `create()`, `cancel()`).
- Os helpers de date devem retornar datas no formato `YYYY-MM-DD`.
- O `setupHelper` deve expor factory functions como `createPatientAndLogin()` e `createDoctor()` que encapsulam toda a lógica de criação + login.
- Configure o `playwright.config.js` com `webServer` apontando para `npm start` na porta 3000.
- Valide sempre o `status code` e o corpo da resposta (campo `erro` para erros, dados esperados para sucesso).
- Não crie testes desnecessários fora do escopo dos casos de teste documentados.

---

### Endpoints da API

| Método | Rota                                     | Acesso       |
|--------|------------------------------------------|--------------|
| POST   | /api/v1/login                            | Público      |
| POST   | /api/v1/pacientes                        | Público      |
| POST   | /api/v1/medicos                          | ADMIN        |
| GET    | /api/v1/medicos                          | Autenticado  |
| GET    | /api/v1/agendamentos/disponibilidade     | Autenticado  |
| POST   | /api/v1/agendamentos                     | PACIENTE     |
| GET    | /api/v1/agendamentos                     | PACIENTE     |
| PATCH  | /api/v1/agendamentos/:id/cancelar        | PACIENTE     |

---

### Credenciais do Admin (Seed)

- **E-mail:** admin@clinica.com
- **Senha:** Admin@123

---

### Exemplo de Page Object Esperado

```javascript
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
}
```

---

### Exemplo de Helper Esperado

```javascript
function getNextWeekday(daysAhead = 7) {
  const date = new Date();
  date.setDate(date.getDate() + daysAhead);
  while (date.getDay() === 0 || date.getDay() === 6) {
    date.setDate(date.getDate() + 1);
  }
  return date.toISOString().split('T')[0];
}
```

---

### Exemplo de Teste Esperado

```javascript
test('CT001 - Login com credenciais válidas do Admin', async ({ request }) => {
  const authPage = new AuthPage(request);
  const response = await authPage.login('admin@clinica.com', 'Admin@123');
  const body = await response.json();

  expect(response.status()).toBe(200);
  expect(body.token).toBeTruthy();
  expect(body.usuario.role).toBe('ADMIN');
});
```
