import { apiHandler, employeesRepo } from 'helpers/api';

export default apiHandler({
    post: getAll
});

async function getAll(req, res) {
    const users = await employeesRepo.getAll(req.body);
    return res.status(200).json(users);
}
