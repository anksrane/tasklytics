import React from 'react'
import { NavLink } from 'react-router-dom';
import { Button} from '../index';
import { FaTasks } from "react-icons/fa";
import { MdDashboardCustomize } from "react-icons/md";
import { BiTask } from "react-icons/bi";
import { MdGroups } from "react-icons/md";
import { TiPower } from "react-icons/ti";
import { IoMdCloseCircle } from "react-icons/io";
import { GoTrash } from "react-icons/go";
import { GoOrganization } from "react-icons/go";
import { IoSettings } from "react-icons/io5";

import { useDispatch, useSelector } from 'react-redux';
import { toggleSidebar, setIsSidebarOpen } from "../../features/ui/uiSlice"

function Sidebar({isOpen}) {
    const {user} = useSelector((state)=>state.auth);  
    const dispatch=useDispatch();
  
    const navItems=[
      { name: 'Dashboard', path:"/dashboard", icon:MdDashboardCustomize},
      { name: 'Tasks', path:"/tasks", icon: BiTask}, 
      { name: 'Deleted Items', path: '/deleted', icon:GoTrash, role: 'Admin' },    
      { name: 'Clients', path: '/clients', icon:GoOrganization, role: 'Admin' },    
      { name: 'Phases', path: '/phases', icon:IoSettings, role: 'Admin' },    
      { name: 'Priorities', path: '/priorities', icon:IoSettings, role: 'Admin' },    
      { name: 'Statuses', path: '/statuses', icon:IoSettings, role: 'Admin' },    
    ]    

    const visibleNavItems = navItems.filter(
      (item) => !item.role || item.role === user.userRole
    );    

    return (
      <aside className={`h-screen bg-brand-primary-900 border-r shadow-md p-2 flex flex-col justify-between duration-500 ${isOpen? 'fixed top-0 z-50 left-0 w-full md:static md:w-64' : 'hidden md:flex md:w-20'}`}>
        <div>
          <div className='md:block flex justify-between items-center'>
            <div className='md:hidden block'></div>
            <div className={`flex justify-center items-center gap-2 text-xl font-bold text-center py-2 transition-all duration-200`}>
              <FaTasks className='text-xl text-brand-text-light'/>
              <h2 className={`text-xl font-bold text-center text-brand-text-light ${isOpen ?  "opacity-100 w-auto ml-2" : "opacity-0 w-0 ml-0"}`}> Tasklytics</h2>
            </div>
            <div className='md:hidden block'>
              <IoMdCloseCircle className='text-2xl text-brand-neutral-500 cursor-pointer' onClick={()=>dispatch(toggleSidebar())} />
            </div>
          </div>

          <nav className="space-y-3 mt-5">
            {visibleNavItems.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.name}
                  to={item.path}
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-4 py-2 rounded-md font-medium transition 
                    ${isActive ? 'bg-brand-primary-500 text-brand-text-light' : 'text-brand-text-light hover:bg-brand-primary-500 hover:text-brand-text-light duration-300'}`
                  }
                  onClick={() => dispatch(setIsSidebarOpen(false))}
                >
                  <Icon className="text-xl 'text-brand-text-light hover:bg-brand-primary-500" />
                  {/* <span className={isOpen ? 'transition-opacity duration-100 opacity-100 inline-block' : 'transition-opacity duration-100 opacity-0 hidden'}>{isOpen? item.name : ""}</span> */}
                  <span
                    className={`
                      whitespace-nowrap overflow-hidden transition-all duration-300
                      ${isOpen ? "opacity-100 max-w-xs ml-2" : "opacity-0 max-w-0 ml-0"}
                    `}
                  >
                    {item.name}
                  </span>                  
                </NavLink>
              );
            })}
          </nav>
        </div>
      </aside>
    )
}

export default Sidebar