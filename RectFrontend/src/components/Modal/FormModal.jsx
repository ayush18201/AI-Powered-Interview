import React,{useState} from 'react'
import {useForm} from 'react-hook-form'
import {useSelector, useDispatch} from 'react-redux'
import {experienceData} from '../Store/Features/authSlice'

function FormModal({onClose, completed}){
    const {register, handleSubmit} = useForm()
    const [error, setError] = useState('')
    const userId = useSelector(state => state.auth.userData.id)
    const userEmail = useSelector(state => state.auth.userData.email)
    const dispatch = useDispatch()
    const onFormSubmit = async(data) =>{    
        const payload ={
            role: data.role,
            experience: data.experience,
            id: userId ?? userEmail
        }
        try{
            const response = await fetch('https://ai-powered-interview-backend.onrender.com/exp/saveExperience',{
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(payload)
            })
            if(response.ok){
                const savedRes = await response.json()
                console.log(savedRes,"savedres")
                if(savedRes.success === true){
                    alert('Experience data saved successfull')
                    dispatch(experienceData(savedRes.data));
                    completed(true);
                    onClose()
                } else{
                    alert('Experience Data already availble for this')
                }
            }
        }
        catch(error){
            setError(error.message)
        }
    }
    return(
        <div className='modal'>
            <div className='modal-content'>
            <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-4">
        <div>
          <label className="block text-gray-700">Your Role</label>
          <input
            type="text"
            className="w-full p-2 border border-gray-300 rounded mt-1"
            placeholder="e.g. Frontend Developer"
            {...register("role", {required:true})}
          />
        </div>
        <div>
          <label className="block text-gray-700">Years of Experience</label>
          <input
            type="number"
            className="w-full p-2 border border-gray-300 rounded mt-1"
            placeholder="e.g. 3"
            {...register("experience",{required:true})}
          />
        </div>
        <div className='flex gap-4'>
        <button
          type="submit"
          className="btn-primary"
        >
          Submit
        </button>
        <button
          className="btn-primary"
          onClick={onClose}
        >
          Close
        </button>
        </div>
      </form>

            </div>
        </div>
    )


}
export default FormModal