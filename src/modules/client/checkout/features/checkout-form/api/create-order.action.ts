'use server';

import { redirect } from 'next/navigation';
import { checkoutFormSchema } from '../model';
import { FormState } from 'shared/types/form.types';
import { CartState } from 'modules/client/cart/model/cart-state.types';
import { createOrder } from 'modules/order/use-cases/create-order.cases';
import { formError, parsedFormData } from 'modules/admin/shared/utils/form.utils';
import { CheckoutFormType } from 'modules/client/checkout/features/checkout-form/model/checkout.model';
import { sendOrderToSocketServer } from 'shared/socket';

export const createOrderAction = async (
  _prevState: FormState | null,
  formData: FormData,
  cart: CartState,
): Promise<FormState<CheckoutFormType>> => {
  const parsed = parsedFormData(formData, checkoutFormSchema);

  if (!parsed.success) return formError({ fieldErrors: parsed.fieldErrors });

  const response = await createOrder({ checkout: parsed.data, cart });

  if (!response.ok) return formError();

  await sendOrderToSocketServer({ checkout: parsed.data, cart }).catch(console.error);

  const orderNumber = response.data.order_number;

  redirect(`/order/success/${orderNumber}`);
};
