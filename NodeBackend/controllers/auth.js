import mongoose from 'mongoose'
import conf from '../Conf/conf.js'
import User from '../models/users.js'
import bcrypt from 'bcrypt'
import {v4 as uuidv4} from 'uuid';
import jwt from 'jsonwebtoken'


export class AuthService{
    constructor(){
        mongoose.connect(conf.mongoUri)
        .then(()=>{
            console.log('Connected to MongoDB')
        })
        .catch((error)=>{
            console.error('Error coneecting to database', error)
        })
       
    }

    async createAccount({email, password, name}){
        try{
          const hashPassword = await bcrypt.hash(password, 10);
          const userId = uuidv4();
          const user = new User({id:userId, email: email, password: hashPassword, name:name})
          await user.save()
          return this.loginAccount({email, password})
        }
        catch(error){
         console.error('Error Creating Account', error)
         throw error
        }
    }
    async loginAccount({email, password}){
        try{
            const user = await User.findOne({email});
            if(!user) console.log('User not found')
            const isPasswordValid = await bcrypt.compare(password, user.password)
            if (!isPasswordValid) {
                console.log('Password is not valid');
                return { error: 'Password is not valid' };
            }
            const token = jwt.sign({id: user.id, email: user.email}, conf.jwtSecret,{expiresIn: '1h'})
           return {token, user};
        }
        catch(error){
            console.error('Error in loginAccount', error)
            throw error
        }
    }
    async getCurrentUser({token}){
        try{
            const decoded = jwt.verify(token, conf.jwtSecret)
            const userData = User.findOne({email: decoded.email})
            if(userData){
                return userData
            }else{
                return null
            }
        }
        catch(error){
            console.error('error in getting currentUser', error)
            throw error
        }
    }

    
}
const authService = new AuthService();
export default authService