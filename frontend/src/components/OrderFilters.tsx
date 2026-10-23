import type { StatusFilter } from '../lib/orders';
import { ORDER_STATUSES } from '../types';

interface Props {
  search: string;
  status: StatusFilter;
  onSearchChange: (value: string) => void;
  onStatusChange: (value: StatusFilter) => void;
}

export function OrderFilters({ search, status, onSearchChange, onStatusChange }: Props) {
  return (
    <div className="filters">
      <label className="field field-grow">
        <span>Search</span>
        <input
          type="search"
          placeholder="Order ID or customer name"
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
        />
      </label>

      <label className="field">
        <span>Status</span>
        <select value={status} onChange={(e) => onStatusChange(e.target.value as StatusFilter)}>
          <option value="All">All statuses</option>
          {ORDER_STATUSES.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>
      </label>
    </div>
  );
}
