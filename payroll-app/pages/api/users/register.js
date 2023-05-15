import { apiHandler, usersRepo } from 'helpers/api';

export default apiHandler({
    post: register
});

async function register(req, res) {
    console.log({'msg':'create_user','req.body': req.body})
    await usersRepo.create(req.body);
    return res.status(200).json({});
}
