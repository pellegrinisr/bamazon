DROP DATABASE IF EXISTS bamazon;
CREATE DATABASE bamazon;
USE bamazon;
CREATE TABLE products (
    item_id INTEGER NOT NULL AUTO_INCREMENT PRIMARY KEY,
    product_name VARCHAR(100),
    department_name VARCHAR(100),
    price FLOAT(8,2),
    stock_quantity INTEGER(10)
);