const jwt = require('jsonwebtoken');
const express = require('express');
const router = express.Router();

//Routers
const userRouter = require('./user/userRouter');
const adminRouter = require('./admin/adminRouter');


router.use((req, res, next) => {
    let token = req.headers['authorization-token'];
    
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