import React, { JSX, useState } from 'react';
import { Fieldset } from '@/components/ui/fieldset/fieldset';
import { InputGroup } from '@/components/ui/input-group/input-group';
import styles from './contact-section.module.scss';
import { labelWithStar } from '@/utils/jsx-utils';

export const ContactFormSection = (): JSX.Element => {
  const [phone, setPhone] = useState('+7');

  const formatPhone = (raw: string): string => {
    const digits = raw.replace(/\D/g, '').replace(/^8/, '7');
    const phone = digits.slice(0, 11);

    const parts = ['+7'];
    if (phone.length > 1) parts.push(' ', phone.slice(1, 4));
    if (phone.length > 4) parts.push(' ', phone.slice(4, 7));
    if (phone.length > 7) parts.push('-', phone.slice(7, 9));
    if (phone.length > 9) parts.push('-', phone.slice(9, 11));

    return parts.join('');
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    setPhone(formatPhone(e.target.value));
  };

  return (
    <Fieldset legendTitle={'Контактные данные'}>
      <InputGroup
        label={labelWithStar('Имя', styles.required)}
        id="name"
        name="name"
        type="text"
        placeholder="Введите имя"
        required
        autoComplete="given-name"
      />

      <InputGroup
        label={labelWithStar('Номер телефона', styles.required)}
        id="phone"
        name="phone"
        type="tel"
        placeholder="+7 ___ ___-__-__"
        required
        autoComplete="tel"
        inputMode="tel"
        defaultValue={phone}
        onChange={handleChange}
      />
    </Fieldset>
  );
};
