const express = require('express');
const faker = require('faker');
const router = express.Router();
const worker = require("../../utils/bgworkers/worker");
const { check, validationResult } = require('express-validator');
const orderService = require("../../utils/orderService");

//Create tea request
router.post('/', [
    //check('order.teaID').isAlphanumeric(),
   // check('order.userID').isAlphanumeric(),
    check('order.description').isAlphanumeric().trim().escape(),
    check('order.amount').isNumeric().trim().escape()
], (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(404).send({ message: 'Try again later' })
    }


    const { user, order } = req.body;
    orderService.addOrder(order)
        .then((result) => {
            if (result) {
                res.json(result);
                return orderService.getCOJEmails()
                    .then((em) => {
                        emailNotifier(em, order, user)
                    });
            } else {
                return res.status(404).send({ message: 'Try again later' })
            }
        })
        .catch(err => next(err));
});

router.post('/all', (req, res, next) => {
    orderService.getAllOrdersUser(req.body)
        .then(orders => orders ? res.json(orders) : res.status(404).send({ message: 'Try again later' }))
        .catch(err => next(err));
})


function emailNotifier(em, order, user) {
    for (index = 0; index < em.length; ++index) {
        worker.addEmailJob(em[index].email, order, user);
    }
}




module.exports = router;
