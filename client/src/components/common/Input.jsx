import React, { useState, useCallback } from 'react';
import { AlertCircle, Eye, EyeOff, Check, X } from 'lucide-react'; // ✅ Added icons

/**
 * Input Component
 * Versatile input field with validation, error states, and helper text
 * 
 * @param {string} label - Input label
 * @param {string} type - Input type ('text', 'email', 'password', 'number', etc.)
 * @param {string} value - Input value
 * @param {function} onChange - Change handler
 * @param {string} placeholder - Placeholder text
 * @param {boolean} required - Is field required
 * @param {boolean} disabled - Disable input
 * @param {string} error - Error message
 * @param {string} helperText - Helper text below input
 * @param {string} name - Input name attribute
 * @param {string} id - Input id attribute
 * @param {string} pattern - Regex pattern for validation
 * @param {function} onBlur - Blur handler
 * @param {function} onFocus - Focus handler
 * @param {boolean} showPassword - Show password toggle (for password inputs)
 * @param {string} className - Additional CSS classes
 * @param {boolean} clearable - Show clear button
 * @param {boolean} showValidation - Show success/error icon
 */
const Input = ({ 
  label, 
  type = 'text', 
  value, 
  onChange, 
  placeholder = '', 
  required = false,
  disabled = false,
  error = '',
  helperText = '',
  name,
  id,
  pattern = null, // ✅ Added
  onBlur = null, // ✅ Added
  onFocus = null, // ✅ Added
  showPassword = true, // ✅ Added
  className = '',
  clearable = false, // ✅ Added
  showValidation = false, // ✅ Added
}) => {
  const [showPasswordValue, setShowPasswordValue] = useState(false); // ✅ Added
  const inputId = id || name;
  const isPasswordType = type === 'password';

  // ✅ Handle clear button
  const handleClear = useCallback(() => {
    if (onChange) {
      onChange({ target: { value: '', name } });
    }
  }, [onChange, name]);

  // ✅ Handle password visibility toggle
  const handleTogglePassword = useCallback(() => {
    setShowPasswordValue(!showPasswordValue);
  }, [showPasswordValue]);

  // ✅ Determine display type for password field
  const displayType = isPasswordType && showPasswordValue ? 'text' : type;

  // ✅ Determine validation state
  const isValid = showValidation && value && !error;
  const isInvalid = showValidation && (error || (required && !value));

  // ✅ Render validation icons
  const renderValidationIcon = () => {
    if (!showValidation) return null;
    
    if (isValid) {
      return <Check className="absolute right-3 top-10 text-green-500" size={20} />;
    }
    
    if (isInvalid) {
      return <AlertCircle className="absolute right-3 top-10 text-red-500" size={20} />;
    }
    
    return null;
  };

  // ✅ Render password toggle
  const renderPasswordToggle = () => {
    if (!isPasswordType || !showPassword) return null;
    
    return (
      <button
        type="button"
        onClick={handleTogglePassword}
        className="absolute right-3 top-10 text-gray-500 hover:text-gray-700 transition-colors focus:outline-none"
        aria-label={showPasswordValue ? 'Hide password' : 'Show password'}
        tabIndex={-1}
      >
        {showPasswordValue ? <EyeOff size={20} /> : <Eye size={20} />}
      </button>
    );
  };

  // ✅ Render clear button
  const renderClearButton = () => {
    if (!clearable || !value) return null;
    
    return (
      <button
        type="button"
        onClick={handleClear}
        className="absolute right-3 top-10 text-gray-400 hover:text-gray-600 transition-colors focus:outline-none"
        aria-label="Clear input"
        tabIndex={-1}
      >
        <X size={20} />
      </button>
    );
  };
  
  return (
    <div className={`w-full ${className}`}>
      {/* Label */}
      {label && (
        <label 
          htmlFor={inputId} 
          className="block text-sm font-medium text-gray-700 mb-2"
        >
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      
      {/* Input Container */}
      <div className="relative">
        {/* Input Field */}
        <input
          type={displayType}
          id={inputId}
          name={name}
          value={value}
          onChange={onChange}
          onBlur={onBlur} // ✅ Added
          onFocus={onFocus} // ✅ Added
          placeholder={placeholder}
          required={required}
          disabled={disabled}
          pattern={pattern} // ✅ Added
          className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${
            error 
              ? 'border-red-500 focus:ring-red-500' 
              : 'border-gray-300'
          } ${
            disabled ? 'bg-gray-100 cursor-not-allowed' : 'bg-white'
          } ${
            (isPasswordType && showPassword) || clearable || showValidation ? 'pr-10' : ''
          }`} // ✅ Added padding for icons
        />

        {/* Icons Container */}
        {renderValidationIcon()}
        {renderPasswordToggle()}
        {renderClearButton()}
      </div>
      
      {/* Error Message */}
      {error && (
        <div className="mt-1 flex items-center gap-1">
          <AlertCircle size={16} className="text-red-600" />
          <p className="text-sm text-red-600">{error}</p>
        </div>
      )}
      
      {/* Helper Text */}
      {helperText && !error && (
        <p className="mt-1 text-sm text-gray-500">{helperText}</p>
      )}
    </div>
  );
};

export default Input;
