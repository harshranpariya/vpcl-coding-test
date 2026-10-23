import { Component, type ErrorInfo, type ReactNode } from 'react';

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
        <section className="panel">
          <h1>Something went wrong</h1>
          <p className="muted">{this.state.error.message}</p>
          <a href="/" className="btn">
            Reload the dashboard
          </a>
        </section>
      );
    }
    return this.props.children;
  }
}
