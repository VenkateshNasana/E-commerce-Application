import { describe, it, expect, beforeAll } from 'vitest';
import request from 'supertest';
import { app } from '../src/index';

describe('Cart & Wishlist API Endpoints', () => {
  let userToken = '';
  let productId = '';

  beforeAll(async () => {
    // Login seeded customer user
    const loginRes = await request(app).post('/api/v1/auth/login').send({
      email: 'user@nexusgaming.com',
      password: 'User@123456',
    });
    userToken = loginRes.body.token;

    // Get a seeded product ID
    const prodRes = await request(app).get('/api/v1/products?limit=1');
    productId = prodRes.body.products[0].id;
  });

  it('should fetch user empty or existing cart', async () => {
    const res = await request(app)
      .get('/api/v1/cart')
      .set('Authorization', `Bearer ${userToken}`);
    expect(res.status).toBe(200);
    expect(res.body.cart).toBeDefined();
  });

  it('should add item to cart', async () => {
    const res = await request(app)
      .post('/api/v1/cart/add')
      .set('Authorization', `Bearer ${userToken}`)
      .send({ productId, quantity: 2 });
    expect(res.status).toBe(200);
    expect(res.body.cart.items.length).toBeGreaterThan(0);
  });

  it('should toggle item in wishlist', async () => {
    const res = await request(app)
      .post('/api/v1/wishlist/toggle')
      .set('Authorization', `Bearer ${userToken}`)
      .send({ productId });
    expect(res.status).toBe(200);
    expect(res.body.action).toBeDefined();
  });
});
