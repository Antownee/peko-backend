const express = require('express');
const router = express.Router();

//Routers
const userRouter = require('./user/user');
const saleRouter = require('./user/sale');
const teaRouter = require('./user/tea');
const orderRequestRouter = require('./user/orderRequest');


router.use('/auth', userRouter);
router.use('/sale', saleRouter);
router.use('/tea', teaRouter);
router.use('/order-request', orderRequestRouter);




module.exports = router;