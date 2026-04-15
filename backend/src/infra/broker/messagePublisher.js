const { connectBroker } = require('./activemq');

async function publishMensagemCriada(payload) {
  const client = await connectBroker();

  return new Promise((resolve, reject) => {
    try {
      const frame = client.send({
        destination: '/queue/mensagem.criada',
        'content-type': 'application/json',
        persistent: 'true',
      });

      frame.write(JSON.stringify(payload));
      frame.end();

      client.disconnect();
      resolve();
    } catch (error) {
      try {
        client.disconnect();
      } catch (_) {
        // ignora erro ao desconectar
      }
      reject(error);
    }
  });
}

module.exports = {
  publishMensagemCriada,
};