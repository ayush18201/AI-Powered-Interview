import React,{useState} from 'react'
import AudioRecorder from '../AudioRecorder'

function QuestionCard({question, className,  onAnswer, onContinue, questionNo, nextDisabled , quesLoading, analyzeLoading}){
// const [isAnswer, setIsAnswer] = useState(false)
const [audioData, setAudioData] = useState(null)
const [isQuestionCompleted, setIsQuestionCompleted] = useState(false)
const [loading, setLoading] = useState(false)

const handleAudioData =(data) =>{
    setAudioData(data)
    onAnswer(data)
    setIsQuestionCompleted(true)

    console.log(data,"data")
}
const handleLoading =(data) =>{
   setLoading(data)
}

    return(
<div className='quescard-container relative'>
    {loading === true || quesLoading ===true || analyzeLoading === true ? (
        <>
          <div className="loading-overlay">
            <div className='spinner-border' role ='status'>
                <span className='sr-only'></span>
            </div>
          </div>
          <div>{question}</div>
        </>
    ):(<div>{question}</div>) }
    <hr />
    <div className='flex justify-between'>
   <AudioRecorder onAudioData={handleAudioData} onLoading={handleLoading} />
   {isQuestionCompleted === true   && (
       <button className='btn-primary' onClick ={onContinue} disabled={nextDisabled}> Continue</button>
   )}
    </div>
</div>
    )
}
export default QuestionCard