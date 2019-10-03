const express = require('express');
const router = express.Router();


//Routers
const orderRouter = require('./admin/orderRequest');
const assetRouter = require('./admin/asset');

router.use((req, res, next) => {
    return req.decoded.role === "Admin" ? next() : res.status(403).send({ message: 'Unauthorized access.' });
});

router.use('/order', orderRouter);
router.use('/asset', assetRouter);

module.exports = router;