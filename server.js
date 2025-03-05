require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const jwt = require('jsonwebtoken');
const path = require('path');
const { GoogleGenerativeAI } = require('@google/generative-ai');

const app = express();

// Initialize Gemini API
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-pro" });

// Security Middleware
app.use(helmet()); // Adds various HTTP headers for security
app.use(express.json({ limit: '10kb' })); // Limit payload size
app.use(cors({
    origin: process.env.CORS_ORIGIN,
    methods: ['GET', 'POST'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

// Rate Limiting
const limiter = rateLimit({
    windowMs: process.env.RATE_LIMIT_WINDOW * 60 * 1000, // 15 minutes
    max: process.env.RATE_LIMIT_MAX_REQUESTS // limit each IP to 100 requests per windowMs
});
app.use(limiter);

// JWT Authentication Middleware
const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        return res.status(401).json({ error: 'Access token required' });
    }

    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        if (err) {
            return res.status(403).json({ error: 'Invalid token' });
        }
        req.user = user;
        next();
    });
};

// Gemini API Route
app.post('/api/chat', authenticateToken, async (req, res) => {
    try {
        const { message } = req.body;
        
        if (!message) {
            return res.status(400).json({ error: 'Message is required' });
        }

        const result = await model.generateContent(message);
        const response = await result.response;
        const text = response.text();

        res.json({ 
            response: text,
            timestamp: new Date().toISOString()
        });
    } catch (error) {
        console.error('Gemini API Error:', error);
        res.status(500).json({ 
            error: 'Failed to process request',
            details: error.message
        });
    }
});

// Health check endpoint
app.get('/health', (req, res) => {
    res.json({ status: 'healthy' });
});

// Serve static files
app.use(express.static(path.join(__dirname, 'public')));

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: 'Something broke!' });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
}); 