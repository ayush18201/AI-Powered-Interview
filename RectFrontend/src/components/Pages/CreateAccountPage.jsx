import React from 'react'
import CreateAccount from '../CreateAccount/CreateAccount'
import {Container} from '../index'

function CreateAccountPage(){
    return(  <div className = 'w-full py-8 items-center flex h-full m-auto'>
    <Container className='items-center flex flex-col gap-4'>
    <h3 className='dark-grey text-[35px]' >Create an Account</h3>
   <CreateAccount />
        
    </Container></div>)
}
export default CreateAccountPage