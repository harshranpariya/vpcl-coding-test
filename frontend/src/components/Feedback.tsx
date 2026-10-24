import { InboxIcon, TriangleAlertIcon } from 'lucide-react';
import type { ReactNode } from 'react';
import { Alert, AlertAction, AlertDescription, AlertTitle } from './ui/alert';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Empty, EmptyContent, EmptyDescription, EmptyHeader, EmptyMedia } from './ui/empty';
import { Skeleton } from './ui/skeleton';

export function Loading({ label = 'Loading' }: { label?: string }) {
  return (
    <Card role="status" aria-live="polite" className="gap-0 py-0">
      <span className="sr-only">{label}</span>
      {Array.from({ length: 6 }, (_, i) => (
        <div key={i} className="flex items-center gap-4 border-b px-4 py-3.5 last:border-0" aria-hidden="true">
          <Skeleton className="h-4 w-20" />
          <Skeleton className="h-4 flex-1" />
          <Skeleton className="h-5 w-20 rounded-full" />
          <Skeleton className="h-4 w-14" />
        </div>
      ))}
    </Card>
  );
}

interface ErrorProps {
  title: string;
  message: string;
  onRetry?: () => void;
}

export function ErrorMessage({ title, message, onRetry }: ErrorProps) {
  return (
    <Alert variant="destructive">
      <TriangleAlertIcon />
      <AlertTitle>{title}</AlertTitle>
      <AlertDescription>{message}</AlertDescription>
      {onRetry && (
        <AlertAction>
          <Button variant="outline" size="sm" onClick={onRetry}>
            Try again
          </Button>
        </AlertAction>
      )}
    </Alert>
  );
}

interface EmptyProps {
  title: string;
  description?: string;
  icon?: ReactNode;
  as?: 'h1' | 'h2';
  children?: ReactNode;
}

export function EmptyState({ title, description, icon = <InboxIcon />, as: Heading = 'h2', children }: EmptyProps) {
  return (
    <Empty className="border bg-card py-12">
      <EmptyHeader>
        <EmptyMedia variant="icon">{icon}</EmptyMedia>
        <Heading className="font-heading text-base font-medium tracking-tight">{title}</Heading>
        {description && <EmptyDescription>{description}</EmptyDescription>}
      </EmptyHeader>
      {children && <EmptyContent>{children}</EmptyContent>}
    </Empty>
  );
}