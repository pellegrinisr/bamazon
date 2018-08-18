var inquirer = require('inquirer');
var mysql = require('mysql');
var separator = '******************************************************************************************************';

var connection = mysql.createConnection({
    host: 'localhost',
    port: 3306,
    user: 'root',
    password: 'root',
    database: 'bamazon'
});

connection.connect(function(error) {
    if (error) throw error;
    console.log('\nConnected as id ' + connection.threadId);
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
            var idArray = [];
            console.log('\nitem_id', '|', name.padEnd(30, ' '), '|', 'department_name', '|', price.padEnd(8, ' '), '|', 'stock_quantity', '|', 'product_sales');
            console.log(separator);
            for (var i = 0; i < response.length; i++) {
                idArray.push(response[i].item_id);
                var sales;
                if (response[i].product_sales === null) {
                    sales = 0;
                } else {
                    sales = response[i].product_sales;
                }
                var output = [
                    response[i].item_id.toString().padEnd(7, ' '),
                    ' | ',
                    response[i].product_name.padEnd(30, ' '),
                    ' | ',
                    response[i].department_name.padEnd(15, ' '),
                    ' | ', 
                    response[i].price.toFixed(2).padEnd(8, ' '),
                    ' | ',
                    response[i].stock_quantity.toString().padEnd(14, ' '),
                    ' | ',
                    sales.toFixed(2)
                ].join(''); 
                //console.log(response[i].item_id + ' | ' + response[i].product_name + ' | ' + response[i].department_name + ' | ' + response[i].price +  ' | ' + response[i].stock_quantity + ' | ' + response[i].product_sales);
                console.log(output);
            }
            getProductID(idArray);
        }  
    );
}

function getProductID(varArray) {
    console.log();
    inquirer.prompt([
        {
            name: 'productID',
            message: 'Which product would you like to buy? Enter 0 to Exit: '
        }
    ]).then(function(reply) {
        if (parseInt(reply.productID) === 0) {
            console.log('Goodbye');
            connection.end();
        } else {
            var x = 0;
            var isFound = false;
            while (x < varArray.length && !isFound) {
                if (parseInt(reply.productID) === varArray[x]) {
                    isFound = true;
                } else {
                    x++;
                }
            }
            if(isFound) {
                getQuantity(reply.productID);
            } else {
                console.log("\nI'm sorry, product id #" + reply.productID + ' was not found in the inventory.');
                showAllRows();
            } 
        }
    });
}

function getQuantity(productID) {
    inquirer.prompt({
        name: 'quantity',
        message: 'How many would you like to buy? '
    }).then(function(replyQuant) {
        var quantInt = parseInt(replyQuant.quantity);
        if (!isNaN(quantInt)) {
            queryQuant(productID, replyQuant.quantity);
        } else {
            console.log('\nError. Invalid quantity.\n');
            showAllRows();
        }
    });
}

function queryQuant(id, quant) {
    connection.query(
        'SELECT stock_quantity FROM products WHERE item_id = ?',
        id,
        function(error, res) {
            if (error) throw error;
            if (res[0].stock_quantity >= quant && quant >= 0) {
                var newQuant = parseInt(res[0].stock_quantity) - parseInt(quant);
                connection.query(
                    'UPDATE products SET stock_quantity = ? WHERE item_id = ?',
                    [newQuant, id],
                    function(error, updateRes) {
                        if (error) throw error;
                        // console.log(updateRes.message);
                        var total;
                        connection.query(
                            'SELECT price FROM products WHERE item_id = ?',
                            id,
                            function(error, res) {
                                if (error) throw error;
                                total = parseFloat(res[0].price) * parseInt(quant); 
                                console.log('Thank you for your purchase of $' + total.toFixed(2));
                                connection.query(
                                    'UPDATE products SET product_sales = ? WHERE item_id = ?',
                                    [total, id],
                                    function(error, data) {
                                        if (error) throw error;
                                        // console.log('product_sales updated');
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