const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator');
const orderService = require("../../utils/orderService");



router.post('/all', [
    check('orderID').isAlphanumeric().trim().escape(),
], (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(404).send({ error: 'Try again later' })
    }

    let { orderID } = req.body;
    orderService.getShipmentsFromOrder(orderID)
    .then(shipments =>
        shipments ? res.status(200).json(shipments) : res.status(404).send({ error: 'Try again later' })
    )
    .catch(err => next(err));
})


module.exports = router;
