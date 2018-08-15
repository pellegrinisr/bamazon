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
        choices: ['View Product Sales by Department', 'Create New Department,', 'Exit']
    }).then(function(response) {
        if (response.initialMenu === 'View Product Sales by Department') {

        } else if (respnse.initialMenu === 'Create New Department') {

        } else {
            console.log('Goodbye');
            connection.end();
        }
    })
}