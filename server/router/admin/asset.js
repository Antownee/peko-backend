const express = require('express');
const router = express.Router();
const orderService = require("../../utils/orderService");
const { check, validationResult } = require('express-validator');


router.post('/tea', [
    check('teaName').isAlphanumeric().trim().escape(),
    check('teaDescription').isAlphanumeric().trim().escape()
], (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(404).send({ error: 'Try again later' })
    }

    let { teaName, teaDescription } = req.body;
    orderService.addTeaItem(teaName, teaDescription)
        .then(tea => tea ? res.json(tea) : res.status(404).send({ error: 'Try again later' }))
        .catch(err => next(err));
})

router.post('/alltea', (req, res, next) => {
    orderService.getTeaItems()
        .then(tea => tea ? res.json(tea) : res.status(404).send({ error: 'Try again later' }))
        .catch(err => next(err));
})

router.post('/email', [
    check('email').isEmail(),
], (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(404).send({ error: 'Try again later' })
    }

    let { email } = req.body;
    orderService.addEmail(email)
        .then(em => em ? res.json(em) : res.status(404).send({ error: 'Try again later' }))
        .catch(err => next(err));
})

router.post('/dashboard', (req, res, next) => {
    orderService.getAdminDashboard()
        .then((em) => {
            if (em) {
                res.json(em)
            } else {
                res.status(404).send({ error: 'Try again later' })
            }
        })
        .catch(err => next(err));
})


module.exports = router;
