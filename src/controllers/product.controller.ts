import { FastifyRequest, FastifyReply } from 'fastify';

type IdParam = {
  Params: {
    id: string;
  };
};

const productService = require('../services/product.service');

exports.createProduct = async (req: FastifyRequest, reply: FastifyReply) => {
  const product = await productService.create(req.body);
  reply.code(201).send(product);
};

exports.getProducts = async (_: FastifyRequest, reply: FastifyReply) => {
  const products = await productService.getAll();
  reply.send(products);
};

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
  await productService.remove(req.params.id);
  reply.code(204).send();
};
