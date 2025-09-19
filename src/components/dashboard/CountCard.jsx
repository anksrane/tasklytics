import React from 'react'

function CountCard({title,count='0',icon, onClick}) {
  return (
    <div className='rounded-lg px-4 py-4 bg-background-surface shadow-md' onClick={onClick}>
        <div className="flex items-center justify-center">  
          <div className='flex gap-4 items-center justify-center sm:w-auto min-w-[210px]'>
            {icon}
            <div className='flex items-center gap-2'>
                <p className='text-text-secondary font-black bg-clip-border text-3xl'>{count}</p>                
                <h3 className='font-semibold text-lg text-text-secondary'>{title}</h3>
            </div>    
          </div> 
        </div>
    </div>
  )
}

export default CountCard
