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
            var name = 'product_name';
            var price = 'price';
            console.log('\nitem_id', '|', name.padEnd(30, ' '), '|', 'department_name', '|', price.padEnd(8, ' '), '|', 'stock_quantity', '|', 'product_sales');
            for (var i = 0; i < response.length; i++) {
                var output = [
                    response[i].item_id.toString().padEnd(7, ' '),
                    ' | ',
                    response[i].product_name.padEnd(30, ' '),
                    ' | ',
                    response[i].department_name.padEnd(15, ' '),
                    ' | ', 
                    response[i].price.toString().padEnd(8, ' '),
                    ' | ',
                    response[i].stock_quantity.toString().padEnd(14, ' '),
                    ' | ',
                    response[i].product_sales
                ].join(''); 
                //console.log(response[i].item_id + ' | ' + response[i].product_name + ' | ' + response[i].department_name + ' | ' + response[i].price +  ' | ' + response[i].stock_quantity + ' | ' + response[i].product_sales);
                console.log(output);
            }
            inquirer.prompt([
                {
                    name: 'productID',
                    message: 'Which product would you like to buy? '
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
                    inquirer.prompt({
                        name: 'quantity',
                        message: 'How many would you like to buy? '
                    }).then(function(replyQuant) {
                        var quantInt = parseInt(replyQuant.quantity);
                        if (!isNaN(quantInt)) {
                            connection.query(
                                'SELECT stock_quantity FROM products WHERE item_id = ?',
                                reply.productID,
                                function(error, res) {
                                    if (error) throw error;
                                    if (res[0].stock_quantity >= replyQuant.quantity) {
                                        var newQuant = parseInt(res[0].stock_quantity) - parseInt(replyQuant.quantity);
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
                                                        total = parseFloat(res[0].price) * parseInt(replyQuant.quantity); 
                                                        console.log('Thank you for your purchase of $' + total);
                                                        connection.query(
                                                            'UPDATE products SET product_sales = ? WHERE item_id = ?',
                                                            [total, reply.productID],
                                                            function(error, data) {
                                                                if (error) throw error;
                                                                console.log('product_sales updated');
                                                                promptAgain();
                                                            }
                                                        );
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
                    })
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