const express = require('express');
const router = express.Router();

//Routers
const orderRequestRouter = require('./user/orderRequest');

router.use((req, res, next) => {
    return req.decoded.role === "User" || "Admin" ? next() : res.status(403).send({ message: 'Unauthorized access.' });
});

router.use('/order', orderRequestRouter);


module.exports = router;