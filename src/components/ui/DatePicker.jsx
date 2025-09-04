import React, { useId } from 'react'

const DatePicker= React.forwardRef (function DatePicker({
    label='Select Date',
    name='',
    className='',
    labelClass='',
    error = '', 
    labelVisible= true,
    ...props
},ref){
    const id = useId()
    return (
        <div className='w-full h-fit'>
            {label && <label htmlFor={id} className={`${labelVisible ? 'inline-block':'hidden'} inline-block mb-1 pl-1 ${labelClass}`}>{label}</label>}
            <input
                type='date'
                id={id}
                name={name}
                ref={ref}
                className={`px-3 rounded-lg bg-white text-black outline-none focus:bg-gray-50 duration-200 border ${error ? 'border-red-500' : 'border-gray-400'} w-full ${className}`}
                {...props}
            />
            {error && <p className="text-sm text-red-500 mt-1">{error}</p>}
        </div>
    )
});

export default DatePicker
