import { JSX } from 'react';
import {
  MuiAvatar,
  MuiList,
  MuiListItem,
  MuiListItemAvatar,
  MuiListItemText,
  MuiTypography,
} from 'modules/admin/shared/ui/mui';
import { OrderItem } from 'modules/admin/orders/entities';

type Props = {
  products: OrderItem[];
};

export const StructureList = ({ products }: Props): JSX.Element => {
  return (
    <MuiList disablePadding>
      {products.map(
        (p): JSX.Element => (
          <MuiListItem
            key={p.id}
            sx={{ py: 1.5, gap: 1.5 }}
            disableGutters
            secondaryAction={
              <MuiTypography variant="body1" fontWeight="500">
                {p.total_price} ₽
              </MuiTypography>
            }
          >
            <MuiListItemAvatar>
              <MuiAvatar src={p.image_link} variant="rounded" sx={{ width: 48, height: 48, bgcolor: 'grey.100' }}>
                {p.title[0]}
              </MuiAvatar>
            </MuiListItemAvatar>
            <MuiListItemText
              primary={p.title}
              secondary={`${p.quantity} x ${p.price} ₽`}
              slotProps={{
                primary: { variant: 'body1', fontWeight: 500 },
                secondary: { variant: 'body2' },
              }}
            />
          </MuiListItem>
        ),
      )}
    </MuiList>
  );
};
