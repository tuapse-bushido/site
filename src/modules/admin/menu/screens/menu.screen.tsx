import { JSX } from 'react';
import { MuiAvatar, MuiBox, MuiCard, MuiCardActionArea, MuiGrid, MuiTypography } from 'modules/admin/shared/ui/mui';
import { MenuConfig } from 'modules/admin/menu/screens/menu-screen.config';
import Link from 'next/link';

type Props = {
  menu: MenuConfig[];
};

export const MenuScreen = ({ menu }: Props): JSX.Element => {
  return (
    <MuiGrid container spacing={3}>
      {menu.map(
        (card): JSX.Element => (
          <MuiGrid size={{ xs: 12, md: 4 }} key={card.href}>
            <Link href={card.href}>
              <MuiCardActionArea>
                <MuiCard sx={{ p: 3, display: 'flex', alignItems: 'center', gap: 3 }}>
                  <MuiAvatar sx={{ bgcolor: card.bg, width: 60, height: 60 }}>{card.icon}</MuiAvatar>
                  <MuiBox>
                    <MuiTypography variant="h5" fontWeight="bold">
                      {card.count}
                    </MuiTypography>
                    <MuiTypography variant="body2" color="text.secondary">
                      {card.title}
                    </MuiTypography>
                  </MuiBox>
                </MuiCard>
              </MuiCardActionArea>
            </Link>
          </MuiGrid>
        ),
      )}
    </MuiGrid>
  );
};
