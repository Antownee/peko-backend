const express = require('express');
const router = express.Router();

//Routers
const orderRequestRouter = require('./orderRequest');
const shipmentRouter = require('../admin/shipment');

router.use((req, res, next) => {
    return req.decoded.role === "User" || "Admin" ? next() : res.status(403).send({ message: 'Unauthorized access.' });
});

router.use('/order', orderRequestRouter);
router.use('/shipment', shipmentRouter);


module.exports = router;