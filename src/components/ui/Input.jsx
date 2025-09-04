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
  ...props
}, ref) {
  const id = useId();
  const inputClass = `px-3 rounded-lg bg-white text-black outline-none focus:bg-gray-50 ${error ? 'border-red-500' : 'border-gray-400'} focus:border-slate-400 duration-200 border w-full ${className}`;

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
          {...props}
        />
      )} 
      {error && <p className="text-sm text-red-500 mt-1">{error}</p>} 
    </div>
  );
});

export default Input;