import { FastifyInstance, FastifyPluginOptions } from 'fastify';
const productController = require('../controllers/product.controller');

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
      price: { type: 'number' }
    }
  }
};

async function routes(fastify: FastifyInstance, options: FastifyPluginOptions) {
  fastify.post('/', { schema: productSchema }, productController.createProduct);
  fastify.get('/', productController.getProducts);
  fastify.get('/:id', productController.getProductById);
  fastify.put('/:id', { schema: productSchema }, productController.updateProduct);
  fastify.delete('/:id', productController.deleteProduct);
}

module.exports = routes;
