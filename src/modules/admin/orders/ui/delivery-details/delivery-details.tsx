import { JSX } from 'react';
import { LocationIcon, PaymentIcon } from './icons';
import {
  MuiAvatar,
  MuiDivider,
  MuiList,
  MuiListItem,
  MuiListItemText,
  MuiPaper,
  MuiStack,
  MuiTypography,
} from 'modules/admin/shared/ui/mui';

type Props = {
  fullAddress: string;
  paymentType: string;
};

export const DeliveryDetails = ({ fullAddress, paymentType }: Props): JSX.Element => {
  return (
    <MuiPaper sx={{ py: 3, borderRadius: 3 }}>
      <MuiStack gap={3}>
        <MuiTypography variant="h5" fontWeight={600} sx={{ px: 3 }}>
          Логистика и оплата
        </MuiTypography>

        <MuiDivider />

        <MuiList disablePadding sx={{ px: 3 }}>
          <MuiListItem sx={{ py: 1, gap: 1.5 }} disableGutters>
            <MuiAvatar sx={{ bgcolor: 'inherit', color: 'black', width: 32, height: 32 }}>
              <LocationIcon />
            </MuiAvatar>
            <MuiListItemText
              primary={fullAddress}
              slotProps={{
                primary: { variant: 'body1', fontWeight: 500 },
              }}
            />
          </MuiListItem>
          <MuiListItem sx={{ py: 1, gap: 1.5 }} disableGutters>
            <MuiAvatar sx={{ bgcolor: 'inherit', color: 'black', width: 32, height: 32 }}>
              <PaymentIcon />
            </MuiAvatar>
            <MuiListItemText
              primary={paymentType}
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
