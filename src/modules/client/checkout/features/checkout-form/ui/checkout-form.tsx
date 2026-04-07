import { JSX, useActionState } from 'react';
import styles from './checkout-form.module.scss';
import { FormState } from 'shared/types/form.types';
import { useAppSelector } from 'modules/client/redux';
import { ContactSection } from '../../../ui/contact-section';
import { AddressSection } from '../../../ui/address-section';
import { CartState } from 'modules/client/cart/model/cart-state.types';
import { PaymentMethodSection } from '../../../ui/payment-method-section';
import { CheckoutFormType } from 'modules/client/checkout/features/checkout-form/model';
import { createOrderAction } from 'modules/client/checkout/features/checkout-form/api/create-order.action';

export const CheckoutForm = ({ orderType }: { orderType: 'delivery' | 'pickup' }): JSX.Element => {
  const cart = useAppSelector((state): CartState => state.cart);

  const [state, formAction, pending] = useActionState(
    async (prevState: FormState | null, formData: FormData): Promise<FormState<CheckoutFormType>> => {
      return createOrderAction(prevState, formData, cart);
    },
    null,
  );

  return (
    <form action={formAction} className={styles.form}>
      <input type="hidden" name={'order_type'} defaultValue={orderType} />

      <ContactSection />

      {orderType === 'delivery' && <AddressSection />}

      <PaymentMethodSection orderType={orderType} />

      <button type="submit" className="btn btnPrimary" disabled={pending}>
        Подтвердить заказ
      </button>
    </form>
  );
};
