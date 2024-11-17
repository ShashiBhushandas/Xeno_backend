
const Customer = require('../models/Customer');
const Order = require('../models/Order');
const Campaign=require('../models/Campaign')
const AudienceSegment=require('../models/AudienceSegment')
const CommunicationLog = require('../models/CommunicationLog');
const DeliveryReceipt=require('../models/DeliveryReceipt')
// const { Customer, Campaign, CommunicationLog } = require('../models'); // Import necessary models


// Utility function to simulate delivery status
const getRandomStatus = () => {
    return Math.random() < 0.9 ? 'SENT' : 'FAILED';
};

const filterCustomersByConditions = (customers, conditions) => {
    console.log(customers);
    console.log(conditions);
    
    return customers.filter((customer) => {
        return conditions.every((condition) => {
            const [field, operator, value] = condition.split(' ');

            if (operator === '>') return customer[field] > parseFloat(value);
            if (operator === '<') return customer[field] < parseFloat(value);
            if (operator === '>=') return customer[field] >= parseFloat(value);
            if (operator === '<=') return customer[field] <= parseFloat(value);
            if (operator === '=') return customer[field] === value;

            return false;
        });
    });
};

// Message sending route
exports.sendMessage=async (req, res) => {
    try {
        const { campaignId } = req.body;

        // Fetch the campaign to get the segment ID
        // console.log('Received campaignId:', campaignId);

        // Convert campaignId (which might be a string) to ObjectId
        // const campaignObjectId = mongoose.Types.ObjectId(campaignId);
        
        // Print the ObjectId value to check it
        // console.log('Converted ObjectId:', campaignObjectId);
        
        // Query the Campaign collection using the ObjectId
        const campaign = await Campaign.findById(campaignId);
        // console.log('Converted ObjectId:',campaign);
        
        if (!campaign) return res.status(404).json({ error: 'Campaign not found' });

        const segmentId = campaign.segmentId;

        // Fetch customers who match the segment conditions
        const segment = await AudienceSegment.findById(segmentId);
        if (!segment) return res.status(404).json({ error: 'Audience Segment not found' });
        console.log(segment)
        // Simulating audience retrieval based on segment conditions
        console.log(segment.conditions)
        const response = await fetch('http://localhost:5001/api/data-ingestion/customers');
        const customers = await response.json();
        // const filteredCustomers = filterCustomersByConditions(customers, segment.conditions);
        // customers=filteredCustomers
        // console.log(customers)


        // const query = {};
        // segment.conditions.forEach((condition) => {
        //     const [field, operator, value] = condition.split(' ');

        //     if (operator === '>') query[field] = { $gt: parseFloat(value) };
        //     else if (operator === '<') query[field] = { $lt: parseFloat(value) };
        //     else if (operator === '=') query[field] = value;
        // });
        const filteredCustomers = filterCustomersByConditions(customers, segment.conditions);

        // Filter customers based on the query built from conditions
        // const filteredCustomers = await Customer.find(query);
        // customers=filteredCustomers
        console.log(filteredCustomers)
        // const customers = await Customer.find({ /* Logic to filter based on conditions in segment */ });

        if (!filteredCustomers.length) return res.status(200).json({ message: 'No customers in this segment' });

        // Loop through customers and send messages
        const communications = [];
        for (const customer of filteredCustomers) {
            const message = `Hi ${customer.name}, here’s 10% off on your next order!`;

            // Create a communication log entry
            const commLog = new CommunicationLog({
                customerId: customer._id,
                message,
                campaignId,
                status: 'PENDING', // Initial status
            });

            await commLog.save();

            // Simulate sending message and get delivery status
            const deliveryStatus = getRandomStatus();

            // Call Delivery Receipt API to update status
            await callDeliveryReceiptAPI(commLog._id, deliveryStatus);
            communications.push(commLog);
        }

        res.status(200).json({
            message: 'Messages sent successfully',
            communications,
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Delivery Receipt route
exports.deliveryReceipt=async (req, res) => {
    try {
        const { communicationId, status } = req.body;

        // Find the communication log entry
        const commLog = await CommunicationLog.findById(communicationId);
        if (!commLog) return res.status(404).json({ error: 'Communication not found' });

        // Update the status of the communication
        commLog.status = status;
        await commLog.save();

        res.status(200).json({ message: 'Communication status updated', status });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

const callDeliveryReceiptAPI = async (communicationId, status) => {
    try {
        const response = await fetch('http://localhost:5001/api/messaging/deliveryReceipt', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                communicationId,
                status
            })
        });

        if (!response.ok) {
            throw new Error('Failed to update delivery status');
        }
    } catch (err) {
        console.error('Error while calling delivery receipt API:', err);
    }
};

exports.delivery_receipt=async (req, res) => {
    try {
      const { communicationLogId, status } = req.body;
  
      // Check if communication log exists
      const log = await CommunicationLog.findById(communicationLogId);
      if (!log) {
        return res.status(404).json({ error: 'Communication log not found' });
      }
  
      // Create a new delivery receipt entry
      const deliveryReceipt = new DeliveryReceipt({
        communicationLogId,
        status
      });
  
      // Save delivery receipt
      await deliveryReceipt.save();
  
      // Update the communication log's status to match the delivery receipt
      log.status = status;
      await log.save();
  
      return res.status(200).json({ message: 'Delivery receipt recorded successfully', deliveryReceipt });
    } catch (err) {
      return res.status(500).json({ error: err.message });
    }
  };
  // Get Communication Log API
exports.getCommunicationLog = async (req, res) => {
    try {
        // Fetch all communication logs from the database
        const communicationLogs = await CommunicationLog.find();

        if (!communicationLogs.length) {
            return res.status(404).json({ message: 'No communication logs found' });
        }

        res.status(200).json({ communicationLogs });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};