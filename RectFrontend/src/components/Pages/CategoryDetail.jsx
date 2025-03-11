import React,{useState, useEffect} from 'react'
import Card from '../Card/Card'
import {useParams} from 'react-router-dom'
import Container from '../Container/Container'
import {QuestionCard, AnswerCard, Result} from '../index'
import {useSelector} from 'react-redux'
import {useNavigate, useLocation} from 'react-router-dom'


function CategoryDetail(){
    const {category} = useParams();
    const [error, setError] = useState('')
    const [question, setQuestion] = useState([])
    const [currentIndex, setCurrentIndex] = useState(0)
    const [completed, setCompleted] = useState(false)
    const [nextDisabled, setNextDisabled] = useState(false)
    const [loading, setLoading] = useState(false)
    const [quesLoading, setQuesLoading]= useState(false)
    const [analyzeLoading, setAnalyzeLoading]= useState(false)
    const[questionNo, setQuestionNo] = useState(1)
    const [isStart, setStart] = useState(false)
    const [interviewData, setInterviewData] = useState([])
    const categoryName = category.split('-').join(' ')
    const navigate = useNavigate()
    const authStatus = useSelector(state => state.auth.isLoggedIn)
    const expStatus = useSelector(state => state.auth.isExperienceData)
    const experience = useSelector(state => state?.auth?.experienceData?.experience) || ''
    const location = useLocation()
    const queryParams = new URLSearchParams(location.search)
    const redirectedFrom = queryParams.get('redirectedFrom')

    useEffect(() => {
        const savedData = localStorage?.getItem('interviewData');
        if (savedData) {
            setInterviewData(JSON.parse(savedData));
        }
        if(redirectedFrom == 'login'){
            setStart(true),
            setCompleted(true)
        }
    }, []);
    const onStart = async() =>{
        setLoading(true)
        try{
            let response ;
            if(authStatus && expStatus){
                response= await fetch(`${import.meta.env.VITE_BACKEND_URL}/get-questions/${categoryName}/${experience}`)
            }else{
                response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/get-questions/${categoryName}`)
            }
            const question = await response.json()
            setQuestion(question.question)
            setCurrentIndex(0)
            await speechQuestion(question.question[currentIndex])
            console.log(question,"question")
        }
        catch(error){
            setError(error)
        }finally{
            setLoading(false)
        }
      
    }
    const speechQuestion = async(text) =>{
        setQuesLoading(true)
        const payload ={
            method: 'POST',
            headers:{
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                text: text
            })  
        }

        try{
            const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/text-to-speech`, payload)
            const audioBlob = await response.blob();
            const audioURL = URL.createObjectURL(audioBlob)
            const audio = new Audio(audioURL)
            setStart(true)
            setQuesLoading(false)
            audio.play()
        }
        catch(error){
         console.log(error)
        }
    }
    const analyseAnswer = async (data) =>{
    console.log(data.transcription, data, "categorydetai")
    setAnalyzeLoading(true)
    const payload ={
        method: 'POST',
        headers:{
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
           
            answer : data.transcription,
            role: category,
            question: question[currentIndex],
            exp: experience || ''
        })  
    }
      try{
        const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/analyse-ans`, payload)
        const analysedAns = await response.json()
        const data1 = {
        question: question[currentIndex],
        answer: data.transcription,
        analysis: analysedAns
        }
        console.log(response, analysedAns, "responce")
        setInterviewData((prev) => [...prev, data1])
        const existingData = JSON.parse(localStorage.getItem('interviewData')) || [];
        const updatedData = [...existingData, data1];
        localStorage.setItem('interviewData', JSON.stringify(updatedData));
        if(currentIndex===4){
            setCompleted(true)
        }
        setAnalyzeLoading(false)
        setNextDisabled(false)
        console.log(interviewData,"interviewData")
      }
      catch(error){
        setError(error)
      }
    }
    const handleNext = async () =>{
        if(currentIndex <5 ){
            await speechQuestion(question[currentIndex +  1])
            setQuestionNo(prev => prev +1)
            setCurrentIndex((prev) => prev +1)
            setNextDisabled(true)
        }
       
    }
    return(
        <div className = {`w-full py-8 flex h-full m-auto ${completed === true ? '':'items-center'}`}>
        <Container className = {`flex justify-center`}>
            {!isStart && loading ?  (<div className='relative'>
          <div className="loading-overlay">
            <div className='spinner-border' role ='status'>
                <span className='sr-only'></span>
            </div>
          </div>
             <Card onClick={onStart} />
             </div>
            ) : (!isStart && <Card onClick={onStart} />) }
            {isStart && question && !completed && (
           <QuestionCard question={question[currentIndex]} onAnswer={analyseAnswer} onContinue={handleNext} questionNo={questionNo} nextDisabled={nextDisabled} quesLoading={quesLoading} analyzeLoading={analyzeLoading} />
            )}
            {completed === true && (
                  <Result interviewData={interviewData} />    
            )}
            
       
        </Container>
      </div>
    )
}
export default CategoryDetail