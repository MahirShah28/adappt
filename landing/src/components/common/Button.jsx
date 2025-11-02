import React from 'react';

/**
 * Button Component
 * Versatile button with multiple variants and sizes
 * 
 * @param {React.ReactNode} children - Button content
 * @param {string} variant - 'primary', 'secondary', 'success', 'danger', 'outline'
 * @param {string} size - 'sm', 'md', 'lg'
 * @param {boolean} disabled - Disable button
 * @param {function} onClick - Click handler
 * @param {string} type - HTML button type ('button', 'submit', 'reset')
 * @param {boolean} fullWidth - Make button full width
 * @param {boolean} loading - Show loading state (disables button)
 * @param {React.ReactNode} loadingText - Text to show when loading
 * @param {string} className - Additional CSS classes
 * @param {string} ariaLabel - Accessibility label
 * @param {boolean} autoFocus - Focus button on mount
 */
const Button = ({ 
  children, 
  variant = 'primary', 
  size = 'md', 
  disabled = false, 
  onClick, 
  type = 'button',
  fullWidth = false,
  loading = false, // ✅ Added
  loadingText = 'Loading...', // ✅ Added
  className = '',
  ariaLabel = null, // ✅ Added
  autoFocus = false, // ✅ Added
}) => {
  const baseStyles = 'font-semibold rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed';
  
  const variants = {
    primary: 'bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500',
    secondary: 'bg-gray-200 text-gray-800 hover:bg-gray-300 focus:ring-gray-500',
    success: 'bg-green-600 text-white hover:bg-green-700 focus:ring-green-500',
    danger: 'bg-red-600 text-white hover:bg-red-700 focus:ring-red-500',
    outline: 'border-2 border-blue-600 text-blue-600 hover:bg-blue-50 focus:ring-blue-500',
  };
  
  const sizes = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-base',
    lg: 'px-6 py-3 text-lg',
  };

  // ✅ Validate variant and size, fallback to defaults
  const buttonVariant = variants[variant] || variants.primary;
  const buttonSize = sizes[size] || sizes.md;
  const widthClass = fullWidth ? 'w-full' : '';
  
  // ✅ Combine disabled states
  const isDisabled = disabled || loading;
  
  // ✅ Render loading spinner
  const renderContent = () => {
    if (loading) {
      return (
        <span className="flex items-center justify-center gap-2">
          <svg 
            className="animate-spin h-4 w-4" 
            xmlns="http://www.w3.org/2000/svg" 
            fill="none" 
            viewBox="0 0 24 24"
          >
            <circle 
              className="opacity-25" 
              cx="12" 
              cy="12" 
              r="10" 
              stroke="currentColor" 
              strokeWidth="4"
            />
            <path 
              className="opacity-75" 
              fill="currentColor" 
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
          <span>{loadingText}</span>
        </span>
      );
    }
    return children;
  };
  
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={isDisabled}
      autoFocus={autoFocus} // ✅ Added
      aria-label={ariaLabel || (typeof children === 'string' ? children : 'Button')} // ✅ Added
      aria-busy={loading} // ✅ Added
      className={`${baseStyles} ${buttonVariant} ${buttonSize} ${widthClass} ${className}`}
    >
      {renderContent()}
    </button>
  );
};

export default Button;
