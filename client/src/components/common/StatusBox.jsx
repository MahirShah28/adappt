import React from 'react';
import { CheckCircle, XCircle, AlertCircle, Info } from 'lucide-react';

const StatusBox = ({ 
  type = 'info', 
  title, 
  message, 
  children,
  className = '' 
}) => {
  const types = {
    success: {
      container: 'bg-green-50 border-l-4 border-green-500',
      icon: CheckCircle,
      iconColor: 'text-green-500',
      titleColor: 'text-green-800',
      textColor: 'text-green-700',
    },
    error: {
      container: 'bg-red-50 border-l-4 border-red-500',
      icon: XCircle,
      iconColor: 'text-red-500',
      titleColor: 'text-red-800',
      textColor: 'text-red-700',
    },
    warning: {
      container: 'bg-yellow-50 border-l-4 border-yellow-500',
      icon: AlertCircle,
      iconColor: 'text-yellow-500',
      titleColor: 'text-yellow-800',
      textColor: 'text-yellow-700',
    },
    info: {
      container: 'bg-blue-50 border-l-4 border-blue-500',
      icon: Info,
      iconColor: 'text-blue-500',
      titleColor: 'text-blue-800',
      textColor: 'text-blue-700',
    },
  };
  
  const config = types[type];
  const Icon = config.icon;
  
  return (
    <div className={`${config.container} p-6 rounded-lg ${className}`}>
      <div className="flex items-start">
        <Icon className={`${config.iconColor} mr-3 flex-shrink-0`} size={24} />
        
        <div className="flex-1">
          {title && (
            <h4 className={`font-bold text-lg mb-2 ${config.titleColor}`}>
              {title}
            </h4>
          )}
          
          {message && (
            <p className={`${config.textColor}`}>{message}</p>
          )}
          
          {children && (
            <div className={`mt-3 ${config.textColor}`}>{children}</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default StatusBox;
