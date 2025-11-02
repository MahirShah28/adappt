import React from 'react';
import { X } from 'lucide-react'; // ✅ Added

/**
 * Card Component
 * Versatile container for content with optional header and variants
 * 
 * @param {React.ReactNode} children - Card content
 * @param {string} title - Card title
 * @param {string} subtitle - Card subtitle
 * @param {string} variant - 'default', 'elevated', 'outlined', 'flat'
 * @param {boolean} clickable - Make card clickable
 * @param {function} onClick - Click handler
 * @param {boolean} closable - Show close button
 * @param {function} onClose - Close handler
 * @param {string} className - Additional CSS classes
 * @param {string} ariaLabel - Accessibility label
 */
const Card = ({ 
  children, 
  title, 
  subtitle,
  variant = 'default',
  clickable = false, // ✅ Added
  onClick = null, // ✅ Added
  closable = false, // ✅ Added
  onClose = null, // ✅ Added
  className = '',
  ariaLabel = null, // ✅ Added
}) => {
  const variants = {
    default: 'bg-white border border-gray-200',
    elevated: 'bg-white shadow-lg',
    outlined: 'bg-white border-2 border-gray-300',
    flat: 'bg-gray-50',
  };

  // ✅ Validate variant, fallback to default
  const cardVariant = variants[variant] || variants.default;
  
  // ✅ Add clickable styles
  const clickableClass = clickable ? 'cursor-pointer hover:shadow-lg transition-shadow hover:border-blue-300' : '';
  
  // ✅ Handle click
  const handleCardClick = (e) => {
    if (clickable && onClick && e.target.tagName !== 'BUTTON') {
      onClick(e);
    }
  };

  // ✅ Handle close
  const handleClose = (e) => {
    e.stopPropagation();
    if (onClose) {
      onClose();
    }
  };
  
  return (
    <div 
      className={`rounded-lg p-6 ${cardVariant} ${clickableClass} ${className}`}
      onClick={handleCardClick}
      role={clickable ? 'button' : 'region'} // ✅ Added
      tabIndex={clickable ? 0 : -1} // ✅ Added
      aria-label={ariaLabel || title || 'Card'} // ✅ Added
      onKeyDown={clickable ? (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          handleCardClick(e);
        }
      } : null} // ✅ Added keyboard support
    >
      {/* Header Section */}
      {(title || subtitle || closable) && (
        <div className="mb-4 flex items-start justify-between">
          <div>
            {title && (
              <h3 className="text-xl font-bold text-gray-800">{title}</h3>
            )}
            {subtitle && (
              <p className="text-sm text-gray-600 mt-1">{subtitle}</p>
            )}
          </div>

          {/* ✅ Close Button */}
          {closable && onClose && (
            <button
              onClick={handleClose}
              className="text-gray-400 hover:text-gray-600 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 rounded p-1"
              aria-label="Close card"
              type="button"
            >
              <X size={20} />
            </button>
          )}
        </div>
      )}

      {/* Content Section */}
      {children}
    </div>
  );
};

export default Card;
