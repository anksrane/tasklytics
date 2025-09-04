import React from 'react'
import { Navigate, Outlet } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { Loader } from '../components';

function ProtectedRoutes() {
    // const isAuthenticated=true;

    // return isAuthenticated? <Outlet /> : <Navigate to="/login" replace/>

    const {user, loading}=useSelector((state)=>state.auth);

    if(loading){
        return <Loader />
    }

    if(!user){
        return <Navigate to="/login" replace/>
    }

    return <Outlet />
    
}

export default ProtectedRoutes
