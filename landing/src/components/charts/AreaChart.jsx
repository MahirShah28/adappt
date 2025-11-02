import React, { useMemo } from 'react';
import {
  AreaChart as RechartsAreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';

/**
 * AreaChart Component
 * Displays area chart using Recharts with customizable data and styling
 * 
 * @param {array} data - Chart data array
 * @param {array} dataKeys - Keys to display as areas
 * @param {string} xAxisKey - Key for X-axis
 * @param {string} title - Chart title
 * @param {number} height - Chart height in pixels
 * @param {array} colors - Color array for areas
 * @param {boolean} showLegend - Show legend
 * @param {boolean} showGrid - Show grid
 * @param {boolean} loading - Show loading state
 * @param {function} onAreaClick - Click handler for areas
 * @param {string} unit - Unit to display (e.g., "₹", "%")
 * @param {boolean} showDataLabels - Show data point labels
 * @param {string} chartType - Chart type ('area', 'smooth', 'linear')
 * @param {number} opacity - Fill opacity (0-1)
 */
const AreaChart = ({ 
  data = [], 
  dataKeys = [], 
  xAxisKey = 'name',
  title,
  height = 300,
  colors = ['#0ea5e9', '#10b981', '#f59e0b', '#ef4444'],
  showLegend = true,
  showGrid = true,
  loading = false, // ✅ Added
  onAreaClick = null, // ✅ Added
  unit = '', // ✅ Added
  showDataLabels = false, // ✅ Added
  chartType = 'monotone', // ✅ Added
  opacity = 0.6, // ✅ Added
}) => {
  // ✅ Validate data
  const validData = useMemo(() => {
    if (!Array.isArray(data) || data.length === 0) {
      return [];
    }
    return data;
  }, [data]);

  // ✅ Validate dataKeys
  const validDataKeys = useMemo(() => {
    if (!Array.isArray(dataKeys) || dataKeys.length === 0) {
      return [];
    }
    return dataKeys;
  }, [dataKeys]);

  // ✅ Custom tooltip to show unit
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg">
          <p className="text-sm font-semibold text-gray-800">
            {label}
          </p>
          {payload.map((entry, index) => (
            <p 
              key={index}
              style={{ color: entry.color }}
              className="text-sm"
            >
              {entry.name}: {entry.value}{unit}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  // ✅ Handle empty state
  if (validData.length === 0 || validDataKeys.length === 0) {
    return (
      <div className="w-full flex items-center justify-center" style={{ height: `${height}px` }}>
        <div className="text-center">
          <p className="text-gray-500 text-sm">No data available</p>
        </div>
      </div>
    );
  }

  // ✅ Show loading state
  if (loading) {
    return (
      <div className="w-full flex items-center justify-center" style={{ height: `${height}px` }}>
        <div className="flex flex-col items-center gap-2">
          <div className="animate-spin">
            <svg className="w-8 h-8 text-blue-500" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
            </svg>
          </div>
          <p className="text-gray-500 text-sm">Loading chart...</p>
        </div>
      </div>
    );
  }
  
  return (
    <div className="w-full">
      {/* ✅ Title section */}
      {title && (
        <div className="mb-4">
          <h3 className="text-lg font-semibold text-gray-800">{title}</h3>
          {unit && (
            <p className="text-xs text-gray-500 mt-1">Values in {unit}</p>
          )}
        </div>
      )}
      
      {/* ✅ Chart container */}
      <div 
        className="w-full bg-white rounded-lg"
        role="img" // ✅ Added
        aria-label={title || 'Area Chart'} // ✅ Added
      >
        <ResponsiveContainer width="100%" height={height}>
          <RechartsAreaChart
            data={validData}
            margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
            onClick={onAreaClick} // ✅ Added
          >
            {showGrid && <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />}
            
            {/* X-Axis */}
            <XAxis 
              dataKey={xAxisKey} 
              stroke="#6b7280"
              style={{ fontSize: '12px' }}
            />
            
            {/* Y-Axis */}
            <YAxis 
              stroke="#6b7280"
              style={{ fontSize: '12px' }}
              label={unit ? { value: unit, angle: -90, position: 'insideLeft' } : null} // ✅ Added
            />
            
            {/* Tooltip */}
            <Tooltip 
              content={<CustomTooltip />} // ✅ Custom tooltip
              contentStyle={{
                backgroundColor: '#fff',
                border: '1px solid #e5e7eb',
                borderRadius: '0.5rem',
                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
              }}
            />
            
            {/* Legend */}
            {showLegend && <Legend />}
            
            {/* Area components */}
            {validDataKeys.map((key, index) => (
              <Area
                key={key}
                type={chartType}
                dataKey={key}
                stroke={colors[index % colors.length]}
                fill={colors[index % colors.length]}
                fillOpacity={opacity}
                isAnimationActive={true} // ✅ Added
                animationDuration={800} // ✅ Added
                dot={showDataLabels ? { r: 4 } : false} // ✅ Added
                activeDot={{ r: 6 }} // ✅ Added
              />
            ))}
          </RechartsAreaChart>
        </ResponsiveContainer>
      </div>

      {/* ✅ Data summary */}
      {validData.length > 0 && (
        <div className="mt-4 grid grid-cols-4 gap-2 text-xs text-gray-600">
          <div className="bg-gray-50 p-2 rounded">
            <p className="font-semibold">Data Points</p>
            <p className="text-gray-800">{validData.length}</p>
          </div>
          <div className="bg-gray-50 p-2 rounded">
            <p className="font-semibold">Series</p>
            <p className="text-gray-800">{validDataKeys.length}</p>
          </div>
          <div className="bg-gray-50 p-2 rounded">
            <p className="font-semibold">Chart Type</p>
            <p className="text-gray-800 capitalize">{chartType}</p>
          </div>
          <div className="bg-gray-50 p-2 rounded">
            <p className="font-semibold">Opacity</p>
            <p className="text-gray-800">{Math.round(opacity * 100)}%</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default AreaChart;
