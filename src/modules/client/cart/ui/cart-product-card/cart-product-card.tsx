import { JSX } from 'react';
import { AppImage } from 'shared/ui/app-image';
import styles from './cart-product-card.module.scss';
import { AddonEntry, CartCardViewModel, CartItem } from 'modules/client/cart/model/cart-state.types';
import { ButtonCardMain } from 'modules/client/catalog/entities/ui/product-card/button-card/button-card-main';

export const CartProductCard = ({
  product,
  prod,
  add,
}: {
  product: CartCardViewModel;
  prod?: CartItem;
  add?: AddonEntry;
}): JSX.Element => {
  const { imageLink, title, countPortion, weight, isFree, price, discountPrice } = product;

  return (
    <div className={styles.card}>
      <AppImage
        classNames={{ root: styles.root, image: styles.image }}
        src={process.env.NEXT_PUBLIC_IMAGES_DOMAIN + '/' + imageLink}
        alt={title}
        imageProps={{ width: 100, height: 75, loading: 'eager' }}
      />

      <div className={styles.content}>
        <div className={styles.contentHeader}>
          <h2 className={styles.headerTitle}>{title}</h2>
          <span className={styles.headerDescription}>
            {countPortion && `${countPortion} шт / `}
            {weight} г
          </span>
        </div>

        <div className={styles.contentFooter}>
          <div className={styles.footerPrice}>
            {discountPrice && <span className={styles.priceDiscount}>{discountPrice} ₽</span>}
            {isFree ? (
              <span className={styles.priceFree}>Бесплатно</span>
            ) : (
              <span className={discountPrice ? styles.priceOld : undefined}>{price} ₽</span>
            )}
          </div>

          <ButtonCardMain product={prod! ?? add?.addon_product} />
        </div>
      </div>
    </div>
  );
};
