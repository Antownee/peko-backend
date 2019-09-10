const express = require('express');
const router = express.Router();

//Routers

const userRouter = require('./userRouter');
const adminRouter = require('./adminRouter');

router.use('/users', userRouter);
router.use('/admin', adminRouter);

module.exports = router;