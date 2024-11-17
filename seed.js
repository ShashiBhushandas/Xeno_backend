const mongoose = require('mongoose');

// Define the schemas
const customerSchema = new mongoose.Schema({
    CustomerId: { type: Number, required: true, unique: true },
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    totalSpending: { type: Number, default: 0 },
    visits: { type: Number, default: 0 },
    lastVisit: { type: Date }
});

const orderSchema = new mongoose.Schema({
    customerId: { type: Number, required: true }, // Match CustomerId field
    amount: { type: Number, required: true },
    date: { type: Date, default: Date.now }
});

const Customer = mongoose.model('Customer', customerSchema);
const Order = mongoose.model('Order', orderSchema);

// MongoDB Connection
const connectDB = async () => {
    try {
        await mongoose.connect('mongodb://127.0.0.1:27017/crm', {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });
        console.log('MongoDB connected');
    } catch (err) {
        console.error(err.message);
        process.exit(1);
    }
};

// Realistic customer data
const customerNames = [
    "Alice Johnson", "Bob Smith", "Charlie Brown", "Diana Prince", "Ethan Hunt",
    "Fiona Gallagher", "George Clooney", "Hannah Montana", "Ian Wright", "Jessica Alba",
    "Kevin Hart", "Liam Neeson", "Megan Fox", "Nina Dobrev", "Oscar Isaac",
    "Penelope Cruz", "Quentin Tarantino", "Rachel Green", "Seth Rogen", "Tina Fey",
    "Uma Thurman", "Vin Diesel", "Will Smith", "Xander Cage", "Yara Shahidi", "Zoe Saldana"
];

const domains = ["gmail.com", "yahoo.com", "outlook.com"];

// Generate realistic email addresses
const generateEmail = (name) => {
    const [firstName, lastName] = name.toLowerCase().split(" ");
    return `${firstName}.${lastName}@${domains[Math.floor(Math.random() * domains.length)]}`;
};

// Function to generate random data
const getRandomInt = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;

const generateRandomDate = (start, end) => {
    return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
};

const seedData = async () => {
    try {
        // Clear existing data
        await Customer.deleteMany({});
        await Order.deleteMany({});

        console.log('Existing data removed from Customer and Order collections.');

        // Create customers (25 customers)
        const customers = [];
        for (let i = 0; i < 25; i++) {
            const customer = new Customer({
                CustomerId: i + 1,
                name: customerNames[i],
                email: generateEmail(customerNames[i]),
                totalSpending: 0, // Default value, will be updated later
                visits: getRandomInt(1, 20),
                lastVisit: generateRandomDate(new Date(2023, 0, 1), new Date())
            });
            customers.push(customer);
        }
        const savedCustomers = await Customer.insertMany(customers);

        // Create orders (25 orders)
        const orders = [];
        for (let i = 0; i < 25; i++) {
            const randomCustomer = savedCustomers[getRandomInt(0, savedCustomers.length - 1)];
            const orderAmount = getRandomInt(50, 5000);
            const order = new Order({
                customerId: randomCustomer.CustomerId, // Use CustomerId
                amount: orderAmount,
                date: generateRandomDate(new Date(2023, 0, 1), new Date())
            });
            orders.push(order);

            // Update totalSpending for the customer incrementally
            randomCustomer.totalSpending += orderAmount;
        }

        // Save all orders to the database
        await Order.insertMany(orders);

        // Update each customer's totalSpending in the database
        for (let customer of savedCustomers) {
            await Customer.updateOne({ CustomerId: customer.CustomerId }, { totalSpending: customer.totalSpending });
        }

        console.log('Database seeded successfully with 25 records');
        process.exit(0);
    } catch (err) {
        console.error(err.message);
        process.exit(1);
    }
};

// Run the script
(async () => {
    await connectDB();
    await seedData();
})();