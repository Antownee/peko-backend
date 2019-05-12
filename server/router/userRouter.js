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
<<<<<<< HEAD
router.use('/order-request', orderRequestRouter);
=======
router.use('/tea-request', teaRequestRouter);
>>>>>>> 4ef0fce200dade858c103a083612d893080b3fb9




module.exports = router;