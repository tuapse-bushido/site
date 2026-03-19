'use client';

import dynamic from 'next/dynamic';
import React, { JSX, useState } from 'react';
import type { ActionMeta, GroupBase, MultiValue, Props as SelectProps, SingleValue } from 'react-select';
import { SelectGroupProps, SelectOption } from '@/components/ui/select-group/select-group.props';

const Select = dynamic(
  // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
  <M extends boolean>() =>
    // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
    import('react-select').then((mod) => mod.default) as Promise<
      React.ComponentType<SelectProps<SelectOption, M, GroupBase<SelectOption>>>
    >,
  {
    ssr: false,
  },
);

const optionsMap = {
  is_active: [
    { value: 'true', label: 'Активно' },
    { value: 'false', label: 'Неактивно' },
  ],
  is_visible: [
    { value: 'true', label: 'Видим' },
    { value: 'false', label: 'Невидим' },
  ],
};

export const SelectGroup = <M extends boolean = false>(props: SelectGroupProps & { isMulti?: M }): JSX.Element => {
  let selectOptions: SelectOption[] = [];
  let defaultVal: SelectOption[] | SelectOption = [];
  let isMulti = false;
  let isDisabled = false;

  if (props.field === 'is_visible' || props.field === 'is_active') {
    const { field, defaultValue } = props;
    selectOptions = optionsMap[field];

    defaultVal =
      selectOptions.find((option): boolean => option.value === String(defaultValue)) ??
      selectOptions.find((option): boolean => option.value === 'true')!;
  }

  if (
    props.field === 'set' ||
    props.field === 'categories' ||
    props.field === 'ingredients' ||
    props.field === 'products' ||
    props.field === 'addon_products'
  ) {
    const { defaultValue, options } = props;

    selectOptions = options.map((option): SelectOption => ({ value: String(option.id), label: option.title }));

    defaultVal = defaultValue
      ? defaultValue.map(
          (item): SelectOption => ({
            value: String(item.id),
            label: item.title,
          }),
        )
      : [];

    isDisabled = props.isDisabled ?? false;
    isMulti = true;
  }

  const [selectedOption, setSelectedOption] = useState<SelectOption[] | SelectOption | null>(
    isMulti ? defaultVal : (defaultVal ?? null),
  );

  const handlerSetValue = (
    newValue: SingleValue<SelectOption> | MultiValue<SelectOption>,
    _actionMeta: ActionMeta<SelectOption>,
  ): void => {
    if (isMulti) {
      setSelectedOption(newValue ? [...(newValue as MultiValue<SelectOption>)] : []);
    } else {
      setSelectedOption((newValue as SingleValue<SelectOption>) ?? null);
    }
  };

  return (
    <div>
      <label htmlFor={props.id}>{props.label}</label>
      <Select
        inputId={props.id ?? ''}
        isMulti={isMulti}
        defaultValue={defaultVal}
        options={selectOptions}
        onChange={handlerSetValue}
        isDisabled={isDisabled}
      />

      {isMulti ? (
        Array.isArray(selectedOption) && selectedOption.length > 0 ? (
          selectedOption.map(
            (opt): JSX.Element => <input key={opt.value} type="hidden" name={props.field} value={opt.value} />,
          )
        ) : (
          <input type="hidden" name={props.field} value="" />
        )
      ) : (
        selectedOption && <input type="hidden" name={props.field} value={(selectedOption as SelectOption).value} />
      )}
    </div>
  );
};
