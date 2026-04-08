type Base = { id: number | string; title: string };
type SelectOption = { value: string; label: string };

export const optionsMapper = {
  options: <T extends Base>(items: T[]): SelectOption[] => {
    return items.map(
      (item): SelectOption => ({
        value: String(item.id),
        label: item.title,
      }),
    );
  },

  defaultSelect: <T extends { id: number | string }>(selected?: T[]): string[] => {
    if (!selected) return [];
    return selected.map((item): string => String(item.id));
  },
};
