const express = require('express');
const router = express.Router();
const worker = require("../../utils/bgworkers/worker");
const { check, validationResult } = require('express-validator');
const orderService = require("../../utils/orderService");

//Create order
router.post('/', [
    // check('order.teaID').not().isEmpty(),
    // check('order.amount').not().isEmpty(),
    // check('order.amount').isNumeric()
], (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(404).send({ message: 'Try again later' })
    }


    const { user, order } = req.body;
    orderService.addOrder(order)
        .then((result) => {
            if (result) {
                worker.emailQueue.add({ status: "ORDER_INIT", order });
                return res.status(200).send({ message: result });
            } else {
                return res.status(404).send({ message: 'Try again later' })
            }
        })
        .catch(err => next(err));
});

router.post('/all', (req, res, next) => {
    //sanitize
    orderService.getAllOrdersUser(req.body)
        .then(orders => orders ? res.status(200).json(orders) : res.status(404).send({ message: 'Try again later' }))
        .catch(err => next(err));
})


function emailNotifier(em, order, user) {
    for (index = 0; index < em.length; ++index) {
        worker.addEmailJob({ email: em[index].email, order, user, status: "PLACE ORDER" });
    }
}




module.exports = router;
