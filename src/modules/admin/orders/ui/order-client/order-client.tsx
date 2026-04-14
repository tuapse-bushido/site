import { JSX } from 'react';
import { ClientIcon, PhoneIcon } from './icons';
import { Avatar, ListItemText } from '@mui/material';
import { MuiDivider, MuiList, MuiListItem, MuiPaper, MuiStack, MuiTypography } from 'modules/admin/shared/ui/mui';

type Props = {
  customerName: string;
  customerPhone: string;
};

export const OrderClient = ({ customerName, customerPhone }: Props): JSX.Element => {
  return (
    <MuiPaper sx={{ py: 3, borderRadius: 3 }}>
      <MuiStack gap={3}>
        <MuiTypography variant="h5" fontWeight={600} sx={{ px: 3 }}>
          Клиент
        </MuiTypography>

        <MuiDivider />

        <MuiList disablePadding sx={{ px: 3 }}>
          <MuiListItem sx={{ py: 1, gap: 1.5 }} disableGutters>
            <Avatar sx={{ bgcolor: 'inherit', color: 'black', width: 32, height: 32 }}>
              <ClientIcon />
            </Avatar>
            <ListItemText
              primary={customerName}
              slotProps={{
                primary: { variant: 'body1', fontWeight: 500 },
              }}
            />
          </MuiListItem>
          <MuiListItem sx={{ py: 1, gap: 1.5 }} disableGutters>
            <Avatar sx={{ bgcolor: 'inherit', color: 'black', width: 32, height: 32 }}>
              <PhoneIcon />
            </Avatar>
            <ListItemText
              primary={customerPhone}
              slotProps={{
                primary: { variant: 'body1', fontWeight: 500 },
              }}
            />
          </MuiListItem>
        </MuiList>
      </MuiStack>
    </MuiPaper>
  );
};
