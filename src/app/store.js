import { configureStore } from "@reduxjs/toolkit";
import uiReducer from '../features/ui/uiSlice'
import authReducer from '../features/auth/authSlice';
import userMenuReducer from '../features/ui/userMenuSlice';
import profilePopupReducer from '../features/ui/profilePopupSlice.js';

const store = configureStore({
    reducer:{
        ui:uiReducer,
        auth:authReducer,
        userMenu:userMenuReducer,
        profilePopup:profilePopupReducer,
    }
})

export default store;