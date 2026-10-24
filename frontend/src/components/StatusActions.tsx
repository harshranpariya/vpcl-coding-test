import type { OrderStatus } from '../types';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from './ui/alert-dialog';
import { Button } from './ui/button';

const LABELS: Record<OrderStatus, string> = {
  Pending: 'Mark as pending',
  Processing: 'Start processing',
  Completed: 'Mark as completed',
  Cancelled: 'Cancel order',
};

interface Props {
  orderId: string;
  status: OrderStatus;
  transitions: OrderStatus[];
  busy: boolean;
  onChange: (next: OrderStatus) => void;
}

export function StatusActions({ orderId, status, transitions, busy, onChange }: Props) {
  if (transitions.length === 0) {
    return <p className="text-sm text-muted-foreground">This order is {status.toLowerCase()} and can no longer be changed.</p>;
  }
  return (
    <div className="flex flex-col gap-2">
      {transitions.map((next) =>
        next === 'Cancelled' ? (
          <AlertDialog key={next}>
            <AlertDialogTrigger asChild>
              <Button variant="destructive" size="lg" disabled={busy}>
                {LABELS[next]}
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Cancel order {orderId}?</AlertDialogTitle>
                <AlertDialogDescription>
                  This cannot be undone. The order will be marked as Cancelled and no further status changes will be
                  possible.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Keep order</AlertDialogCancel>
                <AlertDialogAction variant="destructive" onClick={() => onChange(next)}>
                  Yes, cancel order
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        ) : (
          <Button key={next} size="lg" disabled={busy} onClick={() => onChange(next)}>
            {LABELS[next] ?? next}
          </Button>
        ),
      )}
    </div>
  );
}