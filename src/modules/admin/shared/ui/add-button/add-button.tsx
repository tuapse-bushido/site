'use client';

import { JSX } from 'react';
import { Link } from 'modules/admin/shared/ui/mui-link';
import { MuiButton, MuiSvgIcon } from 'modules/admin/shared/ui/mui';
import { PlusIcon } from 'modules/admin/menu/ingredients/screens/icons';

export const AddButton = (): JSX.Element => {
  return (
    <MuiButton
      component={Link}
      href={'/admin/menu/ingredients/create'}
      variant="contained"
      color="primary"
      size="medium"
      startIcon={<MuiSvgIcon component={PlusIcon} inheritViewBox />}
    >
      Добавить ингредиент
    </MuiButton>
  );
};
