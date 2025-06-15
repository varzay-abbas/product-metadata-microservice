const appInstance = require('../src/app');
const supertest = require('supertest');

let request: any;
let createdProductId: string;

beforeAll(async () => {
  await appInstance.ready();             
  request = supertest(appInstance.server); 
});

describe('Product API', () => {
  it('should return 200 for GET /products', async () => {
    const response = await request.get('/products');
    expect(response.status).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
  });

  it('should create a product with POST /products', async () => {
    const newProduct = {
      name: 'Test Product',
      description: 'Test description',
      tags: ['tag1'],
      price: 100
    };

    const response = await request.post('/products').send(newProduct);
    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty('id');
    createdProductId = response.body.id;
  });

  it('should get a product by ID', async () => {
    const response = await request.get(`/products/${createdProductId}`);
    expect(response.status).toBe(200);
    expect(response.body.name).toBe('Test Product');
  });

  it('should update a product', async () => {
    const updatedData = {
      name: 'Updated Product',
      description: 'Updated description',
      tags: ['updated'],
      price: 200
    };

    const response = await request.put(`/products/${createdProductId}`).send(updatedData);
    expect(response.status).toBe(200);
    expect(response.body.name).toBe('Updated Product');
  });

  it('should delete a product', async () => {
    const response = await request.delete(`/products/${createdProductId}`);
    expect(response.status).toBe(204);
  });

  it('should handle invalid product creation', async () => {
    const invalidProduct = {
      name: '',  // Invalid: empty name
      price: -100 // Invalid: negative price
    };

    const response = await request.post('/products').send(invalidProduct);
    expect(response.status).toBe(400);
  });
});

afterAll(async () => {
  await appInstance.close();
});
