-- TODO - create schema
DROP TABLE IF EXISTS reservations;
DROP TABLE IF EXISTS orders_menu_items;
DROP TABLE IF EXISTS orders;
DROP TABLE IF EXISTS menu_items;
DROP TABLE IF EXISTS menu_item_types;
DROP TABLE IF EXISTS reservation_types;
DROP TABLE IF EXISTS cats;
DROP TABLE IF EXISTS users;

CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    username TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    first_name TEXT NOT NULL,
    last_name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    is_admin BOOLEAN DEFAULT FALSE
);

CREATE TABLE cats (
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    age INT NOT NULL,
    sex CHAR(1) NOT NULL CHECK (sex IN ('M', 'F')),
    breed TEXT NOT NULL,
    description TEXT NOT NULL,
    image_url TEXT
);

CREATE TABLE reservation_types (
    id SERIAL PRIMARY KEY,
    type TEXT UNIQUE NOT NULL,
    description TEXT NOT NULL,
    cost DECIMAL(5, 2) NOT NULL,
    time_length INT NOT NULL
);

CREATE TABLE menu_item_types (
     id SERIAL PRIMARY KEY,
     type TEXT UNIQUE NOT NULL
);

CREATE TABLE menu_items (
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    type_id INT NOT NULL REFERENCES menu_item_types(id),
    description TEXT NOT NULL,
    unit_price DECIMAL(4, 2) NOT NULL,
    image_url TEXT,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE orders (
    id SERIAL PRIMARY KEY,
    user_id INT NOT NULL REFERENCES users(id)
    ON DELETE CASCADE,
    date TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

CREATE TABLE orders_menu_items (
    order_id INT NOT NULL REFERENCES orders(id)
    ON DELETE CASCADE,
    menu_item_id INT NOT NULL REFERENCES menu_items(id)
    ON DELETE CASCADE,
    quantity INT NOT NULL
);

CREATE TABLE reservations (
    id SERIAL,
    user_id INT NOT NULL REFERENCES  users(id)
    ON DELETE CASCADE,
    reservation_type_id INT NOT NULL REFERENCES reservation_types(id)
    ON DELETE CASCADE,
    start_time TIMESTAMPTZ NOT NULL,
    end_time TIMESTAMPTZ NOT NULL
);