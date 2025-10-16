import { JSX } from 'react';
import { ContactFormSection } from '@/components/cart/checkout/contact-section/contact-section';
import { AddressFormSection } from '@/components/cart/checkout/address-section/address-section';
import { PaymentMethodSection } from '@/components/cart/checkout/payment-method-section/payment-method-section';
import { Button } from '@/components/ui/button/button';
import Form from 'next/form';
import { addCheckoutInfo, CheckoutState } from '@/libs/redux/slices/checkout-slice';
import { useAppDispatch } from '@/libs/redux/hooks/hooks';
import { actionSendSmsCode } from '@/utils/actions/confirm-order.action';
import styles from './checkout-form.module.scss';

export const CheckoutForm = ({ orderType }: { orderType: 'delivery' | 'pickup' }): JSX.Element => {
  const dispatch = useAppDispatch();

  const action = async (formData: FormData): Promise<void> => {
    const formObject = Object.fromEntries(formData.entries());

    const checkout: CheckoutState = {
      order: {
        order_type: formObject.order_type as 'delivery' | 'pickup',
        payment_type: formObject.payment_type as 'pickup' | 'courier',
      },
      user: {
        name: formObject.name as string,
        phone: formObject.phone as string,
        address: {
          city: formObject.city as string,
          street: formObject.street as string,
          house: formObject.house as string,
          apartment: formObject.apartment as string,
          floor: formObject.floor as string,
          entrance: formObject.entrance as string,
          intercom: formObject.intercom as string,
        },
      },
    };
    dispatch(addCheckoutInfo(checkout));

    await actionSendSmsCode(formData, orderType);
  };

  return (
    <Form action={action} className={styles.form}>
      <input type="hidden" name={'order_type'} defaultValue={orderType} />

      <ContactFormSection />

      {orderType === 'delivery' && <AddressFormSection />}

      <PaymentMethodSection orderType={orderType} />

      <Button label={'Подтвердить заказ'} type={'primary'} className={styles.button} />
    </Form>
  );
};
