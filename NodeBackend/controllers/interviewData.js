import InterviewData from '../models/interviewData.js'
import mongoose from 'mongoose'
import conf from '../Conf/conf.js'

export class Interview{
    constructor(){
        mongoose.connect(conf.mongoUri)
        .then(()=>{
            console.log('Connected to MongoDb')
        })
        .catch((error)=>{
            console.log('Error connecting to mongoDb', error)
        })
    }

    async saveData ({interviewData, id}){
        try{
            let userInterviewData = await InterviewData.findOne({userId: id})
            if(!userInterviewData){
                userInterviewData = new InterviewData({userId: id, interviewEntries:[]})
            }
            console.log(interviewData,"interview")
            userInterviewData.interviewEntries = interviewData
            const savedData = await userInterviewData.save()
            return{
                success:true,
                data: savedData,
                message: 'Interview data saved successfull'
            }

        }
        catch(error){
            return{
                success:false,
                error: error.message,
                message: 'Error saving interview data'
            }
        }
    }
} 
const interviewData = new Interview()
export default interviewData;