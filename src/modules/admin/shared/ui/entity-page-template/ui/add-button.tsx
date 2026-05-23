'use client';

import { JSX } from 'react';
import PlusIcon from './plus.svg';
import { Link } from 'modules/admin/shared/ui/mui-link';
import { MuiBox, MuiButton, MuiSvgIcon } from 'modules/admin/shared/ui/mui';

type Props = {
  href: string;
  title: string;
};
export const AddButton = ({ href, title }: Props): JSX.Element => {
  return (
    <MuiButton
      component={Link}
      href={href}
      variant="contained"
      color="primary"
      size="medium"
      startIcon={<MuiSvgIcon component={PlusIcon} inheritViewBox />}
      sx={{ whiteSpace: 'nowrap', minWidth: 'max-content' }}
    >
      <MuiBox component={'span'}>Добавить&nbsp;</MuiBox>
      <MuiBox component={'span'} sx={{ display: { xs: 'none' }, '@media (min-width: 700px)': { display: 'inline' } }}>
        {title}
      </MuiBox>
    </MuiButton>
  );
};
