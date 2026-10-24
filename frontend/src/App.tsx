import { PackageIcon } from 'lucide-react';
import { BrowserRouter, Link, Route, Routes } from 'react-router-dom';
import { ErrorBoundary } from './components/ErrorBoundary';
import { ThemeToggle } from './components/ThemeToggle';
import { Toaster } from './components/ui/sonner';
import { useTheme } from './hooks/useTheme';
import { DashboardPage } from './pages/DashboardPage';
import { NotFoundPage } from './pages/NotFoundPage';
import { OrderDetailsPage } from './pages/OrderDetailsPage';

export function App() {
  const { theme, toggle } = useTheme();

  return (
    <BrowserRouter>
      <header className="sticky top-0 z-10 border-b bg-background/90 backdrop-blur">
        <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-4 sm:px-6">
          <Link to="/" className="flex items-center gap-2.5 text-sm font-semibold sm:text-base">
            <span className="flex size-7 items-center justify-center rounded-lg bg-primary text-primary-foreground">
              <PackageIcon className="size-4" aria-hidden="true" />
            </span>
            Order Management Dashboard
          </Link>
          <ThemeToggle theme={theme} onToggle={toggle} />
        </div>
      </header>
      <main className="mx-auto w-full max-w-6xl px-4 py-6 sm:px-6 sm:py-8">
        <ErrorBoundary>
          <Routes>
            <Route path="/" element={<DashboardPage />} />
            <Route path="/orders/:id" element={<OrderDetailsPage />} />
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </ErrorBoundary>
      </main>
      <Toaster theme={theme} />
    </BrowserRouter>
  );
}