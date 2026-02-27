require('dotenv').config();
const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const connectDB = require('../config/db.js');
const cors = require('cors');

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
    cors: {
        origin: 'http://localhost:3001',
        methods: ['GET', 'POST'],
    },
});

app.set('io', io);

io.on('connection', (socket) => {
    console.log('A user connected:', socket.id);

    socket.on('join-auction', (watchId) => {
        socket.join(watchId);
        console.log(`Socket ${socket.id} joined auction room: ${watchId}`);
    });

    socket.on('leave-auction', (watchId) => {
        socket.leave(watchId);
        console.log(`Socket ${socket.id} left auction room: ${watchId}`);
    });

    socket.on('disconnect', () => {
        console.log('User disconnected:', socket.id);
    });

    socket.on('place-bid', async ({ watchId, amount, userId }) => {
        try {
            const Watch = require('../models/Watch.js');
            const watch = await Watch.findById(watchId);

            if (!watch) {
                return socket.emit('bid-error', { message: 'Watch not Found' });
            }
            if (watch.auction_end_time < new Date()) {
                return socket.emit('bid-error', { message: 'Auction has ended' });
            }
            if (amount <= watch.currentBid) {
                return socket.emit('bid-error', {
                    message: `Bid must be higher than current bid of ₹ ${watch.currentBid}`,
                });
            }
            watch.currentBid = amount;
            watch.bids.push({ bidder: userId, amount, timestamp: new Date() });

            await watch.save();
            io.to(watchId).emit('bid-updated', {
                watchId,
                newBid: amount,
                bidderId: userId,
            });
        } catch (_err) {
            socket.emit('bid-error', {
                message: 'Server error Placing Bid',
            });
        }
    });
});

app.use(cors());
app.use(express.json({ limit: '10mb' }));

const authRoutes = require('../routes/auth.js');
const emailRoutes = require('../routes/emailRoutes');
const collectionRoutes = require('../routes/collection.js');

app.use('/api/auth', authRoutes);
app.use('/api/email', emailRoutes);
app.use('/api/collection', collectionRoutes);

app.use((req, res) => {
    res.status(404).json({ message: 'Route not found' });
});

connectDB(process.env.MONGO_URI);

const PORT = process.env.PORT || 3000;
server.listen(PORT, (err) => {
    if (err) {
        console.error('Failed to start server:', err.message);
    } else {
        console.log(`Server running on http://localhost:${PORT}`);
    }
});
