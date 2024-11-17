const mongoose = require('mongoose');

const customerSchema = new mongoose.Schema({
    CustomerId: { type: Number, required: true, unique: true },
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    totalSpending: { type: Number, default: 0 },
    visits: { type: Number, default: 0 },
    lastVisit: { type: Date }
});

// Check if the model is already compiled
const Customer = mongoose.models.Customer || mongoose.model('Customer', customerSchema);

module.exports = Customer;

