export type SelectOption = {
  value: string;
  label: string;
};

export type ProductOptions = {
  id: number;
  title: string;
};

type LabelParams = {
  id?: string;
  label?: string;
};

export type SelectGroupProps = LabelParams &
  (
    | {
        field: 'ingredients' | 'categories' | 'set' | 'products' | 'addon_products';
        defaultValue: ProductOptions[] | null | undefined;
        options: ProductOptions[];
        isDisabled?: boolean;
      }
    | {
        field: 'is_active' | 'is_visible';
        defaultValue: boolean | undefined;
      }
  );
