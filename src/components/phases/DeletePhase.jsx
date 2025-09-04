import React, { useRef, useEffect, useState } from 'react'
import { Button, Loader } from '../index';
import { IoIosWarning } from "react-icons/io";
import { toast } from 'react-toastify';
import { getPhasesListFirebase } from '../../firebase/phaseServices/getPhaseService';
import { deletePhaseFirebase } from '../../firebase/phaseServices/deletePhaseService';

function DeletePhase({onClose, phaseData, onPhaseDeleted}) {
    const [tasks, setTasks] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
      const fetchPhase = async () => {
        setLoading(true);
        try {
          const response = await getPhasesListFirebase(phaseData.id);
          setTasks(response.data);
        } catch (error) {
          console.error("Error fetching phase:", error);
          // You could also show a toast notification here
        } finally {
          setLoading(false); // always runs
        }
      };

      if (phaseData?.id) {
        fetchPhase();
      }
    }, [phaseData?.id]);

    const handleDelete = async(data) => {
      let phaseId=data.id;
      let response;
      try {
        response = await deletePhaseFirebase(phaseId);
        if (response.success) {
          toast.success("Phase deleted successfully");
          onClose();
          onPhaseDeleted?.();            
        }            
      } catch (error) {
          toast.error("Failed to delete phase. Please try again.",error);
          throw response.error;        
      }      
    }

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
        <div 
        ref={backdropRef} 
        className='fixed inset-0 bg-black bg-opacity-50 z-20 flex justify-center items-center cursor-pointer' onMouseDown={handleMouseDown} onMouseUp={handleMouseUp}>
          <div className='bg-white w-auto min-w-96 h-fit flex flex-col p-4 cursor-auto' onMouseDown={(e) => e.stopPropagation()} onMouseUp={(e) => e.stopPropagation()} >
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
                      <p className={`text-center mb-1 text-gray-800`}>This phase cannot be deleted because there are <strong>{tasks.length}</strong> active tasks linked to <strong>{phaseData.label}</strong>.</p>
                      <p className={`text-center mb-3 text-gray-800`}>Please reassign or remove those tasks before deleting.</p>
                      <div className='flex items-center justify-center gap-1'>
                        <Button type="submit" variant='outline' className='py-1 text-sm font-bold' onClick={onClose}>Cancel</Button>
                      </div>
                    </>
                  ):(
                    <>
                      <p className={`text-center mb-1 text-gray-800`}>Are you sure you want to delete <strong>{phaseData.label}</strong>?</p>
                      <p className={`text-center mb-3 text-red-500`}>This action cannot be undone.</p>
                      <div className='flex items-center justify-center gap-1'>
                        <Button type="submit" variant='danger' className='py-1 text-sm font-bold' onClick={()=>{handleDelete(phaseData)}}>Delete</Button>
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

export default DeletePhase
