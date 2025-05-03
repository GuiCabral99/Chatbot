require("dotenv").config(); // Carrega variáveis do .env
const fastify = require("fastify");
const routes = require("./routes");

const app = fastify({
  logger: true, // Ativa logs padrão (opcional, mas útil)
});

// Registra as rotas
routes(app);

// Inicia o servidor
const start = async () => {
  try {
    const port = process.env.PORT || 3000;
    const host = process.env.HOST || "0.0.0.0";

    await app.listen({ port, host });
    console.log(`Server rodando em http://${host}:${port}`);
  } catch (err) {
    app.log.error(err);
    process.exit(1);
  }
};

start();
