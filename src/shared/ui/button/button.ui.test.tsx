import { describe, expect, it, vi } from 'vitest';
import { fireEvent, render, screen } from '@testing-library/react';
import { Button } from './button';

describe('Button UI', (): void => {
  it('рендерит текст label', (): void => {
    render(<Button label="Click me" type="primary" />);

    expect(screen.getByText('Click me')).toBeInTheDocument();
  });

  it('рендерит disabled при type="waiting"', (): void => {
    render(<Button label="Load..." type="waiting" />);

    const btn = screen.getByRole('button');
    expect(btn).toBeDisabled();
    expect(btn).toHaveAttribute('aria-disabled', 'true');
  });

  it('рендерит disabled при type="inActive"', (): void => {
    render(<Button label="Submit" type="inActive" />);

    const btn = screen.getByRole('button');
    expect(btn).toBeDisabled();
    expect(btn).toHaveAttribute('aria-disabled', 'true');
  });

  it('вызывает onClick при клике', (): void => {
    const handleClick = vi.fn();

    render(<Button label="OK" type="primary" onClick={handleClick} />);

    fireEvent.click(screen.getByRole('button'));

    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('НЕ вызывает onClick когда disabled', (): void => {
    const handleClick = vi.fn();

    render(<Button label="Nope" type="waiting" onClick={handleClick} />);

    fireEvent.click(screen.getByRole('button'));

    expect(handleClick).not.toHaveBeenCalled();
  });
});
