'use client';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { JSX } from 'react';
import { MuiBox, MuiButton, MuiListItemButton, MuiListItemText } from 'shared/ui/mui';
import { LayoutGroup, motion } from 'framer-motion';
import { AddonRuleDetail } from 'modules/admin/rules/entities';
import AddIcon from './icons/add.svg';

export const RulesScreen = ({ rules }: { rules: AddonRuleDetail[] }): JSX.Element => {
  const pathname = usePathname();
  const lastSegment = pathname.split('/').pop();

  const isCreating = lastSegment === 'create';
  const currentId = isCreating ? null : Number(lastSegment);

  return (
    <MuiBox sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
      <MuiButton
        component={Link}
        href="/admin/rules/create"
        variant="contained"
        color="info"
        startIcon={<AddIcon />}
        disabled={isCreating} // Чтобы не кликали дважды
      >
        Создать правило
      </MuiButton>

      <LayoutGroup>
        <MuiBox sx={{ width: 300 }}>
          {/* ОПТИМИСТИЧНЫЙ ПУНКТ: Показываем только если создаем */}
          {isCreating && (
            <MuiListItemButton selected={true} sx={{ borderLeft: '3px solid', borderColor: 'info.main' }}>
              <MuiBox component={motion.div} layoutId="active-pill" />
              <MuiListItemText primary="Новое правило" secondary="Заполните данные справа" />
            </MuiListItemButton>
          )}

          {rules.map((r): JSX.Element => {
            const isActive = currentId === r.id;

            return (
              <MuiListItemButton
                key={r.id}
                component={Link}
                href={`/admin/rules/${r.id}`}
                selected={isActive}
                sx={{
                  transition: 'all 0.2s ease-in-out',
                  borderLeft: '3px solid',
                  borderColor: isActive ? 'info.main' : 'transparent',
                }}
              >
                {isActive && <MuiBox component={motion.div} layoutId="active-pill" />}
                <MuiListItemText primary={r.title} />
              </MuiListItemButton>
            );
          })}
        </MuiBox>
      </LayoutGroup>
    </MuiBox>
  );
};
