import type { Order, OrderItem, OrderStatus } from '../types';

export type StatusFilter = OrderStatus | 'All';

export function filterOrders(orders: Order[], search: string, status: StatusFilter): Order[] {
  const term = search.trim().toLowerCase();
  return orders.filter(
    (order) =>
      (status === 'All' || order.status === status) &&
      (term === '' ||
        order.id.toLowerCase().includes(term) ||
        order.customerName.toLowerCase().includes(term)),
  );
}

export function summarize(orders: Order[]): Record<StatusFilter, number> {
  const counts: Record<StatusFilter, number> = {
    All: orders.length,
    Pending: 0,
    Processing: 0,
    Completed: 0,
    Cancelled: 0,
  };
  for (const order of orders) {
    counts[order.status] = counts[order.status] + 1;
  }
  return counts;
}

export const lineTotal = (item: OrderItem): number => item.quantity * item.unitPrice;