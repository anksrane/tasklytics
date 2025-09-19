import React, { useRef, useEffect, useState } from 'react'
import { Button, Loader } from '../index';
import { IoIosWarning } from "react-icons/io";
import { toast } from 'react-toastify';
import { getPrioritiesListFirebase } from '../../firebase/priorityServices/getPriorityService';
import { deletePriorityFirebase } from '../../firebase/priorityServices/deletePriorityService';

function DeletePriorities({onClose, priorityData, onPriorityDeleted}) {
    const [tasks, setTasks] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
      const fetchPriority = async () => {
        setLoading(true);
        try {
          const response = await getPrioritiesListFirebase(priorityData.id);
          setTasks(response.data);
        } catch (error) {
          console.error("Error fetching priority:", error);
          // You could also show a toast notification here
        } finally {
          setLoading(false); // always runs
        }
      };

      if (priorityData?.id) {
        fetchPriority();
      }
    }, [priorityData?.id]);

    const handleDelete = async(data) => {
      let priorityId=data.id;
      let response;
      try {
        response = await deletePriorityFirebase(priorityId);
        if (response.success) {
          toast.success("Priority deleted successfully");
          onClose();
          onPriorityDeleted?.();            
        }            
      } catch (error) {
          toast.error("Failed to delete priority. Please try again.",error);
          throw response.error;        
      }      
    }

    const backdropRef = useRef(null);

    const handleBackdropClick = (e) => {
      if (e.target === backdropRef.current) {
        onClose();
      }
    }; 
    return (
        <div 
        ref={backdropRef} 
        className='fixed inset-0 bg-black bg-opacity-50 z-20 flex justify-center items-center cursor-pointer' 
        onClick={handleBackdropClick}
        >
          <div className='bg-white w-auto min-w-96 h-fit flex flex-col p-4 cursor-auto' 
          onClick={(e) => e.stopPropagation()} 
          >
            <IoIosWarning className='text-5xl m-auto mb-4 text-danger' />
            {
              loading ? (
                <div className="flex justify-center items-center h-20">
                  <Loader color='text-blue' />
                </div>
              )
              :(
                  tasks.length>0 ? (
                    <>
                      <p className={`text-center mb-1 text-dark`}>This priority cannot be deleted because there are <strong>{tasks.length}</strong> active tasks linked to <strong>{priorityData.label}</strong>.</p>
                      <p className={`text-center mb-3 text-dark`}>Please reassign or remove those tasks before deleting.</p>
                      <div className='flex items-center justify-center gap-1'>
                        <Button type="submit" variant='outline' className='py-1 text-sm font-bold' onClick={onClose}>Cancel</Button>
                      </div>
                    </>
                  ):(
                    <>
                      <p className={`text-center mb-1 text-dark`}>Are you sure you want to delete <strong>{priorityData.label}</strong>?</p>
                      <p className={`text-center mb-3 text-danger`}>This action cannot be undone.</p>
                      <div className='flex items-center justify-center gap-1'>
                        <Button type="submit" variant='danger' className='py-1 text-sm font-bold' onClick={()=>{handleDelete(priorityData)}}>Delete</Button>
                        <Button type="submit" variant='outline' className='py-1 text-sm font-bold' onClick={onClose}>Cancel</Button>
                      </div>   
                    </>               
                  )
              )
            }
          </div>
        </div>
    )
}

export default DeletePriorities
