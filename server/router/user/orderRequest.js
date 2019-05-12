const express = require('express');
const faker = require('faker');
const router = express.Router();

const orderRequest = require('../../models/orderRequest');
const orderService = require("../../utils/orderService");

//Create tea request
router.post('/', (req, res, next) => {
    orderService.addOrder(req.body)
        .then(user => user ? res.json(user) : res.sendStatus(404))
        .catch(err => next(err));
});

router.post('/all', (req, res, next) => {
    orderService.getAllOrders(req.body)
        .then(orders => orders ? res.json(orders) : res.sendStatus(404))
        .catch(err => next(err));
})

module.exports = router;
