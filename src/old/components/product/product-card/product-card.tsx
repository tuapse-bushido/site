import { JSX, memo } from 'react';
import { ProductCardProps } from '@/components/product/product-card/product-card.props';
import { ProductCardView } from '@/components/product/product-card/product-card-view/product-card-view';
import { ProductCardPage } from '@/components/product/product-card/product-card-page/product-card-page';

/**
 * Wrapper component that renders the correct product card variant.
 *
 * Based on the `variant` prop, it chooses which visual layout to render:
 * - `'main'` (default): card on the homepage
 * - `'cart'`: product in the cart
 * - `'cart-addon'`: addon in the cart
 * - `'page'`: full product view on the product page
 *
 * ---
 *
 * Обёртка для отображения нужного варианта карточки товара.
 *
 * Выбор компонента зависит от `variant`:
 * - `'main'` (по умолчанию): карточка на главной странице
 * - `'cart'`: товар в корзине
 * - `'cart-addon'`: добавка в корзине
 * - `'page'`: карточка на странице товара
 *
 * @param {ProductCardProps} props Свойства компонента `ProductCardProps`
 * @param {string} props.variant `main` | `cart` | `page` | `cart-addon`
 * @returns Компонент соответствующего типа
 *
 * @example
 * <ProductCard variant="main" product={product} />
 * <ProductCard variant="cart-addon" product={addon} />
 */
export const ProductCard = memo(({ variant, product }: ProductCardProps): JSX.Element => {
  switch (variant) {
    case 'cart-addon':
      return <ProductCardView product={product} type="cart" product_type="addon" />;
    case 'cart':
      return <ProductCardView product={product} type="cart" product_type="product" />;
    case 'page':
      return <ProductCardPage />;
    case 'main':
    default:
      return <ProductCardView product={product} type="main" product_type="product" />;
  }
});

ProductCard.displayName = 'ProductCard';
