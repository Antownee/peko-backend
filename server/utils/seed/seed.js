//Seeding script. Pre-populate the db with
//1. Tea types defined in a json file and the respective image
//2. Create an Admin user

const bcrypt = require('bcryptjs');
const shortid = require('shortid');
const User = require('../../models/user');
const TeaItem = require("../../models/tea");
const fs = require('fs');
const mongoose = require('mongoose');
const config = require("../../config/config");

mongoose.connect(config.database, { useCreateIndex: true, useNewUrlParser: true });

var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));

db.once('open', function () {
    //seed
    createAdmin();
    addTeaTypes();
  console.log('cup of joe has connected to the database.')
});

module.exports = {
    createAdmin,
    addTeaTypes
}


async function createAdmin() {
    const user = new User({
        userID: `COJ-${shortid.generate()}`,
        firstName: "Admin",
        lastName: " ",
        country: "Kenya",
        joinDate: Date.now().toString(),
        username: "admin",
        role: 'Admin'
    });

    // hash password
    user.hash = bcrypt.hashSync("password", 10);

    await user.save();
    console.log("Admin user added.");
    //log
}

async function addTeaTypes() {
    //read from json
    //for each object, create a tea object
    let teatypes = fs.readFileSync("./server/utils/seed/tea-types.json");
    let teaObjects = JSON.parse(teatypes);

    for (let i = 0; i < teaObjects.length; i++) {
        const tea = teaObjects[i];

        const teaItem = new TeaItem({
            teaID: `CH-${shortid.generate()}`,
            teaName: tea.teaName,
            teaDescription: tea.teaDescription
        });

        if (await TeaItem.findOne({ teaID: teaItem.teaID })) {
            return;
        }
        await teaItem.save();
        console.log(`${tea.teaName} has been added.`)
    }
}

