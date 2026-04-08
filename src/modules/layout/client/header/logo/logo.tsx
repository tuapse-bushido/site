'use client';

import { JSX } from 'react';
import { useRouter } from 'next/navigation';
import { LogoIcon, LogoTextIcon } from './icons';

export const Logo = ({ className }: { className: string }): JSX.Element => {
  const router = useRouter();

  return (
    <div className={className} onClick={(): void => router.push('/')}>
      <LogoIcon />
      <LogoTextIcon />
    </div>
  );
};
