const express = require('express');
const router = express.Router();
const userService = require('../../utils/userService');


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

module.exports = router;