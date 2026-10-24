import { SearchXIcon } from 'lucide-react';
import { Link } from 'react-router-dom';
import { EmptyState } from '../components/Feedback';
import { Button } from '../components/ui/button';

export function NotFoundPage({ title = 'Page not found', message }: { title?: string; message?: string }) {
  return (
    <EmptyState as="h1" icon={<SearchXIcon />} title={title} description={message}>
      <Button asChild variant="outline">
        <Link to="/">Back to orders</Link>
      </Button>
    </EmptyState>
  );
}