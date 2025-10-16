import { JSX, useState } from 'react';
import { Button } from '@/components/ui/button/button';
import styles from './checkout.module.scss';
import { CheckoutForm } from '@/components/cart/checkout/checkout-form/checkout-form';

export const Checkout = (): JSX.Element => {
  const [orderType, setOrderType] = useState<'delivery' | 'pickup'>('delivery');

  const handlerChangeTypeOrder = (type: 'delivery' | 'pickup'): void => {
    if (type === 'delivery' && orderType === 'pickup') {
      setOrderType('delivery');
    } else if (type === 'pickup' && orderType === 'delivery') {
      setOrderType('pickup');
    }
  };

  return (
    <>
      <section className={styles.section}>
        <Button
          className={styles.btnOrderType}
          label={'Доставка'}
          type={orderType === 'delivery' ? 'primaryCheckout' : 'secondaryCheckout'}
          onClick={(): void => handlerChangeTypeOrder('delivery')}
        />
        <Button
          className={styles.btnOrderType}
          label={'Самовывоз'}
          type={orderType === 'pickup' ? 'primaryCheckout' : 'secondaryCheckout'}
          onClick={(): void => handlerChangeTypeOrder('pickup')}
        />
      </section>

      <div>
        <CheckoutForm orderType={orderType} />
      </div>
    </>
  );
};
