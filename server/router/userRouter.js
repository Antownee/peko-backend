const express = require('express');
const router = express.Router();

//Routers
const userRouter = require('./user/user');
const saleRouter = require('./user/sale');
const teaRouter = require('./user/tea');
const teaRequestRouter = require('./user/tea-request');


router.use('/auth', userRouter);
router.use('/sale', saleRouter);
router.use('/tea', teaRouter);
router.use('/tea-request', teaRequestRouter);




module.exports = router;