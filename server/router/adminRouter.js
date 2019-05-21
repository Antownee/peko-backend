const express = require('express');
const router = express.Router();


//Routers
const orderRouter = require('./admin/orderRequest');
const assetRouter = require('./admin/asset');


router.use('/order', orderRouter);
router.use('/asset', assetRouter);

module.exports = router;