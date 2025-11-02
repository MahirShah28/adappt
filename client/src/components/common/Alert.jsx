import React, { useContext, useEffect } from 'react';
import { BankingContext } from '../../context/Index'; // ✅ Added
import { X, CheckCircle, XCircle, AlertCircle, Info } from 'lucide-react';

/**
 * Alert Component
 * Displays toast/alert messages with different types
 * Automatically dismisses after timeout if auto-dismiss enabled
 * 
 * @param {string} type - 'success', 'error', 'warning', 'info'
 * @param {string} message - Message text to display
 * @param {function} onClose - Callback when alert is closed
 * @param {boolean} dismissible - Whether to show close button
 * @param {number} autoClose - Auto close after ms (0 = no auto close)
 * @param {string} className - Additional CSS classes
 */
const Alert = ({ 
  type = 'info', 
  message, 
  onClose,
  dismissible = false,
  autoClose = 0, // ✅ Added
  className = '' 
}) => {
  // ✅ Added context for notifications
  const banking = useContext(BankingContext);

  // ✅ Added auto-close functionality
  useEffect(() => {
    if (autoClose > 0 && onClose) {
      const timer = setTimeout(onClose, autoClose);
      return () => clearTimeout(timer);
    }
  }, [autoClose, onClose]);

  const types = {
    success: {
      bg: 'bg-green-100',
      border: 'border-green-400',
      text: 'text-green-800',
      icon: CheckCircle,
      iconColor: 'text-green-600',
    },
    error: {
      bg: 'bg-red-100',
      border: 'border-red-400',
      text: 'text-red-800',
      icon: XCircle,
      iconColor: 'text-red-600',
    },
    warning: {
      bg: 'bg-yellow-100',
      border: 'border-yellow-400',
      text: 'text-yellow-800',
      icon: AlertCircle,
      iconColor: 'text-yellow-600',
    },
    info: {
      bg: 'bg-blue-100',
      border: 'border-blue-400',
      text: 'text-blue-800',
      icon: Info,
      iconColor: 'text-blue-600',
    },
  };
  
  const config = types[type] || types.info;
  const Icon = config.icon;
  
  // ✅ Added handler to notify context when closed
  const handleClose = () => {
    if (onClose) {
      onClose();
    }
    if (banking?.removeNotification) {
      banking.removeNotification(message);
    }
  };
  
  return (
    <div className={`${config.bg} border ${config.border} ${config.text} px-4 py-3 rounded-lg flex items-center justify-between ${className}`}>
      <div className="flex items-center gap-3">
        <Icon className={config.iconColor} size={20} />
        <span className="text-sm font-medium">{message}</span>
      </div>
      
      {dismissible && onClose && (
        <button
          onClick={handleClose}
          className={`${config.iconColor} hover:opacity-75 transition-opacity`}
          aria-label="Close alert"
        >
          <X size={18} />
        </button>
      )}
    </div>
  );
};

export default Alert;
