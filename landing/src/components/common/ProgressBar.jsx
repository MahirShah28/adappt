import React, { useMemo } from 'react';
import { AlertCircle, CheckCircle } from 'lucide-react'; // ✅ Added

/**
 * ProgressBar Component
 * Displays a progress bar with optional label, percentage, and status indicators
 * 
 * @param {number} progress - Progress value (0-100)
 * @param {string} text - Label text
 * @param {boolean} showPercentage - Show percentage label
 * @param {string} color - Color theme ('blue', 'green', 'yellow', 'red', 'purple')
 * @param {string} height - Height size ('sm', 'md', 'lg')
 * @param {string} variant - Progress bar variant ('default', 'striped', 'animated')
 * @param {boolean} showStatus - Show status icon (checkmark or warning)
 * @param {string} status - Status type ('success', 'error', 'warning', 'info')
 * @param {string} label - Additional label or description
 * @param {number} max - Maximum value (for calculations)
 * @param {number} current - Current value (for calculations)
 * @param {boolean} showLabel - Show additional label
 * @param {string} className - Additional CSS classes
 */
const ProgressBar = ({ 
  progress = 0, 
  text = '', 
  showPercentage = true,
  color = 'blue',
  height = 'md',
  variant = 'default', // ✅ Added
  showStatus = false, // ✅ Added
  status = 'info', // ✅ Added
  label = '', // ✅ Added
  max = null, // ✅ Added
  current = null, // ✅ Added
  showLabel = false, // ✅ Added
  className = '' 
}) => {
  const colors = {
    blue: 'bg-blue-600',
    green: 'bg-green-600',
    yellow: 'bg-yellow-500',
    red: 'bg-red-600',
    purple: 'bg-purple-600',
  };
  
  const heights = {
    sm: 'h-2',
    md: 'h-3',
    lg: 'h-4',
  };

  // ✅ Calculate progress from current/max if provided
  const calculatedProgress = useMemo(() => {
    if (max && current !== null) {
      return (current / max) * 100;
    }
    return progress;
  }, [progress, max, current]);

  // ✅ Clamp progress between 0 and 100
  const clampedProgress = Math.min(100, Math.max(0, calculatedProgress));

  // ✅ Auto-detect color based on progress
  const getAutoColor = () => {
    if (clampedProgress >= 100) return 'green';
    if (clampedProgress >= 75) return 'blue';
    if (clampedProgress >= 50) return 'yellow';
    if (clampedProgress >= 25) return 'red';
    return 'red';
  };

  const barColor = color === 'auto' ? getAutoColor() : color;
  const barHeight = heights[height] || heights.md;

  // ✅ Get status icon
  const getStatusIcon = () => {
    if (status === 'success' && clampedProgress === 100) {
      return <CheckCircle size={16} className="text-green-600" />;
    }
    if (status === 'error' || status === 'warning') {
      return <AlertCircle size={16} className="text-red-600" />;
    }
    return null;
  };

  // ✅ Get variant class
  const getVariantClass = () => {
    switch (variant) {
      case 'striped':
        return 'bg-gradient-to-r from-transparent to-white/20';
      case 'animated':
        return 'animate-pulse';
      default:
        return '';
    }
  };

  // ✅ Validate color, fallback to blue
  const validColor = colors[barColor] || colors.blue;

  // ✅ Format label
  const formattedLabel = current && max ? `${current}/${max}` : label;
  
  return (
    <div className={`w-full ${className}`}>
      {/* Header: Text, Label, and Percentage */}
      {(text || showPercentage || (showLabel && formattedLabel)) && (
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-700 font-medium">{text}</span>
            
            {/* ✅ Status icon */}
            {showStatus && getStatusIcon()}
            
            {/* ✅ Additional label */}
            {showLabel && formattedLabel && (
              <span className="text-xs text-gray-500 bg-gray-100 px-2 py-0.5 rounded">
                {formattedLabel}
              </span>
            )}
          </div>

          {/* ✅ Percentage display */}
          {showPercentage && (
            <span className="text-sm font-semibold text-gray-900">
              {Math.round(clampedProgress)}%
            </span>
          )}
        </div>
      )}
      
      {/* Progress Bar Container */}
      <div 
        className={`w-full bg-gray-200 rounded-full ${barHeight} overflow-hidden`}
        role="progressbar" // ✅ Added
        aria-valuenow={Math.round(clampedProgress)} // ✅ Added
        aria-valuemin="0" // ✅ Added
        aria-valuemax="100" // ✅ Added
        aria-label={text || 'Progress'} // ✅ Added
      >
        {/* Progress Fill */}
        <div
          className={`${validColor} ${barHeight} rounded-full transition-all duration-500 ease-out ${getVariantClass()}`}
          style={{ width: `${clampedProgress}%` }}
          role="presentation" // ✅ Added
        />
      </div>

      {/* ✅ Status message below bar */}
      {status === 'success' && clampedProgress === 100 && (
        <p className="text-xs text-green-600 mt-1 font-medium">✓ Complete</p>
      )}

      {status === 'error' && (
        <p className="text-xs text-red-600 mt-1 font-medium">✗ Error</p>
      )}

      {status === 'warning' && (
        <p className="text-xs text-yellow-600 mt-1 font-medium">⚠ Warning</p>
      )}

      {/* ✅ Helper text */}
      {formattedLabel && !showLabel && (
        <p className="text-xs text-gray-500 mt-1">{formattedLabel}</p>
      )}
    </div>
  );
};

export default ProgressBar;
