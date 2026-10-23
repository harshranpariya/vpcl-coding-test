import { formatDate, formatMoney } from '../lib/format';
import type { Order } from '../types';
import { StatusBadge } from './StatusBadge';

export function OrdersTable({ orders }: { orders: Order[] }) {
  return (
    <table className="orders">
      <thead>
        <tr>
          <th>Order ID</th>
          <th>Customer</th>
          <th>Date</th>
          <th>Status</th>
          <th className="num">Total</th>
        </tr>
      </thead>
      <tbody>
        {orders.map((order) => (
          <tr key={order.id}>
            <td>{order.id}</td>
            <td>{order.customerName}</td>
            <td>{formatDate(order.orderDate)}</td>
            <td>
              <StatusBadge status={order.status} />
            </td>
            <td className="num">{formatMoney(order.total)}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
