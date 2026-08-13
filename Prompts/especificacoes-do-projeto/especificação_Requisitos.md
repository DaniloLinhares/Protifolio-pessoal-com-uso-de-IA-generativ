# Especificação de Requisitos - API de Agendamento Médico

## Visão Geral
API REST para gestão de usuários (médicos e pacientes), autenticação baseada em funções (RBAC) e agendamento de consultas médicas em uma clínica.

---

## Perfis de Usuário (Roles)

- **ADMIN:** Administrador do sistema. Criado automaticamente via carga inicial (Seed) do banco de dados. Possui permissões totais de gestão.
- **PACIENTE:** Cliente final da clínica. Realiza autocadastro e gerencia seus próprios agendamentos.
- **MEDICO:** Profissional de saúde cadastrado exclusivamente pelo `ADMIN`.

---

## Requisitos Funcionais (RF)

### 1. Gestão de Acesso e Usuários
- **RF001 (Carga Inicial de Admin):** O sistema deve fornecer uma conta de perfil `ADMIN` pré-cadastrada no banco de dados na inicialização da aplicação (Seed).
- **RF002 (Autocadastro de Paciente):** Permitir que qualquer visitante cadastre sua conta informando nome, CPF, e-mail, telefone e senha.
- **RF003 (Cadastro de Médicos):** Permitir o cadastro de médicos informando nome, CRM, especialidade, e-mail e senha.
- **RF004 (Autenticação / Login):** Permitir que usuários (`ADMIN`, `PACIENTE` ou `MEDICO`) realizem login com e-mail e senha, retornando um token de autenticação JWT com suas respectivas permissões (*claims*).

### 2. Agendamentos
- **RF005 (Consulta de Disponibilidade):** Permitir a consulta da grade de horários livres de um médico em uma determinada data.
- **RF006 (Criar Agendamento):** Permitir que um paciente autenticado agende uma consulta informando médico, data e horário.
- **RF007 (Consultar Agendamentos do Paciente):** Permitir que o paciente autenticado liste todas as suas consultas (futuras e histórico).
- **RF008 (Cancelar Consulta):** Permitir o cancelamento de uma consulta agendada informando o motivo.

---

## Regras de Negócio (RN)

### Segurança e Controle de Acesso (RBAC)
- **RN001 (Acesso Inicial Admin):** As credenciais padrão do `ADMIN` geradas via Seed são:
  - **E-mail:** `admin@clinica.com`
  - **Senha:** `Admin@123`
- **RN002 (Permissão para Cadastro de Médicos):** Apenas usuários com perfil `ADMIN` podem cadastrar médicos (`POST /api/v1/medicos`). Requisições com perfil `PACIENTE` ou não autenticadas devem ser negadas.
- **RN003 (Proteção de Rotas via JWT):** As rotas de agendamento, consulta de histórico e cancelamento exigem envio do token JWT no cabeçalho `Authorization: Bearer <token>`.
- **RN004 (Isolamento de Dados do Paciente):** O paciente logado só pode visualizar e gerenciar os seus próprios agendamentos. A API identifica o paciente diretamente através do token JWT.

### Unicidade e Validação
- **RN005 (Unicidade de Dados):**
  - Não é permitido cadastrar dois médicos com o mesmo **CRM**.
  - Não é permitido cadastrar dois usuários com o mesmo **CPF** ou **E-mail**.

### Horários e Regras de Agendamento
- **RN006 (Concorrência de Horários):** Um médico não pode ter mais de uma consulta agendada no mesmo horário.
- **RN007 (Conflito de Paciente):** Um paciente não pode agendar duas consultas no mesmo horário, mesmo que com médicos diferentes.
- **RN008 (Horário de Funcionamento):** Agendamentos permitidos apenas de segunda a sexta-feira, das 07:00 às 18:00 (consultas com duração fixa de 1 hora).
- **RN009 (Antecedência Mínima para Agendamento):** Consultas devem ser agendadas com no mínimo 30 minutos de antecedência.
- **RN010 (Antecedência Mínima para Cancelamento):** O cancelamento só é permitido se realizado com no mínimo 24 horas de antecedência em relação ao horário agendado.