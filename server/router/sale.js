var express = require('express');
const faker = require('faker');
var router = express.Router();

const Sale = require('../models/sale');

//Create new sale
router.post('/', (req, res, next) => {
    var newSale = new Sale({
        saleID: faker.random.uuid(),
        userID: faker.random.uuid(),
        itemsSold: [{ commodity: "Tea", }],
        saleStartDate: faker.date.recent(),
        saleCompleteDate: faker.date.recent(),
        cost: 3000

    });

    newSale.save().then(
        () => {
            var msg = `New sale ${newSale.saleID} has been added`;
            console.log(msg)
            res.status(200).send(msg);
        },
        (e) => {
            console.error(e.message);
            next(e);
        }
    )
})

module.exports = router;