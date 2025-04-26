import { JSX } from 'react';
import { ProductCardProps } from '@/components/product/product-card/product-card.props';
import { ProductCardMain } from '@/components/product/product-card/product-card-main/product-card-main';
import { ProductCardPage } from '@/components/product/product-card/product-card-page/product-card-page';

export const ProductCard = ({ product, variant = 'main' }: ProductCardProps): JSX.Element => {
  if (variant === 'page') {
    return <ProductCardPage product={product} />;
  }

  return <ProductCardMain product={product} type={'main'} />;
};
