const express = require('express');
const router = express.Router();


//Routers
const orderRouter = require('./orderRequest');
const assetRouter = require('./asset');
const shipmentRouter = require('./shipment');

router.use((req, res, next) => {
    return req.decoded.role === "Admin" ? next() : res.status(403).send({ message: 'Unauthorized access.' });
});

router.use('/order', orderRouter);
router.use('/asset', assetRouter);
router.use('/shipment', shipmentRouter);

module.exports = router;