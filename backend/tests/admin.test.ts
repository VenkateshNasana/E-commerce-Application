import { describe, it, expect, beforeAll } from 'vitest';
import request from 'supertest';
import { app } from '../src/index';

describe('Admin Authorization & Operations Test Suite', () => {
  let adminToken = '';
  let customerToken = '';

  beforeAll(async () => {
    // Admin login
    const adminRes = await request(app).post('/api/v1/auth/login').send({
      email: 'admin@nexusgaming.com',
      password: 'Admin@123456',
    });
    adminToken = adminRes.body.token;

    // Customer login
    const customerRes = await request(app).post('/api/v1/auth/login').send({
      email: 'user@nexusgaming.com',
      password: 'User@123456',
    });
    customerToken = customerRes.body.token;
  });

  it('should block normal customer from accessing admin dashboard stats (403)', async () => {
    const res = await request(app)
      .get('/api/v1/admin/stats')
      .set('Authorization', `Bearer ${customerToken}`);
    expect(res.status).toBe(403);
    expect(res.body.success).toBe(false);
  });

  it('should allow admin user to access dashboard stats', async () => {
    const res = await request(app)
      .get('/api/v1/admin/stats')
      .set('Authorization', `Bearer ${adminToken}`);
    expect(res.status).toBe(200);
    expect(res.body.stats.totalUsers).toBeGreaterThan(0);
    expect(res.body.stats.totalProducts).toBeGreaterThan(0);
  });

  it('should allow admin user to fetch all system orders', async () => {
    const res = await request(app)
      .get('/api/v1/orders/admin/all')
      .set('Authorization', `Bearer ${adminToken}`);
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body.orders)).toBe(true);
  });
});
