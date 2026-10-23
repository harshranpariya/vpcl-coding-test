import { useMemo, useState } from 'react';
import { fetchOrders } from '../api/orders';
import { EmptyState, ErrorMessage, Loading } from '../components/Feedback';
import { OrderFilters } from '../components/OrderFilters';
import { OrdersTable } from '../components/OrdersTable';
import { SummaryCards } from '../components/SummaryCards';
import { useFetch } from '../hooks/useFetch';
import { filterOrders, sortOrders, summarize, type SortState, type StatusFilter } from '../lib/orders';

export function DashboardPage() {
  const { data: orders, loading, error, retry } = useFetch(fetchOrders, []);
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState<StatusFilter>('All');
  const [sort, setSort] = useState<SortState>({ key: 'orderDate', direction: 'desc' });

  const visible = useMemo(
    () => sortOrders(filterOrders(orders ?? [], search, status), sort),
    [orders, search, status, sort],
  );

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
      <OrderFilters
        search={search}
        status={status}
        sort={sort}
        onSearchChange={setSearch}
        onStatusChange={setStatus}
        onSortChange={setSort}
      />
      {visible.length === 0 ? (
        <EmptyState message="No orders match your search." actionLabel="Clear filters" onAction={clearFilters} />
      ) : (
        <OrdersTable orders={visible} />
      )}
    </>
  );
}