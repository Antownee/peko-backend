const express = require('express');
const router = express.Router();
const multer = require('multer');
const { check, validationResult } = require('express-validator');
const orderService = require("../../utils/orderService");
const orderConstants = require("../../utils/orderConstants");4
let receivedDocumentData = {};


const storage = multer.diskStorage({
    fileFilter: function (req, file, cb) {
        let extArray = file.mimetype.split("/");
        let extension = extArray[extArray.length - 1];
        if (extension !== "pdf") {
            return cb(new Error('Only pdf files are allowed!'), false);
        }
        cb(null, true);
    },
    destination: function (req, file, cb) {
        cb(null, './documents/documents')
    },
    filename: function (req, file, cb) {
        let receivedMetadata = JSON.parse(req.body.filepond);
        receivedDocumentData = {
            documentCode: receivedMetadata.documentCode,
            orderID: receivedMetadata.orderID,
            fileName: file.originalname,
            shipmentID: receivedMetadata.shipmentID
        }
        cb(null, file.originalname)
    }
})
const upload = multer({ storage: storage }).single("filepond")

router.post('/all', (req, res, next) => {
    orderService.getAllOrdersAdmin()
        .then(orders => orders ? res.json(orders) : res.status(404).send({ error: 'Try again later' }))
        .catch(err => next(err));
})

router.post('/update', (req, res, next) => {
    const { orderID, orderValue, teaOrders } = req.body;
    //Sanitize
    orderService.updateOrderValue(orderID, orderValue, teaOrders)
        .then((ord) => {
            if (ord) {
                res.status(200).send({ msg: 'Order updated!', order: ord });
            } else {
                res.status(404).send({ error: "Try again later." });
            }
        })
        .catch(err => next(err));
})


router.post('/delete', (req, res, next) => {
    const { order } = req.body;
    //Sanitize
    orderService.deleteOrder(order)
        .then((ord) => {
            if (ord) {
                res.status(200).send({ msg: 'Order deleted!' });
            } else {
                res.status(404).send({ error: ord.error });
            }
        })
        .catch(err => next(err));
})

router.post('/documents', (req, res, next) => {
    upload(req, res, function (err) {
        if (err instanceof multer.MulterError) {
            return res.status(500).json(err)
        } else if (err) {
            return res.status(500).json(err)
        }

        orderService.uploadDocument(receivedDocumentData)
            .then((msg) => {
                msg.nModified === 1 ? res.send({ msg: 'Document successfully added' }) : res.status(404).send({ error: 'Try again later' });
            })
            .catch((err) => {
                res.status(404).send({ error: 'Try again later' });
                next(err);
            });
    })
})

module.exports = router;
