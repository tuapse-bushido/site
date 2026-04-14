import { JSX, ReactNode } from 'react';

type Props = {
  children: JSX.Element;
  detail: ReactNode;
};

export default function RulesLayout({ children, detail }: Props): JSX.Element {
  return (
    <>
      <div style={{ width: '50%' }}>{children}</div>
      <div>{detail}</div>
    </>
  );
}
