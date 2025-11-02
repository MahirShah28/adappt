import React, { useMemo } from 'react';
import {
  PieChart as RechartsPieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';

/**
 * PieChart Component
 * Displays pie/donut chart using Recharts with customizable data and styling
 * 
 * @param {array} data - Chart data array
 * @param {string} dataKey - Key for numeric values
 * @param {string} nameKey - Key for labels
 * @param {string} title - Chart title
 * @param {number} height - Chart height in pixels
 * @param {array} colors - Color array for segments
 * @param {boolean} showLegend - Show legend
 * @param {number} innerRadius - Inner radius (0 for pie, >0 for donut)
 * @param {boolean} loading - Show loading state
 * @param {function} onSegmentClick - Click handler for segments
 * @param {number} outerRadius - Outer radius size
 * @param {boolean} showPercentage - Show percentage in labels
 * @param {boolean} showValue - Show value in labels
 * @param {string} unit - Unit to display (e.g., "₹", "%")
 * @param {number} startAngle - Starting angle (0-360)
 * @param {number} endAngle - Ending angle (0-360)
 */
const PieChart = ({ 
  data = [], 
  dataKey = 'value',
  nameKey = 'name',
  title,
  height = 300,
  colors = ['#0ea5e9', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899'],
  showLegend = true,
  innerRadius = 0,
  loading = false, // ✅ Added
  onSegmentClick = null, // ✅ Added
  outerRadius = 80, // ✅ Added
  showPercentage = true, // ✅ Added
  showValue = false, // ✅ Added
  unit = '', // ✅ Added
  startAngle = 0, // ✅ Added
  endAngle = 360, // ✅ Added
}) => {
  // ✅ Validate and calculate totals
  const validData = useMemo(() => {
    if (!Array.isArray(data) || data.length === 0) {
      return [];
    }
    
    return data.map(item => ({
      ...item,
      [dataKey]: parseFloat(item[dataKey]) || 0,
    }));
  }, [data, dataKey]);

  // ✅ Calculate total for percentage display
  const total = useMemo(() => {
    return validData.reduce((sum, item) => sum + (item[dataKey] || 0), 0);
  }, [validData, dataKey]);

  // ✅ Check if donut chart
  const isDonut = innerRadius > 0;

  // ✅ Custom tooltip with unit and value
  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const { name, value } = payload[0];
      const percentage = total > 0 ? ((value / total) * 100).toFixed(1) : 0;
      
      return (
        <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg">
          <p className="text-sm font-semibold text-gray-800">{name}</p>
          <p className="text-sm text-gray-700">
            Value: {value}{unit}
          </p>
          <p className="text-sm text-gray-600">
            Percentage: {percentage}%
          </p>
        </div>
      );
    }
    return null;
  };

  // ✅ Custom label renderer
  const renderLabel = ({ name, value, percent }) => {
    let label = name;
    
    if (showValue) {
      label += `: ${value}${unit}`;
    }
    
    if (showPercentage) {
      label += ` ${(percent * 100).toFixed(0)}%`;
    }
    
    return label;
  };

  // ✅ Handle empty state
  if (validData.length === 0) {
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
              ircle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"4" /
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
          {isDonut ? (
            <p className="text-xs text-gray-500 mt-1">Donut Chart</p>
          ) : (
            <p className="text-xs text-gray-500 mt-1">Pie Chart</p>
          )}
        </div>
      )}
      
      {/* ✅ Chart container */}
      <div 
        className="w-full bg-white rounded-lg"
        role="img" // ✅ Added
        aria-label={title || 'Pie Chart'} // ✅ Added
      >
        <ResponsiveContainer width="100%" height={height}>
          <RechartsPieChart onClick={onSegmentClick}> {/* ✅ Added */}
            <Pie
              data={validData}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={renderLabel} // ✅ Custom label
              outerRadius={outerRadius} // ✅ Configurable
              innerRadius={innerRadius}
              fill="#8884d8"
              dataKey={dataKey}
              nameKey={nameKey}
              startAngle={startAngle} // ✅ Added
              endAngle={endAngle} // ✅ Added
              isAnimationActive={true} // ✅ Added
              animationDuration={800} // ✅ Added
            >
              {validData.map((entry, index) => (
                <Cell 
                  key={`cell-${index}`} 
                  fill={colors[index % colors.length]}
                  onClick={() => onSegmentClick && onSegmentClick(entry)} // ✅ Segment click
                  style={{ cursor: onSegmentClick ? 'pointer' : 'default' }} // ✅ Cursor
                />
              ))}
            </Pie>
            <Tooltip 
              content={<CustomTooltip />} // ✅ Custom tooltip
              contentStyle={{
                backgroundColor: '#fff',
                border: '1px solid #e5e7eb',
                borderRadius: '0.5rem',
                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
              }}
            />
            {showLegend && <Legend />}
          </RechartsPieChart>
        </ResponsiveContainer>
      </div>

      {/* ✅ Data summary */}
      {validData.length > 0 && (
        <div className="mt-4 space-y-2">
          <div className="bg-gray-50 p-3 rounded-lg">
            <p className="text-xs font-semibold text-gray-700 mb-2">Segments Summary</p>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <p className="text-xs text-gray-600">Total Segments</p>
                <p className="text-sm font-bold text-gray-800">{validData.length}</p>
              </div>
              <div>
                <p className="text-xs text-gray-600">Total Value</p>
                <p className="text-sm font-bold text-gray-800">{total}{unit}</p>
              </div>
            </div>
          </div>

          {/* ✅ Segment breakdown */}
          <div className="bg-gray-50 p-3 rounded-lg max-h-48 overflow-y-auto">
            <p className="text-xs font-semibold text-gray-700 mb-2">Breakdown</p>
            <div className="space-y-1">
              {validData.map((item, index) => {
                const percentage = total > 0 ? ((item[dataKey] / total) * 100).toFixed(1) : 0;
                return (
                  <div key={index} className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2 flex-1">
                      <div 
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: colors[index % colors.length] }}
                      />
                      <span className="text-gray-700">{item[nameKey]}</span>
                    </div>
                    <span className="text-gray-600">
                      {item[dataKey]}{unit} ({percentage}%)
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PieChart;
