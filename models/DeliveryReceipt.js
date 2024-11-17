const mongoose = require('mongoose');

// Define the schema for DeliveryReceipt
const deliveryReceiptSchema = new mongoose.Schema({
  communicationLogId: { type: mongoose.Schema.Types.ObjectId, ref: 'CommunicationLog', required: true },
  status: { type: String, enum: ['SENT', 'FAILED'], required: true },  // SENT or FAILED status
  timestamp: { type: Date, default: Date.now }
});

// Create a DeliveryReceipt model using the schema
const DeliveryReceipt = mongoose.model('DeliveryReceipt', deliveryReceiptSchema);

module.exports = DeliveryReceipt;