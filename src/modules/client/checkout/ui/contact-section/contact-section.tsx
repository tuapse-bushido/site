'use client';

import { InputGroup } from 'shared/ui';
import { formatPhone } from 'shared/utils';
import React, { JSX, useState } from 'react';
import { Fieldset, Label } from 'modules/client/shared/ui';

export const ContactSection = (): JSX.Element => {
  const [phone, setPhone] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const value = e.target.value;

    if (value === '') {
      setPhone('');
      return;
    }

    setPhone(formatPhone(value));
  };

  const handleFocus = (): void => {
    if (!phone) {
      setPhone('+7 ');
    }
  };

  const handleBlur = (): void => {
    if (phone === '+7 ' || phone === '+7') {
      setPhone('');
    }
  };

  return (
    <Fieldset legendTitle={'Контактные данные'}>
      <InputGroup
        labelTitle={<Label label={'Имя'} required />}
        id="name"
        name="name"
        type="text"
        placeholder="Введите имя"
        required
        autoComplete="given-name"
      />

      <InputGroup
        labelTitle={<Label label={'Номер телефона'} required />}
        id="phone"
        name="phone"
        type="tel"
        placeholder="+7 ___ ___-__-__"
        required
        autoComplete="tel"
        inputMode="tel"
        value={phone}
        onChange={handleChange}
        onFocus={handleFocus}
        onBlur={handleBlur}
      />
    </Fieldset>
  );
};
