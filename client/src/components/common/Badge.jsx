import React from 'react';
import { COLORS } from '../../utils/constants'; // ✅ Added

/**
 * Badge Component
 * Displays a styled badge/label with different variants and sizes
 * 
 * @param {React.ReactNode} children - Badge content
 * @param {string} variant - 'default', 'primary', 'success', 'warning', 'danger', 'info'
 * @param {string} size - 'sm', 'md', 'lg'
 * @param {string} className - Additional CSS classes
 * @param {boolean} closable - Show close button
 * @param {function} onClose - Callback when close button clicked
 */
const Badge = ({ 
  children, 
  variant = 'default',
  size = 'md',
  className = '',
  closable = false, // ✅ Added
  onClose = null, // ✅ Added
}) => {
  const variants = {
    default: 'bg-gray-100 text-gray-800',
    primary: 'bg-blue-100 text-blue-800',
    success: 'bg-green-100 text-green-800',
    warning: 'bg-yellow-100 text-yellow-800',
    danger: 'bg-red-100 text-red-800',
    info: 'bg-cyan-100 text-cyan-800',
  };
  
  const sizes = {
    sm: 'px-2 py-0.5 text-xs',
    md: 'px-2.5 py-1 text-sm',
    lg: 'px-3 py-1.5 text-base',
  };

  // ✅ Validate variant, fallback to default
  const badgeVariant = variants[variant] || variants.default;
  const badgeSize = sizes[size] || sizes.md;
  
  return (
    <span 
      className={`inline-flex items-center font-medium rounded-full ${badgeVariant} ${badgeSize} ${className}`}
      role="status" // ✅ Added accessibility
      aria-label={typeof children === 'string' ? children : 'Badge'} // ✅ Added accessibility
    >
      {children}
      
      {/* ✅ Added closable functionality */}
      {closable && onClose && (
        <button
          onClick={onClose}
          className="ml-1.5 hover:opacity-75 transition-opacity focus:outline-none"
          aria-label="Remove badge"
          type="button"
        >
          <svg
            className="w-3 h-3"
            fill="currentColor"
            viewBox="0 0 20 20"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              fillRule="evenodd"
              d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
              clipRule="evenodd"
            />
          </svg>
        </button>
      )}
    </span>
  );
};

export default Badge;
