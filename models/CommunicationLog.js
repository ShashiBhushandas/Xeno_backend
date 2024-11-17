const mongoose = require('mongoose');

const communicationLogSchema = new mongoose.Schema({
    customerId: { type: mongoose.Schema.Types.ObjectId, ref: 'Customer' },
    message: { type: String, required: true },
    campaignId: { type: mongoose.Schema.Types.ObjectId, ref: 'Campaign' },
    status: { type: String, enum: ['PENDING', 'SENT', 'FAILED'], default: 'PENDING' },
}, { timestamps: true });

const CommunicationLog = mongoose.model('CommunicationLog', communicationLogSchema);

module.exports = CommunicationLog;