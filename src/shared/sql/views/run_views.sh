#!/usr/bin/env sh

set -e  # остановить выполнение при любой ошибке

DB_HOST="localhost"
DB_PORT="5432"
DB_NAME="bushido"
DB_USER="admin"

VIEWS_DIR="./product-card"

echo "▶️ Applying product-card views..."

psql \
  -h "$DB_HOST" \
  -p "$DB_PORT" \
  -U "$DB_USER" \
  -d "$DB_NAME" \
  -v ON_ERROR_STOP=1 <<EOF
\i $VIEWS_DIR/00_drop_all_view.sql
\i $VIEWS_DIR/01_product_ingredients_view.sql
\i $VIEWS_DIR/02_product_categories_view.sql
\i $VIEWS_DIR/03_product_discount_percent_view.sql
\i $VIEWS_DIR/04_addon_rule_with_addons_view.sql
\i $VIEWS_DIR/05_addon_rules_to_products_view.sql
\i $VIEWS_DIR/06_addon_rules_to_categories_view.sql
\i $VIEWS_DIR/07_set_items_with_ingredients_view.sql
\i $VIEWS_DIR/08_product_card_view.sql
EOF

echo "✅ All product-card views applied successfully"
