import React, { useRef, useEffect, useState } from 'react'
import { Button, Loader } from '../index';
import { IoIosWarning } from "react-icons/io";
import { toast } from 'react-toastify';
import { getStatusListFirebase } from '../../firebase/statusServices/getStatusService.js';
import { deleteStatusFirebase } from '../../firebase/statusServices/deleteStatusService.js';

function DeleteStatus({onClose, statusData, onStatusDeleted}) {
    const [tasks, setTasks] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
      const fetchStatus = async () => {
        setLoading(true);
        try {
          const response = await getStatusListFirebase(statusData.id);
          setTasks(response.data);
        } catch (error) {
          console.error("Error fetching status:", error);
          // You could also show a toast notification here
        } finally {
          setLoading(false); // always runs
        }
      };

      if (statusData?.id) {
        fetchStatus();
      }
    }, [statusData?.id]);

    const handleDelete = async(data) => {
      let statusId=data.id;
      let response;
      try {
        response = await deleteStatusFirebase(statusId);
        if (response.success) {
          toast.success("Status deleted successfully");
          onClose();
          onStatusDeleted?.();            
        }            
      } catch (error) {
          toast.error("Failed to delete status. Please try again.",error);
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
            <IoIosWarning className='text-5xl m-auto mb-4 text-red-500' />
            {
              loading ? (
                <div className="flex justify-center items-center h-20">
                  <Loader color='text-blue' />
                </div>
              )
              :(
                  tasks.length>0 ? (
                    <>
                      <p className={`text-center mb-1 text-gray-800`}>This status cannot be deleted because there are <strong>{tasks.length}</strong> active tasks linked to <strong>{statusData.label}</strong>.</p>
                      <p className={`text-center mb-3 text-gray-800`}>Please reassign or remove those tasks before deleting.</p>
                      <div className='flex items-center justify-center gap-1'>
                        <Button type="submit" variant='outline' className='py-1 text-sm font-bold' onClick={onClose}>Cancel</Button>
                      </div>
                    </>
                  ):(
                    <>
                      <p className={`text-center mb-1 text-gray-800`}>Are you sure you want to delete <strong>{statusData.label}</strong>?</p>
                      <p className={`text-center mb-3 text-red-500`}>This action cannot be undone.</p>
                      <div className='flex items-center justify-center gap-1'>
                        <Button type="submit" variant='danger' className='py-1 text-sm font-bold' onClick={()=>{handleDelete(statusData)}}>Delete</Button>
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

export default DeleteStatus
