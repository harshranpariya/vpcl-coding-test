import request from 'supertest';
import { beforeEach, describe, expect, it } from 'vitest';
import { app } from '../src/app';
import { orderRepository } from '../src/repositories/orderRepository';

beforeEach(() => orderRepository.reset());

describe('GET /orders', () => {
  it('returns all seeded orders as JSON', async () => {
    const res = await request(app).get('/orders');
    expect(res.status).toBe(200);
    expect(res.body).toHaveLength(15);
    expect(res.body[0]).toMatchObject({ id: 'ORD-1001', status: 'Pending' });
  });
});

describe('GET /orders/:id', () => {
  it('returns the order with its items', async () => {
    const res = await request(app).get('/orders/ORD-1001');
    expect(res.status).toBe(200);
    expect(res.body.items).toHaveLength(2);
  });

  it('returns 404 with a structured error for an unknown id', async () => {
    const res = await request(app).get('/orders/ORD-9999');
    expect(res.status).toBe(404);
    expect(res.body).toEqual({ error: { status: 404, message: 'Order ORD-9999 not found' } });
  });
});

describe('PATCH /orders/:id', () => {
  it('updates the status and the change is visible on the next GET', async () => {
    const patch = await request(app).patch('/orders/ORD-1001').send({ status: 'Processing' });
    expect(patch.status).toBe(200);
    expect(patch.body.status).toBe('Processing');
    expect(patch.body.allowedTransitions).toEqual(['Completed', 'Cancelled']);

    const get = await request(app).get('/orders/ORD-1001');
    expect(get.body.status).toBe('Processing');
  });

  it('returns 400 for an illegal transition', async () => {
    const res = await request(app).patch('/orders/ORD-1003').send({ status: 'Pending' });
    expect(res.status).toBe(400);
    expect(res.body.error.message).toMatch(/can no longer be changed/);
  });

  it('returns 400 when status is missing or not a known status', async () => {
    expect((await request(app).patch('/orders/ORD-1001').send({})).status).toBe(400);
    expect((await request(app).patch('/orders/ORD-1001').send({ status: 'Shipped' })).status).toBe(400);
  });

  it('returns 404 for an unknown order', async () => {
    const res = await request(app).patch('/orders/ORD-9999').send({ status: 'Processing' });
    expect(res.status).toBe(404);
  });
});
