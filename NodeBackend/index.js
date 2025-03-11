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

// 🔹 Allow ALL Origins (CORS)
app.use(cors({
    origin: "*",  // Allow requests from any domain
    credentials: true,  // Allow cookies & authentication headers
    methods: ['GET', 'POST', 'PATCH', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

// 🔹 Manually Set CORS Headers
app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");  // Allow all origins
    res.header("Access-Control-Allow-Credentials", "true");
    res.header("Access-Control-Allow-Methods", "GET, POST, PATCH, PUT, DELETE");
    res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");

    if (req.method === "OPTIONS") {
        return res.sendStatus(200);  // Respond to preflight request
    }

    console.log(`CORS headers set for ${req.headers.origin || "any origin"}`);
    next();
});

// Middleware
app.use(bodyParser.json());
app.use(cookieParser());

// Test CORS Route
app.get('/test-cors', (req, res) => {
    res.json({ message: "CORS is working for all origins!" });
});

// Routes
app.use('/', chatRouter);
app.use('/user', authRouter);
app.use('/exp', experienceRouter);
app.use('/interview', interviewRouter);

// Export app for Vercel
export default app;
