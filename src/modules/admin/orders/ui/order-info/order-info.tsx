import { JSX } from 'react';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import { FullOrder } from 'modules/admin/orders/entities';

type OrderInfoProps = {
  order: FullOrder;
};

export const OrderInfo = ({ order }: OrderInfoProps): JSX.Element => {
  return (
    <Grid container spacing={3} sx={{ mb: 4 }}>
      <Grid>
        <Typography variant="h6" gutterBottom>
          Детали заказа
        </Typography>
        <Box>
          <Typography variant="body2" color="text.secondary">
            Номер:
          </Typography>
          <Typography variant="body1">№{order.order_number}</Typography>
        </Box>
        <Box>
          <Typography variant="body2" color="text.secondary">
            Тип заказа:
          </Typography>
          <Typography variant="body1">{order.order_type}</Typography>
        </Box>
        <Box>
          <Typography variant="body2" color="text.secondary">
            Статус:
          </Typography>
          <Typography variant="body1">{order.status}</Typography>
        </Box>
      </Grid>

      <Grid>
        <Typography variant="h6" gutterBottom>
          Клиент
        </Typography>
        <Box>
          <Typography variant="body2" color="text.secondary">
            Имя:
          </Typography>
          <Typography variant="body1">{order.customer_name || '—'}</Typography>
        </Box>
        <Box sx={{ mt: 1 }}>
          <Typography variant="body2" color="text.secondary">
            Телефон:
          </Typography>
          <Typography variant="body1">{order.customer_phone}</Typography>
        </Box>
        <Box sx={{ mt: 1 }}>
          <Typography variant="body2" color="text.secondary">
            Оплата:
          </Typography>
          <Typography variant="body1">
            {order.payment_status} ({order.payment_type})
          </Typography>
        </Box>
      </Grid>

      <Grid size={{ xs: 12, md: 4 }}>
        <Typography variant="h6" gutterBottom>
          Адрес доставки
        </Typography>
        {order.address_city ? (
          <>
            <Typography variant="body1">
              {order.address_city}, {order.address_street}, д. {order.address_house}
            </Typography>
            <Grid container sx={{ mt: 1 }}>
              <Grid>
                <Typography variant="caption" color="text.secondary">
                  Кв/Оф:
                </Typography>
                <Typography variant="body2">{order.address_apartment || '—'}</Typography>
              </Grid>
              <Grid>
                <Typography variant="caption" color="text.secondary">
                  Этаж:
                </Typography>
                <Typography variant="body2">{order.address_floor || '—'}</Typography>
              </Grid>
              <Grid>
                <Typography variant="caption" color="text.secondary">
                  Подъезд:
                </Typography>
                <Typography variant="body2">{order.address_entrance || '—'}</Typography>
              </Grid>
              <Grid>
                <Typography variant="caption" color="text.secondary">
                  Домофон:
                </Typography>
                <Typography variant="body2">{order.address_intercom || '—'}</Typography>
              </Grid>
            </Grid>
          </>
        ) : (
          <Typography variant="body1">Самовывоз</Typography>
        )}
      </Grid>
    </Grid>
  );
};
