/**
 * Вычисляет ограничения на добавки на основе количества родительского товара и параметров правила.
 *
 * Возвращает:
 * - `max_free`: максимально допустимое количество бесплатных добавок
 * - `show_count`: сколько добавок показать пользователю по умолчанию
 *
 * @param quantity Количество родительского товара
 * @param base_count Базовое количество бесплатных добавок
 * @param divisor Делитель количества для расчёта кратности
 * @param show_count_percent Процент отображаемых добавок
 *
 * @returns Объект с полями `max_free` и `show_count`
 *
 * @example
 * calculateQuantity(2, 1, 1, 100);
 * // => { max_free: 2, show_count: 2 }
 */
export const calculateQuantity = (
  quantity: number,
  base_count: number,
  divisor: number,
  show_count_percent: number,
): {
  max_free: number;
  show_count: number;
} => {
  const max_free = (quantity / divisor) * base_count;
  return {
    max_free,
    show_count: max_free * (show_count_percent / 100),
  };
};

/**
 * Округляет число до ближайшего целого, но не меньше `1`.
 *
 * Гарантирует, что даже нулевые или близкие к нулю значения возвращают хотя бы `1`.
 * Используется при расчётах количества добавок, чтобы избежать пустых значений.
 *
 * @param value Значение, которое нужно округлить
 * @returns {number} Округлённое число, минимум 1
 *
 * @example
 * roundMinOne(0); // 1
 * roundMinOne(1.4); // 1
 * roundMinOne(2.7); // 3
 */
export const roundMinOne = (value: number): number => Math.max(1, Math.round(value));
