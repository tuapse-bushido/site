'use client';

import { SelectComponentProps } from './select-component.props';
import { JSX, useState } from 'react';
import { MuiAutocomplete, MuiBox, MuiTextField } from 'modules/admin/shared/ui/mui';

export const SelectNew = (props: SelectComponentProps): JSX.Element => {
  const { label, name, options, multiple, defaultSelect } = props;

  const [value, setValue] = useState<string | string[]>((): string | string[] =>
    multiple ? (Array.isArray(defaultSelect) ? defaultSelect : []) : ((defaultSelect as string) ?? ''),
  );

  // Храним предыдущий пропс, чтобы понять, что он изменился
  const [prevDefaultSelect, setPrevDefaultSelect] = useState(defaultSelect);

  if (defaultSelect !== prevDefaultSelect) {
    setPrevDefaultSelect(defaultSelect);
    // Обновляем стейт прямо во время рендера
    setValue(
      multiple
        ? Array.isArray(defaultSelect)
          ? defaultSelect
          : defaultSelect
            ? [defaultSelect as string]
            : []
        : ((defaultSelect as string) ?? ''),
    );
  }

  return (
    <MuiBox>
      {/* 3. Единая логика скрытых инпутов */}
      {multiple ? (
        // Теперь здесь всегда массив, даже если в нем 0 или 1 элемент
        (value as string[]).map((v): JSX.Element => <input key={v} type="hidden" name={name} value={v} />)
      ) : (
        <input type="hidden" name={name} value={value as string} />
      )}

      <MuiAutocomplete
        multiple={multiple}
        options={options}
        isOptionEqualToValue={(option, val): boolean => {
          const compareValue = typeof val === 'object' ? val?.value : val;
          return option.value === compareValue;
        }}
        getOptionLabel={(option): string => option.label}
        value={
          multiple
            ? options.filter((o): boolean => (value as string[]).includes(o.value))
            : options.find((o): boolean => o.value === value) || null
        }
        onChange={(_, newValue): void => {
          if (multiple) {
            // Гарантируем массив строк
            const vals = (newValue as typeof options).map((v): string => v.value);
            setValue(vals);
          } else {
            setValue((newValue as (typeof options)[0])?.value || '');
          }
        }}
        renderInput={(params): JSX.Element => (
          <MuiTextField {...params} label={label} placeholder={multiple ? 'Поиск...' : ''} />
        )}
        disableCloseOnSelect={!!multiple}
      />
    </MuiBox>
  );
};
