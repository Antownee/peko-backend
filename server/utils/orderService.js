const shortid = require('shortid');
const rp = require('request-promise');
const cheerio = require('cheerio');
const orderRequest = require("../models/orderRequest");
const TeaItem = require("../models/tea");
const Email = require("../models/email");
const User = require('../models/user');
const Shipment = require('../models/shipment');
const fs = require('fs');
const Sentry = require('@sentry/node');
require('dotenv').config();

//Required
shortid.characters('0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ$@');


module.exports = {
    addTeaItem,
    addOrder,
    updateOrderValue,
    getAllOrdersUser,
    getAllOrdersAdmin,
    deleteOrder,
    uploadDocument,
    addEmail,
    getCOJEmails,
    getUserEmail,
    isDocumentInStorage,
    getTeaItems,
    addShipment,
    updateShipment,
    getShipmentsFromOrder,
    getAdminDashboard,
    getUserDashboard,
    deleteShipment,
    updateOrderStatus,
    getAssetPage
};

//USER
async function addOrder(orderRequestID, userID, teaOrders) {
    const order = new orderRequest({
        orderRequestID: orderRequestID,
        userID: userID,
        confirmed: false,
        requestDate: Date.now().toString(),
        orderStatus: "ORDER_INIT",
        teaOrders: teaOrders
    })

    if (await orderRequest.findOne({ orderRequestID: orderRequestID })) {
        throw `Order has already been created`;
    }

    await order.save();
    return "Order successfully added";
}

async function getAllOrdersUser(userID) {
    return await orderRequest.find({ userID });
}

//ADMIN
async function getAllOrdersAdmin() {
    return await orderRequest.find({});
}

async function deleteOrder(orderRequestID) {
    await Shipment.deleteMany({ orderID: orderRequestID })
    return await orderRequest.findOneAndDelete({ orderRequestID });
}


async function uploadDocument(receivedDocumentData) {
    let { orderID, documentCode, fileName, shipmentID } = receivedDocumentData;
    let dateAdded = Date.now().toString();
    //First update the position/status of the order

    //Look for existing file. If it does exist, update. If new, push
    let documentsInObject = await Shipment.find({ shipmentID, "documents.documentCode": documentCode });
    if (documentsInObject.length > 0) {
        //if file exists in db, update the object in the array
        return await Shipment.updateOne({ shipmentID }, { $set: { documents: { fileName, documentCode, dateAdded, submitted: true } } });
    } else {
        //if file is new, add the object in the array
        return await Shipment.updateOne({ shipmentID }, { $push: { documents: { fileName, documentCode, dateAdded, submitted: true } } });
    }
}

function isDocumentInStorage(orderID, documentCode) {
    //get files in the documents folder that match the orderID and code
    let res = fs.readdirSync("./documents").find(file => {
        if (file.split(".")[0] === `${orderID}_${documentCode}`) { return file }
    });
    return res ? res : ""
}

async function addTeaItem(teaName, teaDescription) {
    //Sanitise
    const teaItem = new TeaItem({
        teaID: `CH-${shortid.generate()}`,
        teaName: teaName,
        teaDescription: teaDescription
    });

    if (await TeaItem.findOne({ teaID: teaItem.teaID })) {
        throw `Tea has already been created`;
    }

    await teaItem.save();
    return "Tea successfully added";
}

async function getTeaItems() {
    return await TeaItem.find({});
}

async function addEmail(email) {
    const em = new Email({ email })

    if (await Email.findOne({ email })) {
        throw `Email has already been created`;
    }

    await em.save();
    return "Email successfully added";
}

async function getCOJEmails() {
    return await Email.find({});
}

async function getUserEmail(orderID) {
    let order = await orderRequest.findOne({ orderRequestID: orderID });
    return await User.findOne({ userID: order.userID });
}

async function getPrice() {
    const html = await rp("https://ycharts.com/indicators/mombasa_tea_price");
    const cellvalue = cheerio('table.summData tbody tr td', html)[1].childNodes[0].data;
    return parseFloat(cellvalue) * 100;
}

async function getMonthData() {
    const url1 = "https://www.indexmundi.com/commodities/?commodity=tea&months=5";
    const url2 = "https://ycharts.com/indicators/mombasa_tea_price";
    const html = await rp(url1)
        .catch((e) => {
            Sentry.captureException(e)
        });
    const rows = cheerio('table.tblData tbody tr td', html);

    let data = [];
    for (let i = 0; i < rows.length; i += 3) {
        const month = rows[i].children[0].data;
        const price = parseFloat(rows[i + 1].children[0].data);
        data.push({ month, price });
    }

    return data
}

async function getAdminTotalOrderWeight() {
    //Sum all the shipmentWeight in shipment collection
    let total = await orderRequest.aggregate([
        { $unwind: "$teaOrders" },
        {
            $group: {
                _id: null,
                totalOrderWeight: { $sum: "$teaOrders.weight" }
            }
        }
    ]);
    return total.length === 0 ? 0 : `${total[0].totalOrderWeight} kgs`;
}

async function getUserTotalOrderWeight(userID) {
    let total = await orderRequest.aggregate([
        { $match: { userID: userID } },
        { $unwind: "$teaOrders" },
        {
            $group: {
                _id: null,
                totalOrderWeight: { $sum: "$teaOrders.weight" }
            }
        }
    ]);
    return total.length === 0 ? 0 : `${total[0].totalOrderWeight} kgs`;
}

async function getAssetPage() {
    const teaList = await getTeaItems();
    const emailList = await getCOJEmails();

    return { teaList, emailList }
}


async function getAdminDashboard() {
    //Historical price 
    const historicalPrices = await getMonthData();
    //Price of tea
    //const priceOfTea = await getPrice();
    //Number of orders made
    const numberOfOrders = await orderRequest.countDocuments({});
    //Pending orders
    const shippedOrders = await orderRequest.countDocuments({ orderStatus: "ORDER_SHIPMENT_ADDED" });
    //Last 5 orders
    const recentOrders = await orderRequest.find().sort('-date').limit(5)
    //Total kgs moved by all clients to date
    const totalOrderWeight = await getAdminTotalOrderWeight();

    return {
        numberOfOrders,
        shippedOrders,
        //priceOfTea,
        recentOrders,
        historicalPrices,
        totalOrderWeight
    };
}

async function getUserDashboard(userID) {
    //Historical price 
    const historicalPrices = await getMonthData();
    //Price of tea
    //const priceOfTea = await getPrice();
    //Number of orders made
    const numberOfOrders = await orderRequest.countDocuments({ userID });
    //Shipped orders
    const shippedOrders = await orderRequest.countDocuments({ userID, orderStatus: "ORDER_SHIPMENT_ADDED" });
    //Last 5 orders
    const recentOrders = await orderRequest.find({ userID }).sort('-date').limit(5)
    //Total kgs moved by all clients to date
    const totalOrderWeight = await getUserTotalOrderWeight(userID);


    return {
        numberOfOrders,
        shippedOrders,
        //priceOfTea,
        recentOrders,
        historicalPrices,
        totalOrderWeight
    };
}

async function getShipmentsFromOrder(orderID) {
    return await Shipment.find({ orderID });
}

async function addShipment(shipmentParam) {
    //Check total weight of order. Is total shipment larger than total order weight? send message
    // if (await checkTotalShipmentValue) {
    //     return { error: `Shipment value exceeds current total order value. \nFirst update the order value.` }
    // }

    // if (await checkTotalShipmentWeight(shipmentParam.orderID)) {
    //     return { error: `Shipment weight exceeds current total order weight. \nFirst update the order weight.` }
    // }

    let newShipment = new Shipment({
        userID: shipmentParam.userID,
        shipmentID: shipmentParam.shipmentID,
        orderID: shipmentParam.orderID,
        shipmentDate: Date.now().toString(),
        shipmentValue: shipmentParam.shipmentValue,
        shipmentWeight: shipmentParam.shipmentWeight,
        orderShipped: false
    })

    if (await Shipment.findOne({ shipmentID: newShipment.shipmentID })) {
        return { error: `Shipment has already been created` }
    }

    return await newShipment.save()
        .then((doc) => {
            return { shipment: doc, message: "Shipment successfully added" }
        }).catch((err) => {
            throw err
        })
}

//This function checks the total shipment weight in an order to the already defined total order value
//This shipment value is not supposed to exceed the order value
async function checkTotalShipmentWeight(orderID) {
    //Weight: New shipment value + current total shipment value < total order value

    //Get total shipment weight shipments from orderID
    let shipments = getShipmentsFromOrder(orderID);
    //const totalShipmentValue = 0
    const checkTotalShipmentValue = shipments.reduce((accum, item) => accum + item.shipmentValue, 0)

    for (const shipment in shipments) {
        totalShipmentValue += shipment.shipmentValue
    }
    console.log(totalShipmentValue);
    //Sum the shipment values
    //Get order
    let order = await orderRequest.findOne({ orderRequestID: orderID });
    //compare that to total order value
    return false;
}

async function checkTotalShipmentValue() {
    return false;
}

async function updateShipment(shipmentID, shipmentValue, shipmentWeight) {
    //Check total weight of order. Is total shipment larger than total order weight? send message

    return await Shipment.findOneAndUpdate({ shipmentID: shipmentID }, { shipmentValue, shipmentWeight }, { new: true })
}

async function deleteShipment(shipmentID) {
    return await Shipment.findOneAndDelete({ shipmentID });
}


async function updateOrderStatus(orderRequestID, orderStatus) {
    return await orderRequest.findOneAndUpdate({ orderRequestID: orderRequestID }, { orderStatus }, { new: true })
}

async function updateOrderValue(orderRequestID, orderValue, teaOrders) {
    return await orderRequest.findOneAndUpdate({ orderRequestID: orderRequestID }, { orderValue, teaOrders }, { new: true })
}