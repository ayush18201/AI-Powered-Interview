import React from 'react'

function Card({onClick}){
return(
    <div className='card-container'>
        <div>
        <h4 className='text-lg'>Answer 5 interview questions</h4>
        <p className='text-base mt-4' style={{color:'#6c7686'}}>When you're done, review your answers and discover insights</p>
        </div>
        <button onClick={onClick} className= 'btn-primary'>Start</button>
    </div>
)
}
export default Card