import { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { ApiError, fetchOrder, updateOrderStatus } from '../api/orders';
import { ErrorMessage, Loading } from '../components/Feedback';
import { StatusActions } from '../components/StatusActions';
import { StatusBadge } from '../components/StatusBadge';
import { useFetch } from '../hooks/useFetch';
import { formatDate, formatMoney } from '../lib/format';
import { lineTotal } from '../lib/orders';
import type { OrderStatus } from '../types';
import { NotFoundPage } from './NotFoundPage';

export function OrderDetailsPage() {
  const { id = '' } = useParams();
  const { data: order, loading, error, retry, setData } = useFetch(() => fetchOrder(id), [id]);
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);

  async function changeStatus(next: OrderStatus) {
    if (next === 'Cancelled' && !window.confirm(`Cancel order ${id}? This cannot be undone.`)) return;
    setSaving(true);
    setSaveError(null);
    try {
      const updated = await updateOrderStatus(id, next);
      setData(updated);
    } catch (e) {
      setSaveError(e instanceof Error ? e.message : 'Update failed');
      if (e instanceof ApiError && e.status === 400) retry();
    } finally {
      setSaving(false);
    }
  }

  if (loading) return <Loading label="Loading order" />;

  if (error instanceof ApiError && error.status === 404) {
    return <NotFoundPage title="Order not found" message={`There is no order with ID ${id}.`} />;
  }

  if (error || !order) {
    return <ErrorMessage title="Could not load order" message={error?.message ?? 'Unknown error'} onRetry={retry} />;
  }

  const items = order.items ?? [];

  return (
    <section className="panel">
      <Link to="/" className="back-link">
        &larr; Back to orders
      </Link>

      <div className="details-header">
        <div>
          <h1>{order.id}</h1>
          <p className="muted">
            {order.customerName} &middot; {formatDate(order.orderDate)}
          </p>
        </div>
        <StatusBadge status={order.status} />
      </div>

      <h2>Items</h2>
      {items.length === 0 ? (
        <p className="muted">This order has no items.</p>
      ) : (
        <div className="table-scroll">
          <table className="items">
            <thead>
              <tr>
                <th>Product</th>
                <th className="num">Qty</th>
                <th className="num">Unit price</th>
                <th className="num">Line total</th>
              </tr>
            </thead>
            <tbody>
              {items.map((item, index) => (
                <tr key={`${item.productId}-${index}`}>
                  <td>{item.productName}</td>
                  <td className="num">{item.quantity}</td>
                  <td className="num">{formatMoney(item.unitPrice)}</td>
                  <td className="num">{formatMoney(lineTotal(item))}</td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr>
                <th colSpan={3}>Order total</th>
                <td className="num">{formatMoney(order.total)}</td>
              </tr>
            </tfoot>
          </table>
        </div>
      )}

      <h2>Update status</h2>
      <StatusActions
        status={order.status}
        transitions={order.allowedTransitions ?? []}
        busy={saving}
        onChange={changeStatus}
      />
      {saving && (
        <p className="muted" role="status">
          Saving…
        </p>
      )}
      {saveError && (
        <p className="error-text" role="alert">
          {saveError}
        </p>
      )}
    </section>
  );
}