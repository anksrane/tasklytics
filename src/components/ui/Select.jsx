import React, { useId } from 'react';

const Select = React.forwardRef(function Select({
  options = [],
  label = 'Please select an option',
  className = '',
  labelClass='',
  defaultOption = 'Select an option', 
  error = '', 
  labelVisible=true,
  showDefaultOption = true,
  disabled=false,
  ...props
}, ref) {
  const id = useId();

  const hasCustomPlaceholder = options.some(opt => typeof opt === 'object' && opt.disabled);

  return (
    <div className="">
      {label && (
        <label className={`${labelVisible ? 'inline-block':'hidden'} mb-1 pl-1 ${labelClass}`} htmlFor={id}>
          {label}
        </label>
      )}
      <select
        id={id}
        ref={ref}
        className={`rounded-md border text-text outline-none focus:shadow-md focus:border-primary hover:border-primary-hover w-full 
          ${error ? 'border border-danger' : 'border border-border'} duration-200 w-full 
          ${disabled ? 'bg-disabled text-text-muted cursor-not-allowed' : ''} ${className}`}
        {...props}
      >
        {/* Only add defaultOption if user hasn't provided their own placeholder */}
        {showDefaultOption && !hasCustomPlaceholder && (
          <option value="" className="text-gray-400">
            {defaultOption}
          </option>
        )}
        {options?.map((option) =>
          typeof option === 'object' ? (
            <option key={option.value} value={option.value} disabled={option.disabled}>
              {option.label}
            </option>
          ) : (
            <option key={option} value={option}>
              {option}
            </option>
          )
        )}
      </select>
      {error && <p className="text-sm text-red-500 mt-1">{error}</p>}
    </div>
  );
});

export default Select;