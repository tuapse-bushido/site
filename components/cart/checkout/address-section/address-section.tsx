import { JSX } from 'react';
import { Fieldset } from '@/components/ui/fieldset/fieldset';
import { InputGroup } from '@/components/ui/input-group/input-group';
import styles from './address-section.module.scss';
import { labelWithStar } from '@/utils/jsx-utils';

export const AddressFormSection = (): JSX.Element => {
  return (
    <Fieldset className={styles.fieldset} legendTitle={'Адрес доставки'}>
      <InputGroup
        label={labelWithStar('Город', styles.required)}
        id={'city'}
        name={'city'}
        type={'text'}
        placeholder={'Введите города'}
        required
        autoComplete={'address-level2'}
        wrapperClassName={styles.city}
        inputClassName={styles.input}
      />

      <InputGroup
        label={labelWithStar('Улица', styles.required)}
        id={'street'}
        name={'street'}
        type={'text'}
        placeholder={'Введите улицу'}
        required
        autoComplete={'address-line1'}
        wrapperClassName={styles.street}
      />

      <InputGroup
        label={labelWithStar('Дом', styles.required)}
        id={'house'}
        name={'house'}
        type={'text'}
        placeholder={'Введите номер дома'}
        required
        autoComplete={'address-line2'}
        inputMode={'numeric'}
        wrapperClassName={styles.house}
      />

      <InputGroup
        label={'Квартира / № офиса'}
        id={'apartment'}
        name={'apartment'}
        type={'text'}
        placeholder={'Введите № квартиры / офиса'}
        autoComplete={'address-line3'}
        inputMode={'numeric'}
        wrapperClassName={styles.apartment}
        labelClassName={styles.apartmentLabel}
      />

      <InputGroup
        label={'Этаж'}
        id={'floor'}
        name={'floor'}
        type={'text'}
        placeholder={'Введите этаж'}
        inputMode={'numeric'}
        wrapperClassName={styles.floor}
      />

      <InputGroup
        label={'Подъезд'}
        id={'entrance'}
        name={'entrance'}
        type={'text'}
        placeholder={'Введите № подъезда'}
        inputMode={'numeric'}
        wrapperClassName={styles.entrance}
      />

      <InputGroup
        label={'Домофон'}
        id={'intercom'}
        name={'intercom'}
        type={'text'}
        placeholder={'Введите код домофона'}
        inputMode={'numeric'}
        wrapperClassName={styles.intercom}
      />
    </Fieldset>
  );
};
