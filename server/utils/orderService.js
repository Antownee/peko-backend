const shortid = require('shortid');
const rp = require('request-promise');
const cheerio = require('cheerio');
const orderRequest = require("../models/orderRequest");
const Tea = require("../models/tea");
const Email = require("../models/email");

//Required
shortid.characters('0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ$@');


module.exports = {
    addTeaItem,
    addOrder,
    getAllOrdersUser,
    getAllOrdersAdmin,
    confirmOrder,
    uploadDocuments,
    addEmail,
    populateAdminDashboard
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
    return await orderRequest.updateOne({ orderRequestID: order.orderRequestID }, { confirmed: true })
}

async function uploadDocuments(documents) {
    const orderId = documents[0].path;
    const id = orderId.substr(0, orderId.indexOf('_'));
    const code = (orderId.split('_', 2)[1]).split('.', 1)[0];
    //Include code in saving details
    const newDocs = documents.map((doc) => {
        return {
            path: doc.path,
            code
        }
    })
    return await orderRequest.updateOne({ orderRequestID: id }, { $push: { documents: newDocs } })
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

async function getPrice() {
    const html = await rp("https://ycharts.com/indicators/mombasa_tea_price");
    const cellvalue = cheerio('table.summData tbody tr td', html)[1].childNodes[0].data;
    return parseFloat(cellvalue) * 100;
}

async function getMonthData() {
    const html = await rp("https://ycharts.com/indicators/mombasa_tea_price");
    const rows = cheerio('table.histDataTable tbody tr td', html).slice(0, 10);

    let months = [];
    let prices = [];
    for (let i = 0; i < rows.length; i += 2) {
        const month = rows[i].children[0].data;
        const price = parseFloat(rows[i + 1].children[0].data) * 100;
        months.push(month);
        prices.push(price);
    }

    return { months, prices }
}

async function populateAdminDashboard(user) {
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

