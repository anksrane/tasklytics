import React from 'react'

function Button({
  children,
  type = 'button',
  variant = 'primary', 
  isLoading = false,   
  className = '',
  ...props
}) {
  const base = 'px-4 rounded-lg mt-2 transition duration-200';
  const variants = {
    primary: 'bg-brand-primary-500 text-white hover:bg-brand-primary-900',
    outline: 'border border-brand-primary-500 text-brand-primary-500 hover:bg-brand-primary-900',
    danger: 'bg-brand-accent-danger text-white hover:text-brand-accent-danger hover:bg-white border border-brand-accent-danger',
    custom: ''
  };

  return (
    <button
      type={type}
      className={`${base} ${variants[variant] || ''} ${className}`} 
      disabled={isLoading}
      {...props}
    >
      {isLoading ? 'Loading...' : children}
    </button>
  );
}

export default Button;