import { GridColDef } from '@mui/x-data-grid';

import { Order } from 'modules/admin/orders/entities';
import { AddonRule } from 'modules/admin/rules/entities';
import { Product } from 'modules/admin/menu/products/entities';
import { Category } from 'modules/admin/menu/categories/entities';
import { Ingredient } from 'modules/admin/menu/ingredients/entities';

import { orderColumns } from 'modules/admin/orders/config';
import { addonRuleColumns } from 'modules/admin/rules/config';
import { productColumns } from 'modules/admin/menu/products/config';
import { categoryColumns } from 'modules/admin/menu/categories/config';

type EntityMap = {
  ingredients: Ingredient;
  categories: Category;
  orders: Order;
  products: Product;
  addonRules: AddonRule;
};

type TableSlug = keyof EntityMap;

type TableSchema<T> = {
  label: {
    plural: string;
    singular: string;
  };
  searchKey: keyof T;
  href: {
    create?: string;
    edit: (id: string | number) => string;
  };
  columns: GridColDef[];
};

export const TABLE_CONFIG: { [K in TableSlug]: TableSchema<EntityMap[K]> } = {
  ingredients: {
    label: {
      plural: 'Ингредиенты',
      singular: 'ингредиент',
    },
    searchKey: 'title',
    href: {
      create: '/admin/menu/ingredients/create',
      edit: (id): string => `/admin/menu/ingredients/${id}`,
    },
    columns: [
      { field: 'id', headerName: 'ID', width: 100 },
      { field: 'title', headerName: 'Название', flex: 1, minWidth: 150 },
    ],
  },
  categories: {
    label: {
      plural: 'Категории',
      singular: 'категорию',
    },
    searchKey: 'title',
    href: {
      create: '/admin/menu/categories/create',
      edit: (id): string => `/admin/menu/categories/${id}`,
    },
    columns: categoryColumns,
  },
  orders: {
    label: {
      plural: 'Категории',
      singular: 'категорию',
    },
    searchKey: 'status',
    href: {
      edit: (id): string => `/admin/orders/${id}`,
    },
    columns: orderColumns,
  },
  products: {
    label: {
      plural: 'Продукты',
      singular: 'продукт',
    },
    searchKey: 'title',
    href: {
      create: '/admin/menu/products/create',
      edit: (id): string => `/admin/menu/products/${id}`,
    },
    columns: productColumns,
  },
  addonRules: {
    label: {
      plural: 'Правила',
      singular: 'правило',
    },
    searchKey: 'title',
    href: {
      create: '/admin/rules/create',
      edit: (id): string => `/admin/rules/${id}`,
    },
    columns: addonRuleColumns,
  },
};
