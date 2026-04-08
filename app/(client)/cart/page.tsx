import { JSX } from 'react';
import styles from './cart-page.module.scss';
import { CartContent } from 'modules/client/cart/widgets';

export default function CartPage(): JSX.Element {
  return (
    <div className={styles.page}>
      <CartContent />
    </div>
  );
}
