import { DashboardPage } from './pages/DashboardPage';
export function App() {
  return (
    <>
      <header className="app-header">
        <span className="brand">Order Management Dashboard</span>
      </header>
      <main className="container">
        <DashboardPage />
      </main>
    </>
  );
}