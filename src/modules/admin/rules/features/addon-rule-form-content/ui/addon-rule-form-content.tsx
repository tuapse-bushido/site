'use client';

import { JSX, useActionState } from 'react';
import { addonRuleAction, deleteAddonRuleAction } from '../api';
import { optionsMapper } from 'modules/admin/shared/config/options-mapper';
import { MuiAlert, MuiStack, MuiTextField } from 'modules/admin/shared/ui/mui';
import { EntityFormActions } from 'modules/admin/shared/features/entity-form-actions';
import { AddonRuleEditData, UpsertFormAddonRule } from 'modules/admin/rules/entities';
import { getSelectValue, selectOptions } from 'modules/admin/shared/config/select-options';
import { SelectComponent } from 'modules/admin/shared/ui/select-component/select-component';

type Props = {
  addonRuleData: AddonRuleEditData;
};

export const AddonRuleFormContent = ({ addonRuleData }: Props): JSX.Element => {
  const { addonRule, categories, products } = addonRuleData;

  const boundAction = addonRuleAction.bind(null, addonRule?.id ?? null);
  const [state, formAction] = useActionState(boundAction, null);

  const getFieldError = (field: keyof UpsertFormAddonRule): string | undefined => {
    if (!state?.fieldErrors) return undefined;

    const errors = state.fieldErrors[field as keyof typeof state.fieldErrors];

    return Array.isArray(errors) ? errors[0] : errors;
  };

  return (
    <MuiStack
      id="addon-rule-form"
      component="form"
      action={formAction}
      direction="column"
      gap={3}
      sx={{ maxWidth: '100rem' }}
    >
      <MuiTextField
        id="title"
        name="title"
        label="Название"
        defaultValue={state?.data?.title ?? addonRule?.title}
        error={!!getFieldError('title')}
        helperText={getFieldError('title')}
        required
      />

      <SelectComponent
        label="Доступность"
        name="is_active"
        options={selectOptions.is_active.options}
        defaultSelect={getSelectValue('is_active', state?.data?.is_active ?? addonRule?.is_active)}
      />

      <MuiTextField
        id="base_count"
        name="base_count"
        label="Базовое количество"
        defaultValue={state?.data?.base_count ?? addonRule?.base_count}
        error={!!getFieldError('base_count')}
        helperText={getFieldError('base_count')}
      />

      <MuiTextField
        id="divisor"
        name="divisor"
        label="Делитель"
        defaultValue={state?.data?.divisor ?? addonRule?.divisor}
        error={!!getFieldError('divisor')}
        helperText={getFieldError('divisor')}
      />

      <MuiTextField
        id="show_count_percent"
        name="show_count_percent"
        label="Процент первого отображения"
        defaultValue={state?.data?.show_count_percent ?? addonRule?.show_count_percent}
        error={!!getFieldError('show_count_percent')}
        helperText={getFieldError('show_count_percent')}
      />

      <SelectComponent
        label={'Продукт добавка'}
        name={'addons'}
        options={optionsMapper.options(products)}
        defaultSelect={optionsMapper.defaultSelect(addonRule?.addons)}
        multiple={true}
        error={!!getFieldError('addons')}
        helperText={getFieldError('addons')}
      />

      <SelectComponent
        label={'Категории применения'}
        name={'categories'}
        options={optionsMapper.options(categories)}
        defaultSelect={optionsMapper.defaultSelect(addonRule?.categories)}
        multiple={true}
        error={!!getFieldError('categories')}
        helperText={getFieldError('categories')}
      />

      <SelectComponent
        label={'Продукты применения'}
        name={'products'}
        options={optionsMapper.options(products)}
        defaultSelect={optionsMapper.defaultSelect(addonRule?.products)}
        multiple={true}
        error={!!getFieldError('products')}
        helperText={getFieldError('products')}
      />

      {state?.message && !state?.fieldErrors && (
        <MuiAlert severity="error" variant="outlined">
          {state.message}
        </MuiAlert>
      )}

      <EntityFormActions id={addonRule?.id} cancelPath="/admin/rules" onDeleteAction={deleteAddonRuleAction} />
    </MuiStack>
  );
};
