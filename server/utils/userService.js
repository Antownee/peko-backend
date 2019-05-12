const dotenv = require('dotenv').config();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const shortid = require('shortid');
const User = require('../models/user');

//Required
shortid.characters('0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ$@');


module.exports = {
    authenticate,
    getAll,
    getById,
    create,
    update,
    delete: _delete
};

async function authenticate({ username, password }) {
    const user = await User.findOne({ username });
    if (user && bcrypt.compareSync(password, user.hash)) {
        const { hash, ...userWithoutHash } = user.toObject();
        const token = jwt.sign({ sub: user.id }, process.env.secret);
        return {
            data: {
                ...userWithoutHash,
                token
            },
            error: null
        };
    }
}

async function getAll() {
    return await User.find().select('-hash');
}

async function getById(id) {
    return await User.findById(id).select('-hash');
}

async function create(userParam) {
    // validate
    if (await User.findOne({ username: userParam.username })) {
        throw `Username ${userParam.username} is already taken`;
    }

<<<<<<< HEAD
    const user = new User({
        userID: `COJ-${shortid.generate()}`,
        firstName: userParam.firstName,
        lastName: userParam.lastName,
        country: "Kenya",
        joinDate: Date.now().toString(),
        username: userParam.username,
        role: 'User'
    });
=======
    const user = new User(userParam);
    user.userID = `COJ-${shortid.generate()}`;
>>>>>>> 4ef0fce200dade858c103a083612d893080b3fb9

    // hash password
    if (userParam.password) {
        user.hash = bcrypt.hashSync(userParam.password, 10);
    }

    await user.save();
<<<<<<< HEAD
    const { hash, ...userWithoutHash } = user.toObject();
    const token = jwt.sign({ sub: user.id }, process.env.secret);
    return {
        ...userWithoutHash,
        token
    };
=======

    return {

    }
>>>>>>> 4ef0fce200dade858c103a083612d893080b3fb9
}

async function update(id, userParam) {
    const user = await User.findById(id);

    // validate
    if (!user) throw 'User not found';
    if (user.username !== userParam.username && await User.findOne({ username: userParam.username })) {
        throw 'Username "' + userParam.username + '" is already taken';
    }

    // hash password if it was entered
    if (userParam.password) {
        userParam.hash = bcrypt.hashSync(userParam.password, 10);
    }

    // copy userParam properties to user
    Object.assign(user, userParam);

    await user.save();
}

async function _delete(id) {
    await User.findByIdAndRemove(id);
}