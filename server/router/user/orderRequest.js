const express = require('express');
const faker = require('faker');
const router = express.Router();

const orderService = require("../../utils/orderService");

//Create tea request
router.post('/', (req, res, next) => {
    orderService.addOrder(req.body)
        .then(user => user ? res.json(user) : res.status(404).send({ error: 'Try again later' }))
        .catch(err => next(err));
});

router.post('/all', (req, res, next) => {
    orderService.getAllOrdersUser(req.body)
        .then(orders => orders ? res.json(orders) : res.status(404).send({ error: 'Try again later' }))
        .catch(err => next(err));
})


module.exports = router;
