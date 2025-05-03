const Whatsapp = require("../controllers/Whatsapp");
const whatsapp = new Whatsapp();

module.exports = async function routes(fastify) {
  fastify.get("/webhook", async (req, reply) => {
    return whatsapp.verify(req, reply);
  });

  fastify.post("/webhook", async (req, reply) => {
    return whatsapp.receiveMessage(req, reply);
  });
};
