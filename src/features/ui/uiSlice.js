import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    isSidebarOpen:false,
}

const uiSlice=createSlice({
    name:'ui',
    initialState:initialState,
    reducers:{
        toggleSidebar:(state)=>{
            state.isSidebarOpen=!state.isSidebarOpen;
        },
        setIsSidebarOpen:(state,action)=>{
            state.isSidebarOpen=action.payload;
        }
    }
})

export const {toggleSidebar, setIsSidebarOpen} = uiSlice.actions;
export default uiSlice.reducer;