import React from 'react'

function CountCard({title,count='0',icon, onClick}) {
  return (
    <div className='rounded-lg px-4 py-4 border border-dotted border-brand-primary-light hover:cursor-pointer' onClick={onClick}>
        <div className="flex gap-4 items-center justify-center">  
            {icon}
            <div className='flex items-center gap-2'>
                <p className='text-brand-primary-dark font-black bg-clip-border text-3xl'>{count}</p>                
                <h3 className='font-semibold text-lg text-brand-text-black'>{title}</h3>
            </div>     
        </div>
    </div>
  )
}

export default CountCard
