'use client';

import { JSX, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

import { useAppDispatch } from 'modules/client/redux';
import { clearCartState } from 'modules/client/cart/model/cart-slice';
import styles from './order-success-screens.module.scss';
import Link from 'next/link';

export const OrderSuccessScreens = ({
  orderNumber,
  totalPrice,
}: {
  orderNumber: string;
  totalPrice: number;
}): JSX.Element => {
  const [timer, setTimer] = useState(6);

  const router = useRouter();
  const dispatch = useAppDispatch();

  useEffect((): (() => void) | undefined => {
    dispatch(clearCartState());

    if (timer === 0) {
      router.push('/');
      return;
    }

    const id = setTimeout((): void => {
      setTimer((prev): number => prev - 1);
    }, 1000);

    return (): void => clearTimeout(id);
  }, [dispatch, timer, router]);

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Спасибо за заказ!</h1>

      <p className={styles.text}>
        Ваш заказ <strong>№{orderNumber}</strong> на сумму <strong>{totalPrice} ₽</strong> успешно оформлен. В ближайшее
        время с вами свяжется менеджер для подтверждения деталей.
      </p>

      <p className={styles.timerText}>
        Перенаправление на{' '}
        <Link href="/" className={styles.link}>
          главную
        </Link>{' '}
        через {timer} сек
      </p>
    </div>
  );
};
