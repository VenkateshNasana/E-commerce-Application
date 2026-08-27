import { describe, it, expect } from 'vitest';
import request from 'supertest';
import { app } from '../src/index';

describe('Product & Category API Endpoints', () => {
  it('should fetch list of categories', async () => {
    const res = await request(app).get('/api/v1/categories');
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(Array.isArray(res.body.categories)).toBe(true);
    expect(res.body.categories.length).toBeGreaterThan(0);
  });

  it('should fetch product catalog with pagination', async () => {
    const res = await request(app).get('/api/v1/products?page=1&limit=5');
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.products.length).toBeLessThanOrEqual(5);
    expect(res.body.pagination.total).toBeGreaterThan(0);
  });

  it('should filter products by search query', async () => {
    const res = await request(app).get('/api/v1/products?search=GeForce');
    expect(res.status).toBe(200);
    expect(res.body.products.length).toBeGreaterThan(0);
    expect(res.body.products[0].name).toContain('GeForce');
  });

  it('should fetch single product by valid slug', async () => {
    const res = await request(app).get('/api/v1/products/nvidia-geforce-rtx-4090-oc-24gb');
    expect(res.status).toBe(200);
    expect(res.body.product.name).toBe('NVIDIA GeForce RTX 4090 OC 24GB');
  });

  it('should return 404 for non-existent product slug', async () => {
    const res = await request(app).get('/api/v1/products/non-existent-product-12345');
    expect(res.status).toBe(404);
  });
});
