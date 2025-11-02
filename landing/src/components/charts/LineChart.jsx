import React, { useMemo } from 'react';
import {
  LineChart as RechartsLineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  ReferenceLine,
} from 'recharts';

/**
 * LineChart Component
 * Displays line chart using Recharts with customizable data and styling
 * 
 * @param {array} data - Chart data array
 * @param {array} dataKeys - Keys to display as lines
 * @param {string} xAxisKey - Key for X-axis
 * @param {string} title - Chart title
 * @param {number} height - Chart height in pixels
 * @param {array} colors - Color array for lines
 * @param {boolean} showLegend - Show legend
 * @param {boolean} showGrid - Show grid
 * @param {number} strokeWidth - Line width
 * @param {boolean} loading - Show loading state
 * @param {function} onLineClick - Click handler for lines
 * @param {string} unit - Unit to display (e.g., "₹", "%")
 * @param {string} lineType - Line type ('monotone', 'linear', 'natural')
 * @param {boolean} showDots - Show data point dots
 * @param {boolean} showArea - Show area under line
 * @param {number} dotRadius - Radius of data point dots
 * @param {number|array} referenceLine - Reference line value(s)
 * @param {string} referenceLineColor - Color of reference line
 */
const LineChart = ({ 
  data = [], 
  dataKeys = [], 
  xAxisKey = 'name',
  title,
  height = 300,
  colors = ['#0ea5e9', '#10b981', '#f59e0b', '#ef4444'],
  showLegend = true,
  showGrid = true,
  strokeWidth = 2,
  loading = false, // ✅ Added
  onLineClick = null, // ✅ Added
  unit = '', // ✅ Added
  lineType = 'monotone', // ✅ Added
  showDots = true, // ✅ Added
  showArea = false, // ✅ Added
  dotRadius = 4, // ✅ Added
  referenceLine = null, // ✅ Added
  referenceLineColor = '#ccc', // ✅ Added
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

  // ✅ Calculate min/max for reference line
  const getMinMaxValues = useMemo(() => {
    if (validData.length === 0) return { min: 0, max: 100 };
    
    let min = Infinity;
    let max = -Infinity;

    validData.forEach(item => {
      validDataKeys.forEach(key => {
        const value = item[key];
        if (typeof value === 'number') {
          min = Math.min(min, value);
          max = Math.max(max, value);
        }
      });
    });

    return { min: min === Infinity ? 0 : min, max: max === -Infinity ? 100 : max };
  }, [validData, validDataKeys]);

  // ✅ Custom tooltip with unit support
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
              ircle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidthth="4" /
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
        aria-label={title || 'Line Chart'} // ✅ Added
      >
        <ResponsiveContainer width="100%" height={height}>
          <RechartsLineChart
            data={validData}
            margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
            onClick={onLineClick} // ✅ Added
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

            {/* ✅ Reference line */}
            {referenceLine && (
              <ReferenceLine 
                y={referenceLine}
                stroke={referenceLineColor}
                strokeDasharray="5 5"
                label={{ value: `Target: ${referenceLine}`, position: 'right', fill: '#666' }}
              />
            )}
            
            {/* Line components */}
            {validDataKeys.map((key, index) => (
              <Line
                key={key}
                type={lineType}
                dataKey={key}
                stroke={colors[index % colors.length]}
                strokeWidth={strokeWidth}
                dot={showDots ? { 
                  fill: colors[index % colors.length], 
                  r: dotRadius 
                } : false} // ✅ Configurable dots
                activeDot={{ r: dotRadius + 2 }} // ✅ Enhanced
                isAnimationActive={true} // ✅ Added
                animationDuration={800} // ✅ Added
                connectNulls={true} // ✅ Added
              />
            ))}
          </RechartsLineChart>
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
            <p className="font-semibold">Line Type</p>
            <p className="text-gray-800 capitalize">{lineType}</p>
          </div>
          <div className="bg-gray-50 p-2 rounded">
            <p className="font-semibold">Width</p>
            <p className="text-gray-800">{strokeWidth}px</p>
          </div>
        </div>
      )}

      {/* ✅ Data range info */}
      {validData.length > 0 && (
        <div className="mt-2 text-xs text-gray-500">
          <p>Data Range: {getMinMaxValues.min.toFixed(1)}{unit} - {getMinMaxValues.max.toFixed(1)}{unit}</p>
        </div>
      )}
    </div>
  );
};

export default LineChart;
