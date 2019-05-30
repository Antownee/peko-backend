const express = require('express');
const faker = require('faker');
const router = express.Router();
const worker = require("../../utils/bgworkers/worker");
const orderService = require("../../utils/orderService");

//Create tea request
router.post('/', (req, res, next) => {
    const { user, order } = req.body;
    orderService.addOrder(order)
        .then((result) => {
            if (result) {
                res.json(result);
                orderService.getCOJEmails()
                    .then((em) => {
                        emailNotifier(em, order, user)
                    });
            } else {
                res.status(404).send({ error: 'Try again later' })
            }
        })
        .catch(err => next(err));
});

router.post('/all', (req, res, next) => {
    orderService.getAllOrdersUser(req.body)
        .then(orders => orders ? res.json(orders) : res.status(404).send({ error: 'Try again later' }))
        .catch(err => next(err));
})


function emailNotifier(em, order, user) {
    for (index = 0; index < em.length; ++index) {
        worker.addEmailJob(em[index].email, order, user);
    }
}




module.exports = router;
