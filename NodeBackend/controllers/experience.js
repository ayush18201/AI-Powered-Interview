import mongoose from 'mongoose'
import conf from '../Conf/conf.js'
import Experience from '../models/experienceData.js'

export class ExperienceService{
    constructor(){
        mongoose.connect(conf.mongoUri)
        .then(()=> console.log('Connected to Mongodb'))
        .catch((error)=> console.error('Error connecting mongodb', error))
    }

    async saveExperienceData ({id, role, experience}){
        try{

            const existingExperience = await Experience.findOne({userId: id})
            if(existingExperience){
                return({
                    success: false,
                    message: 'Experience data already availble for this userId'
                })
            }
            const experience1 = new Experience({userId: id, role:role, experience:experience})
            const savedExperience =  await experience1.save()
            return{
                success:true,
                data: savedExperience,
                message: 'Experience data saved successfull'
            }
        }
        catch(error){
            return{
                success: false,
                message: 'Error saving experience data',
                error: error.message
            }
        }   
    }

    async getExperienceData({userId}){
        try{
            const experience = await Experience.findOne({userId: userId})
            if(experience){
                return({experience})
            }else{
                return({error: 'Experience with this userId is not available'})
            }
        }
        catch(error){
            return{
                error: error.message
            }
        }
    }

}
const experienceService = new ExperienceService()
export default experienceService