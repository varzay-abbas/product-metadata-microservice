const Fastify = require('fastify');
const productRoutes = require('./routes/product.routes');
const swagger = require('./swagger');

import { FastifyInstance } from 'fastify';

const app: FastifyInstance = require('fastify')({ logger: true });

app.register(swagger);
app.register(productRoutes, { prefix: '/products' });

module.exports = app;
