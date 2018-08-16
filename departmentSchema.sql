USE bamazon;

CREATE TABLE departments (
    department_id INTEGER AUTO_INCREMENT PRIMARY KEY,
    department_name VARCHAR(100),
    over_head_costs FLOAT(12,2)
);

ALTER TABLE products
ADD (product_sales FLOAT(15,2));
