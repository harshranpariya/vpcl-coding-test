import { readFileSync } from 'node:fs';
import type { Order, OrderStatus } from '../types';

const SEED_FILE = new URL('../data/orders.json', import.meta.url);

const loadSeed = (): Order[] => JSON.parse(readFileSync(SEED_FILE, 'utf-8'));

let orders: Order[] = loadSeed();

export const orderRepository = {
  findAll: (): Order[] => orders,

  findById: (id: string): Order | undefined => orders.find((order) => order.id === id),

  updateStatus(id: string, status: OrderStatus): Order | undefined {
    const order = orders.find((o) => o.id === id);
    if (order) order.status = status;
    return order;
  },

  reset(): void {
    orders = loadSeed();
  },
};