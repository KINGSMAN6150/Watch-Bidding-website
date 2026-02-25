require('dotenv').config();
const express = require('express');
const http = require('http');         // needed for Socket.io (Phase 1)
const { Server } = require('socket.io'); // Socket.io (Phase 1)
const connectDB = require('../config/db.js');
const cors = require('cors');

const app = express();
const server = http.createServer(app); // wrap Express with http server

// ─── Socket.io Setup (Phase 1 will build on this) ───────────────────────────
const io = new Server(server, {
    cors: {
        origin: 'http://localhost:3001', // React dev server
        methods: ['GET', 'POST'],
    },
});

// Make io accessible in routes (we'll use this in Phase 1)
app.set('io', io);

io.on('connection', (socket) => {
    console.log('A user connected:', socket.id);

    socket.on('disconnect', () => {
        console.log('User disconnected:', socket.id);
    });
});
// ─────────────────────────────────────────────────────────────────────────────

// Middleware
app.use(cors());
app.use(express.json({ limit: '10mb' })); // allow image uploads

// Import Routes
const authRoutes = require('../routes/auth.js');
const emailRoutes = require('../routes/emailRoutes');
const collectionRoutes = require('../routes/collection.js');

// Define Routes
app.use('/api/auth', authRoutes);
app.use('/api/email', emailRoutes);
app.use('/api/collection', collectionRoutes);

// Error Handling for Unknown Routes
app.use((req, res) => {
    res.status(404).json({ message: 'Route not found' });
});

// Connect to MongoDB (from .env only — never hardcode!)
connectDB(process.env.MONGO_URI);

// Start Server
const PORT = process.env.PORT || 3000;
server.listen(PORT, (err) => {
    if (err) {
        console.error('Failed to start server:', err.message);
    } else {
        console.log(`Server running on http://localhost:${PORT}`);
    }
});