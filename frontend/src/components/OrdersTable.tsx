import { ChevronRightIcon } from 'lucide-react';
import { Link } from 'react-router-dom';
import { formatDate, formatMoney } from '../lib/format';
import type { Order } from '../types';
import { StatusBadge } from './StatusBadge';
import { Button } from './ui/button';
import { Card, CardContent } from './ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';

const orderLink = (order: Order) => `/orders/${encodeURIComponent(order.id)}`;

export function OrdersTable({ orders }: { orders: Order[] }) {
  return (
    <>
      <Card className="hidden gap-0 py-0 md:flex">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/50 hover:bg-muted/50">
              <TableHead className="h-11 px-4 text-muted-foreground">Order ID</TableHead>
              <TableHead className="px-4 text-muted-foreground">Customer</TableHead>
              <TableHead className="px-4 text-muted-foreground">Date</TableHead>
              <TableHead className="px-4 text-muted-foreground">Status</TableHead>
              <TableHead className="px-4 text-right text-muted-foreground">Total</TableHead>
              <TableHead className="px-4">
                <span className="sr-only">Actions</span>
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {orders.map((order) => (
              <TableRow key={order.id}>
                <TableCell className="px-4 py-3 font-medium">{order.id}</TableCell>
                <TableCell className="px-4 py-3">{order.customerName}</TableCell>
                <TableCell className="px-4 py-3 text-muted-foreground">{formatDate(order.orderDate)}</TableCell>
                <TableCell className="px-4 py-3">
                  <StatusBadge status={order.status} />
                </TableCell>
                <TableCell className="px-4 py-3 text-right tabular-nums">{formatMoney(order.total)}</TableCell>
                <TableCell className="px-4 py-3 text-right">
                  <Button asChild variant="outline" size="sm">
                    <Link to={orderLink(order)}>View</Link>
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        <p className="border-t px-4 py-3 text-sm text-muted-foreground">
          Showing {orders.length} {orders.length === 1 ? 'order' : 'orders'}
        </p>
      </Card>

      <ul className="flex flex-col gap-3 md:hidden">
        {orders.map((order) => (
          <li key={order.id}>
            <Card>
              <CardContent className="flex flex-col gap-3">
                <div className="flex items-center justify-between gap-3">
                  <span className="font-medium">{order.id}</span>
                  <StatusBadge status={order.status} />
                </div>
                <p className="text-muted-foreground">{order.customerName}</p>
                <div className="flex items-center justify-between gap-3">
                  <span className="text-muted-foreground">{formatDate(order.orderDate)}</span>
                  <span className="text-base font-semibold tabular-nums">{formatMoney(order.total)}</span>
                </div>
                <Button asChild variant="outline" className="min-h-11 w-full">
                  <Link to={orderLink(order)}>
                    View order
                    <ChevronRightIcon data-icon="inline-end" />
                  </Link>
                </Button>
              </CardContent>
            </Card>
          </li>
        ))}
      </ul>
    </>
  );
}