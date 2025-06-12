import { FastifyInstance } from 'fastify';
import { FastifyPluginAsync } from 'fastify';
const fp = require('fastify-plugin');
const fastifySwagger = require('@fastify/swagger');
const fastifySwaggerUI = require('@fastify/swagger-ui');

const swaggerPlugin: FastifyPluginAsync = async function (
  fastify: FastifyInstance,
  opts: Record<string, unknown>
): Promise<void> {
  await fastify.register(fastifySwagger, {
    openapi: {
      info: {
        title: 'Product API',
        description: 'API documentation for Product Metadata Microservice',
        version: '1.0.0',
      },
    },
  });

  await fastify.register(fastifySwaggerUI, {
    routePrefix: '/docs',
    uiConfig: {
      docExpansion: 'list',
      deepLinking: false,
    },
    staticCSP: true,
    transformStaticCSP: (header: string) => header, // ✅ typed
  });
};

module.exports = fp(swaggerPlugin);
