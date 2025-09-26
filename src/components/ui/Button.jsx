import React from 'react'

function Button({
  children,
  type = 'button',
  variant = 'primary', 
  isLoading = false,   
  className = '',
  ...props
}) {
  const base = 'px-4 py-2 rounded-md mt-2 font-medium transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed border-border';
  const variants = {
    primary: 'bg-primary text-white hover:bg-primary-hover',
    outline: 'border border-primary text-primary hover:bg-primary-hover hover:text-white',
    secondary: 'bg-secondary text-text-light hover:bg-secondary-hover',
    secondaryOutline: 'border border-secondary text-secondary hover:bg-secondary-hover hover:text-white',
    danger: 'bg-danger text-white hover:bg-white hover:text-danger border border-danger',
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