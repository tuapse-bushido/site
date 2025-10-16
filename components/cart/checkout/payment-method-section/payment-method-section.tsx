import { JSX } from 'react';
import { Fieldset } from '@/components/ui/fieldset/fieldset';
import { InputGroup } from '@/components/ui/input-group/input-group';
import styles from './payment-method-section.module.scss';

export const PaymentMethodSection = ({ orderType }: { orderType: 'delivery' | 'pickup' }): JSX.Element => (
  <Fieldset legendTitle={'Способ оплаты'}>
    {orderType === 'delivery' ? (
      <InputGroup
        label={'Оплата курьеру - наличный или безналичный расчет'}
        type={'radio'}
        id={'payment_method'}
        name={'payment_type'}
        defaultValue={'courier'}
        defaultChecked
        wrapperClassName={styles.wrapper}
        inputClassName={styles.input}
      />
    ) : (
      <InputGroup
        label={'Оплата при получении - наличный или безналичный расчет'}
        type={'radio'}
        id={'payment_method'}
        name={'payment_type'}
        defaultValue={'pickup'}
        wrapperClassName={styles.wrapper}
        inputClassName={styles.input}
      />
    )}
  </Fieldset>
);
