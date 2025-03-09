import { useState, useEffect } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import Header from './components/Header/Header'
import AudioRecorder from './components/AudioRecorder'
import {Outlet} from 'react-router-dom'
import {useDispatch} from 'react-redux'
import {isUserLoggedIn, experienceData } from '../src/components/Store/Features/authSlice'


function App() {
  const [count, setCount] = useState(0)
  const dispatch = useDispatch()
  
  useEffect(() => {
    const getCurrentUser = async () => {
        try {
            const response = await fetch('https://ai-powered-interview-3d8l.onrender.com/user/currentuser', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                },
                credentials: 'include'
            });

            if (response.ok) {
                const userData = await response.json();
                dispatch(isUserLoggedIn(userData.userData))
                  const userId = userData.id
                  const experience = await fetch(`https://ai-powered-interview-3d8l.onrender.com/exp/getExperience/${userId}`)
                  if(experience){
                      const expJson = await experience.json()
                    if(!expJson.error) dispatch(experienceData(expJson.experience))
                                }
                console.log(userData, "userdata");
            } else {
                console.log('Failed to fetch user data');
            }
        } catch (error) {
            console.log('User not logged in');
        }
    };

    getCurrentUser();
}, []);
 
  return (
    <>
    <div className= 'h-full flex flex-wrap content-between'>
      <div className='w-full h-full'>
      <Header />
      <main className= 'h-full  overflow-y-scroll' style= {{ backgroundColor: '#eef0f4' }} >
        <Outlet />
      </main>
      </div>
    </div>

 
    </>
  )
}

export default App
