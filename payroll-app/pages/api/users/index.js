import { apiHandler, usersRepo } from 'helpers/api';

export default apiHandler({
    post: getAll
});

async function getAll(req, res) {
    const users = await usersRepo.getAll(req.body);
    return res.status(200).json(users);
}
