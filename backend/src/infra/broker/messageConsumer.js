const { connectBroker } = require('./activemq');

let reconnectTimer = null;

function agendarReconexao() {
  if (reconnectTimer) return;

  reconnectTimer = setTimeout(() => {
    reconnectTimer = null;
    iniciarConsumer();
  }, 5000);
}

function iniciarConsumer() {
  connectBroker()
    .then((client) => {
      console.log('[CONSUMER] conectado ao ActiveMQ');

      client.on('error', (err) => {
        console.error('[CONSUMER] erro no client STOMP:', err.message);

        try {
          client.disconnect();
        } catch (_) {
          // ignora erro ao desconectar
        }

        agendarReconexao();
      });

      client.subscribe(
        {
          destination: '/queue/mensagem.criada',
          ack: 'auto',
        },
        (err, message) => {
          if (err) {
            console.error('[CONSUMER] erro ao consumir mensagem:', err.message);
            return;
          }

          let body = '';

          message.on('data', (chunk) => {
            body += chunk.toString();
          });

          message.on('end', () => {
            try {
              const payload = JSON.parse(body);
              console.log('[CONSUMER] evento recebido:', payload);
            } catch (parseError) {
              console.error('[CONSUMER] erro ao converter payload:', parseError.message);
            }
          });
        }
      );
    })
    .catch((error) => {
      console.error('[CONSUMER] erro ao conectar no ActiveMQ:', error.message);
      agendarReconexao();
    });
}

module.exports = {
  iniciarConsumer
};