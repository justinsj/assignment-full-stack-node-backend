import { apiHandler, employeesRepo } from 'helpers/api';

export default apiHandler({
    get: getAll
});

async function getAll(req, res) {
    const users = await employeesRepo.getAll();
    return res.status(200).json(users);
}
