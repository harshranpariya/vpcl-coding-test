const money = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'CAD' });

const date = new Intl.DateTimeFormat('en-US', { dateStyle: 'medium', timeZone: 'UTC' });

export const formatMoney = (value: number): string => money.format(value);

export function formatDate(isoDate: string): string {
  const parsed = new Date(isoDate);
  return Number.isNaN(parsed.getTime()) ? isoDate : date.format(parsed);
}
