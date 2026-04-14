import { DetailedHTMLProps, HTMLAttributes } from 'react';

type DivProps = DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement>;

export type SwiperClientProps = DivProps & {
  items: string[];
};
