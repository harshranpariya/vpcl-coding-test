import type { OrderStatus } from '../types';

const LABELS: Record<OrderStatus, string> = {
  Pending: 'Mark as pending',
  Processing: 'Start processing',
  Completed: 'Mark as completed',
  Cancelled: 'Cancel order',
};

interface Props {
  status: OrderStatus;
  transitions: OrderStatus[];
  busy: boolean;
  onChange: (next: OrderStatus) => void;
}

export function StatusActions({ status, transitions, busy, onChange }: Props) {
  if (transitions.length === 0) {
    return <p className="muted">This order is {status.toLowerCase()} and can no longer be changed.</p>;
  }
  return (
    <div className="actions">
      {transitions.map((next) => (
        <button
          key={next}
          type="button"
          className={next === 'Cancelled' ? 'btn btn-danger' : 'btn btn-primary'}
          disabled={busy}
          onClick={() => onChange(next)}
        >
          {LABELS[next] ?? next}
        </button>
      ))}
    </div>
  );
}
