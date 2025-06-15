
const Fastify = require('fastify');
const productRoutes = require('./routes/product.routes');
const swagger = require('./swagger');
const suggestTagsRoute = require('./routes/suggestTags');
// const auditLogger = require('./middleware/auditLogger');

import { FastifyInstance } from 'fastify';

const app: FastifyInstance = require('fastify')({ logger: true });
app.addHook('onRequest', async (req, reply) => {
  reply.header('Access-Control-Allow-Origin', 'http://localhost:3000');
  reply.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  reply.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  reply.header('Access-Control-Allow-Credentials', 'true');
});

app.options('*', async (req, reply) => {
  reply.code(204).send();
});

app.register(swagger);
app.register(productRoutes, { prefix: '/products' });
app.register(suggestTagsRoute, { prefix: '/suggest-tags' });
// app.addHook('onRequest', auditLogger);

module.exports = app;
