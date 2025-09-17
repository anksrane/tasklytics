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
  const inputClass = `px-3 rounded-lg bg-brand-neutral-100 text-brand-dark outline-none focus:shadow focus:border-brand-primary-100 ${error ? 'border-brand-accent-danger' : 'border-brand-primary-900'} duration-200 border w-full ${className} ${disabled ? 'disabled:bg-brand-accent-disabled disabled:text-gray-500 disabled:cursor-not-allowed':''}`;

  return (
    <div className="w-full h-fit">
      {label && (
        <label className={`${labelVisible ? 'inline-block':'hidden'} inline-block mb-1 pl-1 ${labelClass}`} htmlFor={id}>
          {label}
        </label>
      )}
      {isTextarea ? (
        <textarea
          className={`h-fit ${inputClass}`}
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