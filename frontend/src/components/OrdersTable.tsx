import { Link } from 'react-router-dom';
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
          <th>
            <span className="sr-only">Actions</span>
          </th>
        </tr>
      </thead>
      <tbody>
        {orders.map((order) => (
          <tr key={order.id}>
            <td data-label="Order ID">{order.id}</td>
            <td data-label="Customer">{order.customerName}</td>
            <td data-label="Date">{formatDate(order.orderDate)}</td>
            <td data-label="Status">
              <StatusBadge status={order.status} />
            </td>
            <td data-label="Total" className="num">
              {formatMoney(order.total)}
            </td>
            <td>
              <Link className="btn btn-small" to={`/orders/${encodeURIComponent(order.id)}`}>
                View
              </Link>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}