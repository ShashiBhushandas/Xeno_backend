// const express = require('express');
const AudienceSegment = require('../models/AudienceSegment');
const Customer = require('../models/Customer');

// const router = express.Router();

// Create an audience segment
exports.addAudseg= async (req, res) => {
    try {
        const { name, conditions } = req.body;

        // Build dynamic query
        const query = {};
        console.log(conditions)
        conditions.forEach((condition) => {
            const [field, operator, value] = condition.split(' ');

            if (operator === '>') query[field] = { $gt: parseFloat(value) };
            else if (operator === '<') query[field] = { $lt: parseFloat(value) };
            else if (operator === '=') query[field] = value;
        });

        // Get audience size
        const audienceSize = await Customer.countDocuments(query);

        // Save the segment
        const segment = new AudienceSegment({ name, conditions, audienceSize });
        await segment.save();
        console.log(segment)
        res.status(201).json({ message: 'Audience segment created', segment });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Get all audience segments
exports.Audsegs=async (req, res) => {
    try {
        const segments = await AudienceSegment.find();
        res.status(200).json(segments);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};


const Campaign = require('../models/Campaign');

// Create a campaign
exports.addCamp=async (req, res) => {
    try {
        const { segmentId, name, audienceSize } = req.body;

        const campaign = new Campaign({
            segmentId,
            name,
            audienceSize
        });

        await campaign.save();
        res.status(201).json({ message: 'Campaign created successfully', campaign });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Get campaign history
exports.camps=async (req, res) => {
    try {
        const campaigns = await Campaign.find()
            .populate('segmentId', 'name conditions') // Populate segment details
            .sort({ sentAt: -1 }); // Sort by most recent

        res.status(200).json(campaigns);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// const CommunicationLog = require('../models/CommunicationLog');

// Send messages
// exports.sendMessage=async (req, res) => {
//     try {
//         const { audienceSegmentId, messageTemplate } = req.body;

//         // Fetch customers in the segment
//         const segment = await AudienceSegment.findById(audienceSegmentId);
//         const query = {};
//         segment.conditions.forEach((condition) => {
//             const [field, operator, value] = condition.split(' ');
//             if (operator === '>') query[field] = { $gt: parseFloat(value) };
//             else if (operator === '<') query[field] = { $lt: parseFloat(value) };
//             else if (operator === '=') query[field] = value;
//         });

//         const customers = await Customer.find(query);

//         // Send messages and log results
//         const logs = [];
//         for (const customer of customers) {
//             const personalizedMessage = messageTemplate.replace('[Name]', customer.name);

//             const status = Math.random() < 0.9 ? 'SENT' : 'FAILED'; // 90% success rate

//             logs.push(
//                 new CommunicationLog({
//                     audienceSegmentId,
//                     customerId: customer._id,
//                     message: personalizedMessage,
//                     status,
//                 })
//             );
//         }

//         await CommunicationLog.insertMany(logs);

//         res.status(200).json({ message: 'Messages sent', logs });
//     } catch (err) {
//         res.status(500).json({ error: err.message });
//     }
// };

// module.exports = router;