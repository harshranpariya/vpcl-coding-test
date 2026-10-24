import { SearchIcon } from 'lucide-react';
import type { SortState, StatusFilter } from '../lib/orders';
import { ORDER_STATUSES } from '../types';
import { Input } from './ui/input';
import { NativeSelect, NativeSelectOption } from './ui/native-select';

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
    <div className="flex flex-col gap-3 sm:flex-row">
      <div className="relative flex-1">
        <SearchIcon
          className="pointer-events-none absolute top-1/2 left-2.5 size-4 -translate-y-1/2 text-muted-foreground"
          aria-hidden="true"
        />
        <Input
          type="search"
          aria-label="Search orders"
          placeholder="Search by order ID or customer name"
          className="pl-8"
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
        />
      </div>

      <div className="grid grid-cols-2 gap-3 sm:flex">
        <NativeSelect
          className="w-full sm:w-40"
          aria-label="Filter by status"
          value={status}
          onChange={(e) => onStatusChange(e.target.value as StatusFilter)}
        >
          <NativeSelectOption value="All">All statuses</NativeSelectOption>
          {ORDER_STATUSES.map((s) => (
            <NativeSelectOption key={s} value={s}>
              {s}
            </NativeSelectOption>
          ))}
        </NativeSelect>

        <NativeSelect
          className="w-full sm:w-40"
          aria-label="Sort orders"
          value={sortValue(sort)}
          onChange={(e) => {
            const option = SORT_OPTIONS.find((o) => sortValue(o.sort) === e.target.value);
            if (option) onSortChange(option.sort);
          }}
        >
          {SORT_OPTIONS.map((o) => (
            <NativeSelectOption key={sortValue(o.sort)} value={sortValue(o.sort)}>
              {o.label}
            </NativeSelectOption>
          ))}
        </NativeSelect>
      </div>
    </div>
  );
}