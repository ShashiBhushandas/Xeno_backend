const mongoose = require('mongoose');

const campaignSchema = new mongoose.Schema({
    segmentId: { type: mongoose.Schema.Types.ObjectId, ref: 'AudienceSegment', required: true },
    name: { type: String, required: true },
    sentAt: { type: Date, default: Date.now },
    audienceSize: { type: Number, required: true },
    sentCount: { type: Number, default: 0 },
    failedCount: { type: Number, default: 0 }
});

const Campaign = mongoose.model('Campaign', campaignSchema);

module.exports = Campaign;