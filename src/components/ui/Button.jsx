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
    primary: 'bg-black text-white hover:bg-gray-900',
    outline: 'border border-black text-black hover:bg-gray-100',
    danger: 'bg-red-500 text-white hover:bg-red-600 border border-red-500',
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