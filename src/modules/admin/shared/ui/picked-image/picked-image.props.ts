import { DetailedHTMLProps, HTMLAttributes } from 'react';

export type PickedImageProps = DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement> & {
  imageLink: string | null | undefined;
  altImage: string | undefined;
};
