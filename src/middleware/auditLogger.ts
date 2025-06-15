const { PrismaClient } = require('@prisma/client');

// Configuration type for audit logger
const AUDIT_CONFIG = {
  excludeMethods: ['GET', 'OPTIONS', 'HEAD'],
  entities: {
    Product: {
      path: '/products',
      identifierParam: 'id'
    }
    // Can add more entities here
  },
  defaultEntity: 'Product'
};

class AuditService {
  prisma: any;
  constructor() {
    this.prisma = new PrismaClient();
  }

  async logAction(data: { action: any; entityType: string; entityId: any; changes: string; }) {
    try {
      return await this.prisma.auditLog.create({ data });
    } catch (error) {
      console.error('[AuditService] Failed to log action:', error);
      return null;
    }
  }

  getEntityTypeFromPath(path: string) {
    return Object.entries(AUDIT_CONFIG.entities)
      .find(([_, config]) => path.startsWith(config.path))?.[0] 
      || AUDIT_CONFIG.defaultEntity;
  }

  getEntityId(request, entityType) {
    const config = AUDIT_CONFIG.entities[entityType];
    return request.params?.[config.identifierParam] || '';
  }

  formatChanges(body) {
    try {
      return JSON.stringify(body || {});
    } catch (error) {
      console.error('[AuditService] Failed to format changes:', error);
      return '{}';
    }
  }
}

const auditService = new AuditService();

const auditLogSchema = {
  schema: {
    tags: ['audit'],
    summary: 'Audit log middleware',
    description: 'Logs all non-GET operations for auditing purposes',
    body: {
      type: 'object',
      properties: {
        action: { 
          type: 'string', 
          enum: ['POST', 'PUT', 'DELETE'],
          description: 'HTTP method that triggered the audit' 
        },
        entityType: { 
          type: 'string', 
          description: 'Type of entity being audited'
        },
        entityId: { 
          type: 'string',
          description: 'Identifier of the entity' 
        },
        changes: { 
          type: 'object',
          additionalProperties: true,
          description: 'Changes made in the request'
        }
      }
    },
    response: {
      200: {
        description: 'Successful audit log creation',
        type: 'object',
        properties: {
          id: { type: 'string' },
          action: { type: 'string' },
          entityType: { type: 'string' },
          entityId: { type: 'string' },
          changes: { type: 'object' },
          createdAt: { type: 'string', format: 'date-time' }
        }
      }
    }
  }
};

/**
 * Creates an audit logger middleware
 * @param {Object} options - Configuration options
 * @param {string[]} [options.excludeMethods] - HTTP methods to exclude from logging
 * @returns {Function} Fastify middleware function
 */
const createAuditLogger = (options = {}) => {
  const config = {
    ...AUDIT_CONFIG,
    excludeMethods: [...AUDIT_CONFIG.excludeMethods, ...(options.excludeMethods || [])]
  };

  return (request, reply, done) => {
    const originalSend = reply.send;

    reply.send = async function(payload) {
      if (!config.excludeMethods.includes(request.method)) {
        const entityType = auditService.getEntityTypeFromPath(request.url);
        
        await auditService.logAction({
          action: request.method,
          entityType,
          entityId: auditService.getEntityId(request, entityType),
          changes: auditService.formatChanges(request.body)
        });
      }
      return originalSend.call(this, payload);
    };
    done();
  };
};

module.exports = {
  createAuditLogger,
  auditLogSchema,
  AUDIT_CONFIG
};
