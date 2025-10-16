import clsx from 'clsx';
import { JSX } from 'react';
import Image from 'next/image';
import { getImageUrl } from '@/utils';
import styles from './product-card-view.module.scss';
import { ButtonCardMain } from '@/components/product/product-card/button-card/button-card-main';
import { ProductCardViewProps } from '@/components/product/product-card/product-card-view/product-card-view.props';

export const ProductCardView = ({ product, type, product_type }: ProductCardViewProps): JSX.Element => {
  const isCart = type === 'cart';
  const isProduct = product_type === 'product';

  const imageLink = isProduct ? product.image_link : product.addon_product.image_link;
  const title = isProduct ? product.title : product.addon_product.title;
  const countPortion = isProduct ? product.count_portion : product.addon_product.count_portion;
  const weight = isProduct ? product.weight : product.addon_product.weight;
  const price = isProduct ? product.price : product.addon_product.price;

  const cx = (base: string): string => clsx(styles[base], isCart && styles[`${base}Cart`]);

  return (
    <div className={cx('productCard')}>
      <div className={cx('productImageWrapper')}>
        <Image
          className={clsx(styles.productImage)}
          src={getImageUrl(imageLink)}
          alt={title}
          width={500}
          height={375}
          sizes={type !== 'cart' ? '(max-width: 440px) 50vw' : '(max-width: 440px) 29vw'}
        />
      </div>

      <div className={cx('productContent')}>
        <div className={styles.productContentHeader}>
          <h2 className={styles.productHeaderTitle}>{title}</h2>
          <span className={styles.productHeaderDescription}>
            {countPortion && `${countPortion} шт / `}
            {weight} г
          </span>
        </div>

        <div className={clsx(styles.productContentFooter)}>
          <div className={cx('productFooterPrice')}>
            {isProduct ? (
              <span>{price} ₽</span>
            ) : product.quantity_in_cart <= product.max_free_quantity ? (
              <span className={styles.priceFree}>Бесплатно</span>
            ) : (
              <span>{price} ₽</span>
            )}
          </div>

          <ButtonCardMain product={isProduct ? product : product.addon_product} />
        </div>
      </div>
    </div>
  );
};
