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

export const lineTotal = (item: OrderItem): number => item.quantity * item.unitPrice;