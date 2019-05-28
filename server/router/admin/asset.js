const express = require('express');
const router = express.Router();
const orderService = require("../../utils/orderService");


router.post('/tea', (req, res, next) => {
    orderService.addTeaItem(req.body)
        .then(tea => tea ? res.json(tea) : res.status(404).send({ error: 'Try again later' }))
        .catch(err => next(err));
})

//List of emails to be notified when an order is made
router.post('/email', (req, res, next) => {
    orderService.addEmail(req.body)
        .then(em => em ? res.json(em) : res.status(404).send({ error: 'Try again later' }))
        .catch(err => next(err));
})

router.post('/dashboard', (req, res, next) => {
    orderService.populateDashboard(req.body)
        .then((em) => {
            if (em) {
                res.json(em)
            } else {
                res.status(404).send({ error: 'Try again later' })
            }
        })
        .catch(err => next(err));
})



module.exports = router;
