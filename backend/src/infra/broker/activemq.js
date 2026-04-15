const stompit = require('stompit');

const connectOptions = {
  host: process.env.ACTIVEMQ_HOST || 'activemq',
  port: Number(process.env.ACTIVEMQ_PORT || 61613),
  connectHeaders: {
    host: '/',
    login: process.env.ACTIVEMQ_USER || 'admin',
    passcode: process.env.ACTIVEMQ_PASSWORD || 'admin',
    'heart-beat': '5000,5000',
  },
};

function connectBroker() {
  return new Promise((resolve, reject) => {
    stompit.connect(connectOptions, (error, client) => {
      if (error) {
        return reject(error);
      }
      resolve(client);
    });
  });
}

module.exports = {
  connectBroker,
};