import { ArrowLeftIcon } from 'lucide-react';
import { useState, type ReactNode } from 'react';
import { Link, useParams } from 'react-router-dom';
import { toast } from 'sonner';
import { ApiError, fetchOrder, updateOrderStatus } from '../api/orders';
import { ErrorMessage, Loading } from '../components/Feedback';
import { StatusActions } from '../components/StatusActions';
import { StatusBadge } from '../components/StatusBadge';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '../components/ui/breadcrumb';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Table, TableBody, TableCell, TableFooter, TableHead, TableHeader, TableRow } from '../components/ui/table';
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
    setSaving(true);
    setSaveError(null);
    try {
      const updated = await updateOrderStatus(id, next);
      setData(updated);
      toast.success('Status updated', { description: `${updated.id} is now ${updated.status}.` });
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
  const units = items.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <div className="flex flex-col gap-6">
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link to="/">Orders</Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>{order.id}</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="flex flex-wrap items-center gap-3 text-2xl font-semibold tracking-tight">
            {order.id}
            <StatusBadge status={order.status} />
          </h1>
          <p className="mt-1 text-muted-foreground">
            {order.customerName} &middot; Placed {formatDate(order.orderDate)}
          </p>
        </div>
        <Button asChild variant="outline">
          <Link to="/">
            <ArrowLeftIcon data-icon="inline-start" />
            Back to orders
          </Link>
        </Button>
      </div>

      <div className="grid gap-5 lg:grid-cols-[minmax(0,2fr)_minmax(280px,1fr)] lg:items-start">
        <Card>
          <CardHeader>
            <CardTitle>Items</CardTitle>
            <CardDescription>
              {items.length} {items.length === 1 ? 'product' : 'products'} in this order
            </CardDescription>
          </CardHeader>
          <CardContent>
            {items.length === 0 ? (
              <p className="text-muted-foreground">This order has no items.</p>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Product</TableHead>
                    <TableHead className="text-right">Qty</TableHead>
                    <TableHead className="text-right">Unit price</TableHead>
                    <TableHead className="text-right">Line total</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {items.map((item, index) => (
                    <TableRow key={`${item.productId}-${index}`}>
                      <TableCell className="font-medium whitespace-normal">{item.productName}</TableCell>
                      <TableCell className="text-right tabular-nums">{item.quantity}</TableCell>
                      <TableCell className="text-right tabular-nums">{formatMoney(item.unitPrice)}</TableCell>
                      <TableCell className="text-right tabular-nums">{formatMoney(lineTotal(item))}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
                <TableFooter>
                  <TableRow>
                    <TableCell colSpan={3}>Order total</TableCell>
                    <TableCell className="text-right tabular-nums">{formatMoney(order.total)}</TableCell>
                  </TableRow>
                </TableFooter>
              </Table>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Summary</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-4">
            <dl className="divide-y">
              <SummaryRow label="Status">
                <StatusBadge status={order.status} />
              </SummaryRow>
              <SummaryRow label="Customer">{order.customerName}</SummaryRow>
              <SummaryRow label="Order date">{formatDate(order.orderDate)}</SummaryRow>
              <SummaryRow label="Items">
                {units} {units === 1 ? 'unit' : 'units'}
              </SummaryRow>
              <SummaryRow label="Total">
                <span className="text-lg font-semibold tabular-nums">{formatMoney(order.total)}</span>
              </SummaryRow>
            </dl>

            <div className="flex flex-col gap-3 border-t pt-4">
              <h2 className="font-medium">Update status</h2>
              <StatusActions
                orderId={order.id}
                status={order.status}
                transitions={order.allowedTransitions ?? []}
                busy={saving}
                onChange={changeStatus}
              />
              {saving && (
                <p className="text-sm text-muted-foreground" role="status">
                  Saving…
                </p>
              )}
              {saveError && <ErrorMessage title="Could not update status" message={saveError} />}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function SummaryRow({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="flex items-center justify-between gap-4 py-2.5 first:pt-0 last:pb-0">
      <dt className="text-muted-foreground">{label}</dt>
      <dd className="text-right font-medium">{children}</dd>
    </div>
  );
}