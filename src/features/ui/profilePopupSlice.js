import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    isProfilePopupOpen:false,
}

const profilePopupSlice = createSlice({
    name:'profilePopup',
    initialState,
    reducers:{
        toggleProfilePopup:(state)=>{
            state.isProfilePopupOpen=!state.isProfilePopupOpen;
        },
        setIsProfilePopupOpen:(state,action)=>{
            state.isProfilePopupOpen=action.payload;
        }
    }    
})

export const {toggleUserMenu,setIsProfilePopupOpen}=profilePopupSlice.actions;
export default profilePopupSlice.reducer;