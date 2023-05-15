import { apiHandler, employeesRepo } from 'helpers/api';

export default apiHandler({
    post: register
});

async function register(req, res) {
    console.log({'msg':'create_employee','req.body': req.body})
    await employeesRepo.create(req.body);
    return res.status(200).json({});
}
