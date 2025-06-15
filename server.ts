const app = require('./src/app');
require('dotenv').config();

const PORT = Number(process.env.PORT) || 3001;

app.listen({ port: PORT }, (err: Error | null, address: string) => {
  if (err) {
    app.log.error(err);
    process.exit(1);
  }
  app.log.info(`🚀 Server ready at ${address}`);
});
