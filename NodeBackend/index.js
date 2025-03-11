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

// Enable CORS Middleware
app.use(cors({
    origin: [
        'http://localhost:5173',
        'http://localhost:5174',
        'https://ai-powered-interview-frontend.vercel.app'
    ],
    credentials: true,
    methods: ['GET', 'POST', 'PATCH', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

// Manually Set CORS Headers for Every Response
app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", req.headers.origin || '*');
    res.header("Access-Control-Allow-Credentials", "true");
    res.header("Access-Control-Allow-Methods", "GET, POST, PATCH, PUT, DELETE");
    res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");
    
    if (req.method === "OPTIONS") {
        return res.sendStatus(200);
    }

    console.log(`CORS headers set for ${req.headers.origin}`);
    next();
});

// Middleware
app.use(bodyParser.json());
app.use(cookieParser());

// Test CORS Route
app.get('/test-cors', (req, res) => {
    res.json({ message: "CORS is working!" });
});

// Routes
app.use('/', chatRouter);
app.use('/user', authRouter);
app.use('/exp', experienceRouter);
app.use('/interview', interviewRouter);

// Export app for Vercel
export default app;
