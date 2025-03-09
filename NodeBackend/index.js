import express from 'express'
import bodyParser from 'body-parser'
import chatRouter from './routes/chat.js'
import authRouter from './routes/authRoute.js'
import experienceRouter from './routes/experienceRoute.js'
import interviewRouter from './routes/interviewRoute.js'
import cookieParser from 'cookie-parser'
import cors from 'cors'

const app = express()
const port = process.env.PORT || 3000
app.use(bodyParser.json())
app.use(cookieParser());
app.use(cors({ origin: "*" }));
console.log("Starting transcription process..."); 
app.use('/', chatRouter)
app.use('/user', authRouter)
app.use('/exp', experienceRouter)
app.use('/interview', interviewRouter)
app.listen(port, ()=>{
    console.log(`Server is running at ${port}`)
})


