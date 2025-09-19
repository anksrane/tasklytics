import React, { useId } from 'react';

const InputFile = React.forwardRef(function InputFile({
  label = 'Upload file',
  name = '',
  className = '',
  accept = '',
  multiple = false,
  error = '',
  disabled=false,
  ...props
}, ref) {
  const id = useId();

  return (
    <div className="w-full h-fit">
      {label && (
        <label className="inline-block mb-1 pl-1" htmlFor={id}>
          {label}
        </label>
      )}
      <input
        type="file"
        className={`px-3 py-2 rounded-md text-text outline-none focus:shadow-md focus:border-primary hover:border-primary-hover 
        ${error ? 'border border-danger' : 'border border-border'} duration-200 w-full 
        ${disabled ? 'bg-disabled text-text-muted cursor-not-allowed' : ''} ${className}`}
        name={name}
        ref={ref}
        id={id}
        accept={accept}
        multiple={multiple}
        {...props}
      />
      {error && <p className="text-sm text-red-500 mt-1">{error}</p>} {/* 🆕 added */}
    </div>
  );
});

export default InputFile;