export const ORDER_STATUSES = ['Pending', 'Processing', 'Completed', 'Cancelled'] as const;

export type OrderStatus = (typeof ORDER_STATUSES)[number];

export interface OrderItem {
  productId: string;
  productName: string;
  quantity: number;
  unitPrice: number;
}

export interface Order {
  id: string;
  customerName: string;
  orderDate: string;
  status: OrderStatus;
  total: number;
  items: OrderItem[];
}

export function isOrderStatus(value: unknown): value is OrderStatus {
  return typeof value === 'string' && (ORDER_STATUSES as readonly string[]).includes(value);
}