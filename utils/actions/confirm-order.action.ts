'use server';
import { insertSmsCode, verifySmsCode } from '@/libs/db/sms-code/sms-code.query';
import { redirect } from 'next/navigation';
import { CartState } from '@/types';
import { CheckoutState } from '@/libs/redux/slices/checkout-slice';
import { insertOrder } from '@/libs/db/orders/orders.query';
import { deliveryFormSchema, FormState, pickupFormSchema, smsFormSchema } from '@/types/actions/form-schemas';

export const actionSendSmsCode = async (formData: FormData, orderType: 'delivery' | 'pickup'): Promise<void> => {
  const formObject = Object.fromEntries(formData.entries());

  const parsed =
    orderType === 'delivery' ? deliveryFormSchema.safeParse(formObject) : pickupFormSchema.safeParse(formObject);

  if (!parsed.success) return;

  const phone = parsed.data.phone;

  const code = Math.floor(Math.random() * 1_000_000)
    .toString()
    .padStart(6, '0');

  await insertSmsCode(phone, code);
  console.log('CODE: ', code);

  // await sendSmsCode(phone, code);

  redirect('/cart/order-confirmation');
};

export const actionResendSmsCode = async (
  _state: null,
  _formData: FormData,
  phone: string,
): Promise<void | FormState> => {
  const code = Math.floor(Math.random() * 1_000_000)
    .toString()
    .padStart(6, '0');

  await insertSmsCode(phone, code);
  console.log('CODE: ', code);
};

export const actionVerifySmsCode = async (
  _prevState: FormState,
  formData: FormData,
  cart: CartState,
  checkout: CheckoutState,
): Promise<FormState> => {
  const formObject = Object.fromEntries(formData.entries());
  const parsed = smsFormSchema.safeParse(formObject);

  if (!parsed.success) {
    return {
      success: false,
      fields: {
        sms_code: 'Ошибка в коде',
      },
    };
  }

  const verifyResponse = await verifySmsCode(checkout.user.phone);

  if (!verifyResponse.success)
    return {
      success: false,
      fields: {
        sms_code: 'Ошибка сервера, попробуйте снова',
      },
    };

  if (verifyResponse.data === null)
    return {
      success: false,
      fields: {
        sms_code: 'Неверный код',
      },
    };

  const { code, created_at } = verifyResponse.data;

  const now = Date.now();
  const createdTime = new Date(created_at).getTime();
  const fiveMinutes = 5 * 60 * 1000;

  if (code === parsed.data.sms_code && now - createdTime < fiveMinutes) {
    const order = await insertOrder(checkout, cart);

    if (!order.success) {
      return {
        success: false,
        fields: {
          sms_code: 'Ошибка сервера, попробуйте снова',
        },
      };
    }

    return {
      success: true,
      message: order.data,
    };
  }

  return {
    success: false,
    fields: {
      sms_code: 'Неверный код',
    },
  };
};
