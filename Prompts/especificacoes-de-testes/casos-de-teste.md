# Casos de Teste - API de Agendamento Médico

Baseado na ISO-29119-3.

---

## 1. Autenticação (Login)

---

**ID:** CT001
**Título:** Verificar login com credenciais válidas do Admin
**Prioridade:** Alta
**Rastreabilidade:** RF004, RN001
**Pré-Condições:** Servidor iniciado com usuário Admin criado via Seed (admin@clinica.com / Admin@123)

**Passos:**

1. **Ação:** Enviar requisição POST para `/api/v1/login` com body: `{"email": "admin@clinica.com", "senha": "Admin@123"}`
   **Resultado Esperado:** Status 200 retornado

2. **Ação:** Verificar campo `token` na resposta
   **Resultado Esperado:** Campo `token` presente e não vazio (formato JWT)

3. **Ação:** Verificar campo `usuario.role` na resposta
   **Resultado Esperado:** Valor igual a "ADMIN"

**Pós-Condições:** Token JWT válido gerado com expiração de 8 horas

---

**ID:** CT002
**Título:** Verificar login com credenciais válidas de Paciente
**Prioridade:** Alta
**Rastreabilidade:** RF004
**Pré-Condições:** Paciente cadastrado no sistema com email "maria@email.com" e senha "Paciente@123"

**Passos:**

1. **Ação:** Enviar requisição POST para `/api/v1/login` com body: `{"email": "maria@email.com", "senha": "Paciente@123"}`
   **Resultado Esperado:** Status 200 retornado

2. **Ação:** Verificar campo `token` na resposta
   **Resultado Esperado:** Campo `token` presente e não vazio

3. **Ação:** Verificar campo `usuario.role` na resposta
   **Resultado Esperado:** Valor igual a "PACIENTE"

**Pós-Condições:** Token JWT válido gerado com claims do paciente

---

**ID:** CT003
**Título:** Verificar login com credenciais válidas de Médico
**Prioridade:** Alta
**Rastreabilidade:** RF004
**Pré-Condições:** Médico cadastrado no sistema com email "carlos@clinica.com" e senha "Medico@123"

**Passos:**

1. **Ação:** Enviar requisição POST para `/api/v1/login` com body: `{"email": "carlos@clinica.com", "senha": "Medico@123"}`
   **Resultado Esperado:** Status 200 retornado

2. **Ação:** Verificar campo `token` na resposta
   **Resultado Esperado:** Campo `token` presente e não vazio

3. **Ação:** Verificar campo `usuario.role` na resposta
   **Resultado Esperado:** Valor igual a "MEDICO"

**Pós-Condições:** Token JWT válido gerado com claims do médico

---

**ID:** CT004
**Título:** Verificar que login com e-mail inexistente é recusado
**Prioridade:** Alta
**Rastreabilidade:** RF004
**Pré-Condições:** Nenhum usuário cadastrado com o email "inexistente@email.com"

**Passos:**

1. **Ação:** Enviar requisição POST para `/api/v1/login` com body: `{"email": "inexistente@email.com", "senha": "qualquer123"}`
   **Resultado Esperado:** Status 401 retornado

2. **Ação:** Verificar campo `erro` na resposta
   **Resultado Esperado:** Mensagem: "E-mail ou senha inválidos."

**Pós-Condições:** Nenhum token gerado

---

**ID:** CT005
**Título:** Verificar que login com senha incorreta é recusado
**Prioridade:** Alta
**Rastreabilidade:** RF004
**Pré-Condições:** Usuário Admin existe no sistema (admin@clinica.com)

**Passos:**

1. **Ação:** Enviar requisição POST para `/api/v1/login` com body: `{"email": "admin@clinica.com", "senha": "SenhaErrada"}`
   **Resultado Esperado:** Status 401 retornado

2. **Ação:** Verificar campo `erro` na resposta
   **Resultado Esperado:** Mensagem: "E-mail ou senha inválidos."

**Pós-Condições:** Nenhum token gerado

---

**ID:** CT006
**Título:** Verificar que login sem informar e-mail retorna erro de validação
**Prioridade:** Média
**Rastreabilidade:** RF004
**Pré-Condições:** Nenhuma

**Passos:**

1. **Ação:** Enviar requisição POST para `/api/v1/login` com body: `{"senha": "Admin@123"}`
   **Resultado Esperado:** Status 400 retornado

2. **Ação:** Verificar campo `erro` na resposta
   **Resultado Esperado:** Mensagem: "Os campos email e senha são obrigatórios."

**Pós-Condições:** Nenhum token gerado

---

**ID:** CT007
**Título:** Verificar que login sem informar senha retorna erro de validação
**Prioridade:** Média
**Rastreabilidade:** RF004
**Pré-Condições:** Nenhuma

**Passos:**

1. **Ação:** Enviar requisição POST para `/api/v1/login` com body: `{"email": "admin@clinica.com"}`
   **Resultado Esperado:** Status 400 retornado

2. **Ação:** Verificar campo `erro` na resposta
   **Resultado Esperado:** Mensagem: "Os campos email e senha são obrigatórios."

**Pós-Condições:** Nenhum token gerado

---

## 2. Autocadastro de Paciente

---

**ID:** CT008
**Título:** Verificar autocadastro de paciente com dados válidos
**Prioridade:** Alta
**Rastreabilidade:** RF002
**Pré-Condições:** CPF "111.222.333-44" e email "joao@email.com" não existem no sistema

**Passos:**

1. **Ação:** Enviar requisição POST para `/api/v1/pacientes` com body: `{"nome": "João Silva", "cpf": "111.222.333-44", "email": "joao@email.com", "telefone": "(11) 99999-0000", "senha": "Joao@123"}`
   **Resultado Esperado:** Status 201 retornado

2. **Ação:** Verificar campo `id` na resposta
   **Resultado Esperado:** Campo `id` presente (formato UUID)

3. **Ação:** Verificar campo `role` na resposta
   **Resultado Esperado:** Valor igual a "PACIENTE"

4. **Ação:** Verificar ausência do campo `senha` na resposta
   **Resultado Esperado:** Campo `senha` não retornado

**Pós-Condições:** Paciente registrado no sistema e apto a realizar login

---

**ID:** CT009
**Título:** Verificar que cadastro com e-mail já existente é recusado
**Prioridade:** Alta
**Rastreabilidade:** RF002, RN005
**Pré-Condições:** Paciente com email "joao@email.com" já cadastrado no sistema

**Passos:**

1. **Ação:** Enviar requisição POST para `/api/v1/pacientes` com body contendo email "joao@email.com" e CPF diferente
   **Resultado Esperado:** Status 409 retornado

2. **Ação:** Verificar campo `erro` na resposta
   **Resultado Esperado:** Mensagem: "E-mail já cadastrado no sistema."

**Pós-Condições:** Nenhum novo registro criado

---

**ID:** CT010
**Título:** Verificar que cadastro com CPF já existente é recusado
**Prioridade:** Alta
**Rastreabilidade:** RF002, RN005
**Pré-Condições:** Paciente com CPF "111.222.333-44" já cadastrado no sistema

**Passos:**

1. **Ação:** Enviar requisição POST para `/api/v1/pacientes` com body contendo CPF "111.222.333-44" e email diferente
   **Resultado Esperado:** Status 409 retornado

2. **Ação:** Verificar campo `erro` na resposta
   **Resultado Esperado:** Mensagem: "CPF já cadastrado no sistema."

**Pós-Condições:** Nenhum novo registro criado

---

**ID:** CT011
**Título:** Verificar que cadastro de paciente sem campo nome retorna erro
**Prioridade:** Média
**Rastreabilidade:** RF002
**Pré-Condições:** Nenhuma

**Passos:**

1. **Ação:** Enviar requisição POST para `/api/v1/pacientes` com body sem o campo `nome`
   **Resultado Esperado:** Status 400 retornado

2. **Ação:** Verificar campo `erro` na resposta
   **Resultado Esperado:** Mensagem: "Todos os campos são obrigatórios: nome, cpf, email, telefone, senha."

**Pós-Condições:** Nenhum registro criado

---

**ID:** CT012
**Título:** Verificar que cadastro de paciente sem campo cpf retorna erro
**Prioridade:** Média
**Rastreabilidade:** RF002
**Pré-Condições:** Nenhuma

**Passos:**

1. **Ação:** Enviar requisição POST para `/api/v1/pacientes` com body sem o campo `cpf`
   **Resultado Esperado:** Status 400 retornado

2. **Ação:** Verificar campo `erro` na resposta
   **Resultado Esperado:** Mensagem: "Todos os campos são obrigatórios: nome, cpf, email, telefone, senha."

**Pós-Condições:** Nenhum registro criado

---

**ID:** CT013
**Título:** Verificar que cadastro de paciente sem campo email retorna erro
**Prioridade:** Média
**Rastreabilidade:** RF002
**Pré-Condições:** Nenhuma

**Passos:**

1. **Ação:** Enviar requisição POST para `/api/v1/pacientes` com body sem o campo `email`
   **Resultado Esperado:** Status 400 retornado

2. **Ação:** Verificar campo `erro` na resposta
   **Resultado Esperado:** Mensagem: "Todos os campos são obrigatórios: nome, cpf, email, telefone, senha."

**Pós-Condições:** Nenhum registro criado

---

**ID:** CT014
**Título:** Verificar que cadastro de paciente sem campo telefone retorna erro
**Prioridade:** Média
**Rastreabilidade:** RF002
**Pré-Condições:** Nenhuma

**Passos:**

1. **Ação:** Enviar requisição POST para `/api/v1/pacientes` com body sem o campo `telefone`
   **Resultado Esperado:** Status 400 retornado

2. **Ação:** Verificar campo `erro` na resposta
   **Resultado Esperado:** Mensagem: "Todos os campos são obrigatórios: nome, cpf, email, telefone, senha."

**Pós-Condições:** Nenhum registro criado

---

**ID:** CT015
**Título:** Verificar que cadastro de paciente sem campo senha retorna erro
**Prioridade:** Média
**Rastreabilidade:** RF002
**Pré-Condições:** Nenhuma

**Passos:**

1. **Ação:** Enviar requisição POST para `/api/v1/pacientes` com body sem o campo `senha`
   **Resultado Esperado:** Status 400 retornado

2. **Ação:** Verificar campo `erro` na resposta
   **Resultado Esperado:** Mensagem: "Todos os campos são obrigatórios: nome, cpf, email, telefone, senha."

**Pós-Condições:** Nenhum registro criado

---

## 3. Cadastro de Médicos

---

**ID:** CT016
**Título:** Verificar cadastro de médico com dados válidos pelo Admin
**Prioridade:** Alta
**Rastreabilidade:** RF003, RN002
**Pré-Condições:** Usuário autenticado com role ADMIN. CRM e email não existem no sistema

**Passos:**

1. **Ação:** Enviar requisição POST para `/api/v1/medicos` com header `Authorization: Bearer <token_admin>` e body: `{"nome": "Dra. Maria", "crm": "CRM/SP 123456", "especialidade": "Cardiologia", "email": "maria@clinica.com", "senha": "Medica@123"}`
   **Resultado Esperado:** Status 201 retornado

2. **Ação:** Verificar campo `id` na resposta
   **Resultado Esperado:** Campo `id` presente (formato UUID)

3. **Ação:** Verificar campo `role` na resposta
   **Resultado Esperado:** Valor igual a "MEDICO"

4. **Ação:** Verificar ausência do campo `senha` na resposta
   **Resultado Esperado:** Campo `senha` não retornado

**Pós-Condições:** Médico registrado no sistema e apto a realizar login

---

**ID:** CT017
**Título:** Verificar que cadastro de médico com CRM já existente é recusado
**Prioridade:** Alta
**Rastreabilidade:** RF003, RN005
**Pré-Condições:** Usuário autenticado com role ADMIN. Médico com CRM "CRM/SP 123456" já cadastrado

**Passos:**

1. **Ação:** Enviar requisição POST para `/api/v1/medicos` com body contendo CRM "CRM/SP 123456" e email diferente
   **Resultado Esperado:** Status 409 retornado

2. **Ação:** Verificar campo `erro` na resposta
   **Resultado Esperado:** Mensagem: "CRM já cadastrado no sistema."

**Pós-Condições:** Nenhum novo registro criado

---

**ID:** CT018
**Título:** Verificar que cadastro de médico com e-mail já existente é recusado
**Prioridade:** Alta
**Rastreabilidade:** RF003, RN005
**Pré-Condições:** Usuário autenticado com role ADMIN. Email "maria@clinica.com" já utilizado

**Passos:**

1. **Ação:** Enviar requisição POST para `/api/v1/medicos` com body contendo email "maria@clinica.com" e CRM diferente
   **Resultado Esperado:** Status 409 retornado

2. **Ação:** Verificar campo `erro` na resposta
   **Resultado Esperado:** Mensagem: "E-mail já cadastrado no sistema."

**Pós-Condições:** Nenhum novo registro criado

---

**ID:** CT019
**Título:** Verificar que cadastro de médico sem campos obrigatórios retorna erro
**Prioridade:** Média
**Rastreabilidade:** RF003
**Pré-Condições:** Usuário autenticado com role ADMIN

**Passos:**

1. **Ação:** Enviar requisição POST para `/api/v1/medicos` com body sem o campo `especialidade`
   **Resultado Esperado:** Status 400 retornado

2. **Ação:** Verificar campo `erro` na resposta
   **Resultado Esperado:** Mensagem: "Todos os campos são obrigatórios: nome, crm, especialidade, email, senha."

**Pós-Condições:** Nenhum registro criado

---

**ID:** CT020
**Título:** Verificar que paciente não consegue cadastrar médico (RBAC)
**Prioridade:** Alta
**Rastreabilidade:** RF003, RN002
**Pré-Condições:** Usuário autenticado com role PACIENTE

**Passos:**

1. **Ação:** Enviar requisição POST para `/api/v1/medicos` com header `Authorization: Bearer <token_paciente>` e body com dados válidos
   **Resultado Esperado:** Status 403 retornado

2. **Ação:** Verificar campo `erro` na resposta
   **Resultado Esperado:** Mensagem: "Acesso negado. Permissão insuficiente."

**Pós-Condições:** Nenhum registro criado

---

**ID:** CT021
**Título:** Verificar que cadastro de médico sem autenticação é recusado
**Prioridade:** Alta
**Rastreabilidade:** RF003, RN003
**Pré-Condições:** Nenhuma (requisição sem header Authorization)

**Passos:**

1. **Ação:** Enviar requisição POST para `/api/v1/medicos` sem header Authorization
   **Resultado Esperado:** Status 401 retornado

2. **Ação:** Verificar campo `erro` na resposta
   **Resultado Esperado:** Mensagem: "Token não fornecido."

**Pós-Condições:** Nenhum registro criado

---

**ID:** CT022
**Título:** Verificar que cadastro de médico com token inválido é recusado
**Prioridade:** Média
**Rastreabilidade:** RF003, RN003
**Pré-Condições:** Token malformado ou expirado

**Passos:**

1. **Ação:** Enviar requisição POST para `/api/v1/medicos` com header `Authorization: Bearer token.invalido.aqui`
   **Resultado Esperado:** Status 401 retornado

2. **Ação:** Verificar campo `erro` na resposta
   **Resultado Esperado:** Mensagem: "Token inválido ou expirado."

**Pós-Condições:** Nenhum registro criado

---

## 4. Listar Médicos

---

**ID:** CT023
**Título:** Verificar listagem de médicos com autenticação válida
**Prioridade:** Média
**Rastreabilidade:** RF003
**Pré-Condições:** Usuário autenticado (qualquer perfil). Médicos cadastrados no sistema

**Passos:**

1. **Ação:** Enviar requisição GET para `/api/v1/medicos` com header `Authorization: Bearer <token_valido>`
   **Resultado Esperado:** Status 200 retornado

2. **Ação:** Verificar corpo da resposta
   **Resultado Esperado:** Array de objetos com dados dos médicos (id, nome, crm, especialidade, email)

3. **Ação:** Verificar ausência do campo `senha` nos objetos
   **Resultado Esperado:** Campo `senha` não presente em nenhum item

**Pós-Condições:** Nenhuma alteração no sistema

---

**ID:** CT024
**Título:** Verificar que listagem de médicos sem autenticação é recusada
**Prioridade:** Média
**Rastreabilidade:** RN003
**Pré-Condições:** Nenhuma (sem token)

**Passos:**

1. **Ação:** Enviar requisição GET para `/api/v1/medicos` sem header Authorization
   **Resultado Esperado:** Status 401 retornado

2. **Ação:** Verificar campo `erro` na resposta
   **Resultado Esperado:** Mensagem: "Token não fornecido."

**Pós-Condições:** Nenhuma alteração no sistema

---

## 5. Consulta de Disponibilidade

---

**ID:** CT025
**Título:** Verificar consulta de disponibilidade em dia útil sem agendamentos
**Prioridade:** Alta
**Rastreabilidade:** RF005, RN008
**Pré-Condições:** Usuário autenticado. Médico cadastrado com id conhecido. Data em dia útil sem agendamentos

**Passos:**

1. **Ação:** Enviar requisição GET para `/api/v1/agendamentos/disponibilidade?medicoId=<id>&data=2026-08-12` com token válido
   **Resultado Esperado:** Status 200 retornado

2. **Ação:** Verificar campo `horariosDisponiveis` na resposta
   **Resultado Esperado:** Array com 12 horários: "07:00" a "18:00"

3. **Ação:** Verificar campos `medico` e `especialidade`
   **Resultado Esperado:** Dados do médico retornados corretamente

**Pós-Condições:** Nenhuma alteração no sistema

---

**ID:** CT026
**Título:** Verificar que horários já agendados não aparecem na disponibilidade
**Prioridade:** Alta
**Rastreabilidade:** RF005, RN006
**Pré-Condições:** Usuário autenticado. Médico com consulta agendada às 10:00 na data consultada

**Passos:**

1. **Ação:** Enviar requisição GET para `/api/v1/agendamentos/disponibilidade?medicoId=<id>&data=<data_com_agendamento>`
   **Resultado Esperado:** Status 200 retornado

2. **Ação:** Verificar campo `horariosDisponiveis`
   **Resultado Esperado:** Array com 11 horários (não contém "10:00")

**Pós-Condições:** Nenhuma alteração no sistema

---

**ID:** CT027
**Título:** Verificar que consulta de disponibilidade em sábado é recusada
**Prioridade:** Alta
**Rastreabilidade:** RF005, RN008
**Pré-Condições:** Usuário autenticado. Médico cadastrado

**Passos:**

1. **Ação:** Enviar requisição GET para `/api/v1/agendamentos/disponibilidade?medicoId=<id>&data=2026-08-15` (sábado)
   **Resultado Esperado:** Status 400 retornado

2. **Ação:** Verificar campo `erro` na resposta
   **Resultado Esperado:** Mensagem: "Agendamentos permitidos apenas de segunda a sexta-feira."

**Pós-Condições:** Nenhuma alteração no sistema

---

**ID:** CT028
**Título:** Verificar que consulta de disponibilidade em domingo é recusada
**Prioridade:** Alta
**Rastreabilidade:** RF005, RN008
**Pré-Condições:** Usuário autenticado. Médico cadastrado

**Passos:**

1. **Ação:** Enviar requisição GET para `/api/v1/agendamentos/disponibilidade?medicoId=<id>&data=2026-08-16` (domingo)
   **Resultado Esperado:** Status 400 retornado

2. **Ação:** Verificar campo `erro` na resposta
   **Resultado Esperado:** Mensagem: "Agendamentos permitidos apenas de segunda a sexta-feira."

**Pós-Condições:** Nenhuma alteração no sistema

---

**ID:** CT029
**Título:** Verificar consulta de disponibilidade com médico inexistente
**Prioridade:** Média
**Rastreabilidade:** RF005
**Pré-Condições:** Usuário autenticado

**Passos:**

1. **Ação:** Enviar requisição GET para `/api/v1/agendamentos/disponibilidade?medicoId=id-inexistente&data=2026-08-12`
   **Resultado Esperado:** Status 404 retornado

2. **Ação:** Verificar campo `erro` na resposta
   **Resultado Esperado:** Mensagem: "Médico não encontrado."

**Pós-Condições:** Nenhuma alteração no sistema

---

**ID:** CT030
**Título:** Verificar que consulta de disponibilidade sem medicoId retorna erro
**Prioridade:** Média
**Rastreabilidade:** RF005
**Pré-Condições:** Usuário autenticado

**Passos:**

1. **Ação:** Enviar requisição GET para `/api/v1/agendamentos/disponibilidade?data=2026-08-12` (sem medicoId)
   **Resultado Esperado:** Status 400 retornado

2. **Ação:** Verificar campo `erro` na resposta
   **Resultado Esperado:** Mensagem: "Os campos medicoId e data são obrigatórios."

**Pós-Condições:** Nenhuma alteração no sistema

---

**ID:** CT031
**Título:** Verificar que consulta de disponibilidade sem data retorna erro
**Prioridade:** Média
**Rastreabilidade:** RF005
**Pré-Condições:** Usuário autenticado

**Passos:**

1. **Ação:** Enviar requisição GET para `/api/v1/agendamentos/disponibilidade?medicoId=<id>` (sem data)
   **Resultado Esperado:** Status 400 retornado

2. **Ação:** Verificar campo `erro` na resposta
   **Resultado Esperado:** Mensagem: "Os campos medicoId e data são obrigatórios."

**Pós-Condições:** Nenhuma alteração no sistema

---

## 6. Criar Agendamento

---

**ID:** CT032
**Título:** Verificar criação de agendamento com dados válidos
**Prioridade:** Alta
**Rastreabilidade:** RF006, RN006, RN007, RN008, RN009
**Pré-Condições:** Paciente autenticado. Médico cadastrado. Horário livre em dia útil futuro (mais de 30 min de antecedência)

**Passos:**

1. **Ação:** Enviar requisição POST para `/api/v1/agendamentos` com header `Authorization: Bearer <token_paciente>` e body: `{"medicoId": "<id>", "data": "2026-08-12", "horario": "10:00"}`
   **Resultado Esperado:** Status 201 retornado

2. **Ação:** Verificar campo `status` na resposta
   **Resultado Esperado:** Valor igual a "AGENDADA"

3. **Ação:** Verificar campo `id` na resposta
   **Resultado Esperado:** Campo `id` presente (formato UUID)

4. **Ação:** Verificar campo `medicoNome` na resposta
   **Resultado Esperado:** Nome do médico retornado corretamente

**Pós-Condições:** Agendamento criado. Horário indisponível para novo agendamento com o mesmo médico

---

**ID:** CT033
**Título:** Verificar que agendamento com médico inexistente é recusado
**Prioridade:** Média
**Rastreabilidade:** RF006
**Pré-Condições:** Paciente autenticado

**Passos:**

1. **Ação:** Enviar requisição POST para `/api/v1/agendamentos` com medicoId inexistente
   **Resultado Esperado:** Status 404 retornado

2. **Ação:** Verificar campo `erro` na resposta
   **Resultado Esperado:** Mensagem: "Médico não encontrado."

**Pós-Condições:** Nenhum agendamento criado

---

**ID:** CT034
**Título:** Verificar que agendamento em horário fora do expediente é recusado
**Prioridade:** Alta
**Rastreabilidade:** RF006, RN008
**Pré-Condições:** Paciente autenticado. Médico cadastrado

**Passos:**

1. **Ação:** Enviar requisição POST para `/api/v1/agendamentos` com horário "06:00"
   **Resultado Esperado:** Status 400 retornado

2. **Ação:** Verificar campo `erro` na resposta
   **Resultado Esperado:** Mensagem: "Horário inválido. Horários permitidos: 07:00 às 18:00 (intervalos de 1 hora)."

**Pós-Condições:** Nenhum agendamento criado

---

**ID:** CT035
**Título:** Verificar que agendamento em fim de semana é recusado
**Prioridade:** Alta
**Rastreabilidade:** RF006, RN008
**Pré-Condições:** Paciente autenticado. Médico cadastrado

**Passos:**

1. **Ação:** Enviar requisição POST para `/api/v1/agendamentos` com data em sábado ou domingo
   **Resultado Esperado:** Status 400 retornado

2. **Ação:** Verificar campo `erro` na resposta
   **Resultado Esperado:** Mensagem: "Agendamentos permitidos apenas de segunda a sexta-feira."

**Pós-Condições:** Nenhum agendamento criado

---

**ID:** CT036
**Título:** Verificar que agendamento com menos de 30 min de antecedência é recusado
**Prioridade:** Alta
**Rastreabilidade:** RF006, RN009
**Pré-Condições:** Paciente autenticado. Médico cadastrado. Data/horário com menos de 30 minutos a partir de agora

**Passos:**

1. **Ação:** Enviar requisição POST para `/api/v1/agendamentos` com data e horário dentro dos próximos 30 minutos
   **Resultado Esperado:** Status 400 retornado

2. **Ação:** Verificar campo `erro` na resposta
   **Resultado Esperado:** Mensagem: "Consultas devem ser agendadas com no mínimo 30 minutos de antecedência."

**Pós-Condições:** Nenhum agendamento criado

---

**ID:** CT037
**Título:** Verificar que agendamento em horário já ocupado pelo médico é recusado
**Prioridade:** Alta
**Rastreabilidade:** RF006, RN006
**Pré-Condições:** Paciente autenticado. Médico já possui consulta agendada na data e horário informados

**Passos:**

1. **Ação:** Enviar requisição POST para `/api/v1/agendamentos` com mesmo medicoId, data e horário de consulta existente
   **Resultado Esperado:** Status 409 retornado

2. **Ação:** Verificar campo `erro` na resposta
   **Resultado Esperado:** Mensagem: "O médico já possui uma consulta agendada neste horário."

**Pós-Condições:** Nenhum agendamento criado

---

**ID:** CT038
**Título:** Verificar que paciente não pode agendar duas consultas no mesmo horário
**Prioridade:** Alta
**Rastreabilidade:** RF006, RN007
**Pré-Condições:** Paciente autenticado. Paciente já possui consulta agendada na data e horário informados (com outro médico)

**Passos:**

1. **Ação:** Enviar requisição POST para `/api/v1/agendamentos` com outro medicoId, mesma data e mesmo horário
   **Resultado Esperado:** Status 409 retornado

2. **Ação:** Verificar campo `erro` na resposta
   **Resultado Esperado:** Mensagem: "Você já possui uma consulta agendada neste horário."

**Pós-Condições:** Nenhum agendamento criado

---

**ID:** CT039
**Título:** Verificar que agendamento sem campos obrigatórios retorna erro
**Prioridade:** Média
**Rastreabilidade:** RF006
**Pré-Condições:** Paciente autenticado

**Passos:**

1. **Ação:** Enviar requisição POST para `/api/v1/agendamentos` com body sem o campo `horario`
   **Resultado Esperado:** Status 400 retornado

2. **Ação:** Verificar campo `erro` na resposta
   **Resultado Esperado:** Mensagem: "Os campos medicoId, data e horario são obrigatórios."

**Pós-Condições:** Nenhum agendamento criado

---

**ID:** CT040
**Título:** Verificar que Admin não consegue criar agendamento (RBAC)
**Prioridade:** Alta
**Rastreabilidade:** RF006, RN002
**Pré-Condições:** Usuário autenticado com role ADMIN

**Passos:**

1. **Ação:** Enviar requisição POST para `/api/v1/agendamentos` com token Admin e dados válidos
   **Resultado Esperado:** Status 403 retornado

2. **Ação:** Verificar campo `erro` na resposta
   **Resultado Esperado:** Mensagem: "Acesso negado. Permissão insuficiente."

**Pós-Condições:** Nenhum agendamento criado

---

**ID:** CT041
**Título:** Verificar que agendamento sem autenticação é recusado
**Prioridade:** Alta
**Rastreabilidade:** RF006, RN003
**Pré-Condições:** Nenhuma (sem token)

**Passos:**

1. **Ação:** Enviar requisição POST para `/api/v1/agendamentos` sem header Authorization
   **Resultado Esperado:** Status 401 retornado

2. **Ação:** Verificar campo `erro` na resposta
   **Resultado Esperado:** Mensagem: "Token não fornecido."

**Pós-Condições:** Nenhum agendamento criado

---

## 7. Consultar Agendamentos do Paciente

---

**ID:** CT042
**Título:** Verificar consulta de agendamentos do paciente autenticado
**Prioridade:** Alta
**Rastreabilidade:** RF007, RN004
**Pré-Condições:** Paciente autenticado com agendamentos existentes

**Passos:**

1. **Ação:** Enviar requisição GET para `/api/v1/agendamentos` com header `Authorization: Bearer <token_paciente>`
   **Resultado Esperado:** Status 200 retornado

2. **Ação:** Verificar corpo da resposta
   **Resultado Esperado:** Array com todos os agendamentos do paciente logado

3. **Ação:** Verificar que cada item contém os campos esperados
   **Resultado Esperado:** Campos: id, medicoId, medicoNome, especialidade, data, horario, status

**Pós-Condições:** Nenhuma alteração no sistema

---

**ID:** CT043
**Título:** Verificar consulta de agendamentos quando paciente não possui nenhum
**Prioridade:** Média
**Rastreabilidade:** RF007
**Pré-Condições:** Paciente autenticado sem agendamentos cadastrados

**Passos:**

1. **Ação:** Enviar requisição GET para `/api/v1/agendamentos` com token do paciente
   **Resultado Esperado:** Status 200 retornado

2. **Ação:** Verificar corpo da resposta
   **Resultado Esperado:** Array vazio `[]`

**Pós-Condições:** Nenhuma alteração no sistema

---

**ID:** CT044
**Título:** Verificar que Admin não consegue consultar agendamentos (RBAC)
**Prioridade:** Média
**Rastreabilidade:** RF007, RN002
**Pré-Condições:** Usuário autenticado com role ADMIN

**Passos:**

1. **Ação:** Enviar requisição GET para `/api/v1/agendamentos` com token Admin
   **Resultado Esperado:** Status 403 retornado

2. **Ação:** Verificar campo `erro` na resposta
   **Resultado Esperado:** Mensagem: "Acesso negado. Permissão insuficiente."

**Pós-Condições:** Nenhuma alteração no sistema

---

**ID:** CT045
**Título:** Verificar isolamento de dados entre pacientes diferentes
**Prioridade:** Alta
**Rastreabilidade:** RF007, RN004
**Pré-Condições:** Paciente A e Paciente B autenticados, cada um com agendamentos próprios

**Passos:**

1. **Ação:** Enviar requisição GET para `/api/v1/agendamentos` com token do Paciente A
   **Resultado Esperado:** Status 200 retornado

2. **Ação:** Verificar que a resposta contém apenas agendamentos do Paciente A
   **Resultado Esperado:** Nenhum item com pacienteId diferente do Paciente A

3. **Ação:** Enviar requisição GET para `/api/v1/agendamentos` com token do Paciente B
   **Resultado Esperado:** Status 200 retornado

4. **Ação:** Verificar que a resposta contém apenas agendamentos do Paciente B
   **Resultado Esperado:** Nenhum item com pacienteId diferente do Paciente B

**Pós-Condições:** Nenhuma alteração no sistema

---

## 8. Cancelar Agendamento

---

**ID:** CT046
**Título:** Verificar cancelamento de agendamento com mais de 24h de antecedência
**Prioridade:** Alta
**Rastreabilidade:** RF008, RN010
**Pré-Condições:** Paciente autenticado. Agendamento com status "AGENDADA" e data/horário com mais de 24h do momento atual

**Passos:**

1. **Ação:** Enviar requisição PATCH para `/api/v1/agendamentos/<id>/cancelar` com body: `{"motivo": "Imprevisto pessoal"}`
   **Resultado Esperado:** Status 200 retornado

2. **Ação:** Verificar campo `status` na resposta
   **Resultado Esperado:** Valor igual a "CANCELADA"

3. **Ação:** Verificar campo `motivoCancelamento` na resposta
   **Resultado Esperado:** Valor igual a "Imprevisto pessoal"

4. **Ação:** Verificar campo `canceladoEm` na resposta
   **Resultado Esperado:** Campo presente com data/hora do cancelamento

**Pós-Condições:** Agendamento cancelado. Horário liberado para novos agendamentos

---

**ID:** CT047
**Título:** Verificar que cancelamento sem motivo é recusado
**Prioridade:** Alta
**Rastreabilidade:** RF008
**Pré-Condições:** Paciente autenticado. Agendamento existente

**Passos:**

1. **Ação:** Enviar requisição PATCH para `/api/v1/agendamentos/<id>/cancelar` com body vazio `{}`
   **Resultado Esperado:** Status 400 retornado

2. **Ação:** Verificar campo `erro` na resposta
   **Resultado Esperado:** Mensagem: "O motivo do cancelamento é obrigatório."

**Pós-Condições:** Agendamento mantém status "AGENDADA"

---

**ID:** CT048
**Título:** Verificar que cancelamento com menos de 24h de antecedência é recusado
**Prioridade:** Alta
**Rastreabilidade:** RF008, RN010
**Pré-Condições:** Paciente autenticado. Agendamento com horário em menos de 24h a partir de agora

**Passos:**

1. **Ação:** Enviar requisição PATCH para `/api/v1/agendamentos/<id>/cancelar` com body: `{"motivo": "Imprevisto"}`
   **Resultado Esperado:** Status 400 retornado

2. **Ação:** Verificar campo `erro` na resposta
   **Resultado Esperado:** Mensagem: "O cancelamento só é permitido com no mínimo 24 horas de antecedência."

**Pós-Condições:** Agendamento mantém status "AGENDADA"

---

**ID:** CT049
**Título:** Verificar que cancelamento de agendamento já cancelado é recusado
**Prioridade:** Média
**Rastreabilidade:** RF008
**Pré-Condições:** Paciente autenticado. Agendamento com status "CANCELADA"

**Passos:**

1. **Ação:** Enviar requisição PATCH para `/api/v1/agendamentos/<id>/cancelar` com body: `{"motivo": "Outro motivo"}`
   **Resultado Esperado:** Status 400 retornado

2. **Ação:** Verificar campo `erro` na resposta
   **Resultado Esperado:** Mensagem: "Este agendamento já foi cancelado."

**Pós-Condições:** Nenhuma alteração no agendamento

---

**ID:** CT050
**Título:** Verificar cancelamento de agendamento inexistente
**Prioridade:** Média
**Rastreabilidade:** RF008
**Pré-Condições:** Paciente autenticado

**Passos:**

1. **Ação:** Enviar requisição PATCH para `/api/v1/agendamentos/id-inexistente/cancelar` com body: `{"motivo": "Qualquer"}`
   **Resultado Esperado:** Status 404 retornado

2. **Ação:** Verificar campo `erro` na resposta
   **Resultado Esperado:** Mensagem: "Agendamento não encontrado."

**Pós-Condições:** Nenhuma alteração no sistema

---

**ID:** CT051
**Título:** Verificar que paciente não pode cancelar agendamento de outro paciente
**Prioridade:** Alta
**Rastreabilidade:** RF008, RN004
**Pré-Condições:** Paciente A autenticado. Agendamento pertence ao Paciente B

**Passos:**

1. **Ação:** Enviar requisição PATCH para `/api/v1/agendamentos/<id_paciente_b>/cancelar` com token do Paciente A e body: `{"motivo": "Qualquer"}`
   **Resultado Esperado:** Status 403 retornado

2. **Ação:** Verificar campo `erro` na resposta
   **Resultado Esperado:** Mensagem: "Você não tem permissão para cancelar este agendamento."

**Pós-Condições:** Agendamento do Paciente B mantém status "AGENDADA"

---

**ID:** CT052
**Título:** Verificar que cancelamento sem autenticação é recusado
**Prioridade:** Média
**Rastreabilidade:** RF008, RN003
**Pré-Condições:** Nenhuma (sem token)

**Passos:**

1. **Ação:** Enviar requisição PATCH para `/api/v1/agendamentos/<id>/cancelar` sem header Authorization
   **Resultado Esperado:** Status 401 retornado

2. **Ação:** Verificar campo `erro` na resposta
   **Resultado Esperado:** Mensagem: "Token não fornecido."

**Pós-Condições:** Nenhuma alteração no sistema

---

## 9. Middleware de Autenticação (JWT)

---

**ID:** CT053
**Título:** Verificar que requisição com token válido é processada normalmente
**Prioridade:** Alta
**Rastreabilidade:** RN003
**Pré-Condições:** Token JWT gerado via login e dentro da validade (8h)

**Passos:**

1. **Ação:** Enviar requisição GET para `/api/v1/medicos` com header `Authorization: Bearer <token_valido>`
   **Resultado Esperado:** Status 200 retornado

2. **Ação:** Verificar que a resposta contém dados esperados
   **Resultado Esperado:** Requisição processada com sucesso (não bloqueada pelo middleware)

**Pós-Condições:** Nenhuma

---

**ID:** CT054
**Título:** Verificar que requisição sem header Authorization é bloqueada
**Prioridade:** Alta
**Rastreabilidade:** RN003
**Pré-Condições:** Nenhuma

**Passos:**

1. **Ação:** Enviar requisição GET para `/api/v1/medicos` sem header Authorization
   **Resultado Esperado:** Status 401 retornado

2. **Ação:** Verificar campo `erro` na resposta
   **Resultado Esperado:** Mensagem: "Token não fornecido."

**Pós-Condições:** Requisição não chega ao controller

---

**ID:** CT055
**Título:** Verificar que token sem prefixo Bearer é rejeitado
**Prioridade:** Média
**Rastreabilidade:** RN003
**Pré-Condições:** Nenhuma

**Passos:**

1. **Ação:** Enviar requisição GET para `/api/v1/medicos` com header `Authorization: <token>` (sem "Bearer")
   **Resultado Esperado:** Status 401 retornado

2. **Ação:** Verificar campo `erro` na resposta
   **Resultado Esperado:** Mensagem: "Formato de token inválido."

**Pós-Condições:** Requisição não chega ao controller

---

**ID:** CT056
**Título:** Verificar que token expirado é rejeitado
**Prioridade:** Alta
**Rastreabilidade:** RN003
**Pré-Condições:** Token JWT com expiração ultrapassada

**Passos:**

1. **Ação:** Enviar requisição GET para `/api/v1/medicos` com header `Authorization: Bearer <token_expirado>`
   **Resultado Esperado:** Status 401 retornado

2. **Ação:** Verificar campo `erro` na resposta
   **Resultado Esperado:** Mensagem: "Token inválido ou expirado."

**Pós-Condições:** Requisição não chega ao controller

---

**ID:** CT057
**Título:** Verificar que token com assinatura incorreta é rejeitado
**Prioridade:** Alta
**Rastreabilidade:** RN003
**Pré-Condições:** Nenhuma

**Passos:**

1. **Ação:** Enviar requisição GET para `/api/v1/medicos` com header `Authorization: Bearer token.invalido.aqui`
   **Resultado Esperado:** Status 401 retornado

2. **Ação:** Verificar campo `erro` na resposta
   **Resultado Esperado:** Mensagem: "Token inválido ou expirado."

**Pós-Condições:** Requisição não chega ao controller

---

## 10. Carga Inicial (Seed)

---

**ID:** CT058
**Título:** Verificar criação automática do Admin na inicialização do servidor
**Prioridade:** Alta
**Rastreabilidade:** RF001, RN001
**Pré-Condições:** Servidor sendo iniciado pela primeira vez (banco vazio)

**Passos:**

1. **Ação:** Iniciar o servidor com `npm start`
   **Resultado Esperado:** Servidor inicia sem erros

2. **Ação:** Verificar log no console
   **Resultado Esperado:** Mensagem "Usuário ADMIN criado com sucesso (Seed)." exibida

3. **Ação:** Enviar requisição POST para `/api/v1/login` com email "admin@clinica.com" e senha "Admin@123"
   **Resultado Esperado:** Status 200 retornado com token válido

**Pós-Condições:** Usuário Admin existe no sistema com role ADMIN e senha criptografada via bcrypt

---

**ID:** CT059
**Título:** Verificar que Seed não duplica o Admin em reinicializações
**Prioridade:** Média
**Rastreabilidade:** RF001
**Pré-Condições:** Servidor já iniciado anteriormente com Admin criado

**Passos:**

1. **Ação:** Executar a função `seedAdmin()` novamente
   **Resultado Esperado:** Nenhum erro ocorre

2. **Ação:** Verificar quantidade de usuários com email "admin@clinica.com"
   **Resultado Esperado:** Apenas 1 registro existente (não duplicou)

**Pós-Condições:** Banco de dados mantém apenas um registro de Admin
