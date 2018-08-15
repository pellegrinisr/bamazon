var inquirer = require('inquirer');
var mysql = require('mysql');

var connection = mysql.createConnection({
    host: 'localhost',
    port: 3306,
    user: 'root',
    password: 'root',
    database: 'bamazon'
});

connection.connect(function(error) {
    if (error) throw error;
    console.log('Connected as id ' + connection.threadId + '\n');
    initialPrompt();
});

function initialPrompt() {
    inquirer.prompt({
        name: 'firstPrompt',
        type: 'list',
        message: 'Choose an option: ',
        choices: ['View Products for Sale', 'View Low Inventory', 'Add to Inventory', 'Add New Product']
    }).then(function(response) {
        if (response.firstPrompt === 'View Products for Sale') {
            displayAllProducts();
        } else if (response.firstPrompt === 'View Low Inventory') {
            viewLowInventory();
        } else if (response.firstPrompt === 'Add to Inventory') {
            addToInventory();
        } else if (response.firstPrompt === 'Add New Product') {

        } else {
            console.log('Goodbye.');
            connection.end();
        }
    });
}

function displayAllProducts() {
    connection.query(
        'SELECT * FROM products',
        function(error, reply) {
            if (error) throw error;
            console.log('item_id', '|', 'product_name', '|', 'department_name', '|', 'price', '|', 'stock_quantity');
            for (var i = 0; i < reply.length; i++) {
                console.log(reply[i].item_id + ' | ' + reply[i].product_name + ' | ' + reply[i].department_name + ' | ' + reply[i].price +  ' | ' + reply[i].stock_quantity);
            }
            initialPrompt();
        }
    );
}

function viewLowInventory() {
    connection.query(
        'SELECT * FROM products WHERE stock_quantity < 5',
        function(error, res) {
            if (error) throw error;
            console.log('item_id', '|', 'product_name', '|', 'department_name', '|', 'price', '|', 'stock_quantity');
            for (var i = 0; i < res.length; i++) {
                console.log(res[i].item_id + ' | ' + res[i].product_name + ' | ' + res[i].department_name + ' | ' + res[i].price +  ' | ' + res[i].stock_quantity);
            }
            initialPrompt();
        }
    )
}

function addToInventory() {
    inquirer.prompt([
        {
            name: 'itemNum', 
            message: 'Enter the item number you wish to update: '
        },
        {
            name: 'quant',
            message: 'Enter the quantity to be added: '
        }
    ]).then(function(response) {
        connection.query(
            'SELECT * FROM products',
            function(error, data) {
                if (error) throw error;
                var x = 0;
                var isFound = false;
                while (x < data.length && !isFound) {
                    if (parseInt(response.itemNum) === data[x].item_id) {
                        isFound = true;
                    } else {
                        x++;
                    }
                }
                if (isFound) {
                    var quantInt = parseInt(response.quant);
                    if (!isNaN(quantInt)) {
                        connection.query(
                            'SELECT stock_quantity FROM products WHERE item_id = ?',
                            response.itemNum,
                            function(error, res) {
                                if (error) throw error;
                                var newQuant = parseInt(res[0].stock_quantity) + quantInt;
                                connection.query(
                                    'UPDATE products SET stock_quantity = ? WHERE item_id = ?',
                                    [newQuant, response.itemNum],
                                    function(error, data) {
                                        if (error) throw error;
                                        console.log(data.message);
                                        initialPrompt();
                                    }
                                );
                            }
                        );
                    } else {
                        console.log('\nError. Invalid Quantity.\n');
                        addToInventory();
                    }
                } else {
                    console.log("\nI'm sorry, product id #" + response.itemNum + ' was not found in the inventory.')
                    console.log('Please select another product.');
                    addToInventory();
                }
            }
        );
    });
}

function addNewProduct() {
    
}