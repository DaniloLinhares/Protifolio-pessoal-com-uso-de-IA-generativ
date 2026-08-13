# Plano de Teste - API de Agendamento Médico

---

## 1. Introdução

Este documento descreve o plano de teste para a API REST de Agendamento Médico, um projeto de portfólio que demonstra competências em desenvolvimento backend com Node.js/Express, autenticação JWT, controle de acesso RBAC e banco de dados em memória.

A estratégia de teste é baseada na heurística **VADER**, criada por Stuart Ashman, específica para testes de APIs REST. O acrônimo VADER representa cinco dimensões fundamentais que guiam a cobertura dos testes:

- **V** — Verbs (Verbos HTTP)
- **A** — Authorization (Autorização)
- **D** — Data (Dados)
- **E** — Errors (Erros)
- **R** — Responsiveness (Responsividade)

---

## 2. Escopo

**Dentro do escopo:**
- Todos os endpoints da API REST (7 rotas)
- Autenticação e autorização (JWT + RBAC)
- Regras de negócio de agendamento
- Validações de entrada e tratamento de erros
- Comportamento dos verbos HTTP
- Carga inicial (Seed) do sistema

**Fora do escopo:**
- Testes de interface de usuário (não há frontend)
- Testes de integração com banco de dados real (banco é em memória)
- Testes de deploy e infraestrutura

---

## 3. Itens de Teste

- POST /api/v1/login
- POST /api/v1/pacientes
- POST /api/v1/medicos
- GET /api/v1/medicos
- GET /api/v1/agendamentos/disponibilidade
- POST /api/v1/agendamentos
- GET /api/v1/agendamentos
- PATCH /api/v1/agendamentos/:id/cancelar

---

## 4. Estratégia de Teste — Heurística VADER

### 4.1. V — Verbs (Verbos HTTP)

Verificar se cada verbo HTTP está sendo utilizado corretamente conforme sua semântica REST:

- **POST** — Utilizado para criação de recursos (login, cadastro de paciente, cadastro de médico, criação de agendamento). Cada chamada POST deve criar um novo recurso ou retornar erro se os dados forem inválidos.
- **GET** — Utilizado para consultas (listar médicos, consultar disponibilidade, listar agendamentos). Não deve alterar o estado do servidor.
- **PATCH** — Utilizado para atualização parcial (cancelamento de agendamento). Deve alterar apenas o campo de status e motivo.

**O que testar:**
- Garantir que cada endpoint responde apenas ao verbo esperado
- Verificar que chamadas com verbos incorretos retornam erro adequado (405 Method Not Allowed ou equivalente)
- Confirmar idempotência onde aplicável (GET não altera estado)
- Confirmar que POST cria novo recurso a cada chamada válida

### 4.2. A — Authorization (Autorização)

Verificar que a autenticação (quem é o usuário) e a autorização (o que o usuário pode fazer) estão funcionando corretamente:

**Autenticação (Identidade):**
- Login retorna token JWT válido para credenciais corretas
- Token expirado é rejeitado
- Token com assinatura inválida é rejeitado
- Token ausente é identificado e bloqueado
- Token sem prefixo "Bearer" é rejeitado

**Autorização (Permissões RBAC):**
- ADMIN pode cadastrar médicos
- ADMIN não pode criar ou consultar agendamentos
- PACIENTE pode criar, consultar e cancelar seus agendamentos
- PACIENTE não pode cadastrar médicos
- PACIENTE não pode ver/cancelar agendamentos de outro paciente
- MEDICO não pode criar agendamentos
- Rotas públicas (login e cadastro de paciente) funcionam sem token

**O que testar:**
- Acessar cada rota protegida sem token
- Acessar cada rota protegida com token de perfil não autorizado
- Acessar recursos de outro usuário com token válido (isolamento de dados)
- Verificar que o token identifica corretamente o usuário nas operações

### 4.3. D — Data (Dados)

Verificar o comportamento dos dados em cada requisição e resposta:

**Dados de Entrada:**
- Campos obrigatórios ausentes (nome, cpf, email, senha, crm, especialidade, medicoId, data, horario, motivo)
- Unicidade de dados (CPF, email, CRM)
- Formatos de data (YYYY-MM-DD)
- Formatos de horário (HH:mm)
- Dados em duplicidade

**Dados de Saída:**
- Campos sensíveis não expostos (senha nunca retornada)
- Formato correto dos IDs (UUID)
- Formato correto de datas (ISO 8601)
- Estrutura de resposta consistente (campo `erro` para erros, dados para sucesso)
- Arrays vazios quando não há dados (não null)

**Regras de Negócio sobre Dados:**
- Agendamentos apenas de segunda a sexta (validação de dia da semana)
- Horários válidos: 07:00 a 18:00 (intervalos de 1 hora)
- Antecedência mínima de 30 minutos para agendamento
- Antecedência mínima de 24 horas para cancelamento
- Conflito de horário (médico e paciente)

**O que testar:**
- Enviar cada campo com tipo incorreto
- Enviar campos vazios ou nulos
- Verificar limites de dados (max/min)
- Confirmar que a paginação ou listagem retorna todos os registros esperados
- Validar que o filtro por paciente funciona corretamente

### 4.4. E — Errors (Erros)

Verificar que os erros são tratados adequadamente e retornam informações úteis:

**Status Codes esperados:**
- 200 — Sucesso em consultas e cancelamentos
- 201 — Recurso criado com sucesso
- 400 — Dados inválidos ou regra de negócio violada (validação de entrada)
- 401 — Não autenticado (token ausente, inválido ou expirado)
- 403 — Não autorizado (perfil sem permissão ou recurso de outro usuário)
- 404 — Recurso não encontrado (médico inexistente, agendamento inexistente)
- 409 — Conflito (duplicidade de CRM, CPF, email ou horário)

**O que testar:**
- Cada cenário de erro retorna o status code correto
- Cada erro possui mensagem descritiva no campo `erro`
- Não há erros 500 (Internal Server Error) em cenários de uso normal
- Erros não expõem informações sensíveis (stack traces, detalhes internos)
- Mensagens de erro são claras e orientam o consumidor da API

### 4.5. R — Responsiveness (Responsividade)

Verificar o tempo de resposta e estabilidade da API:

**O que testar:**
- Tempo de resposta dos endpoints em condições normais (esperado < 200ms para banco em memória)
- Comportamento com múltiplas requisições simultâneas
- Verificar se timeouts ocorrem em cenários específicos
- Confirmar que erros retornam no mesmo tempo esperado (não há delay excessivo em falhas)
- Estabilidade do servidor após múltiplas operações consecutivas

**Nota:** Como a API utiliza banco de dados em memória, os tempos de resposta devem ser muito baixos. Esta dimensão é menos crítica neste projeto, mas importante para demonstrar que a arquitetura não possui gargalos.

---

## 5. Critérios de Entrada

- Código-fonte disponível e instalável via `npm install`
- Servidor inicia sem erros com `npm start`
- Seed do Admin é executado automaticamente
- Documentação Swagger acessível em `/api-docs`

---

## 6. Critérios de Saída

- Todos os 59 casos de teste executados
- Nenhum defeito de prioridade Alta aberto
- Cobertura de 100% dos endpoints documentados
- Todas as 5 dimensões VADER exercitadas

---

## 7. Ambiente de Teste

- **Runtime:** Node.js (versão 18+)
- **Sistema Operacional:** Linux/macOS/Windows
- **Ferramenta de Teste:** Postman, Insomnia ou cURL
- **Porta:** localhost:3000
- **Banco de dados:** Em memória (reinicia a cada restart do servidor)

---

## 8. Ferramentas

- **Postman** — Execução manual dos casos de teste e validação de respostas
- **cURL** — Testes rápidos via linha de comando
- **Swagger UI** — Validação visual e exploratória dos endpoints (`/api-docs`)

---

## 9. Riscos e Mitigações

- **Risco:** Banco em memória perde dados ao reiniciar o servidor.
  **Mitigação:** Executar suíte de testes completa em uma única sessão do servidor.

- **Risco:** Testes de antecedência (30 min e 24h) dependem do horário real.
  **Mitigação:** Usar datas futuras suficientemente distantes ao testar cenários positivos.

- **Risco:** Sem persistência, dados de teste não são reaproveitáveis entre sessões.
  **Mitigação:** Criar scripts de setup que cadastram dados base (médicos, pacientes) antes dos testes de agendamento.

---

## 10. Rastreabilidade VADER x Casos de Teste

A tabela abaixo mapeia cada dimensão da heurística VADER aos casos de teste correspondentes:

**V — Verbs (Verbos HTTP)**
- CT001 a CT007 (POST /login)
- CT008 a CT015 (POST /pacientes)
- CT016 a CT022 (POST /medicos)
- CT023, CT024 (GET /medicos)
- CT025 a CT031 (GET /disponibilidade)
- CT032 a CT041 (POST /agendamentos)
- CT042 a CT045 (GET /agendamentos)
- CT046 a CT052 (PATCH /cancelar)

**A — Authorization (Autorização)**
- CT020 (PACIENTE tenta cadastrar médico)
- CT021 (Sem token no cadastro de médico)
- CT022 (Token inválido)
- CT024 (Sem token na listagem)
- CT040 (ADMIN tenta criar agendamento)
- CT041 (Sem token no agendamento)
- CT044 (ADMIN tenta listar agendamentos)
- CT045 (Isolamento entre pacientes)
- CT051 (Paciente tenta cancelar de outro)
- CT052 (Sem token no cancelamento)
- CT053 a CT057 (Middleware JWT)

**D — Data (Dados)**
- CT008 (Dados válidos de paciente)
- CT009, CT010 (Unicidade email/CPF)
- CT011 a CT015 (Campos obrigatórios paciente)
- CT016 (Dados válidos de médico)
- CT017, CT018 (Unicidade CRM/email)
- CT019 (Campos obrigatórios médico)
- CT025, CT026 (Dados de disponibilidade)
- CT032 (Dados válidos agendamento)
- CT034 (Horário inválido)
- CT035 (Data em fim de semana)
- CT036 (Antecedência mínima 30 min)
- CT037, CT038 (Conflito de horário)
- CT039 (Campos obrigatórios agendamento)
- CT046 (Dados de cancelamento)

**E — Errors (Erros)**
- CT004, CT005 (401 — credenciais inválidas)
- CT006, CT007 (400 — campos ausentes login)
- CT009, CT010 (409 — duplicidade)
- CT011 a CT015 (400 — campos ausentes paciente)
- CT017, CT018 (409 — duplicidade médico)
- CT019 (400 — campos ausentes médico)
- CT027, CT028 (400 — fim de semana)
- CT029 (404 — médico não encontrado)
- CT030, CT031 (400 — parâmetros ausentes)
- CT033 (404 — médico inexistente)
- CT034, CT035, CT036 (400 — validações agendamento)
- CT037, CT038 (409 — conflito)
- CT047 (400 — motivo ausente)
- CT048 (400 — antecedência 24h)
- CT049 (400 — já cancelado)
- CT050 (404 — agendamento inexistente)

**R — Responsiveness (Responsividade)**
- Teste exploratório de tempo de resposta em todos os endpoints
- Verificação de estabilidade após sequência completa de operações
- Monitoramento de timeouts em cenários de erro

---

## 11. Cronograma Estimado

- **Preparação do ambiente:** 30 minutos
- **Execução dos testes — Verbs:** 1 hora
- **Execução dos testes — Authorization:** 1 hora
- **Execução dos testes — Data:** 2 horas
- **Execução dos testes — Errors:** 1 hora
- **Execução dos testes — Responsiveness:** 30 minutos
- **Documentação de resultados:** 1 hora
- **Total estimado:** 7 horas

---

## 12. Referências

- Heurística VADER para testes de API — Stuart Ashman
- ISO-29119-3 — Documentação de testes de software
- Especificação de Requisitos do projeto (RF001 a RF008, RN001 a RN010)
- Casos de Teste (CT001 a CT059)
