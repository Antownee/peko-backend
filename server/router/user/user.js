const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator');
const userService = require('../../utils/userService');


//Sign up
router.post('/register', [
    check('firstName').isAlphanumeric().trim().escape(),
    check('lastName').isAlphanumeric().trim().escape(),
    check('email').isEmail().normalizeEmail(),
    check('username').isAlphanumeric().trim().escape(),
], (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(404).send({ error: 'Try again later' })
    }

    userService.create(req.body)
        .then(user => user ? res.json(user) : res.status(400).json({ message: "Username seems to be taken. Try again" }))
        .catch(err => next(err));
})


//Login
router.post('/authenticate', [
    check('username').isAlphanumeric(),
], (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).send({ message: 'Try again later' })
    }
    userService.authenticate(req.body)
        .then(user => user ? res.json(user) : res.status(400).json({ message: 'Username or password is incorrect' }))
        .catch(err => next(err));
})

module.exports = router;