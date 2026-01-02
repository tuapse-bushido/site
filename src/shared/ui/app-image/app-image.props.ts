import { StaticImport } from 'next/dist/shared/lib/get-img-props';
import { DivProps, ImageProps } from 'shared/types/html.types';

export type AppImageProps = {
  src: string | StaticImport;
  alt: string;

  classNames?: {
    root: string;
    image: string;
  };

  rootProps?: DivProps;
  imageProps?: ImageProps;
};
