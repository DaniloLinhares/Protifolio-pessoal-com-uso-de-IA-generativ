# API de Agendamento Médico

Projeto desenvolvido para compor meu portfólio. Toda criação foi realizada com uso do prompt que encontra-se na pasta /especificacoes-do-projeto utilizando a IA generativa do Kiro. Trata-se de uma API RESTful completa para um sistema de agendamento de consultas médicas, demonstrando na prática conceitos como arquitetura em camadas, autenticação com JWT, controle de acesso baseado em funções (RBAC), validação de regras de negócio e documentação interativa com Swagger.

A API foi construída com Node.js e Express, utilizando banco de dados em memória para facilitar a execução e avaliação sem necessidade de configuração de infraestrutura externa.

## Tecnologias

- **Node.js** - Runtime JavaScript
- **Express** - Framework web
- **JSON Web Token (JWT)** - Autenticação stateless
- **bcryptjs** - Criptografia de senhas
- **uuid** - Geração de identificadores únicos
- **Swagger UI Express** - Documentação interativa da API

## Arquitetura

A API segue uma arquitetura em camadas:

```
src/
├── models/         # Camada de Dados: entidades e banco em memória
├── services/       # Camada de Negócio: regras e validações
├── controllers/    # Camada de Apresentação: manipulação HTTP
├── routes/         # Camada de Roteamento: endpoints e middlewares
├── middlewares/    # Camada de Segurança: JWT e RBAC
└── resources/      # Recursos: swagger.json
```

## Instalação

```bash
npm install
```

## Execução

```bash
npm start
```

O servidor inicia na porta `3000` por padrão.

## Documentação da API

Após iniciar o servidor, acesse a documentação interativa Swagger:

```
http://localhost:3000/api-docs
```

## Perfis de Usuário (Roles)

| Perfil    | Descrição                                                              |
|-----------|------------------------------------------------------------------------|
| ADMIN     | Administrador do sistema. Criado automaticamente via Seed.             |
| PACIENTE  | Cliente da clínica. Realiza autocadastro e gerencia agendamentos.      |
| MEDICO    | Profissional de saúde. Cadastrado exclusivamente pelo ADMIN.           |

## Credenciais Padrão (Admin)

- **E-mail:** admin@clinica.com
- **Senha:** Admin@123

## Endpoints

### Autenticação
| Método | Rota              | Descrição        | Acesso   |
|--------|-------------------|------------------|----------|
| POST   | /api/v1/login     | Realizar login   | Público  |

### Pacientes
| Método | Rota              | Descrição                  | Acesso   |
|--------|-------------------|----------------------------|----------|
| POST   | /api/v1/pacientes | Autocadastro de paciente   | Público  |

### Médicos
| Método | Rota             | Descrição             | Acesso        |
|--------|------------------|-----------------------|---------------|
| POST   | /api/v1/medicos  | Cadastrar médico      | ADMIN         |
| GET    | /api/v1/medicos  | Listar médicos        | Autenticado   |

### Agendamentos
| Método | Rota                                     | Descrição                     | Acesso    |
|--------|------------------------------------------|-------------------------------|-----------|
| GET    | /api/v1/agendamentos/disponibilidade     | Consultar disponibilidade     | Autenticado |
| POST   | /api/v1/agendamentos                     | Criar agendamento             | PACIENTE  |
| GET    | /api/v1/agendamentos                     | Consultar meus agendamentos   | PACIENTE  |
| PATCH  | /api/v1/agendamentos/:id/cancelar        | Cancelar agendamento          | PACIENTE  |

## Regras de Negócio

- Não é permitido cadastrar dois médicos com o mesmo CRM
- Não é permitido cadastrar dois usuários com o mesmo CPF ou e-mail
- Um médico não pode ter mais de uma consulta agendada no mesmo horário
- Um paciente não pode agendar duas consultas no mesmo horário
- Agendamentos permitidos apenas de segunda a sexta, das 07:00 às 19:00 (duração fixa de 1 hora)
- Consultas devem ser agendadas com no mínimo 30 minutos de antecedência
- Cancelamento só é permitido com no mínimo 24 horas de antecedência

## Exemplo de Uso

### 1. Login como Admin
```bash
curl -X POST http://localhost:3000/api/v1/login \
  -H "Content-Type: application/json" \
  -d '{"email": "admin@clinica.com", "senha": "Admin@123"}'
```

### 2. Cadastrar um Médico (com token Admin)
```bash
curl -X POST http://localhost:3000/api/v1/medicos \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <TOKEN>" \
  -d '{"nome": "Dr. João", "crm": "CRM/SP 123456", "especialidade": "Cardiologia", "email": "joao@clinica.com", "senha": "Medico@123"}'
```

### 3. Cadastrar um Paciente
```bash
curl -X POST http://localhost:3000/api/v1/pacientes \
  -H "Content-Type: application/json" \
  -d '{"nome": "Maria Silva", "cpf": "123.456.789-00", "email": "maria@email.com", "telefone": "(11) 99999-0000", "senha": "Paciente@123"}'
```

### 4. Agendar Consulta (com token Paciente)
```bash
curl -X POST http://localhost:3000/api/v1/agendamentos \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <TOKEN>" \
  -d '{"medicoId": "<ID_DO_MEDICO>", "data": "2024-12-20", "horario": "10:00"}'
```
