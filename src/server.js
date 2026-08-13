const app = require('./app');
const { seedAdmin } = require('./models/database');

const PORT = process.env.PORT || 3000;

// Executa a carga inicial (Seed)
seedAdmin();

app.listen(PORT, () => {
  console.log(`🚀 Servidor rodando na porta ${PORT}`);
  console.log(`📖 Documentação disponível em http://localhost:${PORT}/api-docs`);
});
