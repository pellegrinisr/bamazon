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

The `bamazonCustomer.js` application provides a user interface for customers to order products from the storefont.

After running `node bamazonCustomer.js`, the user sees a table displaying the current inventory in our store.  This data is stored in a mysql database.

![Customer Interface First Pic](screenshots/customerFirst.png)

The user then either enters the product number corresponding to the product he or she wants to buy.

![Customer Interface Second Pic](screenshots/customerSecond.png)

After receiving a quantity, the application calculates and displays the total order cost to the user. This data is added to the `product_sales` column in the products table of our database.  The quanity is also updated.  Finally, the user must choose whether to order additional items or exit the application.

![Customer Interface Third Pic](screenshots/customerThird.png)

If the user answers yes, the tabe data is again displayed to the user. Note how the `stock_quantity` and `product_sales` columns for the product with `item_id` of 1 are updated.

![Customer Interface Fourth Pic](screenshots/customerFourth.png)

Let's try to order more of a product that we have in stock.  This will demonstrate the application's error checking capabilities.

![Customer Interface Fifth Pic](screenshots/customerFifth.png)

Answering 'no' when asked to make another purchase exits the program.

![Customer Interface Sixth Pic](screenshots/customerSixth.png)

Let's say you ran the program and you don't want to make a purchase, or you accidentally responsed 'yes' when asked to make another purchase. Simply enter 0 when prompted for the product to order, and the program exits.

![Customer Interface Seventh Pic](screenshots/customerSeventh.png)


## Demonstrating the Manager Interface

The `bamazonManager.js` application provides various tools for an employee to manage inventory in our store. 

After executing the application, the user is presented with five options.

![Manager Interface First Pic](screenshots/managerFirst.png)

I will now demonstrate each of the options.  

* The first option, `View Products for Sale`, simply displays the current inventory to the screen. Note how the initial menu is again displayed.

![Manager Interface Second Pic](screenshots/managerSecond.png)

* The second option, `View Low Inventory`, displays all products with an inventory count lower than 5.

![Manager Interface Third Pic](screenshots/managerThird.png)

* Using the third option, `Add to Inventory`, an employee can update an item's inventory quantity.:  
    1. First, they are asked to enter the item number corresponding to to the product they wish to update.

    ![Manager Interface Fourth Pic](screenshots/managerFourth.png)