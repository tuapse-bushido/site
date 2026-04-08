import { JSX, Suspense } from 'react';
import { menu } from '../../model/menu.config';
import { MuiList } from 'shared/ui/mui';
import { SidebarMenuItem } from 'modules/layout/admin/sidebar-menu/ui/menu-item/menu-item';

export const AdminSidebarMenu = (): JSX.Element => {
  return (
    <nav>
      <MuiList>
        <Suspense fallback={<div>loading</div>}>
          {menu.map(
            (item): JSX.Element => (
              <SidebarMenuItem key={item.id} item={item} />
            ),
          )}
        </Suspense>
      </MuiList>
    </nav>
  );
};
