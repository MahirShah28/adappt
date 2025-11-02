import React, { useContext, useMemo, useState } from 'react';
import { BankingContext } from '../../context/Index'; // ✅ Added
import { Card, MetricCard, Badge } from '../../components/common/Index'; // ✅ Updated
import { Users, DollarSign, TrendingUp, Percent, Target, BarChart3, PieChart, Activity, RefreshCw } from 'lucide-react'; // ✅ Added

// ✅ Mock data import
import { 
  getMetricsData,
  getPortfolioMetrics,
  getGrowthMetrics,
  getRiskMetrics,
} from '../../data/Index'; // ✅ Added

/**
 * MetricsGrid Component
 * Displays KPI metrics and performance indicators
 * 
 * @param {array} customMetrics - Custom metrics array (optional)
 * @param {string} timeRange - Time range ('daily', 'weekly', 'monthly', 'quarterly', 'yearly')
 * @param {boolean} loading - Is data loading
 * @param {function} onMetricClick - Metric click handler
 * @param {boolean} showComparison - Show comparison data
 * @param {function} onRefresh - Refresh data callback
 * @param {string} compareWith - Compare with ('previous', 'target', 'industry')
 */
const MetricsGrid = ({ 
  customMetrics = null, // ✅ Added
  timeRange = 'monthly', // ✅ Added
  loading = false, // ✅ Added
  onMetricClick = null, // ✅ Added
  showComparison = true, // ✅ Added
  onRefresh = null, // ✅ Added
  compareWith = 'previous', // ✅ Added
}) => {
  // ✅ Get context
  const banking = useContext(BankingContext);

  // ✅ State for refresh
  const [isRefreshing, setIsRefreshing] = useState(false); // ✅ Added

  // ✅ Get metrics from mock data or use custom
  const metrics = useMemo(() => {
    if (customMetrics) {
      return customMetrics;
    }

    // ✅ Get default metrics from data
    const defaultMetrics = getMetricsData(timeRange);

    return defaultMetrics.map(metric => ({
      title: metric.title,
      value: metric.value,
      delta: metric.delta,
      trend: metric.trend,
      icon: metric.iconName ? getIconComponent(metric.iconName) : Users,
      color: metric.color || 'blue',
      comparison: metric.comparison || 'vs last month',
      previousValue: metric.previousValue, // ✅ Added
      targetValue: metric.targetValue, // ✅ Added
    }));
  }, [customMetrics, timeRange]);

  // ✅ Get portfolio metrics
  const portfolioMetrics = useMemo(() => {
    return getPortfolioMetrics();
  }, []);

  // ✅ Get growth metrics
  const growthMetrics = useMemo(() => {
    return getGrowthMetrics();
  }, []);

  // ✅ Get risk metrics
  const riskMetrics = useMemo(() => {
    return getRiskMetrics();
  }, []);

  // ✅ Map icon names to components
  function getIconComponent(iconName) {
    const iconMap = {
      Users,
      DollarSign,
      TrendingUp,
      Percent,
      Target,
      BarChart3,
      PieChart,
      Activity,
    };
    return iconMap[iconName] || Users;
  }

  // ✅ Handle metric click
  const handleMetricClick = (metric) => {
    if (onMetricClick) {
      onMetricClick(metric);
    } else if (banking?.selectMetric) {
      banking.selectMetric(metric);
    }
  };

  // ✅ Handle refresh
  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      if (onRefresh) {
        await onRefresh();
      } else if (banking?.refreshMetrics) {
        await banking.refreshMetrics();
      }
    } finally {
      setIsRefreshing(false);
    }
  };

  // ✅ Calculate percentage change
  const calculatePercentageChange = (current, previous) => {
    if (!previous || previous === 0) return 0;
    return (((current - previous) / previous) * 100).toFixed(1);
  };

  // ✅ Format metric value
  const formatMetricValue = (value) => {
    if (typeof value === 'number') {
      if (value >= 10000000) return (value / 10000000).toFixed(1) + 'Cr';
      if (value >= 100000) return (value / 100000).toFixed(1) + 'L';
      return value.toLocaleString();
    }
    return value;
  };

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-2xl font-bold text-gray-800 mb-4">Key Performance Indicators</h3>
          <p className="text-gray-600">Platform-wide metrics and performance indicators</p>
        </div>

        {/* ✅ Refresh Button */}
        <button
          onClick={handleRefresh}
          disabled={isRefreshing}
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          title="Refresh metrics"
          aria-label="Refresh metrics"
        >
          <RefreshCw 
            size={20} 
            className={`text-gray-600 ${isRefreshing ? 'animate-spin' : ''}`}
          />
        </button>
      </div>

      {/* ✅ Time Range Selector */}
      <div className="flex gap-2 flex-wrap">
        {['daily', 'weekly', 'monthly', 'quarterly', 'yearly'].map(range => (
          <button
            key={range}
            className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
              timeRange === range
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
            onClick={() => handleRefresh()}
          >
            {range.charAt(0).toUpperCase() + range.slice(1)}
          </button>
        ))}
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {loading ? (
          // ✅ Loading state
          Array(8).fill(0).map((_, idx) => (
            <div
              key={idx}
              className="bg-gray-100 rounded-lg h-32 animate-pulse"
            />
          ))
        ) : (
          metrics.map((metric, index) => (
            <div
              key={index}
              onClick={() => handleMetricClick(metric)}
              className={onMetricClick ? 'cursor-pointer' : ''}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && onMetricClick) {
                  handleMetricClick(metric);
                }
              }}
            >
              <MetricCard
                title={metric.title}
                value={metric.value}
                delta={metric.delta}
                trend={metric.trend}
                icon={metric.icon}
                color={metric.color}
                comparison={showComparison ? metric.comparison : ''}
                previousValue={metric.previousValue} // ✅ Added
                clickable={!!onMetricClick}
              />
            </div>
          ))
        )}
      </div>

      {/* Additional Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
        {/* Revenue Card */}
        <Card 
          className="bg-gradient-to-br from-blue-50 to-blue-100"
          title="Monthly Revenue"
          closable={false}
        >
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-3xl font-bold text-blue-900">
                  {portfolioMetrics.revenue || '₹7.9 L'}
                </p>
                <p className="text-sm text-blue-700 mt-1">Interest income from loans</p>
              </div>
              <DollarSign className="text-blue-600" size={24} />
            </div>

            {/* ✅ Revenue Breakdown */}
            <div className="pt-2 border-t border-blue-200 space-y-1">
              <div className="flex justify-between text-xs text-blue-600">
                <span>Principal Interest:</span>
                <span className="font-semibold">{portfolioMetrics.principalInterest || '₹5.2 L'}</span>
              </div>
              <div className="flex justify-between text-xs text-blue-600">
                <span>Penalty & Other:</span>
                <span className="font-semibold">{portfolioMetrics.penaltyIncome || '₹2.7 L'}</span>
              </div>
              <div className="flex justify-between text-xs text-blue-600 pt-1 border-t border-blue-200 font-semibold">
                <span>Trend:</span>
                <span>↑ {portfolioMetrics.revenueGrowth || '15.3%'} vs last month</span>
              </div>
            </div>
          </div>
        </Card>

        {/* Risk Profile Card */}
        <Card 
          className="bg-gradient-to-br from-red-50 to-orange-100"
          title="Risk Profile"
          closable={false}
        >
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-3xl font-bold text-red-900">
                  {riskMetrics.portfolioAtRisk || '2.1%'}
                </p>
                <p className="text-sm text-red-700 mt-1">Portfolio at risk (30 days)</p>
              </div>
              <Activity className="text-red-600" size={24} />
            </div>

            {/* ✅ Risk Breakdown */}
            <div className="pt-2 border-t border-red-200 space-y-1">
              <div className="flex justify-between text-xs text-red-600">
                <span>Overdue 30-60 days:</span>
                <span className="font-semibold">{riskMetrics.overdue30_60 || '1.2%'}</span>
              </div>
              <div className="flex justify-between text-xs text-red-600">
                <span>Overdue 60+ days:</span>
                <span className="font-semibold">{riskMetrics.overdue60Plus || '0.9%'}</span>
              </div>
              <div className="flex justify-between text-xs text-red-600 pt-1 border-t border-red-200 font-semibold">
                <span>Trend:</span>
                <span>↓ {riskMetrics.improvement || '0.3%'} improvement</span>
              </div>
            </div>
          </div>
        </Card>

        {/* Growth Card */}
        <Card 
          className="bg-gradient-to-br from-green-50 to-emerald-100"
          title="Growth Rate"
          closable={false}
        >
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-3xl font-bold text-green-900">
                  {growthMetrics.yoyGrowth || '23.4%'}
                </p>
                <p className="text-sm text-green-700 mt-1">YoY growth in borrowers</p>
              </div>
              <TrendingUp className="text-green-600" size={24} />
            </div>

            {/* ✅ Growth Breakdown */}
            <div className="pt-2 border-t border-green-200 space-y-1">
              <div className="flex justify-between text-xs text-green-600">
                <span>MoM Growth:</span>
                <span className="font-semibold">{growthMetrics.momGrowth || '3.2%'}</span>
              </div>
              <div className="flex justify-between text-xs text-green-600">
                <span>Quarterly Target:</span>
                <span className="font-semibold">{growthMetrics.quartTarget || '25%'}</span>
              </div>
              <div className="flex justify-between text-xs text-green-600 pt-1 border-t border-green-200 font-semibold">
                <span>Status:</span>
                <Badge variant="success" size="sm">On Pace</Badge>
              </div>
            </div>
          </div>
        </Card>
      </div>

      {/* ✅ Metrics Legend */}
      <div className="mt-8 p-4 bg-gray-50 rounded-lg border border-gray-200">
        <p className="text-xs font-semibold text-gray-700 mb-3">Metrics Legend:</p>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-xs text-gray-600">
          <div>
            <span className="text-green-600 font-bold">↑</span> = Positive trend
          </div>
          <div>
            <span className="text-red-600 font-bold">↓</span> = Negative trend
          </div>
          <div>
            <span className="inline-block w-2 h-2 bg-blue-500 rounded-full mr-1"></span>
            Quarterly data
          </div>
          <div>
            <span className="inline-block w-2 h-2 bg-gray-500 rounded-full mr-1"></span>
            YTD data
          </div>
        </div>
      </div>
    </div>
  );
};

export default MetricsGrid;
