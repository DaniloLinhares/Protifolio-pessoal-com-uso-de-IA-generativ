# Prompt de Instruções para Geração da API REST - Agendamento Médico

**Papel:** Atue como um Desenvolvedor Backend Senior especializado em Node.js, Express.js e Arquitetura de Software.

**Objetivo:** Construir uma API RESTful completa em Node.js utilizando o framework Express para um sistema de agendamento de consultas médicas. A API deve seguir uma arquitetura em camadas, utilizar banco de dados em memória, possuir autenticação via JWT com controle de acesso baseado em funções (RBAC), tratamento padronizado de erros e documentação interativa com Swagger.

***Contexto:** 

- A API possui as seguintes funcionalidades: Autocadastro de Paciente, Cadastro de Médicos, Autenticação / Login, Consulta de Disponibilidade, Criar Agendamento, Consultar Agendamentos do Paciente, Cancelar Consulta
- Para que o paciente possa usar as funcionalidades, precisa fazer login para gerar o token jwt e usar nas demais requisições.
- Não é permitido cadastrar dois médicos com o mesmo **CRM**.
- Não é permitido cadastrar dois usuários com o mesmo **CPF** ou **E-mail**.
- Um médico não pode ter mais de uma consulta agendada no mesmo horário.
- Um paciente não pode agendar duas consultas no mesmo horário, mesmo que com médicos diferentes.
- Agendamentos permitidos apenas de segunda a sexta, das 07:00 às 19:00 (consultas com duração fixa de 1 hora).
- Consultas devem ser agendadas com no mínimo 30 minutos de antecedência.
- O cancelamento só é permitido se realizado com no mínimo 24 horas de antecedência em relação ao horário agendado.

---

### 1. Arquitetura e Divisão em Camadas

A API deve ser construída utilizando a biblioteca **Express** e organizada estritamente na seguinte estrutura de pastas e camadas:

```text
src/
├── models/         # Camada de Dados: entidades e manipulação do armazenamento em memória
├── services/       # Camada de Regras de Negócio: validações, fluxos e regras de agendamento
├── controllers/    # Camada de Apresentação: manipulação de req/res HTTP e chamadas aos services
├── routes/         # Camada de Roteamento: mapeamento dos endpoints e associação de middlewares
├── middlewares/    # Camada de Segurança: validação de token JWT e autorizações RBAC
└── resources/      # Pasta de Recursos: contém o arquivo swagger.json de documentação

### 2. Regras

- Não me pergunte nada, só faça.
- A documentação da API deve ser feita com Swagger, em forma de arquivo. Crie esse arquivo em uma pasta de recursos. O Swagger precisa descrever o modelo JSON da resposta de cada endpoint com base na forma que a API for implementada. O - - - Swagger também deve contemplar os status code de erro que são implementados na API.
- Adicione um endpoint para renderizar o Swagger.
- Construa um arquivo README para descrever o projeto.
- Divida a API em camadas: routs, controllers, service e model.
- Armazene os dados da API em um banco de dados em memória.
- Implemente uma camada de armazenamento em memória utilizando estruturas do JavaScript (Arrays/Maps). 
- Carga Inicial (Seed): Ao iniciar o servidor, o sistema deve registrar automaticamente um usuário ADMIN:
    Nome: Administrador do Sistema
    E-mail: admin@clinica.com
    Senha: Admin@123 (criptografada via bcryptjs)
    Perfil (Role): ADMIN
- Utilize a biblioteca express para construir a API Rest.
- Faça com que a autenticação seja parte do Middleware, utilizando token JWT como modelo de autenticação, e implemente as regras de autenticação seguindo as informações descritas no contexto.
