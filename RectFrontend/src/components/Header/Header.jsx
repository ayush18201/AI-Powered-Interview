import React from 'react'
import Container from '../Container/Container'
import {useNavigate} from 'react-router-dom'
import {useSelector, useDispatch} from 'react-redux'
import {isUserLoggedOut, deleteExperienceData} from '../Store/Features/authSlice'

function Header(){
    const navigate = useNavigate()
    const authStatus = useSelector(state=> state.auth.isLoggedIn) 
    const userName = useSelector(state=> state?.auth?.userData?.name) || '' 
    const dispatch = useDispatch()
    console.log(userName,"username")
    const handleLogout = async() =>{
        try{
            const response = await fetch('https://ai-powered-interview-backend.vercel.app/user/logout',{
                credentials: 'include'
            })
            if(response.ok){
                const resJson = await response.json()
                if(!resJson.error){
                    dispatch(isUserLoggedOut())
                    dispatch(deleteExperienceData())
                    navigate('/')
                }
            }
        }catch(error){

        }

    }
 return(
    <header>
  <Container className='flex justify-center items-center'>
    <div className='w-full'>
        <h6 className='dark-grey text-[22px] relative left-[52px] cursor-pointer' onClick={()=> navigate('/')}>interview prep</h6>
    </div>
    <div className='flex'>
 { authStatus === false ? (<><button onClick={()=> navigate('/login')} className='btn-secondary w-[90px] cursor-pointer'><span>Log in</span></button>
    <button onClick={()=> navigate('/createaccount')} className='btn-secondary w-[90px] cursor-pointer'>Sign up</button></>) :(
        <div>
             {/* <span className="user-name dark-grey text-[22px]">{userName}</span> */}
            <select className="dark-grey text-[22px]" onChange={handleLogout}>
                <option value="">{userName}</option>
                <option value="logout">Logout</option>
            </select>
        </div>
    ) }
   
    </div>
  </Container>
    </header>
 )
}
export default Header;