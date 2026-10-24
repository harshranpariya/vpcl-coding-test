import { MoonIcon, SunIcon } from 'lucide-react';
import type { Theme } from '../hooks/useTheme';
import { Button } from './ui/button';

export function ThemeToggle({ theme, onToggle }: { theme: Theme; onToggle: () => void }) {
  const dark = theme === 'dark';
  return (
    <Button
      variant="outline"
      size="icon"
      aria-label={dark ? 'Switch to light mode' : 'Switch to dark mode'}
      onClick={onToggle}
    >
      {dark ? <SunIcon /> : <MoonIcon />}
    </Button>
  );
}