# Casos de Teste (Gherkin) - API de Agendamento Médico

## Funcionalidade: Autenticação

```gherkin
Funcionalidade: Autenticação de usuários
  Como um usuário do sistema
  Eu quero realizar login com minhas credenciais
  Para obter um token de acesso e utilizar a API

  Esquema do Cenário: Login com credenciais válidas
    Dado que existe um usuário "<perfil>" cadastrado com email "<email>" e senha "<senha>"
    Quando eu envio uma requisição POST para "/api/v1/login" com:
      | email   | senha   |
      | <email> | <senha> |
    Então o status da resposta deve ser 200
    E a resposta deve conter um campo "token" não vazio
    E a resposta deve conter "usuario.role" igual a "<perfil>"

    Exemplos:
      | perfil   | email              | senha        |
      | ADMIN    | admin@clinica.com  | Admin@123    |
      | PACIENTE | maria@email.com    | Paciente@123 |
      | MEDICO   | carlos@clinica.com | Medico@123   |

  Esquema do Cenário: Login com credenciais inválidas
    Quando eu envio uma requisição POST para "/api/v1/login" com:
      | email   | senha   |
      | <email> | <senha> |
    Então o status da resposta deve ser 401
    E a resposta deve conter "erro" igual a "E-mail ou senha inválidos."

    Exemplos:
      | email                 | senha       | descricao           |
      | inexistente@email.com | qualquer123 | e-mail inexistente  |
      | admin@clinica.com     | SenhaErrada | senha incorreta     |

  Esquema do Cenário: Login sem campo obrigatório
    Quando eu envio uma requisição POST para "/api/v1/login" sem o campo "<campo>"
    Então o status da resposta deve ser 400
    E a resposta deve conter "erro" igual a "Os campos email e senha são obrigatórios."

    Exemplos:
      | campo |
      | email |
      | senha |
```

---

## Funcionalidade: Autocadastro de Paciente

```gherkin
Funcionalidade: Autocadastro de pacientes
  Como um visitante do sistema
  Eu quero me cadastrar como paciente
  Para poder agendar consultas médicas

  Cenário: Cadastro com todos os dados válidos
    Dado que não existe usuário com CPF "111.222.333-44" no sistema
    E que não existe usuário com email "joao@email.com" no sistema
    Quando eu envio uma requisição POST para "/api/v1/pacientes" com:
      | nome       | cpf            | email          | telefone        | senha    |
      | João Silva | 111.222.333-44 | joao@email.com | (11) 99999-0000 | Joao@123 |
    Então o status da resposta deve ser 201
    E a resposta deve conter o campo "id"
    E a resposta deve conter "role" igual a "PACIENTE"
    E a resposta não deve conter o campo "senha"

  Esquema do Cenário: Cadastro com dado único já existente
    Dado que existe um paciente cadastrado com <campo_unico> "<valor>"
    Quando eu envio uma requisição POST para "/api/v1/pacientes" com <campo_unico> "<valor>"
    Então o status da resposta deve ser 409
    E a resposta deve conter "erro" igual a "<mensagem>"

    Exemplos:
      | campo_unico | valor          | mensagem                         |
      | email       | joao@email.com | E-mail já cadastrado no sistema. |
      | CPF         | 111.222.333-44 | CPF já cadastrado no sistema.    |

  Esquema do Cenário: Cadastro com campo obrigatório ausente
    Quando eu envio uma requisição POST para "/api/v1/pacientes" sem o campo "<campo>"
    Então o status da resposta deve ser 400
    E a resposta deve conter "erro" igual a "Todos os campos são obrigatórios: nome, cpf, email, telefone, senha."

    Exemplos:
      | campo    |
      | nome     |
      | cpf      |
      | email    |
      | telefone |
      | senha    |
```

---

## Funcionalidade: Cadastro de Médicos

```gherkin
Funcionalidade: Cadastro de médicos
  Como um administrador do sistema
  Eu quero cadastrar médicos
  Para que eles possam atender pacientes

  Contexto:
    Dado que estou autenticado como "ADMIN"

  Cenário: Cadastro de médico com dados válidos
    Dado que não existe médico com CRM "CRM/SP 123456" no sistema
    E que não existe usuário com email "maria@clinica.com" no sistema
    Quando eu envio uma requisição POST para "/api/v1/medicos" com:
      | nome       | crm           | especialidade | email             | senha      |
      | Dra. Maria | CRM/SP 123456 | Cardiologia   | maria@clinica.com | Medica@123 |
    Então o status da resposta deve ser 201
    E a resposta deve conter o campo "id"
    E a resposta deve conter "role" igual a "MEDICO"
    E a resposta não deve conter o campo "senha"

  Esquema do Cenário: Cadastro com dado único já existente
    Dado que existe um registro com <campo_unico> "<valor>" no sistema
    Quando eu envio uma requisição POST para "/api/v1/medicos" com <campo_unico> "<valor>"
    Então o status da resposta deve ser 409
    E a resposta deve conter "erro" igual a "<mensagem>"

    Exemplos:
      | campo_unico | valor             | mensagem                         |
      | CRM         | CRM/SP 123456     | CRM já cadastrado no sistema.    |
      | email       | maria@clinica.com | E-mail já cadastrado no sistema. |

  Esquema do Cenário: Cadastro com campo obrigatório ausente
    Quando eu envio uma requisição POST para "/api/v1/medicos" sem o campo "<campo>"
    Então o status da resposta deve ser 400
    E a resposta deve conter "erro" igual a "Todos os campos são obrigatórios: nome, crm, especialidade, email, senha."

    Exemplos:
      | campo         |
      | nome          |
      | crm           |
      | especialidade |
      | email         |
      | senha         |
```

---

## Funcionalidade: Controle de Acesso (RBAC)

```gherkin
Funcionalidade: Controle de acesso baseado em funções
  Como o sistema de segurança
  Eu quero verificar as permissões dos usuários
  Para garantir que apenas usuários autorizados acessem os recursos

  Esquema do Cenário: Acesso negado por perfil insuficiente
    Dado que estou autenticado como "<perfil>"
    Quando eu envio uma requisição <metodo> para "<rota>" com dados válidos
    Então o status da resposta deve ser 403
    E a resposta deve conter "erro" igual a "Acesso negado. Permissão insuficiente."

    Exemplos:
      | perfil   | metodo | rota                 | descricao                        |
      | PACIENTE | POST   | /api/v1/medicos      | Paciente tenta cadastrar médico  |
      | ADMIN    | POST   | /api/v1/agendamentos | Admin tenta criar agendamento    |
      | MEDICO   | POST   | /api/v1/agendamentos | Médico tenta criar agendamento   |
      | ADMIN    | GET    | /api/v1/agendamentos | Admin tenta listar agendamentos  |

  Esquema do Cenário: Acesso negado por problema no token
    Dado que eu envio o header Authorization como "<header_value>"
    Quando eu envio uma requisição GET para "/api/v1/medicos"
    Então o status da resposta deve ser 401
    E a resposta deve conter "erro" igual a "<mensagem>"

    Exemplos:
      | header_value             | mensagem                        | descricao              |
      |                          | Token não fornecido.            | Sem token              |
      | SemBearer token123       | Formato de token inválido.      | Token mal formatado    |
      | Bearer token.invalido    | Token inválido ou expirado.     | Token inválido         |
      | Bearer token.expirado.x  | Token inválido ou expirado.     | Token expirado         |
```

---

## Funcionalidade: Consulta de Disponibilidade

```gherkin
Funcionalidade: Consulta de disponibilidade de médicos
  Como um paciente autenticado
  Eu quero consultar os horários disponíveis de um médico
  Para escolher o melhor momento para minha consulta

  Contexto:
    Dado que estou autenticado como "PACIENTE"
    E que existe um médico "Dr. Carlos" cadastrado com id "medico-id-1"

  Cenário: Consultar disponibilidade em dia útil sem agendamentos
    Quando eu envio uma requisição GET para "/api/v1/agendamentos/disponibilidade" com medicoId "medico-id-1" e data "2026-08-12"
    Então o status da resposta deve ser 200
    E a resposta deve conter "horariosDisponiveis" com 12 itens
    E a resposta deve conter "medico" igual a "Dr. Carlos"

  Cenário: Consultar disponibilidade com horário já agendado
    Dado que existe um agendamento com o "Dr. Carlos" na data "2026-08-12" às "10:00"
    Quando eu envio uma requisição GET para "/api/v1/agendamentos/disponibilidade" com medicoId "medico-id-1" e data "2026-08-12"
    Então o status da resposta deve ser 200
    E a resposta deve conter "horariosDisponiveis" com 11 itens
    E "horariosDisponiveis" não deve conter "10:00"

  Esquema do Cenário: Consultar disponibilidade em dia não permitido
    Quando eu envio uma requisição GET para "/api/v1/agendamentos/disponibilidade" com medicoId "medico-id-1" e data "<data>"
    Então o status da resposta deve ser 400
    E a resposta deve conter "erro" igual a "Agendamentos permitidos apenas de segunda a sexta-feira."

    Exemplos:
      | data       | dia_semana |
      | 2026-08-15 | sábado     |
      | 2026-08-16 | domingo    |

  Cenário: Consultar disponibilidade com médico inexistente
    Quando eu envio uma requisição GET para "/api/v1/agendamentos/disponibilidade" com medicoId "id-nao-existente" e data "2026-08-12"
    Então o status da resposta deve ser 404
    E a resposta deve conter "erro" igual a "Médico não encontrado."

  Esquema do Cenário: Consultar disponibilidade sem parâmetro obrigatório
    Quando eu envio uma requisição GET para "/api/v1/agendamentos/disponibilidade" sem o campo "<campo>"
    Então o status da resposta deve ser 400
    E a resposta deve conter "erro" igual a "Os campos medicoId e data são obrigatórios."

    Exemplos:
      | campo    |
      | medicoId |
      | data     |
```

---

## Funcionalidade: Criar Agendamento

```gherkin
Funcionalidade: Criação de agendamentos
  Como um paciente autenticado
  Eu quero agendar uma consulta médica
  Para ser atendido por um profissional de saúde

  Contexto:
    Dado que estou autenticado como "PACIENTE"
    E que existe um médico "Dr. Carlos" cadastrado com id "medico-id-1"

  Cenário: Criar agendamento com dados válidos
    Dado que o horário "10:00" do dia "2026-08-12" está disponível para o "Dr. Carlos"
    Quando eu envio uma requisição POST para "/api/v1/agendamentos" com:
      | medicoId    | data       | horario |
      | medico-id-1 | 2026-08-12 | 10:00   |
    Então o status da resposta deve ser 201
    E a resposta deve conter "status" igual a "AGENDADA"
    E a resposta deve conter o campo "id"
    E a resposta deve conter "medicoNome" igual a "Dr. Carlos"

  Esquema do Cenário: Criar agendamento com dados inválidos
    Quando eu envio uma requisição POST para "/api/v1/agendamentos" com:
      | medicoId    | data   | horario   |
      | <medicoId>  | <data> | <horario> |
    Então o status da resposta deve ser <status>
    E a resposta deve conter "erro" igual a "<mensagem>"

    Exemplos:
      | medicoId         | data       | horario | status | mensagem                                                                     | descricao                   |
      | id-nao-existente | 2026-08-12 | 10:00   | 404    | Médico não encontrado.                                                       | Médico inexistente          |
      | medico-id-1      | 2026-08-12 | 06:00   | 400    | Horário inválido. Horários permitidos: 07:00 às 18:00 (intervalos de 1 hora).| Horário fora do expediente  |
      | medico-id-1      | 2026-08-15 | 10:00   | 400    | Agendamentos permitidos apenas de segunda a sexta-feira.                     | Fim de semana (sábado)      |
      | medico-id-1      | 2026-08-16 | 10:00   | 400    | Agendamentos permitidos apenas de segunda a sexta-feira.                     | Fim de semana (domingo)     |

  Cenário: Criar agendamento com menos de 30 minutos de antecedência
    Dado que a data e horário informados estão a menos de 30 minutos do momento atual
    Quando eu envio uma requisição POST para "/api/v1/agendamentos" com data/hora próximos
    Então o status da resposta deve ser 400
    E a resposta deve conter "erro" igual a "Consultas devem ser agendadas com no mínimo 30 minutos de antecedência."

  Esquema do Cenário: Conflito de horário ao criar agendamento
    Dado que existe um agendamento na data "2026-08-12" às "10:00" para <entidade>
    Quando eu envio uma requisição POST para "/api/v1/agendamentos" com:
      | medicoId    | data       | horario |
      | <medicoId>  | 2026-08-12 | 10:00   |
    Então o status da resposta deve ser 409
    E a resposta deve conter "erro" igual a "<mensagem>"

    Exemplos:
      | entidade               | medicoId    | mensagem                                                | descricao         |
      | o médico "Dr. Carlos"  | medico-id-1 | O médico já possui uma consulta agendada neste horário. | Conflito médico   |
      | o paciente logado      | medico-id-2 | Você já possui uma consulta agendada neste horário.     | Conflito paciente |

  Esquema do Cenário: Criar agendamento sem campo obrigatório
    Quando eu envio uma requisição POST para "/api/v1/agendamentos" sem o campo "<campo>"
    Então o status da resposta deve ser 400
    E a resposta deve conter "erro" igual a "Os campos medicoId, data e horario são obrigatórios."

    Exemplos:
      | campo    |
      | medicoId |
      | data     |
      | horario  |
```

---

## Funcionalidade: Consultar Agendamentos do Paciente

```gherkin
Funcionalidade: Consulta de agendamentos do paciente
  Como um paciente autenticado
  Eu quero visualizar meus agendamentos
  Para acompanhar minhas consultas futuras e histórico

  Esquema do Cenário: Consultar agendamentos retorna dados corretos
    Dado que estou autenticado como "PACIENTE"
    E que eu possuo <quantidade> agendamentos cadastrados
    Quando eu envio uma requisição GET para "/api/v1/agendamentos"
    Então o status da resposta deve ser 200
    E a resposta deve conter uma lista com <quantidade> itens

    Exemplos:
      | quantidade | descricao                |
      | 3          | Com consultas existentes |
      | 0          | Sem nenhuma consulta     |

  Cenário: Isolamento de dados entre pacientes
    Dado que o "Paciente A" possui 2 agendamentos
    E que o "Paciente B" possui 3 agendamentos
    Quando o "Paciente A" envia uma requisição GET para "/api/v1/agendamentos"
    Então o status da resposta deve ser 200
    E a resposta deve conter uma lista com 2 itens
    E nenhum item deve pertencer ao "Paciente B"
```

---

## Funcionalidade: Cancelar Agendamento

```gherkin
Funcionalidade: Cancelamento de agendamentos
  Como um paciente autenticado
  Eu quero cancelar uma consulta agendada
  Para liberar o horário quando não puder comparecer

  Contexto:
    Dado que estou autenticado como "PACIENTE"

  Cenário: Cancelar agendamento com sucesso
    Dado que eu possuo um agendamento com id "agendamento-id-1" daqui a 3 dias
    Quando eu envio uma requisição PATCH para "/api/v1/agendamentos/agendamento-id-1/cancelar" com:
      | motivo             |
      | Imprevisto pessoal |
    Então o status da resposta deve ser 200
    E a resposta deve conter "status" igual a "CANCELADA"
    E a resposta deve conter "motivoCancelamento" igual a "Imprevisto pessoal"
    E a resposta deve conter o campo "canceladoEm"

  Esquema do Cenário: Cancelamento recusado por regra de negócio
    Dado que eu possuo um agendamento com id "<id>" com estado "<estado>" e antecedência de <horas> horas
    Quando eu envio uma requisição PATCH para "/api/v1/agendamentos/<id>/cancelar" com:
      | motivo   |
      | <motivo> |
    Então o status da resposta deve ser <status>
    E a resposta deve conter "erro" igual a "<mensagem>"

    Exemplos:
      | id               | estado   | horas | motivo             | status | mensagem                                                                    | descricao                 |
      | agendamento-id-2 | AGENDADA | 12    | Imprevisto pessoal | 400    | O cancelamento só é permitido com no mínimo 24 horas de antecedência.       | Menos de 24h antecedência |
      | agendamento-id-3 | CANCELADA| 72    | Outro motivo       | 400    | Este agendamento já foi cancelado.                                          | Já cancelado              |

  Cenário: Cancelar agendamento sem informar motivo
    Dado que eu possuo um agendamento com id "agendamento-id-1" daqui a 3 dias
    Quando eu envio uma requisição PATCH para "/api/v1/agendamentos/agendamento-id-1/cancelar" sem campo motivo
    Então o status da resposta deve ser 400
    E a resposta deve conter "erro" igual a "O motivo do cancelamento é obrigatório."

  Cenário: Cancelar agendamento inexistente
    Quando eu envio uma requisição PATCH para "/api/v1/agendamentos/id-inexistente/cancelar" com:
      | motivo   |
      | Qualquer |
    Então o status da resposta deve ser 404
    E a resposta deve conter "erro" igual a "Agendamento não encontrado."

  Cenário: Cancelar agendamento de outro paciente
    Dado que existe um agendamento com id "agendamento-outro" pertencente a outro paciente
    Quando eu envio uma requisição PATCH para "/api/v1/agendamentos/agendamento-outro/cancelar" com:
      | motivo   |
      | Qualquer |
    Então o status da resposta deve ser 403
    E a resposta deve conter "erro" igual a "Você não tem permissão para cancelar este agendamento."
```

---

## Funcionalidade: Carga Inicial (Seed)

```gherkin
Funcionalidade: Carga inicial do sistema
  Como o sistema
  Eu quero criar um usuário Admin automaticamente na inicialização
  Para que o administrador possa acessar o sistema imediatamente

  Esquema do Cenário: Verificação da carga inicial
    Dado que o sistema <situacao>
    Quando o servidor inicializa
    Então deve existir <quantidade> usuário(s) com email "admin@clinica.com"
    E o usuário deve ter role "ADMIN"
    E o usuário deve ter nome "Administrador do Sistema"
    E a senha deve estar criptografada com bcrypt

    Exemplos:
      | situacao                            | quantidade |
      | está sendo iniciado pela primeira vez | 1        |
      | já foi iniciado e o Admin já existe   | 1        |
```
