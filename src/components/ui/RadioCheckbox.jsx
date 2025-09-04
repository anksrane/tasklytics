import React, { useId } from 'react'

const RadioCheckbox=React.forwardRef(function Radio({
    type="radio",
    label,
    name,
    value,
    checked,
    onChange,
    disabled,
    className='',
    ...props
},ref){
    const id=useId();
    return(
        <div className="flex items-center space-x-2">
        <input
            type={type}
            id={id}
            name={name}
            value={value}
            checked={checked}
            onChange={onChange}
            disabled={disabled}
            ref={ref}
            className={`accent-blue-500 ${className}`}
            {...props}
        />
        {label && (
            <label htmlFor={id} className="text-sm text-gray-800">
            {label}
            </label>
        )}
        </div>        
    );
}); 

export default RadioCheckbox
