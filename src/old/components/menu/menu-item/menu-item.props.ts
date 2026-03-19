import { IconType } from '@/components/ui/icon-label-item/icon-label-item.props';

export type MenuItemProps = {
  item: {
    title: string;
    icon: IconType;
    href: string;
  };
};
