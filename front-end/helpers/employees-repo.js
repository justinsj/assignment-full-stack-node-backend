const fs = require('fs');
const { v4: uuidv4 } = require('uuid');


let employees = require('data/employees.json');

export const employeesRepo = {
    getAll,
    getById,
    create,
    update,
    delete: _delete
};

function getAll() {
    return employees;
}

function getById(id) {
    return employees.find(x => x.id.toString() === id.toString());
}

function create({ firstName, lastName, salary }) {
    const employee = { firstName, lastName, salary };

    // validate
    if (employees.find(x => x.id === employee.id))
        throw `Employee with the employeeId ${employee.id} already exists`;

    employee.id = uuidv4();

    // set date created and updated
    employee.dateCreated = new Date().toISOString();
    employee.dateUpdated = new Date().toISOString();

    // add and save employee
    employees.push(employee);
    saveData();
}

function update(id, { firstName, lastName, salary }) {
    const params = { firstName, lastName, salary };
    const employee = employees.find(x => x.id.toString() === id.toString());

    // validate
    if (params.id !== employee.id && employees.find(x => x.id === params.id))
        throw `Employee with the email ${params.id} already exists`;

    // set date updated
    employee.dateUpdated = new Date().toISOString();

    // update and save
    Object.assign(employee, params);
    saveData();
}

// prefixed with underscore '_' because 'delete' is a reserved word in javascript
function _delete(id) {
    // filter out deleted employee and save
    employees = employees.filter(x => x.id.toString() !== id.toString());
    saveData();
    
}

// private helper functions

function saveData() {
    fs.writeFileSync('data/employees.json', JSON.stringify(employees, null, 4));
}