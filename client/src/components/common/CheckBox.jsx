import React from 'react';

const Checkbox = ({ 
  label, 
  checked = false, 
  onChange, 
  disabled = false,
  error = '',
  name,
  id,
  className = '' 
}) => {
  const checkboxId = id || name;
  
  return (
    <div className={`${className}`}>
      <div className="flex items-start">
        <input
          type="checkbox"
          id={checkboxId}
          name={name}
          checked={checked}
          onChange={onChange}
          disabled={disabled}
          className={`mt-1 h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500 focus:ring-2 ${
            disabled ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'
          }`}
        />
        
        {label && (
          <label 
            htmlFor={checkboxId} 
            className={`ml-3 text-sm text-gray-700 ${
              disabled ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'
            }`}
          >
            {label}
          </label>
        )}
      </div>
      
      {error && (
        <p className="mt-1 ml-7 text-sm text-red-600">{error}</p>
      )}
    </div>
  );
};

export default Checkbox;
