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

// CORS Middleware
app.use(cors({
    origin: process.env.FRONTEND_URL || "http://localhost:5173",
    credentials: true,
    methods: ['GET', 'POST', 'PATCH', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

// Handle Preflight Requests
app.options('*', (req, res) => {
    res.header("Access-Control-Allow-Origin", "https://ai-powered-interview-frontend.vercel.app");
    res.header("Access-Control-Allow-Methods", "GET, POST, PATCH, PUT, DELETE, OPTIONS");
    res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");
    res.header("Access-Control-Allow-Credentials", "true");
    res.sendStatus(200);
});

// Middleware
app.use(bodyParser.json());
app.use(cookieParser());

// Routes
app.use('/', chatRouter);
app.use('/user', authRouter);
app.use('/exp', experienceRouter);
app.use('/interview', interviewRouter);
app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});
// Export app for Vercel
export default app;
