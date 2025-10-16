'use client';
import { JSX } from 'react';
import { useRouter } from 'next/navigation';
import { LogoProps } from '@/components/header/logo/logo.props';
import { LogoIcon, LogoTextIcon } from '@/assets/logo';

/**
 * Logo component.
 *
 * Displays the site logo with icon and text.
 * Navigates to the homepage on click.
 *
 * ---
 * Компонент логотипа.
 * Отображает логотип сайта с иконкой и текстом.
 * При клике переходит на главную страницу.
 */
export const Logo = ({ className }: LogoProps): JSX.Element => {
  const router = useRouter();

  return (
    <div className={className} onClick={(): void => router.push('/')}>
      <LogoIcon />
      <LogoTextIcon />
    </div>
  );
};
