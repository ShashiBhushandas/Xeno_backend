const express = require('express');
const router = express.Router();
const { addCustomer, addOrder, getCustomers, getOrders } = require('../controllers/dataIngestionController');

router.post('/customer', addCustomer);
router.post('/order', addOrder);
router.get('/customers', getCustomers); // NEW
router.get('/orders', getOrders);       // NEW

module.exports = router;
