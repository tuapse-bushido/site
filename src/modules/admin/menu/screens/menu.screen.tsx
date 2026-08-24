import { JSX } from 'react';
import Link from 'next/link';
import { DashboardStats } from '../model';
import { getMenuDashboardConfig } from './menu-screen.config';
import { PageContainer } from '../../shared/ui/page-container';
import { MuiAvatar, MuiBox, MuiCard, MuiCardActionArea, MuiGrid, MuiTypography } from 'modules/admin/shared/ui/mui';

type Props = {
  stats: DashboardStats;
};
export const MenuScreen = ({ stats }: Props): JSX.Element => {
  const menuConfig = getMenuDashboardConfig(stats);

  return (
    <PageContainer title={'Меню'}>
      <MuiGrid container spacing={3} sx={{ px: { xs: 1, sm: 2, md: 0 }, pr: { md: 2 }, pb: 1 }}>
        {menuConfig.map(
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
    </PageContainer>
  );
};
