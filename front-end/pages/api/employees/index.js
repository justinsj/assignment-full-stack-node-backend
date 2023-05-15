import { employeesRepo } from 'helpers';

export default handler;

function handler(req, res) {
    switch (req.method) {
        case 'GET':
            return getEmployees();
        case 'POST':
            return createEmployee();
        default:
            return res.status(405).end(`Method ${req.method} Not Allowed`)
    }

    function getEmployees() {
        const employees = employeesRepo.getAll();
        return res.status(200).json(employees);
    }
    
    function createEmployee() {
        try {
            employeesRepo.create(req.body);
            return res.status(200).json({});
        } catch (error) {
            return res.status(400).json({ message: error });
        }
    }
}
