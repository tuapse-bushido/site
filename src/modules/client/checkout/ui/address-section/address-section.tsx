import { JSX } from 'react';
import styles from './address-section.module.scss';
import { Fieldset, InputGroup, Label } from 'modules/client/shared/ui';

export const AddressSection = (): JSX.Element => {
  return (
    <Fieldset className={styles.fieldset} legendTitle={'Адрес доставки'}>
      <InputGroup
        labelTitle={<Label label={'Город'} required />}
        id={'city'}
        name={'city'}
        type={'text'}
        placeholder={'Введите города'}
        required
        autoComplete={'address-level2'}
        classNames={{ root: styles.city }}
      />

      <InputGroup
        labelTitle={<Label label={'Улица'} required />}
        id={'street'}
        name={'street'}
        type={'text'}
        placeholder={'Введите улицу'}
        required
        autoComplete={'address-line1'}
        classNames={{ root: styles.street }}
      />

      <InputGroup
        labelTitle={<Label label={'Дом'} required />}
        id={'house'}
        name={'house'}
        type={'text'}
        placeholder={'Введите номер дома'}
        required
        autoComplete={'address-line2'}
        inputMode={'numeric'}
        classNames={{ root: styles.house }}
      />

      <InputGroup
        labelTitle={'Квартира / № офиса'}
        id={'apartment'}
        name={'apartment'}
        type={'text'}
        placeholder={'Введите № квартиры / офиса'}
        autoComplete={'address-line3'}
        inputMode={'numeric'}
        classNames={{ root: styles.apartment }}
      />

      <InputGroup
        labelTitle={'Этаж'}
        id={'floor'}
        name={'floor'}
        type={'text'}
        placeholder={'Введите этаж'}
        inputMode={'numeric'}
        classNames={{ root: styles.floor }}
      />

      <InputGroup
        labelTitle={'Подъезд'}
        id={'entrance'}
        name={'entrance'}
        type={'text'}
        placeholder={'Введите № подъезда'}
        inputMode={'numeric'}
        classNames={{ root: styles.entrance }}
      />

      <InputGroup
        labelTitle={'Домофон'}
        id={'intercom'}
        name={'intercom'}
        type={'text'}
        placeholder={'Введите код домофона'}
        inputMode={'numeric'}
        classNames={{ root: styles.intercom }}
      />
    </Fieldset>
  );
};
