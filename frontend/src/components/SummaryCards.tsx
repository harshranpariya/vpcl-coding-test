import { cn } from 'cn';
import type { StatusFilter } from '../lib/orders';
import { StatusDot } from './StatusBadge';

const CARDS: StatusFilter[] = ['All', 'Pending', 'Processing', 'Completed', 'Cancelled'];

interface Props {
  counts: Record<StatusFilter, number>;
  active: StatusFilter;
  onSelect: (status: StatusFilter) => void;
}

export function SummaryCards({ counts, active, onSelect }: Props) {
  return (
    <div role="group" aria-label="Filter by status" className="grid grid-cols-2 gap-3 md:grid-cols-5 md:gap-4">
      {CARDS.map((status) => (
        <button
          key={status}
          type="button"
          aria-pressed={active === status}
          onClick={() => onSelect(status)}
          className={cn(
            'flex flex-col gap-2 rounded-xl bg-card p-4 text-left ring-1 ring-foreground/10 transition-colors outline-none hover:bg-muted/50 focus-visible:ring-3 focus-visible:ring-ring/50 aria-pressed:ring-2 aria-pressed:ring-ring',
            status === 'All' && 'col-span-2 md:col-span-1',
          )}
        >
          <span className="flex items-center gap-2 text-sm text-muted-foreground">
            {status !== 'All' && <StatusDot status={status} />}
            {status === 'All' ? 'Total orders' : status}
          </span>
          <span className="text-2xl font-semibold tracking-tight tabular-nums md:text-3xl">{counts[status]}</span>
        </button>
      ))}
    </div>
  );
}