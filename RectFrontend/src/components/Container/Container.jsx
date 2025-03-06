import React from 'react'

function Container({children, className}){
    return(
        <div className = {`w-full mx-auto w-90 px-16 py-5  ${className}`}>{children}</div>
    )
}
export default Container