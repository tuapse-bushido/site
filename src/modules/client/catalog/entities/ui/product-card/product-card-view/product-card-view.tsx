import clsx from 'clsx';
import { JSX } from 'react';
import Image from 'next/image';

import styles from './product-card-view.module.scss';

import { ProductCardViewProps } from 'modules/client/catalog/entities/ui/product-card/product-card-view/product-card-view.props';
import { ButtonCardMain } from 'modules/client/catalog/entities/ui/product-card/button-card/button-card-main';

export const ProductCardView = ({ product }: ProductCardViewProps): JSX.Element => {
  const cx = (base: string): string => clsx(styles[base]);

  return (
    <div className={cx('productCard')}>
      <div className={cx('productImageWrapper')}>
        <Image
          className={clsx(styles.productImage)}
          src={process.env.NEXT_PUBLIC_IMAGES_PRODUCTS + product.image_link}
          alt={product.title}
          width={500}
          height={375}
          sizes={'(max-width: 440px) 29vw'}
        />
      </div>

      <div className={cx('productContent')}>
        <div className={styles.productContentHeader}>
          <h2 className={styles.productHeaderTitle}>{product.title}</h2>
          <span className={styles.productHeaderDescription}>
            {product.count_portion && `${product.count_portion} шт / `}
            {product.weight} г
          </span>
          {/*<div>*/}
          {/*  <p>{ingredients}</p>*/}
          {/*</div>*/}
        </div>

        <div className={clsx(styles.productContentFooter)}>
          <div className={cx('productFooterPrice')}>
            <span>{product.price} ₽</span>
          </div>

          {/*<ButtonCardMain product={product} />*/}
        </div>
      </div>
    </div>
  );
};
