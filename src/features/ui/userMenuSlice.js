import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    isUserMenuOpen:false,
}

const userMenuSlice = createSlice({
    name:'userMenu',
    initialState,
    reducers:{
        toggleUserMenu:(state)=>{
            state.isUserMenuOpen=!state.isUserMenuOpen;
        },
        setIsUserMenuOpen:(state,action)=>{
            state.isUserMenuOpen=action.payload;
        }
    }    
})

export const {toggleUserMenu,setIsUserMenuOpen}=userMenuSlice.actions;
export default userMenuSlice.reducer;