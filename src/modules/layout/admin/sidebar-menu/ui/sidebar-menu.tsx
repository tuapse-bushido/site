import { JSX, Suspense } from 'react';
import { menu } from '../model/menu.config';
import { SidebarMenuItem } from './menu-item';
import { MuiList } from 'modules/admin/shared/ui/mui';

type Props = {
  onItemClick?: (() => void) | undefined;
};

export const SidebarMenu = ({ onItemClick }: Props): JSX.Element => {
  return (
    <nav>
      <MuiList>
        <Suspense fallback={<div>loading</div>}>
          {menu.map(
            (item): JSX.Element => (
              <SidebarMenuItem key={item.id} item={item} onClose={onItemClick} />
            ),
          )}
        </Suspense>
      </MuiList>
    </nav>
  );
};
