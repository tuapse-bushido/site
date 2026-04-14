/**
 * Trigger function to automatically update `quantity`, `count_portion`, and `weight`
 * in a set product when its composition changes.
 *
 * Technical specifications:
 * - Triggered on: INSERT, UPDATE, DELETE on `set_item`
 * - Affected table: `product` (only where `is_set = true`)
 * - Calculations:
 *     - quantity: sum of `quantity` from `set_item` entries
 *     - count_portion: sum of portion count * quantity for active products
 *     - weight: sum of weight * quantity for active products
 * - Works for all operations (INSERT/UPDATE/DELETE) via `TG_OP`
 *
 * ---
 *
 * Триггер-функция для автоматического обновления `quantity`, `count_portion` и `weight`
 * у продукта-набора при изменении его состава (`set_item`).
 *
 * Технические характеристики:
 * - Срабатывает при: INSERT, UPDATE, DELETE по таблице `set_item`
 * - Обновляет: таблицу `product` (только записи `is_set = true`)
 * - Логика расчётов:
 *     - quantity: сумма количества позиций в составе
 *     - count_portion: сумма порций активных продуктов с учётом количества
 *     - weight: суммарный вес активных продуктов с учётом количества
 * - Обрабатывает все типы операций через `TG_OP`
 *
 * @trigger
 * AFTER INSERT OR UPDATE OR DELETE ON set_item
 * FOR EACH ROW
 *
 * @example
 * -- Adding or removing items from a set will automatically update the set product:
 * INSERT INTO set_item (set_product_id, product_id, quantity) VALUES (101, 205, 2);
 * -- → product.id = 101 will be updated automatically
 */
CREATE OR REPLACE FUNCTION update_set_properties()
    RETURNS TRIGGER AS
$$
DECLARE
    set_id INTEGER;
BEGIN
    IF (TG_OP = 'DELETE') THEN
        set_id := OLD.set_product_id;
    ELSE
        set_id := NEW.set_product_id;
    END IF;

    UPDATE product
    SET quantity      = (SELECT COALESCE(SUM(si.quantity), 0)
                         FROM set_item si
                         WHERE si.set_product_id = set_id),
        count_portion = (SELECT COALESCE(SUM(p.count_portion * si.quantity), 0)
                         FROM set_item si
                                  JOIN product p ON p.id = si.product_id
                         WHERE si.set_product_id = set_id
                           AND p.is_active = true),
        weight        = (SELECT COALESCE(SUM(p.weight * si.quantity), 0)
                         FROM set_item si
                                  JOIN product p ON p.id = si.product_id
                         WHERE si.set_product_id = set_id
                           AND p.is_active = true)
    WHERE id = set_id;

    RETURN NULL;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_update_set_properties
    AFTER INSERT OR UPDATE OR DELETE
    ON set_item
    FOR EACH ROW
EXECUTE FUNCTION update_set_properties();
