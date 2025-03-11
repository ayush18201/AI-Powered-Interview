import express from 'express';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import dotenv from 'dotenv';

import chatRouter from './routes/chat.js';
import authRouter from './routes/authRoute.js';
import experienceRouter from './routes/experienceRoute.js';
import interviewRouter from './routes/interviewRoute.js';

dotenv.config();
const app = express();
const port = process.env.PORT || 3000;

// Enable CORS for frontend
app.use(cors({
    origin: (origin, callback) => {
        const allowedOrigins = [
            'http://localhost:5173',
            'http://localhost:5174',
            'https://ai-powered-interview-frontend.vercel.app'
        ];
        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    credentials: true,
    methods: ['GET', 'POST', 'PATCH', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

// Middleware
app.use(bodyParser.json());
app.use(cookieParser());

// Debugging - Log requests
app.use((req, res, next) => {
    console.log(`Request: ${req.method} ${req.url}`);
    console.log('Origin:', req.headers.origin);
    console.log('Cookies:', req.cookies);
    next();
});

// Handle Preflight Requests
app.options('*', (req, res) => {
    res.header("Access-Control-Allow-Origin", req.headers.origin || '*');
    res.header("Access-Control-Allow-Credentials", "true");
    res.header("Access-Control-Allow-Methods", "GET, POST, PATCH, PUT, DELETE");
    res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");
    res.sendStatus(200);
});

// Test CORS Route
app.get('/test-cors', (req, res) => {
    res.json({ message: "CORS is working!" });
});

// Routes
app.use('/', chatRouter);
app.use('/user', authRouter);
app.use('/exp', experienceRouter);
app.use('/interview', interviewRouter);

// Start server (Vercel doesn't need this, but useful for local testing)
if (process.env.NODE_ENV !== 'vercel') {
    app.listen(port, () => {
        console.log(`Server is running at ${port}`);
    });
}

// Export app for Vercel
export default app;
