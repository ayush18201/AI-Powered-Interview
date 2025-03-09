import express from 'express'
import interviewData from '../controllers/interviewData.js'
import cors from 'cors'

const interviewRouter = express.Router()

interviewRouter.use(
  cors({
    origin: [
      "http://localhost:5173", 
      "https://ai-powered-interview-frontend.onrender.com"
    ],
    methods: "GET,POST",
    allowedHeaders: "Content-Type,Authorization",
    credentials: true,
  })
);
interviewRouter.post('/saveData', async(req, res)=>{
    const {id, data} = req.body
    try{
        const savedData = await interviewData.saveData({interviewData: data, id:id})
        res.status(201).json(savedData)
    }
    catch(error){
        res.status(400).json({error: error.message})

    }

})
export default interviewRouter;
