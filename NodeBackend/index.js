import express from 'express';
import bodyParser from 'body-parser';
import chatRouter from './routes/chat.js';
import authRouter from './routes/authRoute.js';
import experienceRouter from './routes/experienceRoute.js';
import interviewRouter from './routes/interviewRoute.js';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

app.use(bodyParser.json());
app.use(cookieParser());
app.use(cors({
    origin: [process.env.FRONTEND_URL],
    methods: ['GET', 'POST', 'PATCH', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type'],
    credentials: true
}));

app.options('*', (req, res) => {
    res.header("Access-Control-Allow-Origin", "https://ai-powered-interview-frontend.vercel.app");
    res.header("Access-Control-Allow-Methods", "GET, POST, PATCH, PUT, DELETE, OPTIONS");
    res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");
    res.header("Access-Control-Allow-Credentials", "true");
    res.sendStatus(200);
});
console.log("Starting transcription process...");
app.use('/', chatRouter);
app.use('/user', authRouter);
app.use('/exp', experienceRouter);
app.use('/interview', interviewRouter);

app.listen(port, () => {
    console.log(`Server is running at ${port}`);
});