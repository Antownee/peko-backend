const jwt = require('jsonwebtoken');
const express = require('express');
const router = express.Router();

//Routers
const userRouter = require('./userRouter');
const adminRouter = require('./adminRouter');


router.use((req, res, next) => {
    let token = req.headers['authorization_token'];

    if (token) {
        jwt.verify(token, global.gConfig.secret , (err, decoded) => {
            if (err) {
                return res.json({ message: 'invalid token' });
            } else {
                // if everything is good, save to request for use in other routes
                req.decoded = decoded;
                next();
            }
        });

    } else
        res.status(403).send({
            message: 'Unauthorized access.'
        });
});

router.use('/users', userRouter);
router.use('/admin', adminRouter);


module.exports = router;