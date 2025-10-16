'use client';

import { ChangeEvent, JSX, startTransition, useActionState, useEffect, useState } from 'react';
import { useAppSelector } from '@/libs/redux/hooks/hooks';
import { CheckoutState } from '@/libs/redux/slices/checkout-slice';
import { Button } from '@/components/ui/button/button';
import { actionResendSmsCode, actionVerifySmsCode } from '@/utils/actions/confirm-order.action';
import Form from 'next/form';
import { FormState } from '@/types/actions/form-schemas';
import { CartState } from '@/types';
import { useTimer } from '@/hooks/use-timer';
import styles from './order-confirmation.module.scss';
import { InputGroup } from '@/components/ui/input-group/input-group';
import { redirect } from 'next/navigation';
import { OrderConfirmed } from '@/components/cart/order-confirmed/order-confirmed';
import { getServerSocket } from '@/utils/server-socket';

export const OrderConfirmationPage = (): JSX.Element => {
  const checkout = useAppSelector((state): CheckoutState => state.checkout);
  const cart = useAppSelector((state): CartState => state.cart);

  const [isConfirmed, setIsConfirmed] = useState(false);
  const isEmpty = Object.keys(cart.items).length === 0 && Object.keys(cart.addons).length === 0;

  const [timer, restart] = useTimer(5);

  const verifyCode = (prevState: FormState, formData: FormData): Promise<FormState> => {
    return actionVerifySmsCode(prevState, formData, cart, checkout);
  };
  const [verifyState, verifyAction] = useActionState(verifyCode, null);

  const resendSms = async (prevState: null, formData: FormData): Promise<null> => {
    restart();
    const phone = checkout.user.phone;
    await actionResendSmsCode(prevState, formData, phone);
    return null;
  };
  const [sendCodeState, sendCodeAction] = useActionState(resendSms, null);

  const handlerOnChange = (event: ChangeEvent<HTMLInputElement>): void => {
    const value = event.target.value;

    if (value.length === 6) {
      const formData = new FormData();
      formData.append('sms_code', value);

      startTransition((): void => verifyAction(formData));
    }
  };

  useEffect((): void => {
    if (!verifyState?.message) return;

    const sendOrder = async (): Promise<void> => {
      try {
        const socket = await getServerSocket();
        console.log('📤 Отправляю заказ через сокет:', verifyState.message);
        socket.emit('newOrder', verifyState.message);
      } catch (err) {
        console.error('❌ Ошибка сокета:', err);
      }
    };

    void sendOrder();
  }, [verifyState?.message]);

  useEffect((): void => {
    if (verifyState?.message) setIsConfirmed(true);
  }, [verifyState?.message]);

  if (isEmpty && !isConfirmed) redirect('/cart');

  return (
    <div>
      {!verifyState?.message ? (
        <Form action={sendCodeAction} className={styles.form}>
          <h1 className={styles.h1}>Подтверждение заказа</h1>
          <p>Для подтверждения заказа, введите код из СМС отправленный на номер {checkout.user.phone}</p>

          <InputGroup
            type="tel"
            inputMode="numeric"
            pattern="[0-9]*"
            maxLength={6}
            name="sms_code"
            autoComplete="one-time-code"
            onChange={handlerOnChange}
          />

          {verifyState?.fields && <p>{verifyState.fields.sms_code}</p>}

          <Button
            type={timer > 0 ? 'inActive' : 'primary'}
            label={timer > 0 ? `Получить код (${timer}с)` : 'Получить код'}
          />
        </Form>
      ) : (
        <OrderConfirmed
          orderNumber={typeof verifyState?.message === 'string' ? '' : verifyState?.message.order_number}
        />
      )}
    </div>
  );
};
