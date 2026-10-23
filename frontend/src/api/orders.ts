import type { Order, OrderStatus } from '../types';

const BASE_URL: string = import.meta.env.VITE_API_URL ?? 'http://localhost:3001';

export class ApiError extends Error {
  constructor(
    public readonly status: number,
    message: string,
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  let res: Response;
  try {
    res = await fetch(`${BASE_URL}${path}`, {
      ...init,
      headers: init?.body ? { 'Content-Type': 'application/json' } : undefined,
    });
  } catch {
    throw new ApiError(0, 'Could not reach the server. Is the backend running?');
  }

  if (!res.ok) {
    // The backend sends { error: { status, message } }; fall back if the body is not JSON.
    const body = await res.json().catch(() => null);
    throw new ApiError(res.status, body?.error?.message ?? `Request failed with status ${res.status}`);
  }
  return res.json() as Promise<T>;
}

export const fetchOrders = () => request<Order[]>('/orders');

export const fetchOrder = (id: string) => request<Order>(`/orders/${encodeURIComponent(id)}`);

export const updateOrderStatus = (id: string, status: OrderStatus) =>
  request<Order>(`/orders/${encodeURIComponent(id)}`, {
    method: 'PATCH',
    body: JSON.stringify({ status }),
  });