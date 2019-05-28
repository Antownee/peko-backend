const shortid = require('shortid');
const rp = require('request-promise');
const cheerio = require('cheerio');
const orderRequest = require("../models/orderRequest");
const Tea = require("../models/tea");
const Email = require("../models/email");
const fs = require('fs');
require('dotenv').config();

//Required
shortid.characters('0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ$@');


module.exports = {
    addTeaItem,
    addOrder,
    getAllOrdersUser,
    getAllOrdersAdmin,
    confirmOrder,
    uploadDocument,
    addEmail,
    getEmails,
    populateDashboard,
    isDocumentInStorage
};

//USER
async function addOrder(orderParams) {
    //Sanitise
    const order = new orderRequest({
        orderRequestID: `ORQ-${shortid.generate()}`,
        requestDate: Date.now().toString(),
        teaID: orderParams.teaID,
        amount: orderParams.amount,
        notes: orderParams.description,
        userID: orderParams.userID,
        confirmed: false
    })

    if (await orderRequest.findOne({ orderRequestID: order.orderRequestID })) {
        throw `Order has already been created`;
    }

    await order.save();
    return "Order successfully added";
}

async function getAllOrdersUser(orderParams) {
    return await orderRequest.find({ userID: orderParams.userID });
}

//ADMIN
async function getAllOrdersAdmin() {
    return await orderRequest.find({});
}

async function confirmOrder(order) {
    return await orderRequest.findOneAndUpdate({ orderRequestID: order.orderRequestID }, { confirmed: true }, { new: true })
}

async function uploadDocument(receivedDocumentData) {
    //First look for existing file. If it does exist, update. If new, push
    let { orderID, documentCode, fileName } = receivedDocumentData;
    let documentsInObject = await orderRequest.find({ "documents.documentCode": documentCode });
    if (documentsInObject.length > 0) {
        //if file exists in db, update the object in the array
        return await orderRequest.updateOne({ orderRequestID: orderID }, { $set: { documents: { fileName, documentCode } } });
    } else {
        //if file is new, add the object in the array
        return await orderRequest.updateOne({ orderRequestID: orderID }, { $push: { documents: { fileName, documentCode } } }); l
    }
}

function isDocumentInStorage(orderID, documentCode) {
    //get files in the documents folder that match the orderID and code
    let res = fs.readdirSync("./documents").find(file => {
        if (file.split(".")[0] === `${orderID}_${documentCode}`) {return file }
    });
    return res ? res : ""
}

async function addTeaItem(tea) {
    //Sanitise
    const teaItem = new Tea({
        teaID: `CH-${shortid.generate()}`,
        teaName: tea.teaName,
        description: tea.teaDescription
    });

    if (await Tea.findOne({ teaID: teaItem.teaID })) {
        throw `Tea has already been created`;
    }

    await teaItem.save();
    return "Tea successfully added";
}

async function addTeaItem(tea) {
    //Sanitise
    const teaItem = new Tea({
        teaID: `CH-${shortid.generate()}`,
        teaName: tea.teaName,
        description: tea.teaDescription
    });

    if (await Tea.findOne({ teaID: teaItem.teaID })) {
        throw `Tea has already been created`;
    }

    await teaItem.save();
    return "Tea successfully added";
}

async function addEmail(e) {
    const em = new Email({ email: e.email })

    if (await Email.findOne({ email: em.email })) {
        throw `Email has already been created`;
    }

    await em.save();
    return "Email successfully added";
}

async function getEmails() {
    return await Email.find({});
}

async function getPrice() {
    const html = await rp("https://ycharts.com/indicators/mombasa_tea_price");
    const cellvalue = cheerio('table.summData tbody tr td', html)[1].childNodes[0].data;
    return parseFloat(cellvalue) * 100;
}

async function getMonthData() {
    const html = await rp("https://ycharts.com/indicators/mombasa_tea_price");
    const rows = cheerio('table.histDataTable tbody tr td', html).slice(0, 10);

    let data = [];
    for (let i = 0; i < rows.length; i += 2) {
        const month = rows[i].children[0].data;
        const price = parseFloat(rows[i + 1].children[0].data) * 100;
        data.push({ month, price });
    }

    return data
}


async function getAdminDashboard() {
    //Historical price 
    const historicalPrices = await getMonthData();
    //Price of tea
    const priceOfTea = await getPrice();
    //Number of orders made
    const numberOfOrders = await orderRequest.countDocuments({});
    //Pending orders
    const pendingOrders = await orderRequest.countDocuments({ confirmed: false });
    //Last 5 orders
    const recentOrders = await orderRequest.find().sort('date').limit(5)

    return {
        numberOfOrders,
        pendingOrders,
        priceOfTea,
        recentOrders,
        historicalPrices
    };
}

async function getUserDashboard(user) {
    //Historical price 
    const historicalPrices = await getMonthData();
    //Price of tea
    const priceOfTea = await getPrice();
    //Number of orders made
    const numberOfOrders = await orderRequest.countDocuments({ userID: user.userID });
    //Pending orders
    const pendingOrders = await orderRequest.countDocuments({ userID: user.userID, confirmed: false });
    //Last 5 orders
    const recentOrders = await orderRequest.find({ userID: user.userID }).sort('date').limit(5)

    return {
        numberOfOrders,
        pendingOrders,
        priceOfTea,
        recentOrders,
        historicalPrices
    };
}

function populateDashboard(user) {
    if (user.role === "Admin") {
        return getAdminDashboard();
    } else {
        return getUserDashboard(user);
    }
}
