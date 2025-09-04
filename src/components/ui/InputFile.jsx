import React, { useId } from 'react';

const InputFile = React.forwardRef(function InputFile({
  label = 'Upload file',
  name = '',
  className = '',
  accept = '',
  multiple = false,
  error = '',
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
        className={`px-3 py-2 rounded-lg bg-white text-black outline-none focus:bg-gray-50 duration-200 border w-full ${error ? 'border-red-500' : 'border-gray-400'} ${className}`} // ✨ changed
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