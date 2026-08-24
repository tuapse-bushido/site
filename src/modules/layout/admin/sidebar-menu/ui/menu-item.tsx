'use client';

import Link from 'next/link';
import { JSX, memo } from 'react';
import { usePathname } from 'next/navigation';
import { ADMIN_ICONS } from '../model/icon-map';
import { MenuItem } from '../model/menu.config';
import { Tooltip, useMediaQuery, useTheme } from '@mui/material';
import { MuiListItem, MuiListItemButton, MuiListItemText, MuiStack } from 'modules/admin/shared/ui/mui';

type Props = {
  item: MenuItem;
  onClose?: (() => void) | undefined;
};
export const SidebarMenuItem = memo(({ item, onClose }: Props): JSX.Element => {
  const pathname = usePathname();
  const theme = useTheme();

  const isCompact = useMediaQuery(theme.breakpoints.down('md'));
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const showText = isMobile || !isCompact;
  const active = pathname === item.link;
  const Icon = ADMIN_ICONS[item.iconName];

  return (
    <MuiListItem disablePadding sx={{ display: 'block' }} onClick={onClose}>
      <Tooltip title={!showText ? item.label : ''} placement="right" arrow>
        <MuiListItemButton
          component={Link}
          href={item.link}
          selected={active}
          sx={{
            minHeight: 60,
            justifyContent: showText ? 'initial' : 'center',
            px: 2.5,
            '&.Mui-selected': {
              backgroundColor: 'rgba(var(--primary-rgb), 0.08)',
            },
          }}
        >
          <MuiStack
            direction="row"
            alignItems="center"
            justifyContent={showText ? 'flex-start' : 'center'}
            sx={{
              minWidth: showText ? 40 : '100%',
              mr: showText ? 2 : 0,
              transition: 'all 0.2s ease-in-out',
            }}
          >
            <Icon
              style={{
                width: showText ? '28px' : '36px',
                height: showText ? '28px' : '36px',
                transition: 'all 0.2s ease-in-out',
              }}
            />
          </MuiStack>

          {showText && (
            <MuiListItemText
              primary={item.label}
              sx={{
                '& .MuiTypography-root': {
                  fontWeight: active ? 600 : 400,
                },
              }}
            />
          )}
        </MuiListItemButton>
      </Tooltip>
    </MuiListItem>
  );
});

SidebarMenuItem.displayName = 'SidebarMenuItem';
