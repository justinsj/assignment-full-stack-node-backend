import { employeesRepo } from 'helpers';

export default handler;

function handler(req, res) {
    switch (req.method) {
        case 'GET':
            return getEmployeeById();
        case 'PUT':
            return updateEmployee();
        case 'DELETE':
            return deleteEmployee();
        default:
            return res.status(405).end(`Method ${req.method} Not Allowed`)
    }

    function getEmployeeById() {
        const employee = employeesRepo.getById(req.query.id);
        return res.status(200).json(employee);
    }

    function updateEmployee() {
        try {
            employeesRepo.update(req.query.id, req.body);
            return res.status(200).json({});
        } catch (error) {
            return res.status(400).json({ message: error });
        }
    }

    function deleteEmployee() {
        employeesRepo.delete(req.query.id);
        return res.status(200).json({});
    }
}
