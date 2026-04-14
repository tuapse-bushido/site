'use client';

import Link from 'next/link';
import { JSX, memo } from 'react';
import { MenuItem } from '../../model/menu.config';
import { usePathname } from 'next/navigation';
import { Tooltip, useMediaQuery, useTheme } from '@mui/material';
import { MuiListItem, MuiListItemButton, MuiListItemText } from 'modules/admin/shared/ui/mui';
import { ADMIN_ICONS } from 'modules/layout/admin/sidebar-menu/model/icon-map';

export const SidebarMenuItem = memo(({ item }: { item: MenuItem }): JSX.Element => {
  const pathname = usePathname();
  const theme = useTheme();

  const isCompact = useMediaQuery(theme.breakpoints.down('md'));
  const active = pathname === item.link;

  const Icon = ADMIN_ICONS[item.iconName];

  return (
    <MuiListItem disablePadding sx={{ display: 'block' }}>
      <Tooltip title={isCompact ? item.label : ''} placement="right" arrow>
        <MuiListItemButton component={Link} href={item.link} selected={active}>
          <Icon style={{ width: '30px', height: '30px' }} />

          {!isCompact && <MuiListItemText primary={item.label} />}
        </MuiListItemButton>
      </Tooltip>
    </MuiListItem>
  );
});

SidebarMenuItem.displayName = 'SidebarMenuItem';
