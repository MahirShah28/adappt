import React, { useContext, useMemo, useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { 
  TrendingUp, Users, DollarSign, Percent, Download, RefreshCw, 
  TrendingDown, Target, Award, BarChart3, PieChart as PieChartIcon,
  LineChart as LineChartIcon, AlertCircle
} from 'lucide-react';

/**
 * formatCurrency - Professional currency formatting
 */
const formatCurrency = (value, symbol = true, decimals = 2) => {
  if (!value || isNaN(value)) return symbol ? '₹0' : '0';
  
  const absValue = Math.abs(value);
  let formatted;
  
  if (absValue >= 10000000) {
    formatted = (value / 10000000).toFixed(decimals) + ' Cr';
  } else if (absValue >= 100000) {
    formatted = (value / 100000).toFixed(decimals) + ' L';
  } else if (absValue >= 1000) {
    formatted = (value / 1000).toFixed(decimals) + ' K';
  } else {
    formatted = value.toFixed(decimals);
  }
  
  return symbol ? '₹' + formatted : formatted;
};

/**
 * Card Component - Reusable container
 */
const Card = ({ children, className = '', title = null }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    className={`bg-white rounded-lg border border-blue-200 shadow-sm hover:shadow-md transition-shadow p-6 ${className}`}
  >
    {title && <h3 className="text-lg font-bold text-gray-900 mb-6 tracking-tight">{title}</h3>}
    {children}
  </motion.div>
);

/**
 * MetricCard Component - KPI display
 */
const MetricCard = ({ title, value, delta, trend, icon: Icon }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    className="bg-white rounded-lg border border-blue-200 p-6 shadow-sm hover:shadow-md transition-shadow"
  >
    <div className="flex items-start justify-between mb-4">
      <span className="text-sm text-gray-700 font-bold tracking-tight uppercase">
        {title}
      </span>
      <Icon className="text-blue-600" size={24} />
    </div>
    <div className="flex items-baseline gap-2">
      <span className="text-3xl font-black text-gray-900 tracking-tight">
        {value}
      </span>
      <span className={`text-sm font-bold ${trend === 'up' ? 'text-green-600' : 'text-red-600'} tracking-wide`}>
        {delta}
      </span>
    </div>
  </motion.div>
);

/**
 * Badge Component
 */
const Badge = ({ children, variant = 'default' }) => {
  const variants = {
    default: 'bg-blue-100 text-blue-800',
    success: 'bg-green-100 text-green-800',
    warning: 'bg-yellow-100 text-yellow-800',
    danger: 'bg-red-100 text-red-800',
  };
  
  return (
    <span className={`px-3 py-1 rounded-full text-xs font-bold tracking-wide ${variants[variant]}`}>
      {children}
    </span>
  );
};

/**
 * Button Component
 */
const Button = ({ children, variant = 'primary', onClick, disabled, className = '' }) => {
  const variants = {
    primary: 'bg-gradient-to-r from-blue-500 to-cyan-400 text-white hover:shadow-lg font-bold',
    outline: 'bg-white border-2 border-blue-300 text-blue-700 hover:bg-blue-50 font-bold',
  };
  
  return (
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      disabled={disabled}
      className={`px-4 py-2 rounded-lg transition-all text-sm tracking-wide uppercase ${variants[variant]} ${disabled ? 'opacity-50 cursor-not-allowed' : ''} ${className}`}
    >
      {children}
    </motion.button>
  );
};

/**
 * Select Component
 */
const Select = ({ value, onChange, options = [] }) => (
  <motion.select
    whileFocus={{ scale: 1.02 }}
    value={value}
    onChange={onChange}
    className="px-4 py-2 rounded-lg border-2 border-blue-300 text-gray-900 font-bold text-sm focus:outline-none focus:border-blue-500 bg-white"
  >
    {options.map(opt => (
      <option key={opt.value} value={opt.value}>
        {opt.label}
      </option>
    ))}
  </motion.select>
);

/**
 * Alert Component
 */
const Alert = ({ type = 'info', message, dismissible = true }) => {
  const [show, setShow] = useState(true);
  
  if (!show) return null;
  
  const typeStyles = {
    info: 'bg-blue-50 border-blue-300 text-blue-800',
    success: 'bg-green-50 border-green-300 text-green-800',
    warning: 'bg-yellow-50 border-yellow-300 text-yellow-800',
    error: 'bg-red-50 border-red-300 text-red-800',
  };
  
  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className={`rounded-lg border-2 p-4 flex items-center gap-3 ${typeStyles[type]}`}
    >
      <AlertCircle size={20} className="font-bold" />
      <p className="font-bold text-sm flex-1 tracking-tight">{message}</p>
      {dismissible && (
        <button
          onClick={() => setShow(false)}
          className="text-lg font-bold hover:opacity-70"
        >
          ×
        </button>
      )}
    </motion.div>
  );
};

/**
 * Main Analytics Dashboard Component
 */
const Analytics = ({ 
  onExport = null,
  onFilterChange = null,
  loading = false,
}) => {
  // State
  const [dateRange, setDateRange] = useState('30days');
  const [selectedSegment, setSelectedSegment] = useState('all');
  const [refreshing, setRefreshing] = useState(false);

  // Mock data - Replace with actual context data
  const mockLoans = [
    { id: 1, segment: 'Agriculture', status: 'current', balanceAmount: 500000 },
    { id: 2, segment: 'Small Business', status: 'current', balanceAmount: 750000 },
    { id: 3, segment: 'Personal', status: 'default', balanceAmount: 250000 },
  ];

  const mockBorrowers = [
    { id: 1, status: 'approved' },
    { id: 2, status: 'approved' },
    { id: 3, status: 'declined' },
  ];

  const mockSegments = [
    { segment: 'Agriculture', borrowers: 450, activeLoans: 380 },
    { segment: 'Small Business', borrowers: 320, activeLoans: 270 },
    { segment: 'Personal', borrowers: 280, activeLoans: 220 },
    { segment: 'Education', borrowers: 150, activeLoans: 125 },
  ];

  const mockTransactions = [
    { id: 1, type: 'EMI_PAYMENT', status: 'success', amount: 5000 },
    { id: 2, type: 'EMI_PAYMENT', status: 'success', amount: 7500 },
    { id: 3, type: 'EMI_PAYMENT', status: 'failed', amount: 3000 },
  ];

  // Segment Performance
  const segmentPerformance = useMemo(() => {
    let filteredSegments = mockSegments;
    if (selectedSegment !== 'all') {
      filteredSegments = mockSegments.filter(s => s.segment === selectedSegment);
    }

    return filteredSegments.map(segment => {
      const segmentLoans = mockLoans.filter(l => l.segment === segment.segment);
      const approvedCount = Math.round(segment.borrowers * 0.85);

      return {
        segment: segment.segment,
        applications: segment.borrowers,
        approved: approvedCount,
        disbursed: segment.activeLoans,
        approvalRate: '85.0',
        conversionRate: '70.5',
      };
    });
  }, [selectedSegment]);

  // Monthly Growth
  const monthlyGrowth = [
    { month: 'Jan', disbursements: 245, revenue: 3.2, applications: 50 },
    { month: 'Feb', disbursements: 320, revenue: 4.1, applications: 60 },
    { month: 'Mar', disbursements: 395, revenue: 5.0, applications: 70 },
    { month: 'Apr', disbursements: 470, revenue: 5.9, applications: 80 },
    { month: 'May', disbursements: 545, revenue: 6.8, applications: 90 },
    { month: 'Jun', disbursements: 620, revenue: 7.7, applications: 100 },
  ];

  // Portfolio Distribution
  const portfolioDistribution = [
    { name: 'Agriculture', value: 35 },
    { name: 'Small Business', value: 28 },
    { name: 'Personal', value: 22 },
    { name: 'Education', value: 15 },
  ];

  // KPI Calculations
  const totalPortfolio = mockLoans.reduce((sum, loan) => sum + (loan.balanceAmount || 0), 0);
  const mtdRevenue = mockTransactions
    .filter(t => t.type === 'EMI_PAYMENT' && t.status === 'success')
    .reduce((sum, t) => sum + (t.amount || 0), 0) * 0.35;
  const approvalRate = ((mockBorrowers.filter(b => b.status === 'approved').length / mockBorrowers.length) * 100).toFixed(1);
  const onTimePaymentRate = ((mockLoans.filter(l => l.status === 'current').length / mockLoans.length) * 100).toFixed(1);
  const defaultRate = ((mockLoans.filter(l => l.status === 'default').length / mockLoans.length) * 100).toFixed(1);
  const collectionRate = ((mockTransactions.filter(t => t.status === 'success').length / mockTransactions.length) * 100).toFixed(1);

  // Refresh handler
  const handleRefresh = useCallback(async () => {
    setRefreshing(true);
    await new Promise(resolve => setTimeout(resolve, 1500));
    setRefreshing(false);
  }, []);

  // Export handler
  const handleExport = useCallback(() => {
    const analyticsData = {
      timestamp: new Date().toISOString(),
      dateRange,
      kpis: {
        totalPortfolio,
        activeBorrowers: mockBorrowers.length,
        approvalRate,
        mtdRevenue,
      },
      segmentPerformance,
      monthlyGrowth,
      portfolioDistribution,
      metrics: { onTimePaymentRate, defaultRate, collectionRate },
    };

    if (onExport) onExport(analyticsData);
  }, [dateRange, totalPortfolio, approvalRate, mtdRevenue, segmentPerformance, onTimePaymentRate, defaultRate, collectionRate, onExport]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="max-w-7xl mx-auto space-y-6 p-6"
    >
      {/* Header */}
      <motion.div
        className="flex items-center justify-between flex-wrap gap-4"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div>
          <h1 className="text-5xl font-black text-gray-900 mb-2 tracking-tighter flex items-center gap-3">
            <BarChart3 className="text-blue-600" size={40} />
            Platform Analytics
          </h1>
          <p className="text-gray-800 font-bold">Comprehensive insights into lending operations and business performance</p>
        </div>
        <div className="flex gap-3">
          <Button
            variant="outline"
            onClick={handleRefresh}
            disabled={refreshing}
            className="flex items-center gap-2"
          >
            <RefreshCw size={18} className={refreshing ? 'animate-spin' : ''} />
            {refreshing ? 'Refreshing...' : 'Refresh'}
          </Button>
          <Button
            variant="primary"
            onClick={handleExport}
            className="flex items-center gap-2"
          >
            <Download size={18} />
            Export
          </Button>
        </div>
      </motion.div>

      {/* Filters */}
      <Card className="bg-blue-50 border-blue-300">
        <div className="flex gap-4 flex-wrap items-end">
          <div>
            <label className="block text-xs font-black text-gray-900 mb-2 uppercase tracking-wide">Date Range</label>
            <Select
              value={dateRange}
              onChange={(e) => setDateRange(e.target.value)}
              options={[
                { value: '7days', label: 'Last 7 Days' },
                { value: '30days', label: 'Last 30 Days' },
                { value: '90days', label: 'Last 90 Days' },
                { value: 'ytd', label: 'Year to Date' },
              ]}
            />
          </div>
          <div>
            <label className="block text-xs font-black text-gray-900 mb-2 uppercase tracking-wide">Segment</label>
            <Select
              value={selectedSegment}
              onChange={(e) => setSelectedSegment(e.target.value)}
              options={[
                { value: 'all', label: 'All Segments' },
                ...mockSegments.map(s => ({ value: s.segment, label: s.segment })),
              ]}
            />
          </div>
        </div>
      </Card>

      {/* Data Status Alert */}
      <Alert
        type="info"
        message={`Data: ${mockLoans.length} loans | ${mockBorrowers.length} borrowers | ${mockTransactions.length} transactions | ${mockSegments.length} segments`}
        dismissible={false}
      />

      {/* KPI Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard
          title="Total Portfolio"
          value={formatCurrency(totalPortfolio, true, 0)}
          delta="+12.5%"
          trend="up"
          icon={DollarSign}
        />
        <MetricCard
          title="Active Borrowers"
          value={mockBorrowers.length.toLocaleString()}
          delta="+8.2%"
          trend="up"
          icon={Users}
        />
        <MetricCard
          title="Approval Rate"
          value={`${approvalRate}%`}
          delta="+2.1%"
          trend="up"
          icon={Percent}
        />
        <MetricCard
          title="Revenue (MTD)"
          value={formatCurrency(mtdRevenue, false, 1)}
          delta="+15.3%"
          trend="up"
          icon={TrendingUp}
        />
      </div>

      {/* Performance Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="bg-green-50 border-2 border-green-300 rounded-lg p-6 shadow-sm"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-black text-green-900 uppercase tracking-wide">On-Time Payment Rate</p>
              <p className="text-4xl font-black text-green-900 mt-3 tracking-tighter">{onTimePaymentRate}%</p>
            </div>
            <Award className="text-green-600" size={40} />
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1 }}
          className="bg-blue-50 border-2 border-blue-300 rounded-lg p-6 shadow-sm"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-black text-blue-900 uppercase tracking-wide">Collection Success</p>
              <p className="text-4xl font-black text-blue-900 mt-3 tracking-tighter">{collectionRate}%</p>
            </div>
            <Target className="text-blue-600" size={40} />
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
          className="bg-red-50 border-2 border-red-300 rounded-lg p-6 shadow-sm"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-black text-red-900 uppercase tracking-wide">Default Rate</p>
              <p className="text-4xl font-black text-red-900 mt-3 tracking-tighter">{defaultRate}%</p>
            </div>
            <TrendingDown className="text-red-600" size={40} />
          </div>
        </motion.div>
      </div>

      {/* Segment Analysis Table */}
      <Card title="📋 Detailed Segment Analysis">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-blue-200">
            <thead className="bg-blue-50">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-black text-gray-900 uppercase tracking-wide">Segment</th>
                <th className="px-6 py-4 text-left text-xs font-black text-gray-900 uppercase tracking-wide">Applications</th>
                <th className="px-6 py-4 text-left text-xs font-black text-gray-900 uppercase tracking-wide">Approved</th>
                <th className="px-6 py-4 text-left text-xs font-black text-gray-900 uppercase tracking-wide">Disbursed</th>
                <th className="px-6 py-4 text-left text-xs font-black text-gray-900 uppercase tracking-wide">Approval Rate</th>
                <th className="px-6 py-4 text-left text-xs font-black text-gray-900 uppercase tracking-wide">Conversion</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-blue-200">
              {segmentPerformance.map((segment, idx) => (
                <motion.tr
                  key={idx}
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.05 }}
                  className="hover:bg-blue-50 transition-colors"
                >
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-gray-900">
                    {segment.segment}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-gray-800">
                    {segment.applications}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-gray-800">
                    {segment.approved}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-gray-800">
                    {segment.disbursed}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <Badge variant={parseFloat(segment.approvalRate) >= 80 ? 'success' : 'warning'}>
                      {segment.approvalRate}%
                    </Badge>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <Badge variant={parseFloat(segment.conversionRate) >= 70 ? 'success' : 'warning'}>
                      {segment.conversionRate}%
                    </Badge>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="bg-blue-50 border-blue-300">
          <h4 className="font-black text-blue-900 mb-4 uppercase tracking-tight text-lg">📈 Key Insights</h4>
          <ul className="space-y-3 text-sm font-bold text-blue-900 tracking-tight">
            <li>✓ Portfolio growing steadily with +12.5% monthly increase</li>
            <li>✓ Agriculture segment performing well at 85% approval rate</li>
            <li>✓ Collection efficiency strong at {collectionRate}%</li>
            <li>✓ Default rate well controlled at {defaultRate}%</li>
          </ul>
        </Card>

        <Card className="bg-green-50 border-green-300">
          <h4 className="font-black text-green-900 mb-4 uppercase tracking-tight text-lg">✓ Performance Goals</h4>
          <ul className="space-y-3 text-sm font-bold text-green-900 tracking-tight">
            <li>✓ Portfolio Target: ₹50 Cr (Current: {formatCurrency(totalPortfolio, true, 0)})</li>
            <li>✓ Borrower Base: 50K (Current: {mockBorrowers.length.toLocaleString()})</li>
            <li>✓ On-Time Rate Target: 95% (Current: {onTimePaymentRate}%)</li>
            <li>✓ Default Rate Target: 2% (Current: {defaultRate}%)</li>
          </ul>
        </Card>
      </div>
    </motion.div>
  );
};

export default Analytics;
