import { JSX, useEffect } from 'react';
import { useTimer } from '@/hooks/use-timer';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import { clearCheckoutState } from '@/libs/redux/slices/checkout-slice';
import { clearCartState } from '@/libs/redux/slices/cart-slice';
import { useAppDispatch } from '@/libs/redux/hooks/hooks';

export const OrderConfirmed = ({ orderNumber }: { orderNumber: string }): JSX.Element => {
  const [timer] = useTimer(10);
  const dispatch = useAppDispatch();

  useEffect((): void => {
    dispatch(clearCheckoutState());
    dispatch(clearCartState());
    if (timer === 0) redirect('/');
  }, [timer, dispatch]);

  return (
    <p>
      Заказ {orderNumber} успешно создан! С Вами свяжется менеджер для уточнения деталей и стоимости доставки. Вы будете
      автоматически перенаправлены на <Link href={'/'}>Главную страницу</Link> через {timer}с
    </p>
  );
};
