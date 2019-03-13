var express = require('express');
const faker = require('faker');
var router = express.Router();

const User = require('../models/user');

router.post('/', (req, res, next) => {
   var newUser = new User({
       userID: faker.random.uuid(),
       firstName: faker.name.firstName(),
       lastName: faker.name.lastName(),
       country: faker.address.country(),
       joinDate: faker.date.recent(2)
   })

   newUser.save().then(
       () => {
           var msg = `New user ${newUser.firstName} ${newUser.lastName} has been created`;
           console.log(msg);
           res.status(200).send(msg);
       },
       (e) => {
           console.log(e.message);
           next(e);
       }
   )
})

module.exports = router;