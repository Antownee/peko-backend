var express = require('express');
var router = express.Router();
const userService = require('../../utils/userService');


router.get('/', (req, res, next) => {
    res.send("We're in");
})


//Sign up
router.post('/register', (req, res, next) => {
    userService.create(req.body)
        .then(user => user ? res.json(user) : res.status(400).json({ message: "Username seems to be taken. Try again" }))
        .catch(err => next(err));
})


//Login
router.post('/authenticate', (req, res, next) => {
    userService.authenticate(req.body)
        .then(user => user ? res.json(user) : res.status(400).json({ message: 'Username or password is incorrect' }))
        .catch(err => next(err));
})


function getAll(req, res, next) {
    userService.getAll()
        .then(users => res.json(users))
        .catch(err => next(err));
}

function getCurrent(req, res, next) {
    userService.getById(req.user.sub)
        .then(user => user ? res.json(user) : res.sendStatus(404))
        .catch(err => next(err));
}

function getById(req, res, next) {
    userService.getById(req.params.id)
        .then(user => user ? res.json(user) : res.sendStatus(404))
        .catch(err => next(err));
}

function update(req, res, next) {
    userService.update(req.params.id, req.body)
        .then(() => res.json({}))
        .catch(err => next(err));
}

function _delete(req, res, next) {
    userService.delete(req.params.id)
        .then(() => res.json({}))
        .catch(err => next(err));
}

module.exports = router;