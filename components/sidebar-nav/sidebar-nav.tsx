import { JSX } from 'react';
import { ClientSidebarNav } from '@/components/sidebar-nav/client-wrapper/client-wrapper';
import { MenuList } from '@/components/menu/menu-list';

export const SidebarNav = async (): Promise<JSX.Element | null> => {
  return (
    <>
      <ClientSidebarNav>
        <MenuList />
      </ClientSidebarNav>
    </>
  );
};
