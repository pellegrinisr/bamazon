# Bamazon

Bamazon is command line storefront featuring three distinct user interfaces.

* Bamazon Customer
* Bamazon Manager
* Bamazon Supervisor

As the names imply, each interface targets a different type of user. The customer interface allows users to place orders, the manager interface allows users to view and update inventory, and the supervisor view shows accounting data for the different departments.

## Getting Started

Clone this repository and be sure you have node installed in your environment. Run `npm init` and `npm install` in the local directory.

This application requires the npm inquirer package as well as the npm mysql package.

## Important

For testing purposes, make sure you have mysql installed on your local environment.  This application uses a mysql database running on the localhost.

However, the code will work if your mysql database is running on a remote server.  Just be sure to change the connection parameters in each .js file.

![Connection Params Image](screenshots/connectionParams.png)

## Demonstrating the Customer Interface

After running `node bamazonCustomer.js`, the user sees a table displaying the current inventory in our store.  This data is stored in a mysql database.

![Customer Interface First Pic](screenshots/customerFirst.png)

The user then either enters the product number corresponding to the product he or she wants to buy.

![Customer Interface Second Pic](screenshots/customerSecond.png)

After receiving a quantity, the application calculates and displays the total order cost to the user. This data is added to the `product_sales` column in the products table of our database.  The quanity is also updated.  Finally, the user must choose whether to order additional items or exit the application.

![Customer Interface Third Pic](screenshots/customerThird.png)

If the user answers yes, the tabe data is again displayed to the user. Note how the `stock_quantity` and `product_sales` columns for the product with `item_id` of 1 are updated.

![Customer Interface Fourth Pic](screenshots/customerFourth.png)