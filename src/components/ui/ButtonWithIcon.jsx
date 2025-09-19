import React from 'react'

function ButtonWithIcon({
    children,
    type = 'button',
    variant = 'primary',
    isLoading = false,
    icon = null,               // Any icon (ReactNode)
    iconClass=null,
    iconPosition = 'left',     // 'left' | 'right'
    className = '',
    ...props
}) {
    const base = 'px-4 py-2 rounded-md transition duration-200 inline-flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed';
    const variants = {
        primary: 'bg-primary text-white hover:bg-primary-hover',
        outline: 'border border-primary text-primary hover:bg-primary-hover hover:text-white',
        secondary: 'bg-secondary text-white hover:bg-secondary-hover',
        secondaryOutline: 'border border-secondary text-secondary hover:bg-secondary-hover hover:text-white',
        danger: 'bg-danger text-white hover:bg-white hover:text-danger border border-danger',   
        custom: ''
    };

    const renderContent = () => {
        if (isLoading) return 'Loading...';

        return (
        <>
            {icon && iconPosition === 'left' && <span className={`icon-left ${iconClass}`}>{icon}</span>}
            <span>{children}</span>
            {icon && iconPosition === 'right' && <span className={`icon-right ${iconClass}`}>{icon}</span>}
        </>
        );
    };

    return (
    <button
      type={type}
      className={`${base} ${variants[variant] || ''} ${className}`}
      disabled={isLoading}
      {...props}
    >
      {renderContent()}
    </button>
    )
}

export default ButtonWithIcon