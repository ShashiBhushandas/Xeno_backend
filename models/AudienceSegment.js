const mongoose = require('mongoose');

const audienceSegmentSchema = new mongoose.Schema({
    name: { type: String, required: true },
    conditions: [String], // Store conditions as strings
    audienceSize: { type: Number, default: 0 },
    createdAt: { type: Date, default: Date.now },
});


const AudienceSegment = mongoose.model('AudienceSegment', audienceSegmentSchema);

module.exports = AudienceSegment;