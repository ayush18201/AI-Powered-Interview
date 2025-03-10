import express from 'express'
import authService from '../controllers/auth.js'
import {OAuth2Client} from 'google-auth-library'
import jwt from 'jsonwebtoken'
import conf from '../Conf/conf.js'
import cors from 'cors'

const authRouter = express.Router()
const client = new OAuth2Client('175788622677-ccn8cdv8aacrgk7o52h0u2ef8npvv87u.apps.googleusercontent.com');
authRouter.use(
  cors({
    origin: [
      "http://localhost:5173", 
      "https://ai-powered-interview-frontend.onrender.com",
      "https://ai-powered-interview-ptow.onrender.com"
    ],
    methods: "GET,POST",
    allowedHeaders: "Content-Type,Authorization",
    credentials: true,
  })
);
authRouter.post('/login',async (req, res)=>{
    try{
        const {email, password} = req.body
        const user = await authService.loginAccount({email, password})
        if(user.error) return res.status(401).json({error:'Incorrect email or password'})
        res.cookie('uid', user.token)
        return res.status(200).json(user);
    }
    catch(error){
        res.status(400).json({error:error.message})
    }

})
authRouter.post('/register', async(req, res)=>{
    try{
        const {email, password, name} = req.body;
        console.log(email, password, name,"credentials")
        const userCreated = await authService.createAccount({email, password, name})
        res.cookie('uid', userCreated.token)
        return res.status(200).json(userCreated)
    }
    catch(error){
    res.status(400).json({error: error.message})
    }
})
authRouter.get('/currentuser', async (req, res) => {
    try {
        const token = req?.cookies?.uid;
        if (!token) {
            return res.status(401).json({ error: 'Please provide a valid token' });
        }
        const user = await authService.getCurrentUser({ token });

        if (!user) {
            return res.status(401).json({ error: 'User not found' });
        }

        return res.status(200).json({ userData: user });
    } catch (error) {
        return res.status(400).json({ error: error.message });
    }
});
authRouter.get('/logout', (req, res)=>{
    try{
        res.clearCookie('uid')
        return res.status(201).json({message: 'User logged out successfully'})
    }
    catch(error){
        return res.status(400).json({error:'unable to logout user'})
    }
})
authRouter.post('/auth/google',async(req, res) =>{
    try{
       const {token} = req.body
       const ticket = await client.verifyIdToken({
        idToken: token,
        audience: '175788622677-ccn8cdv8aacrgk7o52h0u2ef8npvv87u.apps.googleusercontent.com'
       })
       const {name, email, picture} = ticket.getPayload()
       const userToken = jwt.sign({name, email}, conf.jwtSecret,{expiresIn: '1h'})
       res.cookie('uid', userToken)
       return res.status(201).json({userToken, name, email})
    }
    catch(error){

    }
})

export default authRouter
