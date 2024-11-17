const express = require('express');
const router = express.Router();
const { sendMessage, deliveryReceipt ,delivery_receipt,getCommunicationLog} = require('../controllers/messagingController.js');

router.post('/sendMessage', sendMessage);
router.post('/deliveryReceipt', deliveryReceipt);
router.post('/delivery_receipt', delivery_receipt);
router.get('/communication-log', getCommunicationLog);


module.exports = router;
