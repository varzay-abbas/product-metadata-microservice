const fastify = require('fastify');
const productController = require('../controllers/product.controller');
const { prisma:any } = require('../lib/prisma');

/** @typedef {import('fastify').FastifyInstance} FastifyInstance */
/** @typedef {import('fastify').FastifyPluginOptions} FastifyPluginOptions */
/** @typedef {import('fastify').FastifyRequest} FastifyRequest */
/** @typedef {import('fastify').FastifyReply} FastifyReply */

const productSchema = {
  body: {
    type: 'object',
    required: ['name', 'description', 'tags', 'price'],
    properties: {
      name: { type: 'string' },
      description: { type: 'string' },
      tags: {
        type: 'array',
        items: { type: 'string' }
      },
      price: { type: 'number' },
      category: { type: 'string' },
      brand: { type: 'string' }
    }
  }
};

/**
 * Product routes plugin
 * @param {FastifyInstance} fastify - Fastify instance
 * @param {FastifyPluginOptions} _options - Plugin options
 * @returns {Promise<void>}
 */
async function routes(fastify:any, _options:any) {
  fastify.post('/', { schema: productSchema }, productController.createProduct);
  fastify.get('/', productController.getProducts);
  fastify.get('/:id', productController.getProductById);
  fastify.put('/:id', { schema: productSchema }, productController.updateProduct);
  fastify.delete('/:id', productController.deleteProduct);

  fastify.get('/products', {
    schema: {
      querystring: {
        cursor: { type: 'string' },
        limit: { type: 'number', default: 10 }
      }
    },
    /**
     * Handle paginated products request
     * @param {FastifyRequest} request 
     * @param {FastifyReply} reply 
     * @returns {Promise<{items: any[], nextCursor: string | null}>}
     */
    handler: async (request:any, reply:any) => {
      const { cursor, limit = 10 } = /** @type {{cursor?: string, limit?: number}} */ (request.query);

      const products = await prisma.product.findMany({
        take: limit + 1,
        where: {
          deletedAt: null,
          ...(cursor ? { id: { gt: cursor } } : {})
        },
        orderBy: { id: 'asc' }
      });

      const hasMore = products.length > limit;
      const items = products.slice(0, limit);
      
      return {
        items,
        nextCursor: hasMore ? items[items.length - 1].id : null
      };
    }
  });
}

module.exports = routes;
