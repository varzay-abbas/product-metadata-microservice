import { FastifyRequest, FastifyReply } from 'fastify';
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

type IdParam = {
  Params: {
    id: string;
  };
};

const productService = require('../services/product.service');

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  tags: string[];
}

interface CreateProductRequest {
  name: string;
  description: string;
  price: number;
  tags: string[];
}

interface ProductFromDB {
  id: string;
  name: string;
  description: string;
  price: number;
  tags: string;  // Note: This is a JSON string in DB
  category?: string;
  brand?: string;
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date;
}

const createProduct = async (
  request: FastifyRequest<{ Body: CreateProductRequest }>,
  reply: FastifyReply
): Promise<Product> => {
  const product = request.body;

  // Convert tags array to JSON string
  const data = {
    ...product,
    tags: JSON.stringify(product.tags),
  };

  const result = await prisma.product.create({ data });

  // Convert tags back to array in response
  return {
    ...result,
    tags: JSON.parse(result.tags),
  };
};

const getProducts = async (
  request: FastifyRequest,
  reply: FastifyReply
) => {
  const products = await prisma.product.findMany({
    where: { deletedAt: null }
  });

  // Convert tags back to arrays
  return products.map((product: ProductFromDB) => ({
    ...product,
    tags: JSON.parse(product.tags),
  }));
};

exports.createProduct = createProduct;
exports.getProducts = getProducts;

exports.getProductById = async (req: FastifyRequest<IdParam>, reply: FastifyReply) => {
  const product = await productService.getById(req.params.id);
  if (!product) return reply.code(404).send({ message: 'Not found' });
  reply.send(product);
};

exports.updateProduct = async (req: FastifyRequest<IdParam>, reply: FastifyReply) => {
  const updated = await productService.update(req.params.id, req.body);
  reply.send(updated);
};

exports.deleteProduct = async (req: FastifyRequest<IdParam>, reply: FastifyReply) => {
  const { id } = req.params;

  await prisma.product.update({
    where: { id },
    data: { deletedAt: new Date() },
  });

  reply.code(204).send();
};
