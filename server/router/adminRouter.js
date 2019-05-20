const express = require('express');
const router = express.Router();


//Routers
const orderRouter = require('./admin/orderRequest');

router.use('/order', orderRouter);

module.exports = router;