import { badRequest, notFound } from '../errors';
import { orderRepository } from '../repositories/orderRepository';
import type { Order, OrderStatus } from '../types';

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
  const order = orderRepository.findById(id);
  if (!order) throw notFound(`Order ${id} not found`);
  return order;
}

export function listOrders(): OrderResponse[] {
  return orderRepository.findAll().map(toResponse);
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

  return toResponse(orderRepository.updateStatus(id, nextStatus)!);
}