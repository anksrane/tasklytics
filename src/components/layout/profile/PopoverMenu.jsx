import React, {useEffect, useRef} from 'react'
import { useDispatch } from 'react-redux'
import { setIsUserMenuOpen } from '../../../features/ui/userMenuSlice';
import { setIsProfilePopupOpen } from '../../../features/ui/profilePopupSlice';
import { useNavigate } from 'react-router-dom';
import { logoutUser } from '../../../features/auth/authActions';

function PopoverMenu({isOpen,triggerRef}) {
    const dispatch = useDispatch();
    const navigate = useNavigate()
    const menuRef = useRef(null);    
    useEffect(() => {
        const handleClickOutside = (event) => {
            const clickedOutsideMenu = menuRef.current && !menuRef.current.contains(event.target);
            const clickedOutsideTrigger = triggerRef.current && !triggerRef.current.contains(event.target);        
            if (clickedOutsideMenu && clickedOutsideTrigger) {
            dispatch(setIsUserMenuOpen(false));
            }
        };

        if (isOpen) {
            document.addEventListener('mousedown', handleClickOutside);
        } else {
            document.removeEventListener('mousedown', handleClickOutside);
        }
        // Cleanup on unmount
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [isOpen, dispatch, triggerRef]);

    if (!isOpen) return null;  

    const gotoProfile=()=>{
        dispatch(setIsUserMenuOpen(false))
        dispatch(setIsProfilePopupOpen(true));
    }    

    const handleLogout = async () => {
        dispatch(setIsUserMenuOpen(false)) 
        await dispatch(logoutUser());
        navigate('/login');
    };    

  return (
    <div ref={menuRef} className={isOpen ? 'absolute top-12 w-48 right-2 border border-background bg-background-overlay text-text-secondary shadow-md rounded-md z-50' : 'hidden'}>
    <div className="absolute -top-2 right-2 w-0 h-0 
                border-l-8 border-l-transparent 
                border-r-8 border-r-transparent 
                border-b-8 border-b-background-overlay"></div>        
      <ul>
        <li className="px-4 py-2 rounded-tr-md rounded-tl-md hover:bg-background-surface cursor-pointer border-b-[1px]" onClick={() => gotoProfile()}
            >Profile</li>
        {/* <li className="px-4 py-2 hover:bg-neutral-500 cursor-pointer border-b-[1px]">Change Password</li> */}
        <li className="px-4 py-2 rounded-bl-md rounded-br-md hover:bg-background-surface cursor-pointer" onClick={handleLogout}>Logout</li>
      </ul>
    </div>
  )
}

export default PopoverMenu
