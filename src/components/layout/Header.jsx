import React from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { FaUser } from "react-icons/fa";
import { GiHamburgerMenu } from "react-icons/gi";
import { useNavigate } from 'react-router-dom';
import { toggleSidebar } from "../../features/ui/uiSlice"

function Header() {
  const dispatch=useDispatch();
  const navigate = useNavigate();

  const {user}=useSelector((state)=>state.auth);
  const username=user? user.name || user.email : "User";
  
  const gotoProfile=()=>{
    navigate("/profile");
  }
  return (
    <div className='w-full py-3 px-4 flex items-center justify-between bg-transparent border-b'>
      <button onClick={()=>dispatch(toggleSidebar())}>
        <GiHamburgerMenu className='text-white text-2xl' />
      </button>
      <div className='flex items-center justify-between gap-2 cursor-pointer' onClick={gotoProfile}>
        <span className='text-white text-xl font-semibold'>{username}</span>
        <FaUser className='text-white text-3xl border border-white p-[2px] rounded-[50%]'/>
      </div>
    </div>
  )
}

export default Header
