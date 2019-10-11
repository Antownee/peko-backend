const express = require('express');
const router = express.Router();
const orderService = require("../../utils/orderService");



router.post('/', (req, res, next) => {
    //Sanitize the body
    orderService.addShipment(req.body)
        .then(result =>
            !result.error ? res.status(200).send({ shipment: result.shipment, message: result.message }) : res.status(404).send({ error: result.error})
        )
        .catch(err => next(err));
})

router.post('/all', (req, res, next) => {
    let { orderID } = req.body;
    //Sanitize
    orderService.getShipmentsFromOrder(orderID)
        .then(shipments =>
            shipments ? res.status(200).json(shipments) : res.status(404).send({ error: 'Try again later' })
        )
        .catch(err => next(err));
})

router.post('/delete', (req, res, next) => {
    let { shipmentID } = req.body;
    //Sanitize
    orderService.deleteShipment(shipmentID)
        .then(shipment =>
            shipment ? res.status(200).json({message: "Shipment deleted"}) : res.status(404).send({ error: 'Try again later' })
        )
        .catch(err => next(err));
})



module.exports = router;
