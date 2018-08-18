var inquirer = require('inquirer');
var mysql = require('mysql');
var separator = '*********************************************************************************';

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
            createDepartment();
        } else {
            console.log('Goodbye');
            connection.end();
        }
    })
}

function salesByDepartment() {
    var myQuery = [
        'SELECT department_id, department_name, over_head_costs, SUM(product_sales) AS sales, (SUM(product_sales) - over_head_costs) AS total_profit',
        'FROM departments LEFT OUTER JOIN products USING (department_name)',
        'GROUP BY department_id'
    ].join(' ');
    // console.log(myQuery);
    connection.query(
        myQuery,
        function(error, data) {
            if (error) throw error;
            // console.log(data[0]);
            console.log('department_id' + ' | ' + 'department_name' + ' | ' + 'over_head_costs' + ' | ' + 'product_sales' + ' | ' + 'total_profit');
            console.log(separator);
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

function createDepartment() {
    inquirer.prompt([
        {
            name: 'deptName',
            message: 'Please enter the department name: '
        },
        {
            name: 'overheadCosts',
            message: 'Enter the overhead costs for the department: '
        }
    ]).then(function(reply) {
        if (isNaN(reply.overheadCosts)) {
            createDepartment();
            console.log('Error. Overhead costs must be numeric.');
        }else if (reply.overheadCosts < 0 ) {
            console.log('Error. Overhead costs cannot be negative.');z
        } else {
            connection.query(
                'INSERT INTO departments SET ?',
                {department_name: reply.deptName, over_head_costs: reply.overheadCosts},
                function(error, data) {
                    if (error) throw error;
                    console.log('\n' + data.affectedRows + ' row(s) added to departments table\n');;
                    initialPrompt();
                }
            )
        }
    })
}