import React, { useMemo } from 'react';
import { TrendingUp, TrendingDown, AlertCircle } from 'lucide-react';

/**
 * MetricCard Component
 * Displays KPI metrics with values, trends, and optional comparison data
 * 
 * @param {string} title - Metric title
 * @param {string|number} value - Current metric value
 * @param {string} delta - Change value (e.g., "+12.5%")
 * @param {string} trend - Trend direction ('up' or 'down')
 * @param {React.Component} icon - Icon component from lucide-react
 * @param {string} previousValue - Previous value for comparison
 * @param {string} comparison - Comparison text (e.g., "vs last month")
 * @param {function} onClick - Click handler for clickable metric
 * @param {boolean} clickable - Make metric card clickable
 * @param {string} color - Color theme ('blue', 'green', 'red', 'purple', 'orange', 'yellow')
 * @param {string} className - Additional CSS classes
 * @param {boolean} showAlert - Show alert icon
 */
const MetricCard = ({ 
  title, 
  value, 
  delta, 
  trend, 
  icon: Icon,
  previousValue = null, // ✅ Added
  comparison = null, // ✅ Added
  onClick = null, // ✅ Added
  clickable = false, // ✅ Added
  color = 'gray', // ✅ Added
  className = '',
  showAlert = false, // ✅ Added
}) => {
  // ✅ Parse delta to extract numeric value
  const parsedDelta = useMemo(() => {
    if (!delta) return null;
    const numeric = parseFloat(delta.replace(/[^0-9.-]/g, ''));
    const isPositive = numeric >= 0;
    return { numeric, isPositive };
  }, [delta]);

  // ✅ Color schemes for different metrics
  const colorSchemes = {
    blue: { bg: 'bg-blue-50', icon: 'text-blue-500', delta: 'text-blue-600' },
    green: { bg: 'bg-green-50', icon: 'text-green-500', delta: 'text-green-600' },
    red: { bg: 'bg-red-50', icon: 'text-red-500', delta: 'text-red-600' },
    purple: { bg: 'bg-purple-50', icon: 'text-purple-500', delta: 'text-purple-600' },
    orange: { bg: 'bg-orange-50', icon: 'text-orange-500', delta: 'text-orange-600' },
    yellow: { bg: 'bg-yellow-50', icon: 'text-yellow-500', delta: 'text-yellow-600' },
    gray: { bg: 'bg-gray-100', icon: 'text-gray-400', delta: 'text-gray-600' },
  };

  // ✅ Get color scheme or fallback
  const scheme = colorSchemes[color] || colorSchemes.gray;

  // ✅ Determine trend color (can override color prop)
  const trendColor = trend === 'up' 
    ? 'text-green-600' 
    : trend === 'down' 
    ? 'text-red-600' 
    : parsedDelta?.isPositive 
    ? 'text-green-600' 
    : 'text-red-600';

  // ✅ Clickable classes
  const clickableClass = clickable && onClick 
    ? 'cursor-pointer hover:shadow-md transition-all hover:scale-105' 
    : '';

  // ✅ Handle card click
  const handleClick = () => {
    if (clickable && onClick) {
      onClick();
    }
  };

  // ✅ Handle keyboard for accessibility
  const handleKeyDown = (e) => {
    if (clickable && onClick && (e.key === 'Enter' || e.key === ' ')) {
      e.preventDefault();
      onClick();
    }
  };
  
  return (
    <div 
      className={`${scheme.bg} p-6 rounded-lg shadow-sm transition-all ${clickableClass} ${className}`}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      role={clickable ? 'button' : 'region'} // ✅ Added
      tabIndex={clickable ? 0 : -1} // ✅ Added
      aria-label={`${title}: ${value}`} // ✅ Added
    >
      {/* Header: Title and Icon */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <p className="text-sm text-gray-600 font-medium">{title}</p>
          
          {/* ✅ Show alert icon if needed */}
          {showAlert && (
            <div className="mt-1 flex items-center gap-1">
              <AlertCircle size={14} className="text-orange-500" />
              <span className="text-xs text-orange-600 font-medium">Attention</span>
            </div>
          )}
        </div>
        
        {Icon && <Icon className={scheme.icon} size={24} />}
      </div>
      
      {/* Value and Delta */}
      <div className="flex items-end justify-between mb-2">
        <div>
          <h3 className="text-3xl font-bold text-gray-800">{value}</h3>
          
          {/* ✅ Show previous value if provided */}
          {previousValue && (
            <p className="text-xs text-gray-500 mt-1">
              Previous: <span className="font-medium">{previousValue}</span>
            </p>
          )}
        </div>
        
        {/* Delta Badge */}
        {delta && (
          <div className={`flex items-center gap-1 text-sm font-semibold ${trendColor}`}>
            {trend === 'up' ? (
              <TrendingUp size={16} />
            ) : trend === 'down' ? (
              <TrendingDown size={16} />
            ) : parsedDelta?.isPositive ? (
              <TrendingUp size={16} />
            ) : (
              <TrendingDown size={16} />
            )}
            <span>{delta}</span>
          </div>
        )}
      </div>

      {/* ✅ Comparison text */}
      {comparison && (
        <p className="text-xs text-gray-500">{comparison}</p>
      )}
    </div>
  );
};

export default MetricCard;
