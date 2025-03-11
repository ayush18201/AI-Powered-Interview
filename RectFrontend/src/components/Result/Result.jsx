import React,{useState} from 'react'
import {Container, AnswerCard, FormModal} from '../index'
import {useSelector} from 'react-redux'
import {useNavigate} from 'react-router-dom'

function Result({interviewData}){
    const [isFormModal, setIsFormModal] = useState(false)
    const authStatus = useSelector(state => state.auth.isLoggedIn)
    const expStatus = useSelector(state => state.auth.isExperienceData)
    const userId = useSelector(state => state?.auth?.userData?.id)
    const role = useSelector(state => state?.auth?.experienceData?.role)
    const navigate = useNavigate()
    const [error, setError] = useState('')

    const closeForm =() =>{
        setIsFormModal(false)
    }

    const saveData =async () =>{
        const payload ={
            id: userId,
            data: interviewData
        }
        try{
            const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/interview/saveData`,{
                method: 'POST',
                headers:{
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(payload)
            })
            if(response){
                const savedData = await response.json()
                if(savedData.success === true){
                    alert('Data saved successfully')
                    setIsFormModal(false)
                }
            }
        }
        catch(error){
            setError(error.message)
        }

    }
    const handleSaveAnswer =()=>{
        if(!authStatus){
            alert('Please login to save your answers')
            navigate('/login?redirectedFrom=result')
        }else if (!expStatus && authStatus){
            alert('Please fill this form to save your answers')
            setIsFormModal(true)
        }else{
            saveData()
        }
    }
    const handleCompleted =(data) =>{
        if (data === true){
            saveData()
        }
    }

    return(  
    <div className='flex flex-col gap-4' style={{width:'950px'}}>
        <div className='flex flex-col w-full items-center'><img className= 'w-[100px]' src='https://www.cloudskillsboost.google/assets/end_mark-PTLDIQEP.digested.png' alt='review image' /></div>
        <h4 className='text-[26px] text-[#27303e]'>Congrats, you did it! Let’s review.</h4>
        <div className='flex gap-4 w-full justify-center mt-[32px]'>
            <button className='btn-secondary' onClick={handleSaveAnswer}>Save your answers</button>
            <button className='btn-secondary' onClick={()=> {navigate(`/`)}}>Practice again</button>
        </div>
        {isFormModal === true && (<FormModal  onClose={closeForm} completed={handleCompleted} />)}  
                    {interviewData.map((data, index)=>(
                       <AnswerCard question={data.question} answer={data.answer} review={data.analysis} />
                    ))}
    </div>
        
        
    )
}
export default Result