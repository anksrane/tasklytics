import React, { useRef, useEffect, useState } from 'react'
import { Loader } from '../index';
import { IoMdCloseCircle } from "react-icons/io";
import { useSelector } from 'react-redux';
import { format } from 'date-fns';

function ViewTask({onClose, viewData }) {
    const {user}=useSelector((state)=>state.auth);
    const [loading,setLoading] = useState(true); 
    const [codersList, setCodersList] = useState([]);
    const startDate = viewData.startDate ? format(viewData.startDate.toDate(), 'dd-MMM-yyyy') : '';
    const endDate = viewData.endDate ? format(viewData.endDate.toDate(), 'dd-MMM-yyyy') : '';
    

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

    useEffect(() => {
      if(viewData && viewData.coders.length > 0){
        const namesString = viewData?.coders
          ?.map(coder => coder.name?.toString?.() || '')
          .join(', ') || '';
        setCodersList(namesString);
      }
      setLoading(false);
    },[])
    

    return (
      <div ref={backdropRef} className='fixed inset-0 bg-black bg-opacity-50 z-20 flex justify-end cursor-pointer'  onMouseDown={handleMouseDown} onMouseUp={handleMouseUp}>
        <div className='bg-white w-96 h-full flex flex-col p-4 cursor-auto' onMouseDown={(e) => e.stopPropagation()} onMouseUp={(e) => e.stopPropagation()} >
          <div className='flex justify-end mb-2'>
            <button onClick={onClose}><IoMdCloseCircle className='text-2xl'/></button>
          </div>
          <h2 className="text-2xl font-bold mb-4 text-center">View Task</h2>

          {loading?(
            <>
              <div>
                <Loader color='text-blue' height='h-64'/>
              </div>
            </>
          ):(
            <>
              <div className='container mx-auto pt-5 pb-4 relative'> 

                <div className='mb-2'>
                  <h5 className='px-1 font-semibold'>Client Name : </h5>
                  <p className='px-1'>{viewData.clientLabel}</p>
                </div>

                <div className='mb-2'>
                  <h5 className='px-1 font-semibold'>Task Title : </h5>
                  <p className='px-1'>{viewData.title}</p>
                </div>

                <div className='mb-2'>
                  <h5 className='px-1 font-semibold'>Task Description : </h5>
                  <p className='px-1'>{viewData.description}</p>
                </div>

                <div className='mb-2'>
                  <h5 className='px-1 font-semibold'>Task Phase : </h5>
                  <p className='px-1'>{viewData.taskPhaseLabel}</p>
                </div>

                <div className='mb-2'>
                  <h5 className='px-1 font-semibold'>Task Status : </h5>
                  <p className='px-1'>{viewData.taskStatusLabel}</p>
                </div>

                <div className='mb-2'>
                  <h5 className='px-1 font-semibold'>Task Priority : </h5>
                  <p className='px-1'>{viewData.priorityLabel}</p>
                </div>

                <div className='mb-2'>
                  <h5 className='px-1 font-semibold'>Task Start Date : </h5>
                  <p className='px-1'>{startDate}</p>
                </div>

                <div className='mb-2'>
                  <h5 className='px-1 font-semibold'>Task End Date : </h5>
                  <p className='px-1'>{endDate}</p>
                </div>

                {user.userRole=="Coder"?(
                  "")
                  :
                  (
                  <div className='mb-2'>
                    <h5 className='px-1 font-semibold'>Coders : </h5>
                    {codersList && codersList.length > 0 && (
                      <>
                        <p className='px-1'>{codersList}</p>
                      </>
                    )}
                  </div>                  
                )}
              </div>            
            </>
          )}
        </div>
      </div>
    )
}

export default ViewTask
