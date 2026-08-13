const express = require('express');
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./resources/swagger.json');
const routes = require('./routes');

const app = express();

// Middlewares globais
app.use(express.json());

// Documentação Swagger
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// Rotas da API
app.use('/api/v1', routes);

// Rota raiz
app.get('/', (req, res) => {
  res.json({
    mensagem: 'API de Agendamento Médico',
    versao: '1.0.0',
    status: 'online',
    documentacao: '/api-docs'
  });
});

// Middleware de tratamento de erros global
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ erro: 'Erro interno do servidor.' });
});

module.exports = app;
