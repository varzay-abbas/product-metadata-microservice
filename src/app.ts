const Fastify = require('fastify');
const productRoutes = require('./routes/product.routes');
const swagger = require('./swagger');
const suggestTagsRoute = require('./routes/suggestTags');

import { FastifyInstance } from 'fastify';

const app: FastifyInstance = require('fastify')({ logger: true });

app.register(swagger);
app.register(productRoutes, { prefix: '/products' });
app.register(suggestTagsRoute, { prefix: '/suggest-tags' });

module.exports = app;
