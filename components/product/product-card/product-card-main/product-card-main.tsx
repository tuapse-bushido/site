import { JSX } from 'react';
import { ProductCardMainProps } from '@/components/product/product-card/product-card-main/product-card-main.props';
import Image from 'next/image';
import styles from './product-card-main.module.scss';
import clsx from 'clsx';
import { ButtonCardMain } from '@/components/product/product-card/product-card-main/button-card-main';

export const ProductCardMain = ({ product, type }: ProductCardMainProps): JSX.Element => {
  return (
    <div className={clsx(styles.productCard, type === 'cart' && styles.productCardCart)}>
      <div
        className={clsx(
          styles.productImageWrapper,
          type === 'cart' && styles.productImageWrapperCart,
        )}
      >
        <Image
          className={clsx(styles.productImage)}
          src={
            typeof product.image_link === 'string'
              ? product.image_link
              : process.env.NEXT_PUBLIC_IMAGES_DOMAIN + '/no_image.png'
          }
          alt={product.title}
          width={500}
          height={375}
          sizes={type !== 'cart' ? '(max-width: 440px) 50vw' : '(max-width: 440px) 29vw'}
        />
      </div>

      <div className={clsx(styles.productContent, type === 'cart' && styles.productContentCart)}>
        <div className={clsx(styles.productContentHeader)}>
          <h2 className={clsx(styles.productHeaderTitle)}>{product.title}</h2>
          <span className={clsx(styles.productHeaderDescription)}>
            {product.count_portion && `${product.count_portion} шт / `}
            {product.weight} г
          </span>
        </div>

        <div className={clsx(styles.productContentFooter)}>
          <div
            className={clsx(
              styles.productFooterPrice,
              type === 'cart' && styles.productFooterPriceCart,
            )}
          >
            <span></span>
            <span>{product.price} ₽</span>
          </div>

          <ButtonCardMain product={product} />
        </div>
      </div>
    </div>
  );
};
