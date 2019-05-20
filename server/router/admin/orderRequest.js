const express = require('express');
const router = express.Router();
const multer = require('multer')

const orderService = require("../../utils/orderService");

//Might be useful later
router.post('/', (req, res, next) => {
    orderService.addOrder(req.body)
        .then(user => user ? res.json(user) : res.sendStatus(404))
        .catch(err => next(err));
});

router.post('/all', (req, res, next) => {
    orderService.getAllOrdersAdmin()
        .then(orders => orders ? res.json(orders) : res.sendStatus(404))
        .catch(err => next(err));
})


router.post('/confirm', (req, res, next) => {
    //Also, trigger a background worker to send those emails to people to be notified
    orderService.confirmOrder(req.body)
        .then((ord) => {
            ord.nModified === 1 ? res.json("Order confirmed.") :  res.sendStatus(404);
        })
        .catch(err => next(err));
})


router.post('/documents', (req, res, next) => {
    orderService.adminUploadDocuments(req.body)
        .then((ord) => {
        })
        .catch(err => next(err));
})


module.exports = router;
