const express = require('express');
const router = express.Router();
const multer = require('multer');
const { check, validationResult } = require('express-validator');
const orderService = require("../../utils/orderService");
const orderConstants = require("../../utils/orderConstants"); 
const path = require("path");
let receivedDocumentData = {};


const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, path.resolve(__dirname, "../../../documents/documents"))
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

const fileFilter = (req, file, cb) => {
    if (file.mimetype !== "application/pdf") {
        req.fileValidationError = 'Only pdf files are allowed!';
        return cb(new Error('Only pdf files are allowed!'));
    }
    cb(null, true);
}

const upload = multer({ storage: storage, fileFilter: fileFilter }).single("filepond")

router.post('/all', (req, res, next) => {
    orderService.getAllOrdersAdmin()
        .then(orders => orders ? res.json(orders) : res.status(404).send({ error: 'Try again later' }))
        .catch(err => next(err));
})

router.post('/update', [
    check('orderID').trim().escape(),
    check('orderValue').isNumeric().trim().escape()
], (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(404).send({ error: 'Try again later' })
    }

    const { orderID, orderValue, teaOrders } = req.body;
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


router.post('/delete', [
    check('orderRequestID').trim().escape(),
], (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(404).send({ error: 'Try again later' })
    }
    const { orderRequestID } = req.body;
    orderService.deleteOrder(orderRequestID)
        .then((ord) => {
            if (ord) {
                return res.status(200).send({ msg: 'Order deleted!' });
            } else {
                return res.status(404).send({ error: ord.error });
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
