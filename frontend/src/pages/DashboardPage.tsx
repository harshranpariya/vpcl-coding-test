import { fetchOrders } from '../api/orders';
import { EmptyState, ErrorMessage, Loading } from '../components/Feedback';
import { OrdersTable } from '../components/OrdersTable';
import { useFetch } from '../hooks/useFetch';

export function DashboardPage() {
  const { data: orders, loading, error, retry } = useFetch(fetchOrders, []);

  if (loading) return <Loading label="Loading orders" />;
  if (error) return <ErrorMessage title="Could not load orders" message={error.message} onRetry={retry} />;
  if (!orders || orders.length === 0) return <EmptyState message="No orders available yet." />;

  return (
    <>
      <h1 className="page-title">Orders</h1>
      <OrdersTable orders={orders} />
    </>
  );
}
