import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import { ErrorMessage } from './error-message';

describe('ErrorMessage UI', (): void => {
  it('рендерит текст label', (): void => {
    render(<ErrorMessage text={'Error message'} />);

    expect(screen.getByText('Error message')).toBeInTheDocument();
  });
});
