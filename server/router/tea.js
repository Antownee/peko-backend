var express = require('express');
const faker = require('faker');
var router = express.Router();

const Tea = require('../models/tea');

//Create new tea 
router.post('/', (req, res, next) => {
    var newTea = new Tea({
        teaID: faker.random.uuid(),
        teaName: "Chai - 1",
        blend: true
    });

    newTea.save(
        () => {
            var msg = `New tea type ${newTea.teaName} has been added`;
            console.log(msg)
            res.status(200).send(msg);
        },
        (e) => {
            console.error(e.message);
            next(e);
        })

});

module.exports = router;