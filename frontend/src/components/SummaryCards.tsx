import type { StatusFilter } from '../lib/orders';

const CARDS: StatusFilter[] = ['All', 'Pending', 'Processing', 'Completed', 'Cancelled'];

interface Props {
  counts: Record<StatusFilter, number>;
  active: StatusFilter;
  onSelect: (status: StatusFilter) => void;
}

export function SummaryCards({ counts, active, onSelect }: Props) {
  return (
    <div className="summary">
      {CARDS.map((status) => (
        <button
          key={status}
          type="button"
          className={`card card-${status.toLowerCase()}`}
          aria-pressed={active === status}
          onClick={() => onSelect(status)}
        >
          <span className="card-label">{status === 'All' ? 'Total orders' : status}</span>
          <span className="card-value">{counts[status]}</span>
        </button>
      ))}
    </div>
  );
}
