import React from 'react'

function CategoryBtn({className, ButtonName, onClick}){
    return(
        <button className = {`category-btn  ${className}`} onClick={onClick}><span>{ButtonName}</span><span> {'>'} </span></button>
    )
}
export default CategoryBtn