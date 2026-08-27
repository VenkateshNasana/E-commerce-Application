import { describe, it, expect, beforeAll } from 'vitest';
import request from 'supertest';
import { app } from '../src/index';

describe('Order Processing & Payment Flow Test Suite', () => {
  let userToken = '';
  let productId = '';

  beforeAll(async () => {
    const loginRes = await request(app).post('/api/v1/auth/login').send({
      email: 'user@nexusgaming.com',
      password: 'User@123456',
    });
    userToken = loginRes.body.token;

    const prodRes = await request(app).get('/api/v1/products?limit=1');
    productId = prodRes.body.products[0].id;

    // Add item to cart
    await request(app)
      .post('/api/v1/cart/add')
      .set('Authorization', `Bearer ${userToken}`)
      .send({ productId, quantity: 1 });
  });

  it('should create order from cart with coupon GAMER10', async () => {
    const res = await request(app)
      .post('/api/v1/orders')
      .set('Authorization', `Bearer ${userToken}`)
      .send({
        shippingAddress: {
          fullName: 'Cyber Samurai',
          street: '123 Cyber St',
          city: 'Tech City',
          state: 'CA',
          postalCode: '90001',
          country: 'United States',
        },
        paymentMethod: 'CREDIT_CARD',
        couponCode: 'GAMER10',
      });

    expect(res.status).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.order.orderNumber).toBeDefined();
    expect(res.body.order.discountAmount).toBeGreaterThan(0);
  });

  it('should fetch user order history', async () => {
    const res = await request(app)
      .get('/api/v1/orders/my-orders')
      .set('Authorization', `Bearer ${userToken}`);
    expect(res.status).toBe(200);
    expect(res.body.orders.length).toBeGreaterThan(0);
  });
});
