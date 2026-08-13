# Testes Automatizados - API de Agendamento Médico

## Sobre

Suíte de testes automatizados para a API REST de Agendamento Médico, implementada com **Playwright Test** utilizando o padrão **Page Object** para organização e reuso de código.

Os testes são executados contra a API real (sem mocks), garantindo validação end-to-end de todos os endpoints, regras de negócio e controle de acesso.

## Tecnologias

- **Playwright Test** — Framework de testes
- **Page Object Pattern** — Organização dos endpoints em classes reutilizáveis
- **Sem mocks** — Testes contra a API real com banco em memória

## Estrutura

```
tests/
├── helpers/                  # Funções auxiliares reutilizáveis
│   ├── dateHelper.js         # Geração de datas futuras (dia útil, sábado, domingo)
│   └── setupHelper.js        # Factory functions (criar paciente, médico, obter tokens)
├── pages/                    # Page Objects (classes de abstração dos endpoints)
│   ├── AuthPage.js           # Login e geração de tokens
│   ├── PatientPage.js        # Cadastro de pacientes
│   ├── DoctorPage.js         # Cadastro e listagem de médicos
│   └── AppointmentPage.js    # Disponibilidade, agendamento e cancelamento
├── auth.spec.js              # Testes de autenticação (CT001 a CT007)
├── patients.spec.js          # Testes de autocadastro de paciente (CT008 a CT015)
├── doctors.spec.js           # Testes de médicos (CT016 a CT024)
├── appointments.spec.js      # Testes de agendamentos (CT025 a CT052)
├── middleware.spec.js        # Testes do middleware JWT (CT053 a CT057)
├── seed.spec.js              # Testes da carga inicial (CT058)
└── README.md                 # Este arquivo
```

## Page Objects

Cada Page Object encapsula as chamadas HTTP para um grupo de endpoints:

- **AuthPage** — `POST /api/v1/login` + helpers para obter tokens por perfil
- **PatientPage** — `POST /api/v1/pacientes`
- **DoctorPage** — `POST /api/v1/medicos` + `GET /api/v1/medicos`
- **AppointmentPage** — `GET /disponibilidade` + `POST /agendamentos` + `GET /agendamentos` + `PATCH /cancelar`

## Helpers

Funções auxiliares que eliminam duplicação e centralizam a lógica de setup:

- **dateHelper.js** — `getNextWeekday(daysAhead)`, `getNextSaturday()`, `getNextSunday()` — geram datas futuras no formato esperado pela API
- **setupHelper.js** — Factory functions para preparar cenários de teste:
  - `createApiContext()` — cria contexto API independente para uso em `beforeAll`
  - `getAdminToken(ctx)` — obtém token JWT do Admin
  - `createPatientAndLogin(ctx, overrides)` — cria paciente e retorna token
  - `createDoctor(ctx, adminToken, overrides)` — cria médico e retorna dados

## Pré-requisitos

- Node.js 18+
- Dependências instaladas (`npm install`)

## Como Executar

### Executar todos os testes

```bash
npm test
```

O Playwright inicia automaticamente o servidor (`npm start`) antes de executar os testes.

### Executar um arquivo específico

```bash
npx playwright test tests/auth.spec.js
```

### Executar com saída detalhada

```bash
npx playwright test --reporter=line
```

### Ver relatório HTML após execução

```bash
npm run test:report
```

## Configuração

A configuração está em `playwright.config.js` na raiz do projeto:

- **baseURL:** `http://127.0.0.1:3000`
- **webServer:** Inicia `npm start` automaticamente antes dos testes
- **Timeout:** 30 segundos por teste
- **Reporter:** HTML + lista no terminal

## Cobertura de Casos de Teste

| Arquivo                | Casos de Teste   | Funcionalidade                     |
|------------------------|------------------|------------------------------------|
| auth.spec.js           | CT001 a CT007    | Autenticação (Login)               |
| patients.spec.js       | CT008 a CT015    | Autocadastro de Paciente           |
| doctors.spec.js        | CT016 a CT024    | Cadastro e Listagem de Médicos     |
| appointments.spec.js   | CT025 a CT052    | Disponibilidade e Agendamentos     |
| middleware.spec.js     | CT053 a CT057    | Middleware JWT                     |
| seed.spec.js           | CT058            | Carga Inicial (Seed)               |

## Estratégia de Teste (VADER)

Os testes cobrem as 5 dimensões da heurística VADER:

- **V (Verbs)** — Cada endpoint testado com o verbo HTTP correto
- **A (Authorization)** — Testes com token válido, inválido, expirado, ausente e perfis não autorizados
- **D (Data)** — Validação de campos obrigatórios, unicidade, formatos e regras de negócio
- **E (Errors)** — Verificação de status codes e mensagens de erro corretas
- **R (Responsiveness)** — Timeouts configurados; falhas de tempo são detectadas automaticamente

## Observações

- O banco de dados é em memória, então cada execução do servidor começa com dados limpos (apenas o Admin via Seed)
- Cada teste cria seus próprios dados usando timestamps únicos (`Date.now()`), evitando conflitos entre execuções
- Os testes são independentes entre si dentro de cada `describe`, mas os `beforeAll` preparam o cenário necessário
