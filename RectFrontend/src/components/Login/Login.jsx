import React,{useState} from 'react'
import {useNavigate, useLocation} from 'react-router-dom'
import {useForm} from 'react-hook-form'
import {useDispatch, useSelector} from 'react-redux'
import {isUserLoggedIn, experienceData} from '../Store/Features/authSlice'
import {GoogleOAuthProvider, GoogleLogin} from '@react-oauth/google'

function Login(){
    const { register, handleSubmit } = useForm();
    const navigate = useNavigate();
    const [error, setError] = useState('')
    const dispatch= useDispatch()
    const guestUserRole = useSelector(state=> state?.auth?.guestUserRole)
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search)
    const redirectedFrom = queryParams.get('redirectedFrom')

    const handleLogin = async (response) => {
        try {
          const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/user/auth/google`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ token: response.credential }),
            credentials: 'include'
          });
      
          if (!res.ok) {
            throw new Error("Failed to authenticate");
          }
          const data = await res.json(); 
          console.log("User Data:", data);
          if(data ){
            dispatch(isUserLoggedIn(data))
            const userId = data.email
            const experience = await fetch(`${import.meta.env.VITE_BACKEND_URL}/exp/getExperience/${userId}`)
            if(experience){
                const expJson = await experience.json()
                if(!expJson.error) dispatch(experienceData(expJson.experience))
            }
            navigate('/')
        }
          
        } catch (error) {
          console.error("Login failed", error);
        }
      };      
  const login = async(data) =>{
    console.log(data,"data")
    const payload= {
        email: data.email,
        password: data.password
    }
    try{
        const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/user/login`,{
            method: 'POST',
            headers:{
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(payload),
            credentials: 'include'
        })
        if(response){
            const userData = await response.json()
            if(!userData.error){
                dispatch(isUserLoggedIn(userData.user))
                const userId = userData.user.id
                const experience = await fetch(`${import.meta.env.VITE_BACKEND_URL}/exp/getExperience/${userId}`)
                if(experience){
                    const expJson = await experience.json()
                    if(!expJson.error) dispatch(experienceData(expJson.experience))
                }
               if(redirectedFrom === 'result'){
                navigate(`/category/${guestUserRole}?redirectedFrom=login`)
               }else{
                   navigate('/')
               }
            }else{
                setError(userData.error)
            }
        }
    }
    catch(error){
       setError(error)
    }

  }
    return(
        <>
        {error && (<h4 className= 'text-red-700'>{error}</h4>)}
        <form className='flex flex-col gap-4 w-[40%]' onSubmit={handleSubmit(login)}>
               <GoogleOAuthProvider clientId="175788622677-ccn8cdv8aacrgk7o52h0u2ef8npvv87u.apps.googleusercontent.com">
      <div>
      {/* <div className='continue-with-google flex justify-center items-center gap-2'><span><svg viewBox="0 0 48 48" width="16px" height="16px"><path fill="#fbc02d" d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12	s5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24s8.955,20,20,20	s20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z"/><path fill="#e53935" d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039	l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z"/><path fill="#4caf50" d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36	c-5.202,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z"/><path fill="#1565c0" d="M43.611,20.083L43.595,20L42,20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.571	c0.001-0.001,0.002-0.001,0.003-0.002l6.19,5.238C36.971,39.205,44,34,44,24C44,22.659,43.862,21.35,43.611,20.083z"/></svg></span>Continue with Google</div> */}
        <GoogleLogin  theme="filled_blue" onSuccess={handleLogin} onError={() => console.log("Login Failed")} />
      </div>
    </GoogleOAuthProvider>
            <hr />
            <div className='flex flex-col gap-2'>
            <label className='flex' htmlFor='email'>Email address</label>
            <input style={{border:'1px solid #787f8b', borderRadius:'5px', height:'40px'}} type='text' id='email' name='email' {...register('email',{required: true})} />
            </div>
            <div className='flex flex-col gap-2'>
            <label className='flex' htmlFor='password'>Your password</label>
            <input style={{border:'1px solid #787f8b', borderRadius:'5px', height:'40px'}} type='password' id='password' name='password' {...register('password',{required: true})} />
            </div>
            <button className='btn-secondary' type="submit">Log in</button>
            <hr style={{ borderColor: '#787f8b', color:'#787f8b' }} />
            <h5>Don't have an account?</h5>
            <button className='btn-secondary' onClick={()=> navigate('/createaccount')}>Sign up</button>
        </form>
        
        </>

    )
}
export default Login