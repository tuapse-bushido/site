'use client';

import { JSX, useTransition } from 'react';
import { MuiBox, MuiButton } from 'modules/admin/shared/ui/mui';
import { deleteAddonRuleAction } from 'modules/admin/rules/features/addon-rule-form/api/delete-addon-rule.action';

export const FormAction = ({ id }: { id: number | undefined }): JSX.Element => {
  const [isPending, startTransition] = useTransition();

  const handleDelete = (): void => {
    if (!window.confirm('Вы уверены, что хотите удалить это правило?')) return;

    startTransition(async (): Promise<void> => {
      await deleteAddonRuleAction(id!);
    });
  };

  return (
    <MuiBox sx={{ display: 'flex', justifyContent: 'end', gap: 3 }}>
      <MuiButton type={'submit'} variant={'outlined'} color={'success'}>
        Сохранить
      </MuiButton>
      {id && (
        <MuiButton variant="contained" color="error" onClick={handleDelete} disabled={isPending}>
          {isPending ? 'Удаление...' : 'Удалить'}
        </MuiButton>
      )}
      <MuiButton variant={'outlined'} color={'info'}>
        Отмена
      </MuiButton>
    </MuiBox>
  );
};
