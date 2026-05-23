'use client';

import { JSX } from 'react';
import { BurgerIcon } from 'modules/layout/admin/header/icons';
import { MuiIconButton, MuiStack, MuiSvgIcon } from 'modules/admin/shared/ui/mui';

type Props = {
  onClickAction: () => void;
};
export const Header = ({ onClickAction }: Props): JSX.Element => {
  return (
    <MuiStack height={'100%'} direction={'row'} alignItems={'center'} sx={{ px: 1 }}>
      <MuiIconButton
        sx={{
          display: { sm: 'none' },
          width: 48,
          height: 48,
        }}
        onClick={onClickAction}
      >
        <MuiSvgIcon
          sx={{
            width: 32,
            height: 32,
            color: 'var(--text-primary)',
          }}
          component={BurgerIcon}
          inheritViewBox
        />
      </MuiIconButton>
    </MuiStack>
  );
};
