// @vitest-environment jsdom
import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { StatusActions } from './StatusActions';

afterEach(cleanup);

describe('StatusActions', () => {
  it('renders one button per allowed transition and reports the choice', () => {
    const onChange = vi.fn();
    render(<StatusActions status="Pending" transitions={['Processing', 'Cancelled']} busy={false} onChange={onChange} />);
    expect(screen.getAllByRole('button').map((b) => b.textContent)).toEqual(['Start processing', 'Cancel order']);
    fireEvent.click(screen.getByRole('button', { name: 'Start processing' }));
    expect(onChange).toHaveBeenCalledWith('Processing');
  });

  it('disables the buttons while busy', () => {
    render(<StatusActions status="Pending" transitions={['Processing']} busy onChange={() => {}} />);
    expect((screen.getByRole('button') as HTMLButtonElement).disabled).toBe(true);
  });

  it('shows the locked notice when nothing is allowed', () => {
    render(<StatusActions status="Completed" transitions={[]} busy={false} onChange={() => {}} />);
    expect(screen.getByText(/can no longer be changed/)).toBeTruthy();
    expect(screen.queryAllByRole('button')).toHaveLength(0);
  });
});
