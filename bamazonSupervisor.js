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
    console.log('connected as ' + connection.threadId + '\n');
    initialPrompt();
});

function initialPrompt() {
    inquirer.prompt({
        type: 'list',
        name: 'initialMenu', 
        choices: ['View Product Sales by Department', 'Create New Department', 'Exit']
    }).then(function(response) {
        if (response.initialMenu === 'View Product Sales by Department') {
            salesByDepartment();
        } else if (response.initialMenu === 'Create New Department') {

        } else {
            console.log('Goodbye');
            connection.end();
        }
    })
}

function salesByDepartment() {
    var myQuery = [
        'SELECT department_id, department_name, over_head_costs, SUM(product_sales) AS sales, (SUM(product_sales) - over_head_costs) AS total_profit',
        'FROM departments JOIN products USING (department_name)',
        'GROUP BY department_id'
    ].join(' ');
    console.log(myQuery);
    connection.query(
        myQuery,
        function(error, data) {
            if (error) throw error;
            console.log(data[0]);
            console.log('department_id' + ' | ' + 'department_name' + ' | ' + 'over_head_costs' + ' | ' + 'product_sales' + ' | ' + 'total_profit');
            for (var i = 0; i < data.length; i++) {
                var sales;
                if (data[i].sales === null) {
                    sales = 0;
                } else {
                    sales = data[i].sales;
                }
                var output = [
                    data[i].department_id.toString().padEnd(13, ' '),
                    ' | ',
                    data[i].department_name.padEnd(15, ' '),
                    ' | ',
                    data[i].over_head_costs.toString().padEnd(15, ' '),
                    ' | ',
                    sales.toString().padEnd(13, ' '),
                    ' | ',
                    data[i].total_profit
                ].join('');
                //console.log(data[i].department_id.toString().padEnd(13, ' ') + ' | ' + data[i].department_name.padEnd(15, ' ') + ' | ' + data[i].over_head_costs.toString().padEnd(15, ' ') + ' | ' + data[i].product_sales + ' | ' + data[i].total_profit)
                console.log(output);
            }
            //console.log(data);
            initialPrompt();
        }
    );
}
