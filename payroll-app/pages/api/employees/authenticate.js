import { apiHandler, usersRepo } from 'helpers/api';

export default apiHandler({
    post: authenticate
});

// Use authenticate using usersRepo (instead of employeesRepo)
async function authenticate(req, res) {
    const user = await usersRepo.authenticate(req.body);
    return res.status(200).json(user);
}
