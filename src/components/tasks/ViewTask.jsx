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

    const handleBackdropClick = (e) => {
      if (e.target === backdropRef.current) {
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
      <div ref={backdropRef} className='fixed inset-0 bg-black bg-opacity-50 z-20 flex justify-end cursor-pointer' onClick={handleBackdropClick}>
        <div className='bg-white sm:w-96 w-full h-full flex flex-col p-4 cursor-auto' onClick={(e) => e.stopPropagation()}  >
          <div className='flex justify-end mb-2'>
            <button onClick={onClose}><IoMdCloseCircle className='text-2xl text-dark'/></button>
          </div>
          <h2 className="text-2xl font-bold mb-4 text-center text-dark">View Task</h2>

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
                  <h5 className='font-semibold text-sm'>Client Name : </h5>
                  <p className='py-1 px-2 border border-disabled text-text text-sm rounded-md'>{viewData.clientLabel}</p>
                </div>

                <div className='mb-2'>
                  <h5 className='font-semibold text-sm'>Task Title : </h5>
                  <p className='py-1 px-2 border border-disabled text-text text-sm rounded-md'>{viewData.title}</p>
                </div>

                <div className='mb-2'>
                  <h5 className='font-semibold text-sm'>Task Description : </h5>
                  <p className='py-1 px-2 border border-disabled text-text text-sm rounded-md'>{viewData.description}</p>
                </div>

                <div className='mb-2'>
                  <h5 className='font-semibold text-sm'>Task Phase : </h5>
                  <p className='py-1 px-2 border border-disabled text-text text-sm rounded-md'>{viewData.taskPhaseLabel}</p>
                </div>

                <div className='mb-2'>
                  <h5 className='font-semibold text-sm'>Task Status : </h5>
                  <p className='py-1 px-2 border border-disabled text-text text-sm rounded-md'>{viewData.taskStatusLabel}</p>
                </div>

                <div className='mb-2'>
                  <h5 className='font-semibold text-sm'>Task Priority : </h5>
                  <p className='py-1 px-2 border border-disabled text-text text-sm rounded-md'>{viewData.priorityLabel}</p>
                </div>

                <div className='mb-2'>
                  <h5 className='font-semibold text-sm'>Task Start Date : </h5>
                  <p className='py-1 px-2 border border-disabled text-text text-sm rounded-md'>{startDate}</p>
                </div>

                <div className='mb-2'>
                  <h5 className='font-semibold text-sm'>Task End Date : </h5>
                  <p className='py-1 px-2 border border-disabled text-text text-sm rounded-md'>{endDate}</p>
                </div>

                {user.userRole=="Coder"?(
                  "")
                  :
                  (
                  <div className='mb-2'>
                    <h5 className='font-semibold text-sm'>Coders : </h5>
                    {codersList && codersList.length > 0 && (
                      <>
                        <p className='py-1 px-2 border border-disabled text-text text-sm rounded-md'>{codersList}</p>
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
