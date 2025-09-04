import React, { useRef } from 'react';
import { IoMdCloseCircle } from "react-icons/io";

function ConfirmationModal({onClose}) {
    const backdropRef = useRef(null);

    const handleMouseDown = (e) => {
      setTimeout(() => {
        backdropRef.current.clickedOnBackdrop = e.target === backdropRef.current;
      }, 0);
    };

    const handleMouseUp = (e) => {
      if (backdropRef.current.clickedOnBackdrop && e.target === backdropRef.current) {
        onClose(); 
      }
    };  
  return (
      <div ref={backdropRef} className='absolute bg-black bg-opacity-50 z-20 w-full h-full cursor-pointer flex items-center justify-center'   onMouseDown={handleMouseDown} onMouseUp={handleMouseUp}>
        <div className='bg-white h-auto w-96 p-4 overflow-y-auto cursor-auto' onMouseDown={(e) => e.stopPropagation()} onMouseUp={(e) => e.stopPropagation()} >
          <div className='flex justify-end mb-2'>
            <button onClick={onClose}><IoMdCloseCircle className='text-2xl'/></button>
          </div>
          <h2 className="text-2xl font-bold mb-4 text-center">test</h2>

        </div>
      </div>
  )
}

export default ConfirmationModal
