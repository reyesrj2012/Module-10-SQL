const inquirer = require('inquirer');
//const mysql = require('mysql2');

// Create a MySQL connection
//const db = mysql.createConnection({
//    host: 'localhost',
//    user: 'root',
//    password: 'test', // replace with your MySQL root password
//    database: 'company_db'
//});

//db.connect(err => {
//    if (err) throw err;
//    console.log('Connected to the database');
//    startApp();
//});

// Function to start the app and present menu options
    inquirer
        .prompt({
            type: 'list'
            name: 'action'
            message: 'What would you like to do?'
            choices: [
                'View All Departments',
                'View All Roles',
                'View All Employees',
                'Add a Department',
                'Add a Role',
                'Add an Employee',
                'Update an Employee Role',
                'Exit'
            ]
        })
        .then(answer => {
            switch (answer.action) {
                case 'View All Departments':
                    viewDepartments();
                    break;
                case 'View All Roles':
                    viewRoles();
                    break;
                case 'View All Employees':
                    viewEmployees();
                    break;
                case 'Add a Department':
                    addDepartment();
                    break;
                case 'Add a Role':
                    addRole();
                    break;
                case 'Add an Employee':
                    addEmployee();
                    break;
                case 'Update an Employee Role':
                    updateEmployeeRole();
                    break;
                case 'Exit':
                    db.end();
                    break;
            }
        });

// View all departments
function viewDepartments() {
    db.query('SELECT * FROM departments', (err, results) => {
        if (err) throw err;
        console.table(results);
        startApp();
    });
}

// View all roles
function viewRoles() {
    const query = `
        SELECT roles.id, roles.title, departments.name AS department, roles.salary 
        FROM roles 
        JOIN departments ON roles.department_id = departments.id;
    `;
    db.query(query, (err, results) => {
        if (err) throw err;
        console.table(results);
        startApp();
    });
}

// View all employees
function viewEmployees() {
    const query = `
        SELECT employees.id, employees.first_name, employees.last_name, roles.title, departments.name AS department, roles.salary, 
        CONCAT(manager.first_name, ' ', manager.last_name) AS manager
        FROM employees
        JOIN roles ON employees.role_id = roles.id
        JOIN departments ON roles.department_id = departments.id
        LEFT JOIN employees manager ON manager.id = employees.manager_id;
    `;
    db.query(query, (err, results) => {
        if (err) throw err;
        console.table(results);
        startApp();
    });
}

// Add a department
function addDepartment() {
    inquirer
        .prompt({
            name: 'name',
            type: 'input',
            message: 'Enter the name of the new department:'
        })
        .then(answer => {
            db.query('INSERT INTO departments SET ?', { name: answer.name }, (err) => {
                if (err) throw err;
                console.log('Department added successfully!');
                startApp();
            });
        });
}

// Add a role
function addRole() {
    db.query('SELECT * FROM departments', (err, results) => {
        if (err) throw err;
        const departments = results.map(department => ({
            name: department.name,
            value: department.id
        }));

        inquirer
            .prompt([
                {
                    name: 'title',
                    type: 'input',
                    message: 'Enter the name of the role:'
                },
                {
                    name: 'salary',
                    type: 'input',
                    message: 'Enter the salary for the role:'
                },
                {
                    name: 'department_id',
                    type: 'list',
                    message: 'Select the department for the role:',
                    choices: departments
                }
            ])
            .then(answer => {
                db.query('INSERT INTO roles SET ?', answer, (err) => {
                    if (err) throw err;
                    console.log('Role added successfully!');
                    startApp();
                });
            });
    });
}

// Add an employee
function addEmployee() {
    db.query('SELECT * FROM roles', (err, roles) => {
        if (err) throw err;

        db.query('SELECT * FROM employees', (err, managers) => {
            if (err) throw err;

            const roleChoices = roles.map(role => ({
                name: role.title,
                value: role.id
            }));

            const managerChoices = managers.map(manager => ({
                name: `${manager.first_name} ${manager.last_name}`,
                value: manager.id
            }));

            managerChoices.unshift({ name: 'None', value: null });

            inquirer
                .prompt([
                    {
                        name: 'first_name',
                        type: 'input',
                        message: 'Enter the employee\'s first name:'
                    },
                    {
                        name: 'last_name',
                        type: 'input',
                        message: 'Enter the employee\'s last name:'
                    },
                    {
                        name: 'role_id',
                        type: 'list',
                        message: 'Select the employee\'s role:',
                        choices: roleChoices
                    },
                    {
                        name: 'manager_id',
                        type: 'list',
                        message: 'Select the employee\'s manager:',
                        choices: managerChoices
                    }
                ])
                .then(answer => {
                    db.query('INSERT INTO employees SET ?', answer, (err) => {
                        if (err) throw err;
                        console.log('Employee added successfully!');
                        startApp();
                    });
                });
        });
    });
}

// Update an employee's role
function updateEmployeeRole() {
    db.query('SELECT * FROM employees', (err, employees) => {
        if (err) throw err;

        const employeeChoices = employees.map(employee => ({
            name: `${employee.first_name} ${employee.last_name}`,
            value: employee.id
        }));

        db.query('SELECT * FROM roles', (err, roles) => {
            if (err) throw err;

            const roleChoices = roles.map(role => ({
                name: role.title,
                value: role.id
            }));

            inquirer
                .prompt([
                    {
                        name: 'employee_id',
                        type: 'list',
                        message: 'Select the employee to update:',
                        choices: employeeChoices
                    },
                    {
                        name: 'role_id',
                        type: 'list',
                        message: 'Select the employee\'s new role:',
                        choices: roleChoices
                    }
                ])
                .then(answer => {
                    db.query('UPDATE employees SET role_id = ? WHERE id = ?', [answer.role_id, answer.employee_id], (err) => {
                        if (err) throw err;
                        console.log('Employee role updated successfully!');
                        startApp();
                    });
                });
        });
    });
}