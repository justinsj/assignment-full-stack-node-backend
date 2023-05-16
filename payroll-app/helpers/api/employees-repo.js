import getConfig from 'next/config';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { db } from 'helpers/api';


export const employeesRepo = {
    getAll,
    getById,
    create,
    update,
    delete: _delete
};

async function getAll({ page, pageSize }) {
    const offset = (page - 1) * pageSize;
    const limit = pageSize;
    const employees = await db.Employee.findAndCountAll({
        offset,
        limit,
    });

    const data = employees.rows;
    const totalItems = employees.count;
    const totalPages = Math.ceil(totalItems / pageSize);

    return { data, totalPages };
}


async function getById(id) {
    return await db.Employee.findByPk(id);
}

async function create(params) {
    // Create an id if there is none
    const employee = new db.Employee(params);

    // save employee
    await employee.save();
}

async function update(id, params) {
    const employee = await db.Employee.findByPk(id);

    // validate
    if (!employee) throw 'Employee not found';
    if (employee.employeename !== params.employeename && await db.Employee.findOne({ where: { employeename: params.employeename } })) {
        throw 'Employee "' + params.employeename + '" is already taken';
    }

    // copy params properties to employee
    Object.assign(employee, params);

    await employee.save();
}

async function _delete(id) {
    const employee = await db.Employee.findByPk(id);
    if (!employee) throw 'Employee not found';

    // delete employee
    await employee.destroy();
}
