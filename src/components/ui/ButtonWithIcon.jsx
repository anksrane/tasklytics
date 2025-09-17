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
    const base = 'px-4 py-2 rounded-lg transition duration-200 inline-flex items-center justify-center gap-2';
    const variants = {
        primary: 'bg-brand-primary-500 text-white hover:bg-brand-primary-900',
        outline: 'border border-brand-primary-500 text-brand-primary-500 hover:bg-brand-primary-900',
        danger: 'bg-brand-accent-danger text-white hover:text-brand-accent-danger hover:bg-white border border-brand-accent-danger',        
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