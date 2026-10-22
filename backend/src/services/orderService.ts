import { readFileSync } from 'node:fs';
import type { Order } from '../types';

const SEED_FILE = new URL('../data/orders.json', import.meta.url);
const orders: Order[] = JSON.parse(readFileSync(SEED_FILE, 'utf-8'));

export function listOrders(): Order[] {
  return orders;
}