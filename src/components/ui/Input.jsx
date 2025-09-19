import React, { useId } from 'react';

const Input = React.forwardRef(function Input({
  label = 'Please enter Text',
  type = 'text',
  name = '',
  className = '',
  labelClass='',
  placeholder = 'Please enter Text',
  error = '',        
  isTextarea = false, 
  labelVisible= true,
  disabled=false,
  ...props
}, ref) {
  const id = useId();
  const inputClass = `rounded-md text-text outline-none focus:shadow-md focus:border-primary hover:border-primary-hover 
  ${error ? 'border border-danger' : 'border border-border'} duration-200 w-full 
  ${disabled ? 'bg-disabled text-text-muted cursor-not-allowed' : ''} ${className}`;

  return (
    <div className="w-full h-fit">
      {label && (
        <label className={`${labelVisible ? 'inline-block':'hidden'} inline-block mb-1 pl-1 ${labelClass? labelClass : "text-text-secondary"}`} htmlFor={id}>
          {label}
        </label>
      )}
      {isTextarea ? (
        <textarea
          className={`h-fit ${inputClass} ${className}`}
          name={name}
          id={id}
          ref={ref}
          placeholder={placeholder}
          disabled={disabled}
          {...props}
        />
      ) : (
        <input
          type={type}
          className={inputClass}
          name={name}
          ref={ref}
          id={id}
          placeholder={placeholder}
          disabled={disabled}
          {...props}
        />
      )} 
      {error && <p className="text-sm text-red-500 mt-1">{error}</p>} 
    </div>
  );
});

export default Input;