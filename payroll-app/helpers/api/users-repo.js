import getConfig from 'next/config';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { db } from 'helpers/api';

const { serverRuntimeConfig } = getConfig();

export const usersRepo = {
    authenticate,
    getAll,
    getById,
    create,
    update,
    delete: _delete
};

async function authenticate({ username, password }) {
    const user = await db.User.scope('withHash').findOne({ where: { username } });

    if (!(user && bcrypt.compareSync(password, user.hash))) {
        throw 'Username or password is incorrect';
    }

    // create a jwt token that is valid for 7 days
    const token = jwt.sign({ sub: user.id }, serverRuntimeConfig.secret, { expiresIn: '7d' });

    // remove hash from return value
    const userJson = user.get();
    delete userJson.hash;

    // return user and jwt
    return {
        ...userJson,
        token
    };
}

async function getAll({ page, pageSize, sortColumn, sortDirection }) {
    const offset = (page - 1) * pageSize;
    const limit = pageSize;
  
    let orderBy = [['id', 'ASC']]; // Default sort order
  
    // Check if sorting is requested
    if (sortColumn && sortDirection) {
      let columnName;
  
      // Determine the column name in the database based on the sortColumn value
      switch (sortColumn) {
        case 'firstName':
          columnName = 'firstName';
          break;
        case 'lastName':
          columnName = 'lastName';
          break;
        case 'username':
          columnName = 'username';
          break;
        default:
          columnName = 'id';
      }
  
      // Determine the sort order based on the sortDirection value
      switch (sortDirection) {
        case 'asc':
          orderBy = [[columnName, 'ASC']];
          break;
        case 'desc':
          orderBy = [[columnName, 'DESC']];
          break;
      }
    }
  
    const users = await db.User.findAndCountAll({
      offset,
      limit,
      order: orderBy, // Apply the sort order
    });
  
    const data = users.rows;
    const totalItems = users.count;
    const totalPages = Math.ceil(totalItems / pageSize);
  
    return { data, totalPages };
  }
  

async function getById(id) {
    return await db.User.findByPk(id);
}

async function create(params) {
    // validate
    if (await db.User.findOne({ where: { username: params.username } })) {
        throw 'Username "' + params.username + '" is already taken';
    }

    const user = new db.User(params);

    // hash password
    if (params.password) {
        user.hash = bcrypt.hashSync(params.password, 10);
    }

    // save user
    await user.save();
}

async function update(id, params) {
    const user = await db.User.findByPk(id);

    // validate
    if (!user) throw 'User not found';
    if (user.username !== params.username && await db.User.findOne({ where: { username: params.username } })) {
        throw 'Username "' + params.username + '" is already taken';
    }

    // hash password if it was entered
    if (params.password) {
        params.hash = bcrypt.hashSync(params.password, 10);
    }

    // copy params properties to user
    Object.assign(user, params);

    await user.save();
}

async function _delete(id) {
    const user = await db.User.findByPk(id);
    if (!user) throw 'User not found';

    // delete user
    await user.destroy();
}
