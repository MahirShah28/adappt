import React, { useContext, useMemo, useCallback, useState } from 'react';
import { BankingContext } from '../context/Index';
import { Card, Badge, Button } from '../components/common/Index';
import { BarChart, LineChart, PieChart } from '../components/charts/Index';
import { Users, DollarSign, CheckCircle, TrendingDown, TrendingUp, Download, RefreshCw } from 'lucide-react';

// ✅ Import only what exists
import { 
  getAllSegments,
  getAllLoans,
  getAllBorrowers,
  getOverdueLoans,
  getHighRiskLoans
} from '../data/Index';

/**
 * formatCurrency - Local utility function
 */
const formatCurrency = (value, symbol = true, decimals = 0) => {
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
 * Dashboard Component - Professional Enterprise Theme
 */
const Dashboard = () => {
  const banking = useContext(BankingContext);
  const [refreshing, setRefreshing] = useState(false);

  // Fetch data
  const allSegments = getAllSegments();
  const allLoans = getAllLoans();
  const allBorrowers = getAllBorrowers();
  const overdueLoans = getOverdueLoans();
  const highRiskLoans = getHighRiskLoans();

  // Calculate metrics
  const segmentsData = useMemo(() => {
    return allSegments.map(segment => {
      const segmentLoans = allLoans.filter(l => l.segment === segment.segment);
      const defaultCount = segmentLoans.filter(l => l.status === 'default' || l.status === 'overdue').length;
      
      return {
        segment: segment.segment,
        borrowers: segment.borrowers || 0,
        portfolio: segment.portfolioSize || formatCurrency(segmentLoans.reduce((sum, l) => sum + (l.amount || 0), 0), false, 0),
        defaultRate: segmentLoans.length > 0 ? ((defaultCount / segmentLoans.length) * 100).toFixed(1) : 0,
      };
    });
  }, [allSegments, allLoans]);

  const totalPortfolio = useMemo(() => {
    return allLoans.reduce((sum, loan) => sum + (loan.balanceAmount || 0), 0);
  }, [allLoans]);

  const totalBorrowers = useMemo(() => allBorrowers.length, [allBorrowers]);

  const approvalRate = useMemo(() => {
    if (allLoans.length === 0) return 0;
    const approved = allLoans.filter(l => l.status !== 'declined').length;
    return ((approved / allLoans.length) * 100).toFixed(1);
  }, [allLoans]);

  const defaultRate = useMemo(() => {
    if (allLoans.length === 0) return 0;
    const defaultCount = overdueLoans.length + highRiskLoans.length;
    return ((defaultCount / allLoans.length) * 100).toFixed(1);
  }, [allLoans, overdueLoans, highRiskLoans]);

  const monthlyTrends = useMemo(() => [
    { month: 'Jan', loans: 420, approved: 285, disbursed: 270 },
    { month: 'Feb', loans: 485, approved: 335, disbursed: 320 },
    { month: 'Mar', loans: 550, approved: 380, disbursed: 365 },
    { month: 'Apr', loans: 620, approved: 425, disbursed: 410 },
    { month: 'May', loans: 690, approved: 475, disbursed: 455 },
    { month: 'Jun', loans: 750, approved: 520, disbursed: 500 },
  ], []);

  const segmentDistribution = useMemo(() => {
    return segmentsData.slice(0, 4).map(s => ({
      name: s.segment,
      value: s.borrowers,
    }));
  }, [segmentsData]);

  const handleRefresh = useCallback(async () => {
    setRefreshing(true);
    if (banking?.addNotification) {
      banking.addNotification({
        type: 'info',
        message: 'Refreshing dashboard...',
        duration: 2000,
      });
    }
    await new Promise(resolve => setTimeout(resolve, 1500));
    setRefreshing(false);
    if (banking?.addNotification) {
      banking.addNotification({
        type: 'success',
        message: 'Dashboard updated!',
        duration: 2000,
      });
    }
  }, [banking]);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="flex items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
              <p className="text-gray-600 mt-2">Welcome to your lending platform</p>
            </div>
            <div className="flex gap-3">
              <Button
                variant="outline"
                onClick={handleRefresh}
                disabled={refreshing}
                className="flex items-center gap-2"
              >
                <RefreshCw size={18} className={refreshing ? 'animate-spin' : ''} />
                Refresh
              </Button>
              <Button
                variant="primary"
                className="flex items-center gap-2"
              >
                <Download size={18} />
                Export
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-8 space-y-8">
        
        {/* KPI Cards - 4 Column Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Card 1: Total Borrowers */}
          <div className="bg-white rounded-lg border border-gray-200 p-6 hover:border-gray-300 transition-colors">
            <div className="flex items-start justify-between mb-4">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Borrowers</p>
                <h3 className="text-2xl font-bold text-gray-900 mt-2">
                  {totalBorrowers.toLocaleString()}
                </h3>
              </div>
              <div className="p-2 bg-blue-100 rounded-lg">
                <Users className="text-blue-600" size={24} />
              </div>
            </div>
            <div className="flex items-center gap-2">
              <TrendingUp size={16} className="text-green-600" />
              <span className="text-sm font-medium text-green-600">+15% this month</span>
            </div>
          </div>

          {/* Card 2: Total Portfolio */}
          <div className="bg-white rounded-lg border border-gray-200 p-6 hover:border-gray-300 transition-colors">
            <div className="flex items-start justify-between mb-4">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Portfolio</p>
                <h3 className="text-2xl font-bold text-gray-900 mt-2">
                  {formatCurrency(totalPortfolio, true, 0)}
                </h3>
              </div>
              <div className="p-2 bg-green-100 rounded-lg">
                <DollarSign className="text-green-600" size={24} />
              </div>
            </div>
            <div className="flex items-center gap-2">
              <TrendingUp size={16} className="text-green-600" />
              <span className="text-sm font-medium text-green-600">+8.2% this month</span>
            </div>
          </div>

          {/* Card 3: Approval Rate */}
          <div className="bg-white rounded-lg border border-gray-200 p-6 hover:border-gray-300 transition-colors">
            <div className="flex items-start justify-between mb-4">
              <div>
                <p className="text-sm font-medium text-gray-600">Approval Rate</p>
                <h3 className="text-2xl font-bold text-gray-900 mt-2">{approvalRate}%</h3>
              </div>
              <div className="p-2 bg-purple-100 rounded-lg">
                <CheckCircle className="text-purple-600" size={24} />
              </div>
            </div>
            <div className="flex items-center gap-2">
              <TrendingUp size={16} className="text-green-600" />
              <span className="text-sm font-medium text-green-600">+2.1% improvement</span>
            </div>
          </div>

          {/* Card 4: Default Rate */}
          <div className="bg-white rounded-lg border border-gray-200 p-6 hover:border-gray-300 transition-colors">
            <div className="flex items-start justify-between mb-4">
              <div>
                <p className="text-sm font-medium text-gray-600">Default Rate</p>
                <h3 className="text-2xl font-bold text-gray-900 mt-2">{defaultRate}%</h3>
              </div>
              <div className="p-2 bg-orange-100 rounded-lg">
                <TrendingDown className="text-orange-600" size={24} />
              </div>
            </div>
            <div className="flex items-center gap-2">
              <TrendingDown size={16} className="text-green-600" />
              <span className="text-sm font-medium text-green-600">-0.5% improvement</span>
            </div>
          </div>
        </div>

        {/* Charts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Line Chart */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h2 className="text-lg font-bold text-gray-900 mb-6">Monthly Trends</h2>
            <LineChart
              data={monthlyTrends}
              dataKeys={['loans', 'approved', 'disbursed']}
              xAxisKey="month"
              height={300}
            />
          </div>

          {/* Bar Chart */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h2 className="text-lg font-bold text-gray-900 mb-6">Borrowers by Segment</h2>
            <BarChart
              data={segmentDistribution}
              dataKeys={['value']}
              xAxisKey="name"
              height={300}
            />
          </div>
        </div>

        {/* Table */}
        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-bold text-gray-900">Segment Performance</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Segment</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Active Borrowers</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Portfolio Size</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Default Rate</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {segmentsData.map((segment, idx) => (
                  <tr key={idx} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 text-sm font-medium text-gray-900">
                      {segment.segment}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      <Badge variant="info" size="sm">
                        {segment.borrowers.toLocaleString()}
                      </Badge>
                    </td>
                    <td className="px-6 py-4 text-sm font-medium text-gray-900">
                      {typeof segment.portfolio === 'number' 
                        ? formatCurrency(segment.portfolio, false, 0) 
                        : segment.portfolio}
                    </td>
                    <td className="px-6 py-4 text-sm">
                      <Badge 
                        variant={segment.defaultRate < 2.5 ? 'success' : segment.defaultRate < 5 ? 'warning' : 'danger'}
                        size="sm"
                      >
                        {segment.defaultRate}%
                      </Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Key Insights */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Insight 1 */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h3 className="font-bold text-gray-900 mb-4">Portfolio Insights</h3>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Total Portfolio</span>
                <span className="font-semibold text-gray-900">{formatCurrency(totalPortfolio, true, 0)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Average Loan</span>
                <span className="font-semibold text-gray-900">
                  {formatCurrency(totalPortfolio / allLoans.length, true, 0)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Active Loans</span>
                <span className="font-semibold text-gray-900">{allLoans.length}</span>
              </div>
            </div>
          </div>

          {/* Insight 2 */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h3 className="font-bold text-gray-900 mb-4">Performance</h3>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Approval Rate</span>
                <span className="font-semibold text-gray-900">{approvalRate}%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Total Borrowers</span>
                <span className="font-semibold text-gray-900">{totalBorrowers.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Monthly Growth</span>
                <span className="font-semibold text-green-600">+12%</span>
              </div>
            </div>
          </div>

          {/* Insight 3 */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h3 className="font-bold text-gray-900 mb-4">Risk Management</h3>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Default Rate</span>
                <span className="font-semibold text-gray-900">{defaultRate}%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">High Risk Loans</span>
                <span className="font-semibold text-orange-600">{highRiskLoans.length}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Overdue Loans</span>
                <span className="font-semibold text-red-600">{overdueLoans.length}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
