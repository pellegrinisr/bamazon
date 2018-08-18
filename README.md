# Bamazon

Bamazon is command line storefront featuring three distinct user interfaces.

* Bamazon Customer
* Bamazon Manager
* Bamazon Supervisor

As the names imply, each interface targets a different type of user. The customer interface allows users to place orders, the manager interface allows users to view and update inventory, and the supervisor view shows accounting data for the different departments.

## Getting Started

Clone this repository and be sure to run `npm init` and `npm install` in the local directory.

This application requires the npm inquirer package as well as the npm mysql package.

## Important

For testing purposes, make sure you have mysql installed on your local environment.  This application uses a mysql database running on the localhost.

However, the code will work if your mysql database is running on a remote server.  Just be sure to change the connection parameters in each .js file.

![Connection Params Image](screenshots/connectionParams.png)

## Demonstrating the Customer Interface