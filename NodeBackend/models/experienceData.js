import mongoose from 'mongoose'

const experienceSchema = new mongoose.Schema({
    userId: {type: String, unique: true},
    role:String,
    experience: Number
})

const Experience =  mongoose.model('experience', experienceSchema)

export default Experience;