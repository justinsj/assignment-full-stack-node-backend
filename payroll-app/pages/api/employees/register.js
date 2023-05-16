import { apiHandler, employeesRepo } from 'helpers/api';

export default apiHandler({
    post: register
});

async function register(req, res) {
    await employeesRepo.create(req.body);
    return res.status(200).json({});
}
