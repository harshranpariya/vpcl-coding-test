import type { SortState, StatusFilter } from '../lib/orders';
import { ORDER_STATUSES } from '../types';

const SORT_OPTIONS: { label: string; sort: SortState }[] = [
  { label: 'Newest first', sort: { key: 'orderDate', direction: 'desc' } },
  { label: 'Oldest first', sort: { key: 'orderDate', direction: 'asc' } },
  { label: 'Highest total', sort: { key: 'total', direction: 'desc' } },
  { label: 'Lowest total', sort: { key: 'total', direction: 'asc' } },
];

const sortValue = (sort: SortState) => `${sort.key}:${sort.direction}`;

interface Props {
  search: string;
  status: StatusFilter;
  sort: SortState;
  onSearchChange: (value: string) => void;
  onStatusChange: (value: StatusFilter) => void;
  onSortChange: (value: SortState) => void;
}

export function OrderFilters({ search, status, sort, onSearchChange, onStatusChange, onSortChange }: Props) {
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

      <label className="field">
        <span>Sort by</span>
        <select
          value={sortValue(sort)}
          onChange={(e) => {
            const option = SORT_OPTIONS.find((o) => sortValue(o.sort) === e.target.value);
            if (option) onSortChange(option.sort);
          }}
        >
          {SORT_OPTIONS.map((o) => (
            <option key={sortValue(o.sort)} value={sortValue(o.sort)}>
              {o.label}
            </option>
          ))}
        </select>
      </label>
    </div>
  );
}
