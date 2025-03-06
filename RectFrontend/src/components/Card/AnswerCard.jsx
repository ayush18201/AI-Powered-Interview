import React from 'react'

function AnswerCard({question, answer, review}){
    return(
        <div className='answercard' style={{width:'950px'}}>
            <div>{question}</div>
            <div><span>Your answer</span>  <hr/><div>{answer}</div></div>
            <div><span>Review</span>  <hr/><div><span className='font-bold'>Clarity:</span>{review.clarity}<br/>
            <span className='font-bold'>Confidence:</span>{review.confidence}<br/>
            <span className='font-bold'>Relevance:</span>{review.relevance}</div></div>
        </div>
    )

}
export default AnswerCard