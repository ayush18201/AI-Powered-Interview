import mongoose from 'mongoose'

const userSchema = new mongoose.Schema({
    id: String,
    email:{type: String , unique: true},
    password: String,
    name: String
})
const User = mongoose.model('users',userSchema);
export default User;