import { SelectNew } from 'modules/admin/shared/ui/select-new/select-new';
import { MuiBox, MuiTypography } from 'modules/admin/shared/ui/mui';
import { optionsMapper } from 'modules/admin/menu/products';
import { AddonRuleDetail } from 'modules/admin/rules/entities';
import { Category } from 'modules/admin/menu/categories';
import { Product } from 'modules/admin/menu/products/entities';
import { JSX } from 'react';

type Props = {
  rule: AddonRuleDetail | undefined;
  categories: Category[];
  products: Product[];
};

export const RelationSettings = ({ rule, products, categories }: Props): JSX.Element => {
  return (
    <MuiBox sx={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
      {/* ГРУППА 1: ЧТО ПРЕДЛАГАЕМ */}
      <MuiBox>
        <MuiTypography variant="subtitle1" fontWeight={700} sx={{ mb: 1 }}>
          Состав правила
        </MuiTypography>
        <MuiTypography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 2 }}>
          Выберите продукты, которые будут предлагаться в качестве добавок
        </MuiTypography>
        <SelectNew
          label="Доступные добавки"
          name="addons"
          options={optionsMapper.options(products)}
          defaultSelect={optionsMapper.defaultSelect(rule?.addons)}
          multiple
        />
      </MuiBox>

      {/* ГРУППА 2: К ЧЕМУ ПРИМЕНЯЕМ */}
      <MuiBox>
        <MuiTypography variant="subtitle1" fontWeight={700} sx={{ mb: 1 }}>
          Область применения
        </MuiTypography>
        <MuiTypography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 2 }}>
          Укажите, в каких разделах меню или для каких товаров действует это правило
        </MuiTypography>

        <MuiBox sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
          <SelectNew
            label="Применить к категориям"
            name="categories"
            options={optionsMapper.options(categories)}
            defaultSelect={optionsMapper.defaultSelect(rule?.categories)}
            multiple
          />

          <SelectNew
            label="Применить к конкретным продуктам"
            name="products"
            options={optionsMapper.options(products)}
            defaultSelect={optionsMapper.defaultSelect(rule?.products)}
            multiple
          />
        </MuiBox>
      </MuiBox>
    </MuiBox>
  );
};
