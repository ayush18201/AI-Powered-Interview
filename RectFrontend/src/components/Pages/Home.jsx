import React,{useState} from 'react'
import {useNavigate} from 'react-router-dom'
import {useSelector} from 'react-redux'
import {Header, Container, FormModal} from '../index'
function Home(){
 const navigate = useNavigate()
 const [modalOpen, setModalOpen] = useState(false)
 const authStatus = useSelector(state => state.auth.isLoggedIn)
 const userName = useSelector(state => state?.auth?.userData?.name)
 const expStatus = useSelector(state => state.auth.isExperienceData)
 const role = useSelector(state => state?.auth?.experienceData?.role)
console.log(expStatus,"expstatus")
    const handleStart= () =>{
    if(authStatus && expStatus){
        const url = role.split(' ').join('-')
        navigate(`/category/${url}`)
    }else{
        navigate('/category')
    }
    }
    const openForm =() =>{
        setModalOpen(true)
    }
    const closeForm =() =>{
        setModalOpen(false)
    }
  return(
  <div className = 'w-full py-8 items-center flex h-full m-auto'>
    <Container className='items-center flex flex-col gap-4'>
        <h3 className='dark-grey text-[85px]' >interview prep</h3>
        {authStatus === true && expStatus === false ? (
            <>
            <p className='light-grey text-[18px]'>Hi <strong>{userName} </strong>, please fill out this <a href='#' onClick={openForm} className='text-[#1c6ef3] underline'>form</a> to receive questions tailored to your role and experience.</p>
            </>
        ) : (expStatus === true  && authStatus === true? ( <p className='light-grey text-[18px]'>Hi <strong>{userName} </strong>, please fill out this <a href='#' onClick={openForm} className='text-[#1c6ef3] underline'>form</a> to update  your role and experience.</p>) : null )}
            {modalOpen === true && (<FormModal  onClose={closeForm} />)}   
        <p className='light-grey text-[18px]'>Practice key questions, get insights about your answers, and get more comfortable interviewing. </p>
     <button onClick={handleStart} className= 'btn-primary cursor-pointer'>Start Practising</button>
    </Container>
  </div>
  )
}
export default Home
