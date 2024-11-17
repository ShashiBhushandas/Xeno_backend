const Customer = require('../models/Customer');
const Order = require('../models/Order');

exports.addCustomer = async (req, res) => {
    try {
        const { name, email, totalSpending, visits, lastVisit } = req.body;

        // Fetch the max CustomerId from the database
        const maxCustomer = await Customer.findOne().sort({ CustomerId: -1 }).exec();

        // Calculate the new CustomerId
        let newCustomerId = 1; // Default starting ID if no customers exist
        if (maxCustomer && maxCustomer.CustomerId) {
            newCustomerId = maxCustomer.CustomerId + 1;
        }

        // Create a new customer with the incremented CustomerId
        const customer = new Customer({
            CustomerId: newCustomerId,
            name,
            email,
            totalSpending: totalSpending || 0,
            visits: visits || 0,
            lastVisit
        });

        await customer.save();
        res.status(201).json({ message: 'Customer added successfully', customer });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.addOrder = async (req, res) => {
    try {
        const { customerId, amount } = req.body;

        // Check if the customerId exists in the Customer collection
        const customer = await Customer.findOne({ CustomerId: customerId });
        if (!customer) {
            return res.status(404).json({ message: 'Customer not found' });
        }

        // Create the order
        const order = new Order({ customerId, amount });
        await order.save();

        res.status(201).json({ message: 'Order created successfully', order });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};


exports.getCustomers = async (req, res) => {
    try {
        const customers = await Customer.find();
        res.status(200).json(customers);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.getOrders = async (req, res) => {
    try {
        const orders = await Order.find();
        res.status(200).json(orders);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};