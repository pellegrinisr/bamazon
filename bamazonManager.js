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
    console.log('Connected as id ' + connection.threadId + '\n');
    initialPrompt();
});

function initialPrompt() {
    inquirer.prompt({
        name: 'firstPrompt',
        type: 'list',
        message: 'Choose an option: ',
        choices: ['View Products for Sale', 'View Low Inventory', 'Add to Inventory', 'Add New Product', 'Exit']
    }).then(function(response) {
        if (response.firstPrompt === 'View Products for Sale') {
            displayAllProducts();
        } else if (response.firstPrompt === 'View Low Inventory') {
            viewLowInventory();
        } else if (response.firstPrompt === 'Add to Inventory') {
            addToInventory();
        } else if (response.firstPrompt === 'Add New Product') {
            addNewProduct();
        } else {
            console.log('Goodbye.');
            connection.end();
        }
    });
}

function displayAllProducts() {
    connection.query(
        'SELECT * FROM products',
        function(error, response) {
            if (error) throw error;
            //console.log(response);
            var name = 'product_name';
            var price = 'price';
            console.log('\nitem_id', '|', name.padEnd(30, ' '), '|', 'department_name', '|', price.padEnd(8, ' '), '|', 'stock_quantity', '|', 'product_sales');
            console.log(separator);
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
            console.log();
            initialPrompt();
        }
    );
}

function viewLowInventory() {
    connection.query(
        'SELECT * FROM products WHERE stock_quantity < 5',
        function(error, response) {
            if (error) throw error;
            //console.log(response);
            var name = 'product_name';
            var price = 'price';
            console.log('\nitem_id', '|', name.padEnd(30, ' '), '|', 'department_name', '|', price.padEnd(8, ' '), '|', 'stock_quantity', '|', 'product_sales');
            console.log(separator);
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
            console.log();
            initialPrompt();
        }
    );
}

function addToInventory() {
    inquirer.prompt(
        {
            name: 'itemNum', 
            message: 'Enter the item number you wish to update: '
        }
    ).then(function(response) {
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
                    inquirer.prompt({
                        name: 'quant',
                        message: 'Enter the quantity to be added: ' 
                    }).then(function(responseQuant) {
                        var quantInt = parseInt(responseQuant.quant);
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
                    });
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
    inquirer.prompt([
        {
            name: 'name',
            message: 'Enter information about the new product\nName: '
        },
        {
            name: 'department',
            message: 'Department: ',
        }
    ]).then(function(response) {
        askPrice(response.name, response.department);
    });
}

function askPrice(name, department) {
    inquirer.prompt({
        name: 'price',
        message: 'Price: '
    }).then(function(response) {
        var priceFloat = parseFloat(response.price);
        if (!isNaN(priceFloat)) {
            askQuant(name, department, priceFloat);
        } else {
            console.log('Error. You entered a nonnumeric price.')
            askPrice(name, department);
        }
    })
}

function askQuant(name, department, price) {
    inquirer.prompt({
        name: 'quantity',
        message: 'Quantity: '   
    }).then(function(reply) {
        var quantInt = parseInt(reply.quantity);
        if (!isNaN(quantInt)) {
            connection.query(
                'INSERT INTO products SET ?',
                {product_name: name, department_name: department, price: price, stock_quantity: quantInt},
                function(error, data) {
                    if (error) throw error;
                    console.log('Query performed, ' + data.affectedRows + ' row(s) affected.');
                    initialPrompt();
                }
            );
        } else {
            console.log('Error. You entered a nonnumeric quantity');
            askQuant(name, department, price);
        }
    });
}