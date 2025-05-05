module.exports = class Whatsapp {
  constructor() {
    this.apiUrl = `${process.env.WHATSAPP_API_URL}/${process.env.WHATSAPP_PHONE_NUMBER_ID}/messages`;
    this.token = process.env.WHATSAPP_TOKEN;
    this.verifyToken = process.env.WHATSAPP_VERIFY_TOKEN;

    this.openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });
  }

  async verify(request, reply) {
    console.log("Rota de verificação chamada!");
    const {
      "hub.mode": mode,
      "hub.verify_token": token,
      "hub.challenge": challenge,
    } = request.query;

    if (mode === "subscribe" && token === this.verifyToken) {
      return reply.send(challenge);
    } else {
      return reply.status(403).send("Forbidden");
    }
  }

  async receiveMessage(request, reply) {
    const entry = request.body?.entry?.[0];
    const changes = entry?.changes?.[0];
    const message = changes?.value?.messages?.[0];
    const from = message?.from;
    const text = message?.text?.body;

    if (from && text) {
      await this.sendTextMessage(from, `Recebemos sua mensagem: "${text}"`);
      return reply.status(200).send();
    }

    console.log("Mensagem recebida mas não processada (formato inválido)");
    return reply.status(200).send();
  }

  async sendTextMessage(to, text) {
    if ((!to, !text)) {
      console.log(
        "O metodo sendTextMessage nao recebeu o destinatário e a mensagem."
      );
    }

    try {
      const response = await fetch(this.apiUrl, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${this.token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          messaging_product: "whatsapp",
          to,
          type: "text",
          text: { body: text },
        }),
      });

      await response.json();
    } catch (err) {
      console.error("Erro ao enviar mensagem:", err.message);
    }
  }
};
