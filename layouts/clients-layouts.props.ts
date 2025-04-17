import React, { DetailedHTMLProps, HTMLAttributes } from 'react';

type DivProps = DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement>;

export type ClientLayoutProps = DivProps & {
  children: React.ReactNode;
};
