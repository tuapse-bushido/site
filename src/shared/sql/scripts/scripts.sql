DROP TABLE IF EXISTS order_item;
DROP TABLE IF EXISTS order_daily_counter;
DROP TABLE IF EXISTS "order";
DROP TABLE IF EXISTS "user";

CREATE TABLE users (
                       id SERIAL PRIMARY KEY,
                       name VARCHAR(100) NOT NULL
);

DROP TYPE IF EXISTS order_status;
CREATE TYPE order_status AS ENUM ('new', 'in_progress', 'sent', 'done', 'canceled');

DROP TYPE IF EXISTS order_type;
CREATE TYPE order_type AS ENUM ('delivery', 'pickup');

DROP TYPE IF EXISTS payment_type;
CREATE TYPE payment_type AS ENUM ('courier', 'pickup');

DROP TYPE IF EXISTS payment_status;
CREATE TYPE payment_status AS ENUM ('paid', 'not_paid');

CREATE TABLE orders (
                        id SERIAL PRIMARY KEY,
                        order_number VARCHAR(20) UNIQUE NOT NULL,

                        customer_name VARCHAR(50),
                        customer_phone VARCHAR(20) NOT NULL,
                        user_id INTEGER REFERENCES users(id),

    -- Адрес
                        address_city TEXT,
                        address_street TEXT,
                        address_house TEXT,
                        address_apartment TEXT,
                        address_floor TEXT,
                        address_entrance TEXT,
                        address_intercom TEXT,

                        total_price NUMERIC(8, 2) NOT NULL,

                        payment_status payment_status NOT NULL DEFAULT 'not_paid',
                        order_type order_type NOT NULL DEFAULT 'delivery',
                        payment_type payment_type NOT NULL DEFAULT 'courier',
                        status order_status NOT NULL DEFAULT 'new',

                        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE order_item (
                            id SERIAL PRIMARY KEY,
                            order_id INTEGER NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
                            product_id INTEGER NOT NULL REFERENCES product(id),
                            quantity_total INTEGER NOT NULL CHECK (quantity_total > 0),
                            quantity_free INTEGER NOT NULL DEFAULT 0
                                CHECK (quantity_free >= 0 AND quantity_free <= quantity_total),
                            unit_price NUMERIC(10, 2) NOT NULL,
                            total_price NUMERIC(10, 2) NOT NULL
);

CREATE TABLE order_daily_counter (
                                     order_date DATE PRIMARY KEY,
                                     counter INTEGER NOT NULL DEFAULT 0
);