import { useMemo, useState } from 'react';
import { fetchOrders } from '../api/orders';
import { EmptyState, ErrorMessage, Loading } from '../components/Feedback';
import { OrderFilters } from '../components/OrderFilters';
import { OrdersTable } from '../components/OrdersTable';
import { SummaryCards } from '../components/SummaryCards';
import { useFetch } from '../hooks/useFetch';
import { filterOrders, summarize, type StatusFilter } from '../lib/orders';

export function DashboardPage() {
  const { data: orders, loading, error, retry } = useFetch(fetchOrders, []);
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState<StatusFilter>('All');

  const visible = useMemo(() => filterOrders(orders ?? [], search, status), [orders, search, status]);

  if (loading) return <Loading label="Loading orders" />;
  if (error) return <ErrorMessage title="Could not load orders" message={error.message} onRetry={retry} />;
  if (!orders || orders.length === 0) return <EmptyState message="No orders available yet." />;

  const clearFilters = () => {
    setSearch('');
    setStatus('All');
  };

  return (
    <>
      <h1 className="page-title">Orders</h1>
      <SummaryCards counts={summarize(orders)} active={status} onSelect={setStatus} />
      <OrderFilters search={search} status={status} onSearchChange={setSearch} onStatusChange={setStatus} />
      {visible.length === 0 ? (
        <EmptyState message="No orders match your search." actionLabel="Clear filters" onAction={clearFilters} />
      ) : (
        <OrdersTable orders={visible} />
      )}
    </>
  );
}