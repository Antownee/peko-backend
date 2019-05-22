const express = require('express');
const router = express.Router();

//Routers
const userRouter = require('./user/user');
const orderRequestRouter = require('./user/orderRequest');

router.use('/auth', userRouter);
router.use('/order-request', orderRequestRouter);


module.exports = router;