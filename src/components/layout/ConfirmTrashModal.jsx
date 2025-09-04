import React, { useRef } from 'react';
import { Button, Loader } from '../index';
import { IoIosWarning } from "react-icons/io";
import { updateTaskFirebase } from '../../firebase/updateTaskService';
import { toast } from 'react-toastify';

function ConfirmTrashModal({onClose, onTaskAdded, deleteData}) {
    // console.log(deleteData);
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

    const trashTask= async (data) =>{
      let taskId=data.id;
      let task={
        ...data,
        trash:true
      }
      const response = await updateTaskFirebase(taskId, task);
      if (response.success) {
        toast.success("Task moved to trash successfully.");
        onClose();
        onTaskAdded?.();            
      } else {
          toast.error("Failed to move task to trash. Please try again.");
          throw response.error;
      }       
    }
    
  return (
      <div ref={backdropRef} className='absolute bg-black bg-opacity-50 z-20 w-full h-full cursor-pointer flex items-center justify-center' onMouseDown={handleMouseDown} onMouseUp={handleMouseUp}>
        <div className='bg-white h-auto w-96 p-4 overflow-y-auto cursor-auto' onMouseDown={(e) => e.stopPropagation()} onMouseUp={(e) => e.stopPropagation()} >
          <IoIosWarning className='text-5xl m-auto mb-4 text-red-500' />
          <p className={`text-center mb-3 text-gray-800`}>Move <span className='text-gray-700 font-bold'>"{deleteData.title}"</span> to Trash?</p>
          <p className={`text-center mb-3 text-gray-900`}>You can restore it later if needed.</p>
          <div className='flex items-center justify-center gap-1'>
            <Button type="submit" variant='danger' className='py-1 text-sm font-bold' onClick={()=>trashTask(deleteData)}>Delete</Button>
            <Button type="submit" variant='outline' className='py-1 text-sm font-bold' onClick={onClose}>Cancel</Button>
          </div>
        </div>
      </div>
  )
}

export default ConfirmTrashModal
