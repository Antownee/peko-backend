const express = require('express');
const router = express.Router();

//Routers
const orderRequestRouter = require('./orderRequest');
const shipmentRouter = require('./shipment');
const assetRouter = require('./asset');

router.use((req, res, next) => {
    return req.decoded.role === "User" || "Admin" ? next() : res.status(403).send({ message: 'Unauthorized access.' });
});

router.use('/order', orderRequestRouter);
router.use('/shipment', shipmentRouter);
router.use('/asset', assetRouter);


module.exports = router;