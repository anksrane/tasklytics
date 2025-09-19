import React, { useId } from 'react'

const DatePicker= React.forwardRef (function DatePicker({
    label='Select Date',
    name='',
    className='',
    labelClass='',
    error = '', 
    labelVisible= true,
    disabled=false,
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
                className={`px-3 rounded-md text-text outline-none focus:shadow-md focus:border-primary hover:border-primary-hover duration-200 border 
                        ${error ? 'border border-danger' : 'border border-border'} duration-200 w-full 
                        ${disabled ? 'bg-disabled text-text-muted cursor-not-allowed' : ''} ${className}`}
                {...props}
            />
            {error && <p className="text-sm text-red-500 mt-1">{error}</p>}
        </div>
    )
});

export default DatePicker
