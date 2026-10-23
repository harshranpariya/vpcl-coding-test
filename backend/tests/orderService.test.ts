import { beforeEach, describe, expect, it } from 'vitest';
import { HttpError } from '../src/errors';
import { orderRepository } from '../src/repositories/orderRepository';
import { getOrder, listOrders, updateStatus } from '../src/services/orderService';

const thrown = (fn: () => unknown): unknown => {
  try {
    fn();
  } catch (e) {
    return e;
  }
  return undefined;
};

beforeEach(() => orderRepository.reset());

describe('updateStatus', () => {
  it('allows Pending to Processing and persists it for later reads', () => {
    expect(updateStatus('ORD-1001', 'Processing').status).toBe('Processing');
    expect(getOrder('ORD-1001').status).toBe('Processing');
  });

  it('allows Processing to Completed', () => {
    expect(updateStatus('ORD-1002', 'Completed').status).toBe('Completed');
  });

  it('rejects skipping Pending to Completed and leaves the order unchanged', () => {
    const err = thrown(() => updateStatus('ORD-1001', 'Completed'));
    expect(err).toBeInstanceOf(HttpError);
    expect(err).toMatchObject({ status: 400 });
    expect(getOrder('ORD-1001').status).toBe('Pending');
  });

  it('rejects any change to a Completed or Cancelled order', () => {
    expect(thrown(() => updateStatus('ORD-1003', 'Cancelled'))).toMatchObject({ status: 400 });
    expect(thrown(() => updateStatus('ORD-1004', 'Processing'))).toMatchObject({ status: 400 });
  });

  it('throws 404 for an unknown order', () => {
    expect(thrown(() => updateStatus('ORD-9999', 'Processing'))).toMatchObject({ status: 404 });
  });
});

describe('getOrder', () => {
  it('includes the allowed next statuses so the UI never has to guess', () => {
    expect(getOrder('ORD-1001').allowedTransitions).toEqual(['Processing', 'Cancelled']);
    expect(getOrder('ORD-1003').allowedTransitions).toEqual([]);
  });
});

describe('seed data', () => {
  it('has every order total equal to the sum of its line totals', () => {
    for (const order of listOrders()) {
      const sum = order.items.reduce((acc, item) => acc + item.quantity * item.unitPrice, 0);
      expect(sum, order.id).toBeCloseTo(order.total, 2);
    }
  });
});
