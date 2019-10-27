const express = require('express');
const router = express.Router();
const orderService = require("../../utils/orderService");
const emailWorker = require("../../utils/bgworkers/worker");
const { check, validationResult } = require('express-validator');

router.post('/', [
    check('userID').trim().escape(),
    check('shipmentID').trim().escape(),
    check('orderID').trim().escape(),
    check('shipmentValue').isNumeric().trim().escape(),
    check('shipmentWeight').isNumeric().trim().escape(),
], (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(404).send({ error: 'Try again later' })
    }

    orderService.addShipment(req.body)
        .then((result) => {
            if (result.error) {
                return res.status(404).send({ error: result.error })
            }
            let { shipment } = result;
            orderService.updateOrderStatus(shipment.orderID, "ORDER_SHIPMENT_ADDED");
            emailWorker.emailQueue.add({ status: "ORDER_SHIPMENT_ADDED", shipment });
            return res.status(200).send({ shipment, message: result.message });
        })
        .catch(err => next(err));
})

router.post('/all', [
    check('orderID').trim().escape()
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


router.post('/update', [
    check('shipmentID').trim().escape(),
    check('shipmentValue').isNumeric().trim().escape(),
    check('shipmentWeight').isNumeric().trim().escape(),
], (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(404).send({ error: 'Try again later' })
    }

    let { shipmentID, shipmentValue, shipmentWeight } = req.body;
    orderService.updateShipment(shipmentID, shipmentValue, shipmentWeight)
        .then((shp) => {
            if (shp) {
                res.status(200).send({ msg: 'Shipment updated!', shipment: shp });
            }
        })
        .catch(err => next(err));
})

router.post('/delete', [
    check('shipmentID').trim().escape()
], (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(404).send({ error: 'Try again later' })
    }

    let { shipmentID } = req.body;
    orderService.deleteShipment(shipmentID)
        .then(shipment =>
            shipment ? res.status(200).json({ message: "Shipment deleted" }) : res.status(404).send({ error: 'Try again later' })
        )
        .catch(err => next(err));
})



module.exports = router;
