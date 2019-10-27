const express = require('express');
const router = express.Router();
const orderService = require("../../utils/orderService");

router.post('/alltea', (req, res, next) => {
    orderService.getTeaItems()
        .then(tea => tea ? res.json(tea) : res.status(404).send({ error: 'Try again later' }))
        .catch(err => next(err));
})

router.post('/dashboard', (req, res, next) => {
    orderService.getUserDashboard(req.body)
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
