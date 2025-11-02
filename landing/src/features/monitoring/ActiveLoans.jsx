import React, { useContext, useState, useMemo, useCallback } from 'react';
import { BankingContext } from '../../context/Index'; // ✅ Added
import { Card, Badge, Button, Input, Alert } from '../../components/common/Index'; // ✅ Updated
import { Eye, Download, Filter, TrendingUp, AlertCircle, CheckCircle, BarChart3, TrendingDown } from 'lucide-react'; // ✅ Added

/**
 * ActiveLoans Component
 * Monitor and manage active loan portfolio
 * 
 * @param {function} onLoanClick - Loan click callback
 * @param {array} customLoans - Custom loan data
 * @param {boolean} loading - Is data loading
 * @param {function} onExport - Export callback
 * @param {function} onFilterChange - Filter change callback
 */
const ActiveLoans = ({ 
  onLoanClick = null, // ✅ Added
  customLoans = null, // ✅ Added
  loading = false, // ✅ Added
  onExport = null, // ✅ Added
  onFilterChange = null, // ✅ Added
}) => {
  // ✅ Get context
  const banking = useContext(BankingContext);

  // ✅ State management
  const [filterStatus, setFilterStatus] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('id'); // ✅ Added
  const [sortOrder, setSortOrder] = useState('asc'); // ✅ Added
  const [selectedLoans, setSelectedLoans] = useState([]); // ✅ Added

  // ✅ Default active loans
  const defaultActiveLoans = [
    {
      id: 'L001',
      borrowerName: 'Ramesh Kumar',
      amount: 50000,
      emi: 4500,
      rateOfInterest: 12.5,
      tenure: 12,
      startDate: '2025-06-15',
      endDate: '2026-06-15',
      paidEMIs: 6,
      totalEMIs: 12,
      nextDueDate: '2025-11-15',
      status: 'current',
      daysOverdue: 0,
      disbursedAmount: 50000,
      principalPaid: 24500,
      interestPaid: 3200,
      balanceAmount: 25500,
      riskLevel: 'low',
      createdAt: '2025-06-15',
    },
    {
      id: 'L002',
      borrowerName: 'Priya Sharma',
      amount: 75000,
      emi: 6800,
      rateOfInterest: 13.5,
      tenure: 12,
      startDate: '2025-04-20',
      endDate: '2026-04-20',
      paidEMIs: 8,
      totalEMIs: 12,
      nextDueDate: '2025-11-10',
      status: 'overdue',
      daysOverdue: 12,
      disbursedAmount: 75000,
      principalPaid: 35000,
      interestPaid: 4200,
      balanceAmount: 40000,
      riskLevel: 'medium',
      createdAt: '2025-04-20',
    },
    {
      id: 'L003',
      borrowerName: 'Arjun Patel',
      amount: 100000,
      emi: 9200,
      rateOfInterest: 12.0,
      tenure: 18,
      startDate: '2025-03-10',
      endDate: '2026-09-10',
      paidEMIs: 3,
      totalEMIs: 18,
      nextDueDate: '2025-11-20',
      status: 'current',
      daysOverdue: 0,
      disbursedAmount: 100000,
      principalPaid: 24000,
      interestPaid: 4800,
      balanceAmount: 76000,
      riskLevel: 'low',
      createdAt: '2025-03-10',
    },
    {
      id: 'L004',
      borrowerName: 'Deepa Singh',
      amount: 60000,
      emi: 5600,
      rateOfInterest: 14.0,
      tenure: 12,
      startDate: '2025-02-15',
      endDate: '2026-02-15',
      paidEMIs: 10,
      totalEMIs: 12,
      nextDueDate: '2025-11-05',
      status: 'default',
      daysOverdue: 45,
      disbursedAmount: 60000,
      principalPaid: 45000,
      interestPaid: 5400,
      balanceAmount: 15000,
      riskLevel: 'high',
      createdAt: '2025-02-15',
    },
  ];

  const activeLoans = customLoans || defaultActiveLoans;

  // ✅ Filter loans
  const filteredLoans = useMemo(() => {
    let result = activeLoans.filter(loan => {
      if (filterStatus !== 'all' && loan.status !== filterStatus) return false;
      if (searchTerm && !loan.borrowerName.toLowerCase().includes(searchTerm.toLowerCase())) return false;
      return true;
    });

    // ✅ Sort loans
    result.sort((a, b) => {
      let aVal = a[sortBy];
      let bVal = b[sortBy];

      if (typeof aVal === 'string') {
        aVal = aVal.toLowerCase();
        bVal = bVal.toLowerCase();
      }

      if (sortOrder === 'asc') {
        return aVal > bVal ? 1 : -1;
      } else {
        return aVal < bVal ? 1 : -1;
      }
    });

    return result;
  }, [activeLoans, filterStatus, searchTerm, sortBy, sortOrder]);

  // ✅ Calculate portfolio metrics
  const portfolioMetrics = useMemo(() => {
    const currentLoans = activeLoans.filter(l => l.status === 'current');
    const overdueLoans = activeLoans.filter(l => l.status === 'overdue');
    const defaultedLoans = activeLoans.filter(l => l.status === 'default');

    const totalPortfolio = activeLoans.reduce((sum, loan) => sum + loan.balanceAmount, 0);
    const portfolioAtRisk = overdueLoans.reduce((sum, loan) => sum + loan.balanceAmount, 0) +
                           defaultedLoans.reduce((sum, loan) => sum + loan.balanceAmount, 0);
    
    const totalCollected = activeLoans.reduce((sum, loan) => sum + (loan.principalPaid + loan.interestPaid), 0);
    const totalDisbursed = activeLoans.reduce((sum, loan) => sum + loan.disbursedAmount, 0);
    
    const collectionEfficiency = totalDisbursed > 0 ? (totalCollected / totalDisbursed) * 100 : 0;
    const defaultRate = activeLoans.length > 0 ? (defaultedLoans.length / activeLoans.length) * 100 : 0;

    return {
      current: currentLoans.length,
      overdue: overdueLoans.length,
      default: defaultedLoans.length,
      total: activeLoans.length,
      totalPortfolio,
      portfolioAtRisk,
      totalCollected,
      totalDisbursed,
      collectionEfficiency: Math.round(collectionEfficiency),
      defaultRate: Math.round(defaultRate),
    };
  }, [activeLoans]);

  // ✅ Handle filter status change
  const handleFilterStatusChange = useCallback((status) => {
    setFilterStatus(status);
    if (onFilterChange) {
      onFilterChange({ status });
    }
    if (banking?.updatePortfolioFilter) {
      banking.updatePortfolioFilter({ status });
    }
  }, [onFilterChange, banking]);

  // ✅ Handle search
  const handleSearch = useCallback((e) => {
    setSearchTerm(e.target.value);
    if (onFilterChange) {
      onFilterChange({ search: e.target.value });
    }
  }, [onFilterChange]);

  // ✅ Handle loan click
  const handleLoanClick = useCallback((loan) => {
    if (onLoanClick) {
      onLoanClick(loan);
    } else if (banking?.selectLoan) {
      banking.selectLoan(loan);
    }
  }, [onLoanClick, banking]);

  // ✅ Handle export
  const handleExport = useCallback(() => {
    const exportData = {
      loans: filteredLoans,
      metrics: portfolioMetrics,
      filters: { status: filterStatus, search: searchTerm },
      exportedAt: new Date().toISOString(),
    };

    if (onExport) {
      onExport(exportData);
    } else if (banking?.exportPortfolioData) {
      banking.exportPortfolioData(exportData);
    }

    if (banking?.addNotification) {
      banking.addNotification({
        type: 'success',
        message: 'Portfolio data exported successfully!',
        duration: 2000,
      });
    }
  }, [filteredLoans, portfolioMetrics, filterStatus, searchTerm, onExport, banking]);

  // ✅ Get status badge
  const getStatusBadge = useCallback((status, daysOverdue) => {
    switch (status) {
      case 'current':
        return <Badge variant="success">✓ Current</Badge>;
      case 'overdue':
        return <Badge variant="warning">⚠️ {daysOverdue} Days</Badge>;
      case 'default':
        return <Badge variant="danger">✗ Default</Badge>;
      default:
        return <Badge variant="default">Unknown</Badge>;
    }
  }, []);

  // ✅ Get risk badge
  const getRiskBadge = useCallback((riskLevel) => {
    switch (riskLevel) {
      case 'low':
        return <Badge variant="success" size="sm">✓ Low Risk</Badge>;
      case 'medium':
        return <Badge variant="warning" size="sm">⚠️ Medium Risk</Badge>;
      case 'high':
        return <Badge variant="danger" size="sm">✗ High Risk</Badge>;
      default:
        return <Badge variant="default" size="sm">Unknown</Badge>;
    }
  }, []);

  // ✅ Calculate loan progress
  const getLoanProgress = useCallback((paidEMIs, totalEMIs) => {
    return (paidEMIs / totalEMIs) * 100;
  }, []);

  // ✅ Get health score
  const getPortfolioHealthScore = useCallback(() => {
    let score = 100;
    
    // Deduct for defaults
    score -= portfolioMetrics.defaultRate * 2;
    
    // Deduct for overdue
    score -= (portfolioMetrics.overdue / portfolioMetrics.total) * 10;
    
    return Math.max(0, Math.round(score));
  }, [portfolioMetrics]);

  const healthScore = getPortfolioHealthScore();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h3 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
            <TrendingUp className="text-blue-600" size={28} />
            Active Loans
          </h3>
          <p className="text-gray-600 mt-1">Monitor all active loans and borrower performance</p>
        </div>
        <Button
          variant="outline"
          onClick={handleExport}
          className="flex items-center gap-2"
        >
          <Download size={18} />
          Export
        </Button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {/* Active Loans Card */}
        <Card className="bg-blue-50 border-l-4 border-blue-500">
          <div className="text-center">
            <p className="text-sm text-blue-700 mb-1">Active Loans</p>
            <p className="text-3xl font-bold text-blue-900">{portfolioMetrics.total}</p>
            <p className="text-xs text-blue-600 mt-1">₹{portfolioMetrics.totalPortfolio.toLocaleString()} Portfolio</p>
          </div>
        </Card>

        {/* Current Card */}
        <Card className="bg-green-50 border-l-4 border-green-500">
          <div className="text-center">
            <p className="text-sm text-green-700 mb-1">Current</p>
            <p className="text-3xl font-bold text-green-900">{portfolioMetrics.current}</p>
            <p className="text-xs text-green-600 mt-1">
              {portfolioMetrics.total > 0 ? `${Math.round((portfolioMetrics.current / portfolioMetrics.total) * 100)}% of total` : 'N/A'}
            </p>
          </div>
        </Card>

        {/* Overdue Card */}
        <Card className="bg-yellow-50 border-l-4 border-yellow-500">
          <div className="text-center">
            <p className="text-sm text-yellow-700 mb-1">Overdue</p>
            <p className="text-3xl font-bold text-yellow-900">{portfolioMetrics.overdue}</p>
            <p className="text-xs text-yellow-600 mt-1">Action Required</p>
          </div>
        </Card>

        {/* Default Card */}
        <Card className="bg-red-50 border-l-4 border-red-500">
          <div className="text-center">
            <p className="text-sm text-red-700 mb-1">Default</p>
            <p className="text-3xl font-bold text-red-900">{portfolioMetrics.default}</p>
            <p className="text-xs text-red-600 mt-1">₹{portfolioMetrics.portfolioAtRisk.toLocaleString()} at Risk</p>
          </div>
        </Card>
      </div>

      {/* ✅ Portfolio Health & Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Health Score */}
        <Card className="bg-gradient-to-br from-purple-50 to-blue-50 border border-purple-200">
          <div className="text-center">
            <p className="text-xs text-purple-700 font-semibold mb-2">Portfolio Health Score</p>
            <div className="relative inline-block">
              <div className="w-20 h-20 rounded-full bg-white flex items-center justify-center border-4 border-purple-300">
                <p className={`text-2xl font-bold ${healthScore >= 70 ? 'text-green-600' : healthScore >= 50 ? 'text-yellow-600' : 'text-red-600'}`}>
                  {healthScore}
                </p>
              </div>
            </div>
            <Badge 
              variant={healthScore >= 70 ? 'success' : healthScore >= 50 ? 'warning' : 'danger'}
              size="sm"
              className="mt-2"
            >
              {healthScore >= 70 ? 'Healthy' : healthScore >= 50 ? 'Fair' : 'Poor'}
            </Badge>
          </div>
        </Card>

        {/* Collection Efficiency */}
        <Card className="bg-green-50 border border-green-200">
          <div className="text-center">
            <p className="text-xs text-green-700 font-semibold mb-1">Collection Efficiency</p>
            <p className="text-3xl font-bold text-green-900">{portfolioMetrics.collectionEfficiency}%</p>
            <p className="text-xs text-green-600 mt-1">₹{portfolioMetrics.totalCollected.toLocaleString()} collected</p>
          </div>
        </Card>

        {/* Default Rate */}
        <Card className="bg-orange-50 border border-orange-200">
          <div className="text-center">
            <p className="text-xs text-orange-700 font-semibold mb-1">Default Rate</p>
            <p className="text-3xl font-bold text-orange-900">{portfolioMetrics.defaultRate}%</p>
            <p className="text-xs text-orange-600 mt-1">{portfolioMetrics.default} loans defaulted</p>
          </div>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <Input
              placeholder="Search by borrower name..."
              value={searchTerm}
              onChange={handleSearch}
              icon={<Filter size={16} />}
            />
          </div>
          <div className="flex gap-2 flex-wrap">
            {['all', 'current', 'overdue', 'default'].map((status) => (
              <Button
                key={status}
                variant={filterStatus === status ? 'primary' : 'outline'}
                onClick={() => handleFilterStatusChange(status)}
                size="sm"
              >
                {status.charAt(0).toUpperCase() + status.slice(1)} ({
                  status === 'all' ? portfolioMetrics.total :
                  status === 'current' ? portfolioMetrics.current :
                  status === 'overdue' ? portfolioMetrics.overdue :
                  portfolioMetrics.default
                })
              </Button>
            ))}
          </div>
        </div>
      </Card>

      {/* Loans Table */}
      <Card title="📋 Loan Details">
        {loading ? (
          <div className="text-center py-8">
            <div className="inline-block animate-spin">
              <BarChart3 size={32} className="text-blue-600" />
            </div>
            <p className="text-gray-600 mt-2">Loading loans...</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase cursor-pointer hover:bg-gray-100"
                      onClick={() => setSortBy('id')}>
                    Loan ID
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase cursor-pointer hover:bg-gray-100"
                      onClick={() => setSortBy('borrowerName')}>
                    Borrower
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase cursor-pointer hover:bg-gray-100"
                      onClick={() => setSortBy('amount')}>
                    Loan Amount
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">EMI / Rate</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Progress</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase cursor-pointer hover:bg-gray-100"
                      onClick={() => setSortBy('balanceAmount')}>
                    Balance
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Risk</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Action</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredLoans.map((loan) => (
                  <tr key={loan.id} className="hover:bg-gray-50 transition-colors cursor-pointer"
                      onClick={() => handleLoanClick(loan)}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-gray-900">
                      {loan.id}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      {loan.borrowerName}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      ₹{loan.amount.toLocaleString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      <div>₹{loan.emi.toLocaleString()}</div>
                      <div className="text-xs text-gray-500">{loan.rateOfInterest}% p.a.</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      <div className="text-sm font-medium">{loan.paidEMIs}/{loan.totalEMIs}</div>
                      <div className="w-24 bg-gray-200 rounded-full h-2 mt-1">
                        <div
                          className="bg-blue-600 h-2 rounded-full transition-all"
                          style={{ width: `${getLoanProgress(loan.paidEMIs, loan.totalEMIs)}%` }}
                        />
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900">
                      ₹{loan.balanceAmount.toLocaleString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      {getStatusBadge(loan.status, loan.daysOverdue)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      {getRiskBadge(loan.riskLevel)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm" onClick={(e) => e.stopPropagation()}>
                      <Button variant="outline" size="sm">
                        <Eye size={16} />
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>

      {/* Empty State */}
      {!loading && filteredLoans.length === 0 && (
        <Card className="text-center py-12">
          <AlertCircle className="text-gray-400 mx-auto mb-4" size={64} />
          <h4 className="text-lg font-semibold text-gray-600 mb-2">No Loans Found</h4>
          <p className="text-gray-500">Try adjusting your filters or search criteria</p>
        </Card>
      )}

      {/* ✅ Portfolio Summary */}
      {filteredLoans.length > 0 && (
        <Card className="bg-gradient-to-r from-gray-50 to-blue-50 border border-gray-200">
          <h4 className="font-semibold text-gray-800 mb-3">📊 Portfolio Summary</h4>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
            <div>
              <p className="text-gray-600">Total Disbursed</p>
              <p className="text-lg font-bold text-gray-900">₹{portfolioMetrics.totalDisbursed.toLocaleString()}</p>
            </div>
            <div>
              <p className="text-gray-600">Total Collected</p>
              <p className="text-lg font-bold text-green-600">₹{portfolioMetrics.totalCollected.toLocaleString()}</p>
            </div>
            <div>
              <p className="text-gray-600">Outstanding</p>
              <p className="text-lg font-bold text-blue-600">₹{portfolioMetrics.totalPortfolio.toLocaleString()}</p>
            </div>
            <div>
              <p className="text-gray-600">At Risk</p>
              <p className="text-lg font-bold text-red-600">₹{portfolioMetrics.portfolioAtRisk.toLocaleString()}</p>
            </div>
          </div>
        </Card>
      )}
    </div>
  );
};

export default ActiveLoans;
