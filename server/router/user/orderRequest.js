const express = require('express');
const router = express.Router();
const worker = require("../../utils/bgworkers/worker");
const { check, validationResult } = require('express-validator');
const orderService = require("../../utils/orderService");
const multer = require('multer');
let receivedDocumentData = {};

let storage = multer.diskStorage({
    fileFilter: function (req, file, cb) {
        if (file.mimetype !== "application/pdf") {
            req.fileValidationError = 'Only pdf files are allowed!';
            return cb(new Error('Only pdf files are allowed!'));
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

//Create order
router.post('/', [
    check('orderRequestID').not().isEmpty(),
    check('userID').not().isEmpty(),
], (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(404).send({ message: 'Try again later' })
    }

    const { orderRequestID, userID, teaOrders } = req.body;
    orderService.addOrder(orderRequestID, userID, teaOrders)
        .then((result) => {
            if (result) {
                worker.emailQueue.add({ status: "ORDER_INIT", order });
                return res.status(200).send({ message: result });
            } else {
                return res.status(404).send({ message: 'Try again later' })
            }
        })
        .catch(err => next(err));
});

router.post('/all', [
    check('userID').not().isEmpty(),
    check('userID').trim().escape(),
], (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(404).send({ message: 'Try again later' })
    }

    let { userID } = req.body;
    orderService.getAllOrdersUser(userID)
        .then(orders => orders ? res.status(200).json(orders) : res.status(404).send({ message: 'Try again later' }))
        .catch(err => next(err));
})


router.post('/documents', (req, res, next) => {
    upload(req, res, function (err) {
        if (req.file.mimetype !== "application/pdf") {
            return  res.status(500).json("only pdfs allowed");;
        }

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
