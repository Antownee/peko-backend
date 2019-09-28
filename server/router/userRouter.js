const express = require('express');
const router = express.Router();

//Routers
const orderRequestRouter = require('./user/orderRequest');

router.use('/order-request', orderRequestRouter);


module.exports = router;