import { JSX } from 'react';

export function labelWithStar(label: string, styles: string): JSX.Element {
  return (
    <>
      {label}
      <span className={styles}>*</span>
    </>
  );
}
