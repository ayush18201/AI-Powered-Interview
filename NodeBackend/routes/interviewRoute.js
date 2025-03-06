import express from 'express'
import interviewData from '../controllers/interviewData.js'

const interviewRouter = express.Router()

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