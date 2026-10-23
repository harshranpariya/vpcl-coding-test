import { describe, expect, it } from 'vitest';
import type { Order } from '../types';
import { filterOrders, sortOrders, summarize } from './orders';

const order = (overrides: Partial<Order>): Order => ({
  id: 'ORD-1',
  customerName: 'Clinic',
  orderDate: '2026-01-01',
  status: 'Pending',
  total: 10,
  items: [],
  allowedTransitions: [],
  ...overrides,
});

const orders = [
  order({ id: 'ORD-1001', customerName: 'ABC Veterinary Clinic', status: 'Pending', orderDate: '2026-10-15', total: 125.5 }),
  order({ id: 'ORD-1002', customerName: 'Paws & Claws Hospital', status: 'Processing', orderDate: '2026-10-14', total: 114.5 }),
  order({ id: 'ORD-1003', customerName: 'ABC Equine Centre', status: 'Completed', orderDate: '2026-10-12', total: 305.5 }),
];

const ids = (list: Order[]) => list.map((o) => o.id);

describe('filterOrders', () => {
  it('matches order id and customer name, ignoring case and surrounding spaces', () => {
    expect(ids(filterOrders(orders, '  abc ', 'All'))).toEqual(['ORD-1001', 'ORD-1003']);
    expect(ids(filterOrders(orders, '1002', 'All'))).toEqual(['ORD-1002']);
  });

  it('applies search and status filter together', () => {
    expect(ids(filterOrders(orders, 'abc', 'Completed'))).toEqual(['ORD-1003']);
    expect(filterOrders(orders, 'abc', 'Processing')).toEqual([]);
  });
});

describe('sortOrders', () => {
  it('sorts by total in both directions without mutating the input', () => {
    expect(ids(sortOrders(orders, { key: 'total', direction: 'asc' }))).toEqual(['ORD-1002', 'ORD-1001', 'ORD-1003']);
    expect(ids(sortOrders(orders, { key: 'total', direction: 'desc' }))).toEqual(['ORD-1003', 'ORD-1001', 'ORD-1002']);
    expect(orders[0].id).toBe('ORD-1001');
  });

  it('sorts by date', () => {
    expect(sortOrders(orders, { key: 'orderDate', direction: 'asc' })[0].id).toBe('ORD-1003');
  });
});

describe('summarize', () => {
  it('counts orders per status', () => {
    expect(summarize(orders)).toEqual({ All: 3, Pending: 1, Processing: 1, Completed: 1, Cancelled: 0 });
  });
});