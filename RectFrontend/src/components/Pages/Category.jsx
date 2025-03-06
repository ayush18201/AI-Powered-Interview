import React, {useState} from 'react'
import CategoryBtn from '../CategoryBtn/CategoryBtn'
import Container from '../Container/Container'
import {useNavigate} from 'react-router-dom'
import {useDispatch} from 'react-redux'
import {setGuestUserRole} from '../Store/Features/authSlice'

function Category(){
 const [categories, setCategories] = useState(['Data Analytics', 'Digital Marketing and E-Commerce', 'IT Support', 'Project Management','UX Design', 'Cybersecurity','General'])
 const navigate = useNavigate()
 const dispatch = useDispatch()
   const handleClick =(item) =>{
    const url = item.split(' ').join('-')
    dispatch(setGuestUserRole(url))

      navigate(`/category/${url}`)
   }
    return(
          <div className = 'w-full py-8 items-center flex h-full m-auto'>
          <Container>
            <div className = 'flex flex-col items-center gap-2'>
          {categories.map((item, index)=>(
            <CategoryBtn key={index} ButtonName ={item} onClick={()=>handleClick(item)} />
            ))}
            </div>
          </Container>
        </div>
    )
}
export default Category