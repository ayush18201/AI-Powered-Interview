import React from 'react'
import Login from '../Login/Login'
import {Container} from '../index'

function LoginPage(){
    return(  <div className = 'w-full py-8 items-center flex h-full m-auto'>
    <Container className='items-center flex flex-col gap-4'>
    <h3 className='dark-grey text-[35px]' >Log in your account</h3>
   <Login />
        
    </Container></div>)
}
export default LoginPage