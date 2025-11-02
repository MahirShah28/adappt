import React, { useContext, useState, useMemo, useCallback } from 'react';
import { BankingContext } from '../../context/Index'; // ✅ Added
import { Card, Badge, Select, Alert } from '../../components/common/Index'; // ✅ Updated
import { PieChart, BarChart } from '../../components/charts/Index'; // ✅ Updated
import { TrendingDown, TrendingUp, DollarSign, Calendar, AlertCircle, Download, Target } from 'lucide-react'; // ✅ Added

// ✅ Mock data import
import { 
  getSpendingData,
  getCategoryBreakdown,
  getMonthlyTrend,
} from '../../data/Index'; // ✅ Added

/**
 * SpendingAnalysis Component
 * Analyze spending patterns and budget management
 * 
 * @param {string} timeRange - Initial time range
 * @param {object} customData - Custom spending data (optional)
 * @param {boolean} loading - Is data loading
 * @param {function} onCategoryClick - Category click handler
 * @param {boolean} showInsights - Show insights section
 * @param {function} onExport - Export callback
 * @param {array} budgets - Custom budget data
 */
const SpendingAnalysis = ({ 
  timeRange: initialTimeRange = 'thisMonth', // ✅ Added
  customData = null, // ✅ Added
  loading = false, // ✅ Added
  onCategoryClick = null, // ✅ Added
  showInsights = true, // ✅ Added
  onExport = null, // ✅ Added
  budgets = null, // ✅ Added
}) => {
  // ✅ Get context
  const banking = useContext(BankingContext);

  // ✅ State management
  const [timeRange, setTimeRange] = useState(initialTimeRange); // ✅ Updated

  // ✅ Get spending data
  const spendingData = useMemo(() => {
    if (customData?.spending) return customData.spending;
    return getSpendingData(timeRange);
  }, [timeRange, customData]);

  // ✅ Get category breakdown
  const categories = useMemo(() => {
    if (customData?.categories) return customData.categories;
    const breakdown = getCategoryBreakdown(timeRange);
    
    // ✅ Apply custom budgets if provided
    if (budgets) {
      return breakdown.map(cat => ({
        ...cat,
        budget: budgets[cat.name] || cat.budget,
      }));
    }
    return breakdown;
  }, [timeRange, customData, budgets]);

  // ✅ Get monthly trend
  const monthlyTrend = useMemo(() => {
    if (customData?.trend) return customData.trend;
    return getMonthlyTrend();
  }, [customData]);

  // ✅ Calculate summary metrics
  const summaryMetrics = useMemo(() => {
    const totalSpending = spendingData.reduce((sum, item) => sum + item.value, 0);
    const savingsAmount = spendingData.find(item => item.name === 'Savings')?.value || 0;
    const totalBudget = categories.reduce((sum, cat) => sum + cat.budget, 0);
    
    // ✅ Calculate savings rate
    const savingsRate = savingsAmount > 0 
      ? (savingsAmount / (totalSpending + savingsAmount)) * 100 
      : 0;

    // ✅ Calculate budget usage
    const budgetUsed = (totalSpending / totalBudget) * 100;

    // ✅ Calculate daily average
    const daysInPeriod = timeRange === 'thisMonth' ? 30 : timeRange === 'last3Months' ? 90 : 365;
    const dailyAverage = Math.round(totalSpending / daysInPeriod);

    return {
      totalSpending,
      savingsAmount,
      savingsRate,
      totalBudget,
      budgetUsed,
      dailyAverage,
    };
  }, [spendingData, categories, timeRange]);

  // ✅ Generate insights
  const insights = useMemo(() => {
    const overBudgetCategories = categories.filter(cat => cat.percentage > 100);
    const warningCategories = categories.filter(cat => cat.percentage > 80 && cat.percentage <= 100);
    const underBudgetCategories = categories.filter(cat => cat.percentage < 50);

    const generatedInsights = [];

    // ✅ Savings rate insight
    if (summaryMetrics.savingsRate > 20) {
      generatedInsights.push({
        type: 'positive',
        icon: '✓',
        title: 'Great Savings Rate!',
        message: `Your savings rate of ${summaryMetrics.savingsRate.toFixed(1)}% is above the recommended 20%.`,
        color: 'green',
      });
    } else if (summaryMetrics.savingsRate > 15) {
      generatedInsights.push({
        type: 'warning',
        icon: '⚠',
        title: 'Moderate Savings',
        message: `Your savings rate is ${summaryMetrics.savingsRate.toFixed(1)}%. Try to aim for 20%+.`,
        color: 'yellow',
      });
    }

    // ✅ Over budget insight
    if (overBudgetCategories.length > 0) {
      const categoryNames = overBudgetCategories.map(c => c.name).join(', ');
      const totalOverBudget = overBudgetCategories.reduce((sum, cat) => sum + (cat.amount - cat.budget), 0);
      generatedInsights.push({
        type: 'warning',
        icon: '⚠',
        title: 'Categories Over Budget',
        message: `${categoryNames} are over budget. Total overspend: ₹${totalOverBudget.toLocaleString()}.`,
        color: 'red',
      });
    }

    // ✅ Under budget insight
    if (underBudgetCategories.length > 0) {
      const categoryNames = underBudgetCategories.map(c => c.name).join(', ');
      generatedInsights.push({
        type: 'positive',
        icon: '✓',
        title: 'Categories Under Budget',
        message: `Great job! ${categoryNames} are well under budget.`,
        color: 'green',
      });
    }

    // ✅ Budget usage insight
    if (summaryMetrics.budgetUsed > 95) {
      generatedInsights.push({
        type: 'warning',
        icon: '⚠',
        title: 'High Budget Usage',
        message: `You're using ${summaryMetrics.budgetUsed.toFixed(0)}% of your budget. Be careful with remaining spending.`,
        color: 'yellow',
      });
    }

    return generatedInsights;
  }, [categories, summaryMetrics]);

  // ✅ Handle time range change
  const handleTimeRangeChange = useCallback((e) => {
    const newRange = e.target.value;
    setTimeRange(newRange);
    
    if (banking?.updateTimeRange) {
      banking.updateTimeRange(newRange);
    }
  }, [banking]);

  // ✅ Handle category click
  const handleCategoryClick = useCallback((category) => {
    if (onCategoryClick) {
      onCategoryClick(category);
    } else if (banking?.selectCategory) {
      banking.selectCategory(category);
    }
  }, [onCategoryClick, banking]);

  // ✅ Handle export
  const handleExport = useCallback(() => {
    const exportData = {
      timeRange,
      summaryMetrics,
      spendingData,
      categories,
      monthlyTrend,
      insights,
      exportedAt: new Date(),
    };

    if (onExport) {
      onExport(exportData);
    } else if (banking?.exportData) {
      banking.exportData({
        type: 'spending-analysis',
        data: exportData,
      });
    }

    if (banking?.addNotification) {
      banking.addNotification({
        type: 'success',
        message: 'Spending analysis exported successfully!',
        duration: 2000,
      });
    }
  }, [timeRange, summaryMetrics, spendingData, categories, monthlyTrend, insights, onExport, banking]);

  // ✅ Get budget status color
  const getBudgetStatusColor = useCallback((percentage) => {
    if (percentage > 100) return 'red';
    if (percentage > 80) return 'yellow';
    return 'green';
  }, []);

  // ✅ Get budget status variant
  const getBudgetStatusVariant = useCallback((percentage) => {
    if (percentage > 100) return 'danger';
    if (percentage > 80) return 'warning';
    return 'success';
  }, []);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h3 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
            <DollarSign className="text-blue-600" size={28} />
            Spending Analysis
          </h3>
          <p className="text-gray-600 mt-1">Track where your money goes</p>
        </div>

        {/* ✅ Export & Time Range */}
        <div className="flex items-center gap-2">
          <button
            onClick={handleExport}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            title="Export spending analysis"
            aria-label="Export data"
          >
            <Download size={20} className="text-gray-600" />
          </button>

          <Select
            value={timeRange}
            onChange={handleTimeRangeChange}
            options={[
              { value: 'thisMonth', label: 'This Month' },
              { value: 'lastMonth', label: 'Last Month' },
              { value: 'last3Months', label: 'Last 3 Months' },
              { value: 'thisYear', label: 'This Year' },
            ]}
          />
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {/* ✅ Total Spending Card */}
        <Card 
          className="bg-gradient-to-br from-blue-50 to-blue-100 cursor-pointer hover:shadow-md transition-all"
          onClick={() => handleCategoryClick({ type: 'total', value: summaryMetrics.totalSpending })}
        >
          <div className="text-center">
            <p className="text-sm text-blue-700 mb-1">Total Spending</p>
            <p className="text-3xl font-bold text-blue-900">
              ₹{summaryMetrics.totalSpending.toLocaleString()}
            </p>
            <Badge variant="info" size="sm" className="mt-2">
              {timeRange.replace(/([A-Z])/g, ' $1').toLowerCase()}
            </Badge>
          </div>
        </Card>

        {/* ✅ Savings Rate Card */}
        <Card className="bg-gradient-to-br from-green-50 to-green-100">
          <div className="text-center">
            <p className="text-sm text-green-700 mb-1">Savings Rate</p>
            <p className="text-3xl font-bold text-green-900">
              {summaryMetrics.savingsRate.toFixed(1)}%
            </p>
            <Badge 
              variant={summaryMetrics.savingsRate > 20 ? 'success' : summaryMetrics.savingsRate > 15 ? 'warning' : 'danger'}
              size="sm" 
              className="mt-2"
            >
              {summaryMetrics.savingsRate > 20 ? 'Excellent' : summaryMetrics.savingsRate > 15 ? 'Good' : 'Needs Work'}
            </Badge>
          </div>
        </Card>

        {/* ✅ Budget Used Card */}
        <Card className="bg-gradient-to-br from-orange-50 to-orange-100">
          <div className="text-center">
            <p className="text-sm text-orange-700 mb-1">Budget Used</p>
            <p className="text-3xl font-bold text-orange-900">
              {summaryMetrics.budgetUsed.toFixed(0)}%
            </p>
            <Badge 
              variant={summaryMetrics.budgetUsed > 95 ? 'danger' : summaryMetrics.budgetUsed > 80 ? 'warning' : 'success'}
              size="sm" 
              className="mt-2"
            >
              {summaryMetrics.budgetUsed > 95 ? 'Warning' : summaryMetrics.budgetUsed > 80 ? 'Caution' : 'On Track'}
            </Badge>
          </div>
        </Card>

        {/* ✅ Daily Average Card */}
        <Card className="bg-gradient-to-br from-purple-50 to-purple-100">
          <div className="text-center">
            <p className="text-sm text-purple-700 mb-1">Avg Daily</p>
            <p className="text-3xl font-bold text-purple-900">
              ₹{summaryMetrics.dailyAverage.toLocaleString()}
            </p>
            <Badge variant="default" size="sm" className="mt-2">Per Day</Badge>
          </div>
        </Card>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Spending Distribution */}
        <Card>
          <PieChart
            data={spendingData}
            dataKey="value"
            nameKey="name"
            title="Spending Distribution"
            height={350}
            showLegend={true}
            loading={loading}
            onSegmentClick={handleCategoryClick}
            showValue={true}
            unit="₹"
          />
        </Card>

        {/* Monthly Trend */}
        <Card>
          <BarChart
            data={monthlyTrend}
            dataKeys={['spending', 'income']}
            xAxisKey="month"
            title="Income vs Spending Trend"
            height={350}
            colors={['#ef4444', '#10b981']}
            loading={loading}
            unit="₹"
          />
        </Card>
      </div>

      {/* Category Breakdown */}
      <Card title="📊 Category-wise Breakdown">
        <div className="space-y-4">
          {categories.map((category, index) => {
            const overBudget = category.percentage > 100;
            const color = getBudgetStatusColor(category.percentage);
            
            return (
              <div 
                key={index}
                className="space-y-2 p-3 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer"
                onClick={() => handleCategoryClick(category)}
              >
                {/* Category Header */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="font-semibold text-gray-800">{category.name}</span>
                    
                    {/* ✅ Trend indicator */}
                    {category.trend === 'up' && (
                      <TrendingUp size={16} className="text-red-600" title="Spending increased" />
                    )}
                    {category.trend === 'down' && (
                      <TrendingDown size={16} className="text-green-600" title="Spending decreased" />
                    )}
                  </div>

                  {/* Amount & Badge */}
                  <div className="text-right">
                    <p className="text-sm font-semibold text-gray-800">
                      ₹{category.amount.toLocaleString()} / ₹{category.budget.toLocaleString()}
                    </p>
                    <Badge 
                      variant={getBudgetStatusVariant(category.percentage)}
                      size="sm"
                    >
                      {category.percentage}%
                    </Badge>
                  </div>
                </div>

                {/* Progress Bar */}
                <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                  <div
                    className={`h-3 rounded-full transition-all duration-500 bg-${color}-500`}
                    style={{ 
                      width: `${Math.min(100, category.percentage)}%`,
                      backgroundColor: color === 'red' ? '#ef4444' : color === 'yellow' ? '#eab308' : '#10b981',
                    }}
                  />
                </div>

                {/* ✅ Over Budget Alert */}
                {overBudget && (
                  <Alert
                    type="error"
                    message={`Over budget by ₹${(category.amount - category.budget).toLocaleString()}`}
                    dismissible={false}
                  />
                )}
              </div>
            );
          })}
        </div>
      </Card>

      {/* Insights */}
      {showInsights && (
        <Card title="💡 Spending Insights">
          <div className="space-y-3">
            {insights.length > 0 ? (
              insights.map((insight, idx) => (
                <div
                  key={idx}
                  className={`p-3 rounded-lg border-l-4 ${
                    insight.color === 'green'
                      ? 'bg-green-50 border-green-500'
                      : insight.color === 'yellow'
                      ? 'bg-yellow-50 border-yellow-500'
                      : 'bg-red-50 border-red-500'
                  }`}
                >
                  <p className={`text-sm ${
                    insight.color === 'green'
                      ? 'text-green-800'
                      : insight.color === 'yellow'
                      ? 'text-yellow-800'
                      : 'text-red-800'
                  }`}>
                    <strong>{insight.icon} {insight.title}:</strong> {insight.message}
                  </p>
                </div>
              ))
            ) : (
              <Alert
                type="info"
                message="No spending insights available. Keep tracking your expenses!"
                dismissible={false}
              />
            )}
          </div>

          {/* ✅ Tips Section */}
          <div className="mt-4 pt-4 border-t space-y-2">
            <h5 className="font-semibold text-gray-800 mb-2">💡 Money-Saving Tips</h5>
            <ul className="text-sm text-gray-700 space-y-1 list-disc list-inside">
              <li>Review categories that exceed budget and find ways to reduce spending</li>
              <li>Set realistic budgets based on your actual spending patterns</li>
              <li>Track daily expenses to stay aware of your spending habits</li>
              <li>Aim for a minimum 20% savings rate for financial security</li>
            </ul>
          </div>
        </Card>
      )}
    </div>
  );
};

export default SpendingAnalysis;
