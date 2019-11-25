//Seeding script. Pre-populate the db with
//1. Tea types defined in a json file and the respective image
//2. Create an Admin user
//3. Add emails of COJ users

const bcrypt = require('bcryptjs');
const shortid = require('shortid');
const User = require('../../models/user');
const TeaItem = require("../../models/tea");
const fs = require('fs');
const path = require("path");
//const mongoose = require('mongoose');
const config = require("../../config/config");

module.exports = {
    createAdmin,
    addTeaTypes,
    createDocumentFolder
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
    user.hash = bcrypt.hashSync("12", 10);

    await user.save();
    console.log("Admin user added.");
    //log
}

async function addTeaTypes() {
    //read from json
    //for each object, create a tea object
    let teatypes = fs.readFileSync(path.resolve(__dirname, "./tea-types.json"));
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
        console.log(`${tea.teaName} has been added.`);
    }
}

function createDocumentFolder() {
    let dir = path.resolve(__dirname, "../../../documents/documents");

    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir);
    }
}

