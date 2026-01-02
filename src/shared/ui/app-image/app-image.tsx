import clsx from 'clsx';
import { JSX } from 'react';
import Image from 'next/image';
import styles from './app-image.module.scss';
import { AppImageProps } from './app-image.props';

export const AppImage = ({ src, alt, classNames, rootProps, imageProps }: AppImageProps): JSX.Element => {
  return (
    <div className={clsx(styles.root, classNames?.root)} {...rootProps}>
      <Image className={clsx(styles.image, classNames?.image)} src={src} alt={alt} {...imageProps} />
    </div>
  );
};
