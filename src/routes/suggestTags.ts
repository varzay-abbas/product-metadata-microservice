import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import { suggestTags } from '../services/tagSuggester';

interface SuggestTagsRequest {
  Body: {
    name: string;
    description: string;
  }
}

const suggestTagsSchema = {
  schema: {
    summary: 'Suggest tags for a product',
    description: 'Suggest tags based on product name and description using AI',
    tags: ['tags'],
    body: {
      type: 'object',
      required: ['name', 'description'],
      properties: {
        name: { type: 'string', description: 'Product name' },
        description: { type: 'string', description: 'Product description' }
      }
    },
    response: {
      200: {
        description: 'Successful response',
        type: 'object',
        properties: {
          suggestedTags: {
            type: 'array',
            items: { type: 'string' },
            description: 'Array of suggested tags'
          }
        }
      },
      400: {
        description: 'Bad Request',
        type: 'object',
        properties: {
          error: { type: 'string' }
        }
      },
      500: {
        description: 'Internal Server Error',
        type: 'object',
        properties: {
          error: { type: 'string' }
        }
      }
    }
  }
};

export default async function suggestTagsRoute(fastify: FastifyInstance) {
  fastify.post<SuggestTagsRequest>(
    '/suggest-tags', 
    {
      schema: suggestTagsSchema.schema,
      onRequest: [(request, reply, done) => {
        // Add any pre-handlers here if needed
        done();
      }]
    },
    async (request, reply) => {
      const { name, description } = request.body;
      
      if (!name || !description) {
        return reply.code(400).send({ error: 'Missing name or description' });
      }

      try {
        const suggestedTags = await suggestTags(name, description);
        return reply.send({ suggestedTags });
      } catch (err) {
        fastify.log.error('Error suggesting tags:', err);
        return reply.code(500).send({ error: 'Failed to generate tags' });
      }
    }
  );
}
