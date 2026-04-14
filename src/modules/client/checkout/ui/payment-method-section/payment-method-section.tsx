import { JSX } from 'react';
import styles from './payment-method-section.module.scss';
import { Fieldset, InputGroup } from 'modules/client/shared/ui';

export const PaymentMethodSection = ({ orderType }: { readonly orderType: 'delivery' | 'pickup' }): JSX.Element => {
  const options =
    orderType === 'delivery'
      ? { title: 'Оплата курьеру - наличный или безналичный расчет', value: 'courier' }
      : { title: 'Оплата при получении - наличный или безналичный расчет', value: 'pickup' };

  return (
    <Fieldset legendTitle={'Способ оплаты'}>
      <InputGroup
        labelTitle={options.title}
        type={'radio'}
        id={'payment_method'}
        name={'payment_type'}
        value={options.value}
        defaultChecked
        className={styles.input}
        classNames={{ root: styles.root, label: styles.label }}
      />
    </Fieldset>
  );
};
