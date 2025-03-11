import express from 'express'
import experienceService from '../controllers/experience.js'

const experienceRouter = express.Router()

experienceRouter.post('/saveExperience',async (req, res)=>{
    try{
        const {id, role, experience} = req.body
        const saveData = await experienceService.saveExperienceData({id, role, experience})
        if(!saveData) return res.status(400).json({error:'error saving data'})
        return res.status(201).json(saveData)
    }
    catch(error){
        return res.status(400).json({error: error.message})

    }
})

experienceRouter.get('/getExperience/:id', async (req, res)=>{
    const userId = req.params.id
    try{
        const expData = await experienceService.getExperienceData({userId: userId})
        return res.status(201).json(expData)

    }catch(error){
      return res.status(400).json({error: error.message})
    }

})

export default experienceRouter;