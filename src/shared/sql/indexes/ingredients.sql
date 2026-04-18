CREATE UNIQUE INDEX idx_ingredient_title_unique ON ingredient (LOWER(TRIM(title)));

-- 1. Создаем функцию-фильтр
CREATE OR REPLACE FUNCTION clean_ingredient_title() RETURNS trigger AS $$
BEGIN
    NEW.title := LOWER(TRIM(NEW.title));
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 2. Вешаем её на таблицу
CREATE TRIGGER trg_clean_title
    BEFORE INSERT OR UPDATE ON ingredient
    FOR EACH ROW EXECUTE FUNCTION clean_ingredient_title();