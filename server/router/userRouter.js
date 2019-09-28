const express = require('express');
const router = express.Router();

//Routers
const orderRequestRouter = require('./user/orderRequest');

router.use('/order', orderRequestRouter);


module.exports = router;