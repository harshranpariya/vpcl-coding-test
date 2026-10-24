import { useMemo, useState } from 'react';
import { fetchOrders } from '../api/orders';
import { EmptyState, ErrorMessage, Loading } from '../components/Feedback';
import { OrderFilters } from '../components/OrderFilters';
import { OrdersTable } from '../components/OrdersTable';
import { SummaryCards } from '../components/SummaryCards';
import { Button } from '../components/ui/button';
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
  if (!orders || orders.length === 0) return <EmptyState title="No orders available yet" />;

  const clearFilters = () => {
    setSearch('');
    setStatus('All');
  };

  return (
    <div className="flex flex-col gap-5">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Orders</h1>
        <p className="mt-1 text-muted-foreground">Track customer orders and update their status.</p>
      </div>
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
        <EmptyState
          title="No orders match your search"
          description="Try a different order ID or customer name, or clear the filters."
        >
          <Button variant="outline" onClick={clearFilters}>
            Clear filters
          </Button>
        </EmptyState>
      ) : (
        <OrdersTable orders={visible} />
      )}
    </div>
  );
}