const appInstance = require('../src/app');
const supertest = require('supertest');

let request: any;

beforeAll(async () => {
  await appInstance.ready();             // ensure Fastify is fully ready
  request = supertest(appInstance.server); // attach to live server
});

describe('Product API', () => {
  it('should return 200 for GET /products', async () => {
    const response = await request.get('/products');
    expect(response.status).toBe(200);
  });

  it('should create a product with POST /products', async () => {
    const response = await request.post('/products').send({
      name: 'Test Product',
      description: 'Test description',
      tags: ['tag1'],
      price: 100
    });
    expect(response.status).toBe(201); 
  });
});
