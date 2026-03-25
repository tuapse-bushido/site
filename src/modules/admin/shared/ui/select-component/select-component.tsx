import { JSX, useState } from 'react';
import { SelectChangeEvent } from '@mui/material/Select';
import { SelectComponentProps } from './select-component.props';
import { MuiBox, MuiFormControl, MuiInputLabel, MuiMenuItem, MuiSelect } from 'shared/ui/mui';

export const SelectComponent = (props: SelectComponentProps): JSX.Element => {
  const { label, name, options } = props;

  const [select, setSelect] = useState(props.multiple ? props.defaultSelect : props.defaultSelect);

  const handleChange = (event: SelectChangeEvent<typeof select>): void => {
    const { value } = event.target;

    if (props.multiple) {
      setSelect(typeof value === 'string' ? value.split(',') : value);
    } else {
      setSelect(value as string);
    }
  };

  return (
    <MuiBox>
      <MuiFormControl fullWidth>
        <MuiInputLabel id={`label-${name}`}>{label}</MuiInputLabel>
        <MuiSelect
          labelId={`label-${name}`}
          id={name}
          name={name}
          value={select}
          label={label}
          multiple={props.multiple ?? false}
          onChange={handleChange}
        >
          {options.map(
            (o): JSX.Element => (
              <MuiMenuItem key={o.value} value={o.value}>
                {o.label}
              </MuiMenuItem>
            ),
          )}
        </MuiSelect>
      </MuiFormControl>
    </MuiBox>
  );
};
