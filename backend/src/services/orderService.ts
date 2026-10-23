import { readFileSync } from 'node:fs';
import type { Order } from '../types';
import { notFound } from '../errors';

const SEED_FILE = new URL('../data/orders.json', import.meta.url);
const orders: Order[] = JSON.parse(readFileSync(SEED_FILE, 'utf-8'));

export function listOrders(): Order[] {
  return orders;
}

export function getOrder(id: string): Order {
  const order = orders.find((o) => o.id === id);
  if (!order) throw notFound(`Order ${id} not found`);
  return order;
}