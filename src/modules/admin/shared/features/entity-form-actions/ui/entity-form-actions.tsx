'use client';

import { JSX, useTransition } from 'react';
import { FormState } from 'shared/types/form.types';
import { Link } from 'modules/admin/shared/ui/mui-link';
import { MuiBox, MuiButton } from 'modules/admin/shared/ui/mui';

type Props = {
  cancelPath: string;
  confirmDeleteText?: string;
  id?: number | undefined;
  isSaving?: boolean;
  onDeleteAction?: (id: number) => Promise<FormState<null>>;
  setFormKeyAction?: () => void;
};

export const EntityFormActions = ({
  id,
  onDeleteAction,
  cancelPath,
  confirmDeleteText = 'Вы уверены, что хотите удалить эту запись?',
  isSaving = false,
  setFormKeyAction,
}: Props): JSX.Element => {
  const [isDeleting, startTransition] = useTransition();

  const handleDelete = (): void => {
    if (!onDeleteAction || !id) return;
    if (!window.confirm(confirmDeleteText)) return;

    startTransition(async (): Promise<void> => {
      await onDeleteAction(id);
    });
  };

  return (
    <MuiBox sx={{ display: 'flex', justifyContent: 'end', gap: 2, mt: 4 }}>
      <MuiButton
        component={Link}
        href={cancelPath}
        variant="outlined"
        color="inherit"
        onClick={(): void => {
          setFormKeyAction?.();
        }}
        disabled={isSaving || isDeleting}
      >
        Назад
      </MuiButton>

      {id && onDeleteAction && (
        <MuiButton variant="contained" color="error" onClick={handleDelete} disabled={isSaving || isDeleting}>
          {isDeleting ? 'Удаление...' : 'Удалить'}
        </MuiButton>
      )}

      <MuiButton type="submit" variant="contained" color="success" disabled={isSaving || isDeleting}>
        {isSaving ? 'Сохранение...' : 'Сохранить'}
      </MuiButton>
    </MuiBox>
  );
};
