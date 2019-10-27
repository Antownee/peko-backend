const express = require('express');
const router = express.Router();
const orderService = require("../../utils/orderService");
const { check, validationResult } = require('express-validator');


router.post('/alltea', (req, res, next) => {
    orderService.getTeaItems()
        .then(tea => tea ? res.json(tea) : res.status(404).send({ error: 'Try again later' }))
        .catch(err => next(err));
})

router.post('/dashboard', [
    check('userID').not().isEmpty(),
], (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(404).send({ message: 'Try again later' })
    }

    let { userID } = req.body
    orderService.getUserDashboard(userID)
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
