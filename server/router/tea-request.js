var express = require('express');
const faker = require('faker');
var router = express.Router();

const TeaRequest = require('../models/teaRequest');

//Create tea request
router.post('/', (req, res, next) => {
    var newTeaRequest = new TeaRequest({
        teaRequestID: faker.random.uuid(),
        requestDate: faker.date.recent(),
        teaID: faker.random.uuid()
    });

    newTeaRequest.save(
        () => {
            var msg = `New tea request ${newTeaRequest.teaRequestID} has been added`;
            console.log(msg)
            res.status(200).send(msg);
        },
        (e) => {
            console.error(e.message);
            next(e);
        });
});

module.exports = router;
