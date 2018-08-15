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
    showAllRows();
});

function showAllRows() {
    connection.query(
        'SELECT * FROM products',
        function(error, response) {
            if (error) throw error;
            //console.log(response);
            console.log('item_id', '|', 'product_name', '|', 'department_name', '|', 'price', '|', 'stock_quantity');
            for (var i = 0; i < response.length; i++) {
                console.log(response[i].item_id + ' | ' + response[i].product_name + ' | ' + response[i].department_name + ' | ' + response[i].price +  ' | ' + response[i].stock_quantity);
            }
            inquirer.prompt([
                {
                    name: 'productID',
                    message: 'Which product would you like to buy? '
                },
                {
                    name: 'quantity',
                    message: 'How many would you like to buy? '
                }
            ]).then(function(reply) {
                var x = 0;
                var isFound = false;
                while (x < response.length && !isFound) {
                    if (parseInt(reply.productID) === response[x].item_id) {
                        isFound = true;
                    } else {
                        x++;
                    }
                }
                if (isFound) {
                    var quantInt = parseInt(reply.quantity);
                    if (!isNaN(quantInt)) {
                        connection.query(
                            'SELECT stock_quantity FROM products WHERE item_id = ?',
                            reply.productID,
                            function(error, res) {
                                if (error) throw error;
                                if (res[0].stock_quantity >= reply.quantity) {
                                    var newQuant = parseInt(res[0].stock_quantity) - parseInt(reply.quantity);
                                    connection.query(
                                        'UPDATE products SET stock_quantity = ? WHERE item_id = ?',
                                        [newQuant, reply.productID],
                                        function(error, updateRes) {
                                            if (error) throw error;
                                            console.log(updateRes.message);
                                            var total;
                                            connection.query(
                                                'SELECT price FROM products WHERE item_id = ?',
                                                reply.productID,
                                                function(error, res) {
                                                    if (error) throw error;
                                                    total = parseFloat(res[0].price) * parseInt(reply.quantity); 
                                                    console.log('Thank you for your purchase of $' + total);
                                                    //showAllRows();
                                                    promptAgain();
                                                }
                                            ); 
                                        }
                                    );
                                } else {
                                    console.log('\nInsufficient Quantity.\n');
                                    showAllRows();
                                }
                            }
                        );
                    } else {
                        console.log('\nError. Invalid quantity.\n');
                        showAllRows();
                    }
                } else {
                    console.log("\nI'm sorry, product id #" + reply.productID + ' was not found in the inventory.');
                    console.log('Please select another product to purchase.\n');
                    showAllRows();
                }
            });
        }
    );
}

function promptAgain() {
    inquirer.prompt({
        type: 'confirm',
        message: 'Do you want to purchase another item? ',
        name: 'again'
    }).then(function(response) {
        //console.log(response.again);
        if (response.again) {
            showAllRows();
        } else {
            console.log('Thank you for visiting. Goodbye');
            connection.end();
        }
    });
}