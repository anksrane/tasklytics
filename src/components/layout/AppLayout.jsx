import React from 'react'
import { useSelector,useDispatch } from 'react-redux'
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import Header from './Header';
import { toggleSidebar } from '../../features/ui/uiSlice';
import { ToastContainer, Slide } from 'react-toastify';

function AppLayout() {
    const dispatch=useDispatch()
    const isSidebarOpen=useSelector((state)=>state.ui.isSidebarOpen);
    const handleToggleSidebar=()=>{
        dispatch(toggleSidebar())
    }
    return (
        <>
        <ToastContainer position="top-right" autoClose={2500} transition={Slide}/>
            <div className='flex h-screen w-screen overflow-hidden'>
                <Sidebar isOpen={isSidebarOpen}/>
                <div className='flex flex-col flex-1 overflow-hidden'>
                    <Header toggleSidebar={handleToggleSidebar}/>
                    <main className=' flex-1 overflow-y-auto relative'>
                        <div className='bg-white min-h-full h-fit w-full'> 
                            <Outlet/>
                        </div>
                    </main>
                </div>
            </div>
        </>
    )
}

export default AppLayout
