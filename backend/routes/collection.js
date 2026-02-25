const express = require('express');
const router = express.Router();
const Watch = require('../models/Watch');
const authMiddleware = require('../middleware/authMiddleware');

router.post('/', authMiddleware, async (req, res) => {
    const { name, brand, model, condition, bid, description, auction_end_time, image } = req.body;

    if (!name || !brand || !model || !bid || !auction_end_time || !description || !image) {
        return res.status(400).json({ message: 'Missing required fields.' });
    }

    try {
        const newWatch = new Watch({
            name,
            brand,
            model,
            condition: condition || 'Not specified',
            startingBid: bid,
            currentBid: bid,
            auction_end_time,
            description,
            image,
            seller: req.user,
        });

        const savedWatch = await newWatch.save();
        res.status(201).json(savedWatch);
    } catch (error) {
        console.error('Error saving watch:', error);
        res.status(500).json({ message: 'Error saving watch.' });
    }
});

router.get('/', async (req, res) => {
    try {
        const watches = await Watch.find({ status: 'active' }).populate('seller', 'name email');
        res.json(watches);
    } catch (error) {
        console.error('Error fetching watches:', error);
        res.status(500).json({ message: 'Error fetching watches.' });
    }
});

router.get('/:id', async (req, res) => {
    try {
        const watch = await Watch.findById(req.params.id)
            .populate('seller', 'name email')
            .populate('bids.bidder', 'name');
        if (!watch) return res.status(404).json({ message: 'Watch not found.' });
        res.json(watch);
    } catch (error) {
        console.error('Error fetching watch:', error);
        res.status(500).json({ message: 'Error fetching watch.' });
    }
});

router.post('/bid/:id', authMiddleware, async (req, res) => {
    const { amount } = req.body;

    if (!amount || isNaN(amount)) {
        return res.status(400).json({ message: 'A valid bid amount is required.' });
    }

    try {
        const watch = await Watch.findById(req.params.id);
        if (!watch) return res.status(404).json({ message: 'Watch not found.' });

        if (watch.status !== 'active') {
            return res.status(400).json({ message: 'This auction has ended.' });
        }

        if (new Date() > new Date(watch.auction_end_time)) {
            watch.status = 'expired';
            await watch.save();
            return res.status(400).json({ message: 'This auction has expired.' });
        }

        if (Number(amount) <= watch.currentBid) {
            return res.status(400).json({
                message: `Bid must be higher than current bid of $${watch.currentBid}.`,
            });
        }

        if (watch.seller.toString() === req.user.toString()) {
            return res.status(400).json({ message: 'You cannot bid on your own auction.' });
        }

        watch.currentBid = Number(amount);
        watch.bids.push({
            bidder: req.user,
            amount: Number(amount),
        });

        await watch.save();

        const io = req.app.get('io');
        if (io) {
            io.to(req.params.id).emit('bid-updated', {
                watchId: req.params.id,
                newBid: watch.currentBid,
                totalBids: watch.bids.length,
            });
        }

        res.json({
            message: 'Bid placed successfully!',
            currentBid: watch.currentBid,
            totalBids: watch.bids.length,
        });
    } catch (error) {
        console.error('Error placing bid:', error);
        res.status(500).json({ message: 'Error placing bid.' });
    }
});

module.exports = router;