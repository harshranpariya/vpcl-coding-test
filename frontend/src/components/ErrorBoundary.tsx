import { TriangleAlertIcon } from 'lucide-react';
import { Component, type ErrorInfo, type ReactNode } from 'react';
import { EmptyState } from './Feedback';
import { Button } from './ui/button';

interface State {
  error: Error | null;
}

export class ErrorBoundary extends Component<{ children: ReactNode }, State> {
  state: State = { error: null };

  static getDerivedStateFromError(error: Error): State {
    return { error };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error(error, info.componentStack);
  }

  render() {
    if (this.state.error) {
      return (
        <EmptyState as="h1" icon={<TriangleAlertIcon />} title="Something went wrong" description={this.state.error.message}>
          <Button asChild variant="outline">
            <a href="/">Reload the dashboard</a>
          </Button>
        </EmptyState>
      );
    }
    return this.props.children;
  }
}