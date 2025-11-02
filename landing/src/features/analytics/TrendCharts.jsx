import React, { useContext, useState, useMemo, useCallback } from 'react';
import { BankingContext } from '../../context/Index'; // ✅ Added
import { Card, Select, Badge } from '../../components/common/Index'; // ✅ Updated
import { LineChart, BarChart, AreaChart } from '../../components/charts/Index'; // ✅ Updated
import { Download, TrendingUp, TrendingDown, AlertCircle } from 'lucide-react'; // ✅ Added

// ✅ Mock data import
import { 
  getTrendData,
  getRevenueData,
  getDefaultTrendData,
  getBorrowerGrowthData,
} from '../../data/Index'; // ✅ Added

/**
 * TrendCharts Component
 * Displays multi-chart analysis of key metrics over time
 * 
 * @param {string} timeRange - Initial time range ('3months', '6months', '1year', '2years')
 * @param {object} customData - Custom chart data (optional)
 * @param {boolean} loading - Is data loading
 * @param {function} onChartInteraction - Chart click handler
 * @param {boolean} showInsights - Show insights section
 * @param {function} onExport - Export callback
 * @param {array} selectedMetrics - Metrics to display
 */
const TrendCharts = ({ 
  timeRange: initialTimeRange = '6months', // ✅ Added
  customData = null, // ✅ Added
  loading = false, // ✅ Added
  onChartInteraction = null, // ✅ Added
  showInsights = true, // ✅ Added
  onExport = null, // ✅ Added
  selectedMetrics = ['applications', 'revenue', 'defaults', 'growth'], // ✅ Added
}) => {
  // ✅ Get context
  const banking = useContext(BankingContext);

  // ✅ State management
  const [timeRange, setTimeRange] = useState(initialTimeRange); // ✅ Updated
  const [selectedChart, setSelectedChart] = useState(null); // ✅ Added

  // ✅ Get data based on time range
  const getDataForTimeRange = useCallback((data, range) => {
    if (!data || data.length === 0) return data;
    
    const dataMap = {
      '3months': data.slice(-3),
      '6months': data.slice(-6),
      '1year': data.slice(-12),
      '2years': data,
    };
    
    return dataMap[range] || data;
  }, []);

  // ✅ Get trend data
  const trendData = useMemo(() => {
    if (customData?.trends) return getDataForTimeRange(customData.trends, timeRange);
    return getDataForTimeRange(getTrendData(), timeRange);
  }, [timeRange, customData, getDataForTimeRange]);

  // ✅ Get revenue data
  const revenueData = useMemo(() => {
    if (customData?.revenue) return getDataForTimeRange(customData.revenue, timeRange);
    return getDataForTimeRange(getRevenueData(), timeRange);
  }, [timeRange, customData, getDataForTimeRange]);

  // ✅ Get default trend data
  const defaultTrendData = useMemo(() => {
    if (customData?.defaults) return getDataForTimeRange(customData.defaults, timeRange);
    return getDataForTimeRange(getDefaultTrendData(), timeRange);
  }, [timeRange, customData, getDataForTimeRange]);

  // ✅ Get borrower growth data
  const borrowerGrowthData = useMemo(() => {
    if (customData?.growth) return getDataForTimeRange(customData.growth, timeRange);
    return getDataForTimeRange(getBorrowerGrowthData(), timeRange);
  }, [timeRange, customData, getDataForTimeRange]);

  // ✅ Calculate insights
  const insights = useMemo(() => {
    if (!trendData || trendData.length < 2) return { positive: [], leaders: [] };

    const first = trendData[0];
    const last = trendData[trendData.length - 1];

    const positive = [];
    const leaders = [];

    // ✅ Collection rate trend
    if (first.collection && last.collection) {
      const improvement = (last.collection - first.collection).toFixed(2);
      if (improvement > 0) {
        positive.push(`✓ Collection rate improved from ${first.collection}% to ${last.collection}%`);
      }
    }

    // ✅ Default rate trend
    if (first.defaultRate && last.defaultRate) {
      const improvement = (first.defaultRate - last.defaultRate).toFixed(2);
      if (improvement > 0) {
        positive.push(`✓ Default rate decreased from ${first.defaultRate}% to ${last.defaultRate}%`);
      }
    }

    // ✅ Revenue growth
    if (revenueData && revenueData.length > 0) {
      const firstRevenue = (revenueData[0].interestIncome || 0) + (revenueData[0].processingFees || 0);
      const lastRevenue = (revenueData[revenueData.length - 1].interestIncome || 0) + (revenueData[revenueData.length - 1].processingFees || 0);
      const growth = ((lastRevenue - firstRevenue) / firstRevenue * 100).toFixed(0);
      if (growth > 0) {
        positive.push(`✓ Revenue grew ${growth}% in period`);
      }
    }

    // ✅ Borrower growth leaders
    if (borrowerGrowthData && borrowerGrowthData.length > 0) {
      const first = borrowerGrowthData[0];
      const last = borrowerGrowthData[borrowerGrowthData.length - 1];

      const segments = {
        'CIBIL-less': { first: first.cibilLess, last: last.cibilLess },
        'Women entrepreneurs': { first: first.women, last: last.women },
        'Tier 3/4 cities': { first: first.tier3, last: last.tier3 },
        'Small business owners': { first: first.business, last: last.business },
      };

      Object.entries(segments).forEach(([name, values]) => {
        const growth = ((values.last - values.first) / values.first * 100).toFixed(0);
        leaders.push(`📊 ${name}: ${growth}% growth`);
      });
    }

    return { positive, leaders };
  }, [trendData, revenueData, borrowerGrowthData]);

  // ✅ Handle chart click
  const handleChartClick = useCallback((chartName) => {
    setSelectedChart(chartName);
    if (onChartInteraction) {
      onChartInteraction(chartName);
    }
  }, [onChartInteraction]);

  // ✅ Handle export
  const handleExport = useCallback(() => {
    const exportData = {
      timeRange,
      trends: trendData,
      revenue: revenueData,
      defaults: defaultTrendData,
      growth: borrowerGrowthData,
      insights,
      exportedAt: new Date(),
    };

    if (onExport) {
      onExport(exportData);
    } else if (banking?.exportData) {
      banking.exportData({
        type: 'trend-analysis',
        data: exportData,
      });
    }
  }, [timeRange, trendData, revenueData, defaultTrendData, borrowerGrowthData, insights, onExport, banking]);

  // ✅ Handle time range change
  const handleTimeRangeChange = useCallback((e) => {
    const newRange = e.target.value;
    setTimeRange(newRange);
    
    if (banking?.updateTimeRange) {
      banking.updateTimeRange(newRange);
    }
  }, [banking]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h3 className="text-2xl font-bold text-gray-800">Trend Analysis</h3>
          <p className="text-gray-600 mt-1">Monitor key metrics over time</p>
        </div>

        {/* ✅ Action Buttons */}
        <div className="flex items-center gap-2">
          <button
            onClick={handleExport}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            title="Export trend data"
            aria-label="Export trend data"
          >
            <Download size={20} className="text-gray-600" />
          </button>

          {/* Time Range Selector */}
          <Select
            value={timeRange}
            onChange={handleTimeRangeChange}
            options={[
              { value: '3months', label: 'Last 3 Months' },
              { value: '6months', label: 'Last 6 Months' },
              { value: '1year', label: 'Last 1 Year' },
              { value: '2years', label: 'Last 2 Years' },
            ]}
          />
        </div>
      </div>

      {/* ✅ Data Range Info */}
      <div className="flex items-center gap-2 text-sm text-gray-600">
        <AlertCircle size={16} />
        <span>Showing data for {timeRange.replace(/([A-Z])/g, ' $1').toLowerCase()}</span>
        {trendData && <span>({trendData.length} data points)</span>}
      </div>

      {/* Application & Disbursement Trends */}
      {selectedMetrics.includes('applications') && (
        <Card
          clickable={true}
          onClick={() => handleChartClick('applications')}
          className={selectedChart === 'applications' ? 'ring-2 ring-blue-500' : ''}
        >
          <BarChart
            data={trendData}
            dataKeys={['applications', 'approved', 'disbursed']}
            xAxisKey="month"
            title="Application & Disbursement Trends"
            height={350}
            colors={['#f59e0b', '#3b82f6', '#10b981']}
            loading={loading}
            unit=" loans"
          />
        </Card>
      )}

      {/* Collection Rate Trend */}
      {selectedMetrics.includes('collection') && (
        <Card
          clickable={true}
          onClick={() => handleChartClick('collection')}
          className={selectedChart === 'collection' ? 'ring-2 ring-blue-500' : ''}
        >
          <LineChart
            data={trendData}
            dataKeys={['collection']}
            xAxisKey="month"
            title="Monthly Collection Rate Trend"
            height={300}
            colors={['#10b981']}
            loading={loading}
            unit="%"
            referenceLine={97}
            referenceLineColor="#10b981"
          />
        </Card>
      )}

      {/* Revenue Breakdown */}
      {selectedMetrics.includes('revenue') && (
        <Card
          clickable={true}
          onClick={() => handleChartClick('revenue')}
          className={selectedChart === 'revenue' ? 'ring-2 ring-blue-500' : ''}
        >
          <AreaChart
            data={revenueData}
            dataKeys={['interestIncome', 'processingFees', 'otherIncome']}
            xAxisKey="month"
            title="Revenue Composition (₹ in Lakhs)"
            height={350}
            colors={['#3b82f6', '#10b981', '#f59e0b']}
            loading={loading}
            unit=" L"
          />
        </Card>
      )}

      {/* Default & Risk Metrics */}
      {selectedMetrics.includes('defaults') && (
        <Card
          clickable={true}
          onClick={() => handleChartClick('defaults')}
          className={selectedChart === 'defaults' ? 'ring-2 ring-blue-500' : ''}
        >
          <LineChart
            data={defaultTrendData}
            dataKeys={['defaultRate', 'npl']}
            xAxisKey="month"
            title="Default Rate & NPL Trend"
            height={300}
            colors={['#ef4444', '#f97316']}
            loading={loading}
            unit="%"
            referenceLine={2.5}
            referenceLineColor="#f97316"
          />
        </Card>
      )}

      {/* Borrower Growth by Segment */}
      {selectedMetrics.includes('growth') && (
        <Card
          clickable={true}
          onClick={() => handleChartClick('growth')}
          className={selectedChart === 'growth' ? 'ring-2 ring-blue-500' : ''}
        >
          <AreaChart
            data={borrowerGrowthData}
            dataKeys={['farmers', 'women', 'tier3', 'cibilLess', 'business']}
            xAxisKey="month"
            title="Borrower Growth by Segment"
            height={350}
            colors={['#84cc16', '#ec4899', '#06b6d4', '#f59e0b', '#8b5cf6']}
            loading={loading}
            unit=" borrowers"
          />
        </Card>
      )}

      {/* Key Insights */}
      {showInsights && (
        <Card title="📈 Key Trend Insights">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Positive Trends */}
            <div className="p-4 bg-green-50 rounded-lg border-l-4 border-green-500">
              <div className="flex items-center gap-2 mb-2">
                <TrendingUp className="text-green-600" size={20} />
                <h5 className="font-semibold text-green-900">Positive Trends</h5>
              </div>
              <ul className="space-y-1 text-sm text-green-800">
                {insights.positive.length > 0 ? (
                  insights.positive.map((item, idx) => (
                    <li key={idx}>{item}</li>
                  ))
                ) : (
                  <li>No significant positive trends detected</li>
                )}
              </ul>
            </div>

            {/* Growth Leaders */}
            <div className="p-4 bg-blue-50 rounded-lg border-l-4 border-blue-500">
              <div className="flex items-center gap-2 mb-2">
                <TrendingUp className="text-blue-600" size={20} />
                <h5 className="font-semibold text-blue-900">Growth Leaders</h5>
              </div>
              <ul className="space-y-1 text-sm text-blue-800">
                {insights.leaders.length > 0 ? (
                  insights.leaders.map((item, idx) => (
                    <li key={idx}>{item}</li>
                  ))
                ) : (
                  <li>No growth data available</li>
                )}
              </ul>
            </div>
          </div>

          {/* ✅ Summary Stats */}
          {trendData && trendData.length > 0 && (
            <div className="mt-4 pt-4 border-t grid grid-cols-2 md:grid-cols-4 gap-2 text-xs">
              <div className="text-center p-2 bg-gray-50 rounded">
                <p className="text-gray-600">Data Points</p>
                <p className="font-bold text-gray-800">{trendData.length}</p>
              </div>
              <div className="text-center p-2 bg-gray-50 rounded">
                <p className="text-gray-600">Time Period</p>
                <p className="font-bold text-gray-800">{timeRange}</p>
              </div>
              <div className="text-center p-2 bg-gray-50 rounded">
                <p className="text-gray-600">Last Updated</p>
                <p className="font-bold text-gray-800">Today</p>
              </div>
              <div className="text-center p-2 bg-gray-50 rounded">
                <p className="text-gray-600">Charts</p>
                <p className="font-bold text-gray-800">{selectedMetrics.length}</p>
              </div>
            </div>
          )}
        </Card>
      )}

      {/* ✅ No Data Alert */}
      {!loading && trendData && trendData.length === 0 && (
        <Card className="bg-yellow-50 border-l-4 border-yellow-500">
          <div className="flex items-center gap-2">
            <AlertCircle className="text-yellow-600" size={24} />
            <div>
              <h5 className="font-semibold text-yellow-900">No Data Available</h5>
              <p className="text-sm text-yellow-800">Please select a different time range or check back later.</p>
            </div>
          </div>
        </Card>
      )}
    </div>
  );
};

export default TrendCharts;
