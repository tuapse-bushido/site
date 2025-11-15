import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import { InputGroup } from './input-group';

describe('InputGroup UI', (): void => {
  it('рендерит label, если labelTitle указан', (): void => {
    render(<InputGroup id="email" labelTitle="Email" />);
    expect(screen.getByText('Email')).toBeInTheDocument();
  });

  it('не рендерит label, если нет labelTitle', (): void => {
    render(<InputGroup id="email" />);
    expect(screen.queryByLabelText(/email/i)).toBeNull();
  });

  it('применяет кастомные классы через classNames', (): void => {
    render(
      <InputGroup
        id="email"
        labelTitle="Email"
        classNames={{
          rootClassName: 'root-x',
          labelClassName: 'label-z',
          inputClassName: 'input-y',
        }}
      />,
    );

    expect(screen.getByText('Email').className).toContain('label-z');
    expect(screen.getByRole('textbox').className).toContain('input-y');
  });

  it('передаёт rootProps в корневой div', (): void => {
    render(<InputGroup id="email" labelTitle="Email" rootProps={{ 'data-test': 'root' }} />);

    const root = screen.getByRole('textbox').parentElement;
    expect(root).toHaveAttribute('data-test', 'root');
  });

  it('передаёт labelProps в label', (): void => {
    render(<InputGroup id="email" labelTitle="Email" labelProps={{ title: 'tooltip' }} />);

    expect(screen.getByText('Email')).toHaveAttribute('title', 'tooltip');
  });

  it('передаёт HTML-пропсы input через rest props', (): void => {
    render(<InputGroup id="login" placeholder="Введите" autoComplete="username" />);

    const input = screen.getByRole('textbox');

    expect(input).toHaveAttribute('placeholder', 'Введите');
    expect(input).toHaveAttribute('autocomplete', 'username');
  });
});
