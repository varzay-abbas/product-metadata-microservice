import { PrismaClient, Product } from '@prisma/client';

const prisma = new PrismaClient();

type ProductInput = {
  name: string;
  description: string;
  tags: string[];
  price: number;
};

export const create = async (data: ProductInput): Promise<Product> => {
  return prisma.product.create({
    data: {
      ...data,
      tags: data.tags.join(','),
    },
  });
};

export const getAll = async (): Promise<Product[]> => {
  return prisma.product.findMany();
};

export const getById = async (id: string): Promise<Product | null> => {
  return prisma.product.findUnique({ where: { id } });
};

export const update = async (id: string, data: ProductInput): Promise<Product> => {
  return prisma.product.update({
    where: { id },
    data: {
      ...data,
      tags: data.tags.join(','),
    },
  });
};

export const remove = async (id: string): Promise<Product> => {
  return prisma.product.delete({ where: { id } });
};
