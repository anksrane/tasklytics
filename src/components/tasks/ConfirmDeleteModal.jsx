import React, { useRef } from 'react';
import { Button, Loader } from '../index';
import { IoIosWarning } from "react-icons/io";
import { deleteTaskFirebase } from '../../firebase/taskServices/deleteTaskService'; 
import { toast } from 'react-toastify';

function ConfirmDeleteModal({onClose, onTaskAdded, deleteData}) {
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

    const handleDelete= async (data) =>{
      let taskId=data.id;
      let response;
      try {
        response = await deleteTaskFirebase(taskId);
        if (response.success) {
          toast.success("Task deleted successfully");
          onClose();
          onTaskAdded?.();            
        }            
      } catch (error) {
          toast.error("Failed to delete task. Please try again.",error);
          throw response.error;        
      } 
    }
    
  return (
      <div ref={backdropRef} className='absolute bg-black bg-opacity-50 z-20 w-full h-full cursor-pointer flex items-center justify-center' onMouseDown={handleMouseDown} onMouseUp={handleMouseUp}>
        <div className='bg-white h-auto w-96 p-4 overflow-y-auto cursor-auto' onMouseDown={(e) => e.stopPropagation()} onMouseUp={(e) => e.stopPropagation()} >
          <IoIosWarning className='text-5xl m-auto mb-4 text-red-500' />
          <p className={`text-center mb-3 text-gray-800`}>This action cannot be undone.</p>
          <p className={`text-center mb-3 text-gray-900`}>Are you sure you want to permanently delete this task?</p>
          <div className='flex items-center justify-center gap-1'>
            <Button type="submit" variant='danger' className='py-1 text-sm font-bold' onClick={()=>handleDelete(deleteData)}>Delete</Button>
            <Button type="submit" variant='outline' className='py-1 text-sm font-bold' onClick={onClose}>Cancel</Button>
          </div>
        </div>
      </div>
  )
}

export default ConfirmDeleteModal
