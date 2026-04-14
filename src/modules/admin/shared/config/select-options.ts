export const selectOptions = {
  is_active: {
    default: 'false',
    options: [
      { value: 'true', label: 'Активно' },
      { value: 'false', label: 'Неактивно' },
    ],
  },
  is_visible: {
    default: 'true',
    options: [
      { value: 'true', label: 'Видим' },
      { value: 'false', label: 'Скрыт' },
    ],
  },
  is_set: {
    default: 'false',
    options: [
      { value: 'true', label: 'Сет' },
      { value: 'false', label: 'Блюдо' },
    ],
  },
} as const;

export type SelectOptionKey = keyof typeof selectOptions;

export function getSelectValue(option: SelectOptionKey, value: boolean | undefined): string {
  return value === undefined ? selectOptions[option].default : String(value);
}
