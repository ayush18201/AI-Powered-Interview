import {createSlice} from '@reduxjs/toolkit'

const initialState = {
    isLoggedIn: false,
    userData:null,
    isExperienceData: false,
    experienceData: null,
    guestUserRole: null
}

const authSlice = createSlice({
    name:'auth',
    initialState,
    reducers: {
        isUserLoggedIn: (state, action)=>{
            state.isLoggedIn = true,
            state.userData = action.payload;
        },
        isUserLoggedOut: (state, action)=>{
            state.isLoggedIn = false,
            state.userData = null;
        },
        experienceData:(state, action)=>{
            state.isExperienceData = true,
            state.experienceData = action.payload
        },
        deleteExperienceData: (state, action)=>{
            state.isExperienceData = false,
            state.experienceData= null
        },
        setGuestUserRole:(state, action) =>{
            console.log(action,"actionxx")
            state.guestUserRole = action.payload
        }

    }
})
export const {isUserLoggedIn, isUserLoggedOut, experienceData, deleteExperienceData, setGuestUserRole} = authSlice.actions
export default authSlice.reducer;