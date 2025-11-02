import React, { useContext, useMemo, useState, useCallback } from 'react';
import { BankingContext } from '../context/Index';
import { Card, Badge, StatusBox, Button, Alert } from '../components/common/Index';
import { LineChart, BarChart } from '../components/charts/Index';
import { AlertCircle, CheckCircle, Clock, TrendingUp, Download, RefreshCw, Eye } from 'lucide-react';

// Import data functions
import {
  getAllLoans,
  getAllBorrowers,
  getOverdueLoans,
  getHighRiskLoans,
  getAllTransactions,
} from '../data/Index';

/**
 * Monitoring Component
 * Real-time loan monitoring and repayment tracking
 */
const Monitoring = () => {
  const banking = useContext(BankingContext);

  // State management
  const [refreshing, setRefreshing] = useState(false);
  const [selectedLoan, setSelectedLoan] = useState(null);

  // Fetch data
  const loans = useMemo(() => getAllLoans(), []);
  const borrowers = useMemo(() => getAllBorrowers(), []);
  const overdueLoans = useMemo(() => getOverdueLoans(), []);
  const highRiskLoans = useMemo(() => getHighRiskLoans(), []);
  const transactions = useMemo(() => getAllTransactions(), []);

  /**
   * Calculate monitoring metrics
   */
  const monitoringMetrics = useMemo(() => {
    const activeLoans = loans.filter(l => l.status === 'current').length;
    const currentEmis = loans.filter(l => l.status === 'current').length;
    const overdue = overdueLoans.length;
    const defaulted = highRiskLoans.length;

    // Calculate collection rate
    const successfulPayments = transactions.filter(
      t => t.type === 'EMI_PAYMENT' && t.status === 'success'
    ).length;
    const totalPayments = transactions.filter(t => t.type === 'EMI_PAYMENT').length;
    const collectionRate = totalPayments > 0 ? ((successfulPayments / totalPayments) * 100).toFixed(1) : 0;

    // Calculate total portfolio
    const totalAmount = loans.reduce((sum, l) => sum + (l.amount || 0), 0);
    const outstanding = loans.reduce((sum, l) => sum + (l.balanceAmount || 0), 0);

    return {
      activeLoans,
      currentEmis,
      overdue,
      defaulted,
      collectionRate,
      totalAmount,
      outstanding,
      healthScore: Math.round(100 - ((overdue + defaulted) / activeLoans * 100)),
    };
  }, [loans, overdueLoans, highRiskLoans, transactions]);

  /**
   * Prepare active loans data
   */
  const activeLoansData = useMemo(() => {
    return loans.slice(0, 10).map(loan => {
      const borrower = borrowers.find(b => b.id === loan.borrowerId);
      const progress = loan.paidEMIs ? (loan.paidEMIs / (loan.paidEMIs + 5)) * 100 : 0;

      return {
        id: loan.id,
        borrower: borrower?.name || 'Unknown',
        amount: loan.amount || 0,
        emi: loan.emi || 0,
        progress: Math.round(progress),
        paidEmis: loan.paidEMIs || 0,
        totalEmis: (loan.paidEMIs || 0) + 5,
        nextDue: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toLocaleDateString(),
        status: loan.status || 'current',
        daysOverdue: loan.status === 'overdue' ? Math.floor(Math.random() * 30) : 0,
      };
    });
  }, [loans, borrowers]);

  /**
   * Generate alert messages
   */
  const alerts = useMemo(() => {
    const alertList = [];

    // Overdue alert
    if (overdueLoans.length > 0) {
      alertList.push({
        type: 'warning',
        message: `${overdueLoans.length} borrowers have overdue payments (>15 days)`,
        time: '2 hours ago',
        icon: AlertCircle,
      });
    }

    // Daily collection
    const dailyCollections = transactions
      .filter(t => t.type === 'EMI_PAYMENT' && t.status === 'success')
      .reduce((sum, t) => sum + (t.amount || 0), 0);

    if (dailyCollections > 0) {
      alertList.push({
        type: 'info',
        message: `${transactions.filter(t => t.type === 'EMI_PAYMENT' && t.status === 'success').length} EMI payments received today (₹${(dailyCollections / 100000).toFixed(1)}L)`,
        time: '5 hours ago',
        icon: CheckCircle,
      });
    }

    // Collection rate
    alertList.push({
      type: 'success',
      message: `Monthly collection rate: ${monitoringMetrics.collectionRate}%`,
      time: 'Today',
      icon: TrendingUp,
    });

    // High risk alert
    if (highRiskLoans.length > 0) {
      alertList.push({
        type: 'warning',
        message: `${highRiskLoans.length} high-risk loans detected. Review recommended.`,
        time: '1 hour ago',
        icon: AlertCircle,
      });
    }

    return alertList;
  }, [overdueLoans, highRiskLoans, transactions, monitoringMetrics]);

  /**
   * Prepare repayment trend data
   */
  const repaymentTrend = useMemo(() => {
    return [
      { month: 'Jun', onTime: 95, late: 3, default: 2 },
      { month: 'Jul', onTime: 96, late: 2, default: 2 },
      { month: 'Aug', onTime: 94, late: 4, default: 2 },
      { month: 'Sep', onTime: 97, late: 2, default: 1 },
      { month: 'Oct', onTime: 96, late: 3, default: 1 },
      { month: 'Nov', onTime: Math.round(monitoringMetrics.collectionRate), late: 1, default: 1 },
    ];
  }, [monitoringMetrics.collectionRate]);

  /**
   * Segment-wise distribution
   */
  const segmentDistribution = useMemo(() => {
    const distribution = {};
    loans.forEach(loan => {
      const segment = loan.segment || 'Other';
      if (!distribution[segment]) {
        distribution[segment] = 0;
      }
      distribution[segment]++;
    });

    return Object.entries(distribution)
      .map(([name, count]) => ({
        name,
        value: count,
      }))
      .slice(0, 6);
  }, [loans]);

  /**
   * Handle refresh
   */
  const handleRefresh = useCallback(async () => {
    setRefreshing(true);
    
    if (banking?.addNotification) {
      banking.addNotification({
        type: 'info',
        message: 'Refreshing monitoring data...',
        duration: 2000,
      });
    }

    await new Promise(resolve => setTimeout(resolve, 1500));
    setRefreshing(false);

    if (banking?.addNotification) {
      banking.addNotification({
        type: 'success',
        message: 'Monitoring data updated!',
        duration: 2000,
      });
    }
  }, [banking]);

  /**
   * Handle export
   */
  const handleExport = useCallback(() => {
    const reportData = {
      timestamp: new Date().toISOString(),
      metrics: monitoringMetrics,
      activeLoans: activeLoansData,
      alerts: alerts.length,
      collectionRate: monitoringMetrics.collectionRate,
    };

    const dataStr = JSON.stringify(reportData, null, 2);
    const element = document.createElement('a');
    element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(dataStr));
    element.setAttribute('download', `monitoring_report_${Date.now()}.json`);
    element.style.display = 'none';
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);

    if (banking?.addNotification) {
      banking.addNotification({
        type: 'success',
        message: 'Report exported successfully!',
        duration: 2000,
      });
    }
  }, [monitoringMetrics, activeLoansData, alerts, banking]);

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h2 className="text-3xl font-bold text-gray-800 mb-2 flex items-center gap-2">
            <Eye className="text-blue-600" size={32} />
            📊 Loan Monitoring Dashboard
          </h2>
          <p className="text-gray-600">Real-time loan monitoring, repayments, and risk alerts</p>
        </div>
        <div className="flex gap-2">
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
            variant="outline"
            onClick={handleExport}
            className="flex items-center gap-2"
          >
            <Download size={18} />
            Export
          </Button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        <Card className="bg-blue-50 border border-blue-200">
          <div className="text-center">
            <p className="text-sm text-blue-700 font-semibold">Active Loans</p>
            <p className="text-3xl font-bold text-blue-900">{monitoringMetrics.activeLoans}</p>
            <p className="text-xs text-blue-600 mt-1">Total portfolio</p>
          </div>
        </Card>

        <Card className="bg-green-50 border border-green-200">
          <div className="text-center">
            <p className="text-sm text-green-700 font-semibold">Current EMIs</p>
            <p className="text-3xl font-bold text-green-900">{monitoringMetrics.currentEmis}</p>
            <p className="text-xs text-green-600 mt-1">On schedule</p>
          </div>
        </Card>

        <Card className="bg-red-50 border border-red-200">
          <div className="text-center">
            <p className="text-sm text-red-700 font-semibold">Overdue</p>
            <p className="text-3xl font-bold text-red-900">{monitoringMetrics.overdue}</p>
            <p className="text-xs text-red-600 mt-1">Needs action</p>
          </div>
        </Card>

        <Card className="bg-yellow-50 border border-yellow-200">
          <div className="text-center">
            <p className="text-sm text-yellow-700 font-semibold">High Risk</p>
            <p className="text-3xl font-bold text-yellow-900">{monitoringMetrics.defaulted}</p>
            <p className="text-xs text-yellow-600 mt-1">Default risk</p>
          </div>
        </Card>

        <Card className="bg-purple-50 border border-purple-200">
          <div className="text-center">
            <p className="text-sm text-purple-700 font-semibold">Collection Rate</p>
            <p className="text-3xl font-bold text-purple-900">{monitoringMetrics.collectionRate}%</p>
            <p className="text-xs text-purple-600 mt-1">Excellent</p>
          </div>
        </Card>
      </div>

      {/* Health Score & Outstanding */}
      <Card className="bg-gradient-to-r from-green-50 to-blue-50 border border-green-200">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <p className="text-sm text-gray-600 mb-2">Portfolio Health Score</p>
            <div className="flex items-center gap-4">
              <div className="text-4xl font-bold text-green-600">{monitoringMetrics.healthScore}</div>
              <div className="text-xs text-gray-600">
                <p>Status: Excellent</p>
                <p>Risk Level: Low</p>
              </div>
            </div>
          </div>
          <div>
            <p className="text-sm text-gray-600 mb-2">Total Disbursed</p>
            <p className="text-2xl font-bold text-gray-800">
              ₹{(monitoringMetrics.totalAmount / 100000).toFixed(1)}L
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-600 mb-2">Outstanding Amount</p>
            <p className="text-2xl font-bold text-gray-800">
              ₹{(monitoringMetrics.outstanding / 100000).toFixed(1)}L
            </p>
          </div>
        </div>
      </Card>

      {/* Alerts */}
      <Card title="🔔 Recent Alerts & Updates">
        <div className="space-y-3">
          {alerts.length > 0 ? (
            alerts.map((alert, index) => {
              const Icon = alert.icon;
              return (
                <div key={index} className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                  <Icon
                    className={
                      alert.type === 'warning' ? 'text-yellow-600' :
                      alert.type === 'success' ? 'text-green-600' :
                      'text-blue-600'
                    }
                    size={20}
                  />
                  <div className="flex-1">
                    <p className="text-sm text-gray-800 font-medium">{alert.message}</p>
                    <p className="text-xs text-gray-500 mt-1">{alert.time}</p>
                  </div>
                  <Badge 
                    variant={
                      alert.type === 'warning' ? 'warning' :
                      alert.type === 'success' ? 'success' :
                      'info'
                    }
                    size="sm"
                  >
                    {alert.type}
                  </Badge>
                </div>
              );
            })
          ) : (
            <p className="text-gray-600 text-center py-4">No alerts at this time</p>
          )}
        </div>
      </Card>

      {/* Active Loans Table */}
      <Card title="📋 Active Loans - Detailed View">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Loan ID</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Borrower</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Amount</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">EMI</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Progress</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Next Due</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {activeLoansData.map((loan) => (
                <tr key={loan.id} className="hover:bg-gray-50 transition-colors cursor-pointer">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {loan.id}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                    {loan.borrower}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                    ₹{loan.amount.toLocaleString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                    ₹{loan.emi.toLocaleString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <div className="flex items-center gap-2">
                      <div className="w-20 bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-green-600 h-2 rounded-full"
                          style={{ width: `${loan.progress}%` }}
                        />
                      </div>
                      <span className="text-xs font-semibold">{loan.paidEmis}/{loan.totalEmis}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                    {loan.nextDue}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <Badge 
                      variant={loan.status === 'current' ? 'success' : loan.status === 'overdue' ? 'warning' : 'danger'}
                    >
                      {loan.status === 'current' ? 'Current' : loan.status === 'overdue' ? 'Overdue' : 'Default'}
                    </Badge>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card title="📈 Repayment Trends (Last 6 Months)">
          <LineChart
            data={repaymentTrend}
            dataKeys={['onTime', 'late', 'default']}
            xAxisKey="month"
            height={300}
            colors={['#10b981', '#f59e0b', '#ef4444']}
          />
        </Card>

        <Card title="📊 Loans by Segment">
          <BarChart
            data={segmentDistribution}
            dataKeys={['value']}
            xAxisKey="name"
            title="Segment Distribution"
            height={300}
          />
        </Card>
      </div>

      {/* Portfolio Summary */}
      <Card title="📋 Portfolio Summary">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-sm">
          <div className="p-4 bg-blue-50 rounded-lg">
            <p className="text-gray-600 font-semibold">Total Active Loans</p>
            <p className="text-3xl font-bold text-blue-600 mt-2">{monitoringMetrics.activeLoans}</p>
          </div>
          <div className="p-4 bg-green-50 rounded-lg">
            <p className="text-gray-600 font-semibold">Total Outstanding</p>
            <p className="text-3xl font-bold text-green-600 mt-2">₹{(monitoringMetrics.outstanding / 100000).toFixed(1)}L</p>
          </div>
          <div className="p-4 bg-purple-50 rounded-lg">
            <p className="text-gray-600 font-semibold">Average Loan Size</p>
            <p className="text-3xl font-bold text-purple-600 mt-2">
              ₹{Math.round(monitoringMetrics.totalAmount / monitoringMetrics.activeLoans).toLocaleString()}
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default Monitoring;
