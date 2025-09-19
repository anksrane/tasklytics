import React, { useRef } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { FaUser } from "react-icons/fa";
import { GiHamburgerMenu } from "react-icons/gi";
import { toggleSidebar } from "../../features/ui/uiSlice"
import { toggleUserMenu } from '../../features/ui/userMenuSlice';
import { PopoverMenu } from '../index';
import { ProfilePopup } from '../index';

function Header() {
  const dispatch=useDispatch();
  const { isUserMenuOpen } = useSelector((state) => state.userMenu);
  const { isProfilePopupOpen } = useSelector((state) => state.profilePopup);
  const {user}=useSelector((state)=>state.auth);
  const username=user? user.name || user.email : "User";

  const triggerRef = useRef(null);

  const handleUserMenuToggle = () => {
    dispatch(toggleUserMenu());  // ✅ this toggles between true/false
  };  
  return (
    <>
      <div className='w-full px-4 flex items-center justify-between border-b bg-background'>
        <button className='z-10' onClick={()=>dispatch(toggleSidebar())} >
          <GiHamburgerMenu className='text-text-secondary text-2xl' />
        </button>
        <div className='relative flex'>
          <div ref={triggerRef} className='py-3 px-2 flex items-center justify-between gap-2 hover:bg-background-overlay cursor-pointer' onClick={handleUserMenuToggle}>
            <span className='text-text-secondary text-xl font-semibold'>{username}</span>
            <FaUser className='text-text-secondary text-3xl border border-brand-text-light p-[2px] rounded-[50%]'/>
          </div>
          <PopoverMenu isOpen={isUserMenuOpen} triggerRef={triggerRef} />
        </div>
      </div>
      <ProfilePopup isOpen={isProfilePopupOpen}/>
    </>
  )
}

export default Header
