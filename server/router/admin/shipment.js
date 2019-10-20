const express = require('express');
const router = express.Router();
const orderService = require("../../utils/orderService");
const worker = require("../../utils/bgworkers/worker");


router.post('/', (req, res, next) => {
    //Sanitize the body
    orderService.addShipment(req.body)
        .then((result) => {
            if (result.error) {
                return res.status(404).send({ error: result.error })
            }
            let { shipment } = result;
            orderService.updateOrderStatus(shipment.orderID,"ORDER_SHIPMENT_ADDED");
            worker.emailQueue.add({ status: "ORDER_SHIPMENT_ADDED", shipment});
            return res.status(200).send({ shipment, message: result.message });
        })
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
            shipment ? res.status(200).json({ message: "Shipment deleted" }) : res.status(404).send({ error: 'Try again later' })
        )
        .catch(err => next(err));
})



module.exports = router;
