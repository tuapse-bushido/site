'use client';

import { JSX } from 'react';
import { Button } from '@/components/ui/button/button';
import { ButtonComponentProps } from '@/components/ui/button/button.props';

/**
 * NavItem component.
 *
 * Wraps a `Button` with provided `label` and `type`.
 * Used to render individual items in the top navigation.
 *
 * ---
 * Компонент `NavItem`.
 *
 * Обёртка над `Button`, принимает `label` и `type`.
 * Используется для отображения элементов верхней навигации.
 */
export const NavItem = ({ label, type }: ButtonComponentProps): JSX.Element => {
  return <Button label={label} type={type} />;
};
