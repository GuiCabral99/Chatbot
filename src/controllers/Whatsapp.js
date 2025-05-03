module.exports = class Whatsapp {
  constructor() {
    this.apiUrl = `${process.env.WHATSAPP_API_URL}/${process.env.PHONE_NUMBER_ID}/messages`;
    this.token = process.env.WHATSAPP_TOKEN;
    this.verifyToken = process.env.VERIFY_TOKEN;
  }

  verify(request, reply) {
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
      console.log("Mensagem recebida e respondida com sucesso");
      return reply.status(200).send();
    }

    console.log("Mensagem recebida mas não processada (formato inválido)");
    return reply.status(200).send(); // Sempre retorne 200 para evitar reenvios pela Meta
  }

  async sendTextMessage(to, text) {
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

      const data = await response.json();

      if (!response.ok) {
        console.error("Erro na API do WhatsApp:", data);
      } else {
        console.log("Mensagem enviada com sucesso:", data);
      }
    } catch (err) {
      console.error("Erro ao enviar mensagem:", err.message);
    }
  }
};
