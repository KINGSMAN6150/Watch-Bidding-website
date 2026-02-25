const mongoose = require('mongoose');

// Sub-schema for individual bids
const BidSchema = new mongoose.Schema({
    bidder: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    amount: {
        type: Number,
        required: true,
    },
    timestamp: {
        type: Date,
        default: Date.now,
    },
});

const WatchSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    brand: {
        type: String,
        required: true,
    },
    model: {
        type: String,
        required: true,
    },
    condition: {
        type: String,
        default: 'Not specified',
    },
    startingBid: {
        type: Number,
        required: true,
    },
    currentBid: {
        type: Number,
        required: true,
    },
    auction_end_time: {
        type: Date,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    image: {
        type: String, // base64 or URL — will migrate to Cloudinary in Phase 4
        required: true,
    },
    // ── New Fields ──────────────────────────────────────────────
    seller: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    status: {
        type: String,
        enum: ['active', 'sold', 'expired'],
        default: 'active',
    },
    bids: [BidSchema], // full bid history
    winner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        default: null,
    },
}, { timestamps: true }); // adds createdAt, updatedAt automatically

module.exports = mongoose.model('Watch', WatchSchema);