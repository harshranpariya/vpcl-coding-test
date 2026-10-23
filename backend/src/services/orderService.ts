import { readFileSync } from 'node:fs';
import type { Order, OrderStatus } from '../types';
import { badRequest, notFound } from '../errors';

const SEED_FILE = new URL('../data/orders.json', import.meta.url);
const orders: Order[] = JSON.parse(readFileSync(SEED_FILE, 'utf-8'));

export const ALLOWED_TRANSITIONS: Record<OrderStatus, readonly OrderStatus[]> = {
  Pending: ['Processing', 'Cancelled'],
  Processing: ['Completed', 'Cancelled'],
  Completed: [],
  Cancelled: [],
};

export interface OrderResponse extends Order {
  allowedTransitions: readonly OrderStatus[];
}

const toResponse = (order: Order): OrderResponse => ({
  ...order,
  allowedTransitions: ALLOWED_TRANSITIONS[order.status],
});

function findOrThrow(id: string): Order {
  const order = orders.find((o) => o.id === id);
  if (!order) throw notFound(`Order ${id} not found`);
  return order;
}
export function listOrders(): OrderResponse[] {
  return orders.map(toResponse);
}

export function getOrder(id: string): OrderResponse {
  return toResponse(findOrThrow(id));
}

export function updateStatus(id: string, nextStatus: OrderStatus): OrderResponse {
  const order = findOrThrow(id);
  const allowed = ALLOWED_TRANSITIONS[order.status];

  if (allowed.length === 0) {
    throw badRequest(`Order ${id} is ${order.status} and can no longer be changed`);
  }
  if (!allowed.includes(nextStatus)) {
    throw badRequest(`Cannot change order ${id} from ${order.status} to ${nextStatus}`);
  }

  order.status = nextStatus;
  return toResponse(order);
}