import { JSX } from 'react';
import { SidebarMenu } from './sidebar-menu';
import { MuiDrawer } from 'modules/admin/shared/ui/mui';

type Props = {
  variant: 'temporary' | 'permanent';
  open?: boolean;
  onClose?: () => void;
};

export const AdminSidebar = ({ variant, open, onClose }: Props): JSX.Element => {
  const isTemporary = variant === 'temporary';

  return (
    <MuiDrawer
      component={'aside'}
      variant={variant}
      open={open}
      onClose={onClose}
      sx={{
        display: isTemporary ? { xs: 'block', sm: 'none' } : { xs: 'none', sm: 'block' },
        gridArea: isTemporary ? undefined : 'sidebar',
        '& .MuiDrawer-paper': {
          width: isTemporary ? 280 : '100%',
          position: isTemporary ? 'fixed' : 'static',
          height: '100%',
          border: 'none',
          boxSizing: 'border-box',
          backgroundColor: 'var(--surface-base)',
        },
      }}
    >
      <SidebarMenu onItemClick={onClose} />
    </MuiDrawer>
  );
};
