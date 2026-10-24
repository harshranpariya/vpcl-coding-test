import { cn } from 'cn';
import type { OrderStatus } from '../types';
import { Badge } from './ui/badge';

const STYLES: Record<OrderStatus, { badge: string; dot: string }> = {
  Pending: {
    badge: 'border-amber-200 bg-amber-50 text-amber-800 dark:border-amber-400/30 dark:bg-amber-400/10 dark:text-amber-300',
    dot: 'bg-amber-500',
  },
  Processing: {
    badge: 'border-blue-200 bg-blue-50 text-blue-800 dark:border-blue-400/30 dark:bg-blue-400/10 dark:text-blue-300',
    dot: 'bg-blue-500',
  },
  Completed: {
    badge: 'border-green-200 bg-green-50 text-green-800 dark:border-green-400/30 dark:bg-green-400/10 dark:text-green-300',
    dot: 'bg-green-500',
  },
  Cancelled: {
    badge: 'border-red-200 bg-red-50 text-red-800 dark:border-red-400/30 dark:bg-red-400/10 dark:text-red-300',
    dot: 'bg-red-500',
  },
};

export function StatusDot({ status, className }: { status: OrderStatus; className?: string }) {
  return <span className={cn('inline-block size-2 rounded-full', STYLES[status].dot, className)} aria-hidden="true" />;
}

export function StatusBadge({ status }: { status: OrderStatus }) {
  return (
    <Badge variant="outline" className={cn('gap-1.5', STYLES[status].badge)}>
      <StatusDot status={status} className="size-1.5" />
      {status}
    </Badge>
  );
}