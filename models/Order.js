const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
    customerId: { type: Number, required: true }, // Store CustomerId from Customer schema
    amount: { type: Number, required: true },
    date: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Order', orderSchema);
