import crypto from 'crypto'
import dotenv from 'dotenv'
const secret = crypto.randomBytes(64).toString('hex');
const conf={
    mongoUri: process.env.MONGO_URI,
    jwtSecret: process.env.JWT_SECRET
}

export default conf;