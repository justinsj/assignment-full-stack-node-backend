import { apiHandler, employeesRepo } from 'helpers/api';

export default apiHandler({
    get: getById,
    put: update,
    delete: _delete
});

async function getById(req, res) {
    const employee = await employeesRepo.getById(req.query.id);

    if (!employee) throw 'Employee Not Found';

    return res.status(200).json(employee);
}

async function update(req, res) {
    await employeesRepo.update(req.query.id, req.body);
    return res.status(200).json({});
}

async function _delete(req, res) {
    await employeesRepo.delete(req.query.id);
    return res.status(200).json({});
}
