import React, { useContext, useState, useMemo, useCallback } from 'react';
import { BankingContext } from '../../context/Index'; // ✅ Added
import { Card, Badge, Button, Alert } from '../../components/common/Index'; // ✅ Updated
import { AlertCircle, AlertTriangle, Bell, CheckCircle, Clock, TrendingDown, X, Eye, Mail, Phone } from 'lucide-react'; // ✅ Added

/**
 * RiskAlerts Component
 * Monitor and manage loan repayment risks and alerts
 * 
 * @param {array} customAlerts - Custom alerts data
 * @param {function} onAlertAction - Alert action callback
 * @param {function} onAlertDismiss - Alert dismiss callback
 * @param {boolean} loading - Is data loading
 * @param {function} onAlertFilter - Alert filter callback
 */
const RiskAlerts = ({ 
  customAlerts = null, // ✅ Added
  onAlertAction = null, // ✅ Added
  onAlertDismiss = null, // ✅ Added
  loading = false, // ✅ Added
  onAlertFilter = null, // ✅ Added
}) => {
  // ✅ Get context
  const banking = useContext(BankingContext);

  // ✅ State management
  const [alerts, setAlerts] = useState(customAlerts || [
    {
      id: 1,
      type: 'high',
      title: 'Loan Default - Immediate Action',
      borrower: 'Deepa Singh',
      borrowerId: 'B004',
      loanId: 'L004',
      message: 'Loan has not been paid for 45 days. Risk of permanent default.',
      daysOverdue: 45,
      amount: 15000,
      timestamp: new Date(Date.now() - 3600000),
      status: 'active',
      actionTaken: false,
      severity: 'critical',
    },
    {
      id: 2,
      type: 'medium',
      title: 'EMI Overdue - 12 Days',
      borrower: 'Priya Sharma',
      borrowerId: 'B002',
      loanId: 'L002',
      message: 'EMI payment is 12 days overdue. Send reminder to borrower.',
      daysOverdue: 12,
      amount: 6800,
      timestamp: new Date(Date.now() - 86400000),
      status: 'active',
      actionTaken: false,
      severity: 'moderate',
    },
    {
      id: 3,
      type: 'medium',
      title: 'High Credit Utilization',
      borrower: 'Multiple Borrowers',
      borrowerId: 'MULTI',
      loanId: 'N/A',
      message: '8 borrowers have credit utilization above 80%. Assess repayment capacity.',
      daysOverdue: null,
      amount: null,
      timestamp: new Date(Date.now() - 172800000),
      status: 'active',
      actionTaken: false,
      severity: 'warning',
      affectedCount: 8,
    },
    {
      id: 4,
      type: 'low',
      title: 'EMI Due Tomorrow',
      borrower: 'Multiple Borrowers',
      borrowerId: 'MULTI',
      loanId: 'N/A',
      message: '15 EMI payments are due tomorrow. Send reminder notifications.',
      daysOverdue: null,
      amount: null,
      timestamp: new Date(Date.now() - 7200000),
      status: 'active',
      actionTaken: false,
      severity: 'info',
      affectedCount: 15,
    },
    {
      id: 5,
      type: 'low',
      title: 'On-Time Payment',
      borrower: 'Ramesh Kumar',
      borrowerId: 'B001',
      loanId: 'L001',
      message: 'EMI payment received successfully. Payment history: 6/6 on time.',
      daysOverdue: null,
      amount: 4500,
      timestamp: new Date(Date.now() - 259200000),
      status: 'resolved',
      actionTaken: true,
      severity: 'positive',
    },
  ]);
  
  const [filterType, setFilterType] = useState('all'); // ✅ Added
  const [filterStatus, setFilterStatus] = useState('all'); // ✅ Added
  const [sortBy, setSortBy] = useState('timestamp'); // ✅ Added

  // ✅ Filter alerts
  const filteredAlerts = useMemo(() => {
    let result = alerts;

    if (filterType !== 'all') {
      result = result.filter(a => a.type === filterType);
    }

    if (filterStatus !== 'all') {
      result = result.filter(a => a.status === filterStatus);
    }

    // ✅ Sort alerts
    result.sort((a, b) => {
      if (sortBy === 'timestamp') {
        return b.timestamp - a.timestamp;
      }
      if (sortBy === 'severity') {
        const severityOrder = { critical: 0, moderate: 1, warning: 2, info: 3, positive: 4 };
        return severityOrder[a.severity] - severityOrder[b.severity];
      }
      return 0;
    });

    return result;
  }, [alerts, filterType, filterStatus, sortBy]);

  // ✅ Calculate alert statistics
  const alertStats = useMemo(() => {
    const highPriority = alerts.filter(a => a.type === 'high' && a.status === 'active').length;
    const mediumPriority = alerts.filter(a => a.type === 'medium' && a.status === 'active').length;
    const lowPriority = alerts.filter(a => a.type === 'low' && a.status === 'active').length;
    const resolved = alerts.filter(a => a.status === 'resolved').length;
    const actioned = alerts.filter(a => a.actionTaken).length;

    const totalAtRisk = alerts
      .filter(a => a.type === 'high')
      .reduce((sum, a) => sum + (a.amount || 0), 0);

    const resolutionRate = alerts.length > 0 ? (resolved / alerts.length) * 100 : 0;

    return {
      highPriority,
      mediumPriority,
      lowPriority,
      total: alerts.length,
      resolved,
      actioned,
      totalAtRisk,
      resolutionRate: Math.round(resolutionRate),
    };
  }, [alerts]);

  // ✅ Dismiss alert
  const dismissAlert = useCallback((id) => {
    setAlerts(alerts.filter(alert => alert.id !== id));

    if (onAlertDismiss) {
      onAlertDismiss(id);
    } else if (banking?.dismissAlert) {
      banking.dismissAlert(id);
    }

    if (banking?.addNotification) {
      banking.addNotification({
        type: 'success',
        message: 'Alert dismissed',
        duration: 2000,
      });
    }
  }, [alerts, onAlertDismiss, banking]);

  // ✅ Handle alert action
  const handleAlertAction = useCallback((alert, action) => {
    const updatedAlerts = alerts.map(a => 
      a.id === alert.id ? { ...a, actionTaken: true, status: 'resolved' } : a
    );
    setAlerts(updatedAlerts);

    if (onAlertAction) {
      onAlertAction({ alert, action });
    } else if (banking?.handleAlertAction) {
      banking.handleAlertAction({ alert, action });
    }

    if (banking?.addNotification) {
      banking.addNotification({
        type: 'success',
        message: `Action: ${action} sent to ${alert.borrower}`,
        duration: 2000,
      });
    }
  }, [alerts, onAlertAction, banking]);

  // ✅ Get alert icon
  const getAlertIcon = useCallback((type) => {
    switch (type) {
      case 'high':
        return <AlertTriangle className="text-red-600" size={24} />;
      case 'medium':
        return <AlertCircle className="text-yellow-600" size={24} />;
      case 'low':
        return <Bell className="text-blue-600" size={24} />;
      default:
        return <CheckCircle className="text-green-600" size={24} />;
    }
  }, []);

  // ✅ Get alert background
  const getAlertBg = useCallback((type, status) => {
    if (status === 'resolved') return 'bg-green-50 border-l-4 border-green-500';
    switch (type) {
      case 'high':
        return 'bg-red-50 border-l-4 border-red-500';
      case 'medium':
        return 'bg-yellow-50 border-l-4 border-yellow-500';
      case 'low':
        return 'bg-blue-50 border-l-4 border-blue-500';
      default:
        return 'bg-gray-50 border-l-4 border-gray-500';
    }
  }, []);

  // ✅ Get alert badge
  const getAlertBadge = useCallback((type, status) => {
    if (status === 'resolved') return <Badge variant="success">✓ Resolved</Badge>;
    switch (type) {
      case 'high':
        return <Badge variant="danger">🔴 Critical</Badge>;
      case 'medium':
        return <Badge variant="warning">🟡 Warning</Badge>;
      case 'low':
        return <Badge variant="info">🔵 Info</Badge>;
      default:
        return <Badge variant="default">Info</Badge>;
    }
  }, []);

  // ✅ Format time
  const formatTime = useCallback((timestamp) => {
    const now = new Date();
    const diff = Math.floor((now - timestamp) / 1000);
    
    if (diff < 60) return 'Just now';
    if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
    if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
    if (diff < 604800) return `${Math.floor(diff / 86400)}d ago`;
    return timestamp.toLocaleDateString();
  }, []);

  // ✅ Get action buttons
  const getActionButtons = useCallback((alert) => {
    if (alert.status === 'resolved') {
      return (
        <Button variant="success" size="sm" disabled>
          ✓ Resolved
        </Button>
      );
    }

    if (alert.type === 'high') {
      return (
        <>
          <Button 
            variant="danger" 
            size="sm"
            onClick={() => handleAlertAction(alert, 'Send Notice')}
            className="flex items-center gap-1"
          >
            <Mail size={14} />
            Send Notice
          </Button>
          <Button 
            variant="primary" 
            size="sm"
            onClick={() => handleAlertAction(alert, 'Schedule Call')}
            className="flex items-center gap-1"
          >
            <Phone size={14} />
            Schedule Call
          </Button>
        </>
      );
    }

    if (alert.type === 'medium') {
      return (
        <>
          <Button 
            variant="warning" 
            size="sm"
            onClick={() => handleAlertAction(alert, 'Send Reminder')}
            className="flex items-center gap-1"
          >
            <Bell size={14} />
            Send Reminder
          </Button>
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => handleAlertAction(alert, 'Reschedule EMI')}
          >
            Reschedule EMI
          </Button>
        </>
      );
    }

    return (
      <Button 
        variant="outline" 
        size="sm"
        onClick={() => handleAlertAction(alert, 'Send Notification')}
        className="flex items-center gap-1"
      >
        <Bell size={14} />
        Send Notification
      </Button>
    );
  }, [handleAlertAction]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h3 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
            <Bell className="text-red-600" size={28} />
            Risk Alerts & Notifications
          </h3>
          <p className="text-gray-600 mt-1">Monitor and manage loan repayment risks</p>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {/* High Priority */}
        <Card className="bg-red-50 border-l-4 border-red-500">
          <div className="text-center">
            <p className="text-sm text-red-700 mb-1">🔴 High Priority</p>
            <p className="text-3xl font-bold text-red-900">{alertStats.highPriority}</p>
            <p className="text-xs text-red-600 mt-1">Needs Immediate Action</p>
          </div>
        </Card>

        {/* Medium Priority */}
        <Card className="bg-yellow-50 border-l-4 border-yellow-500">
          <div className="text-center">
            <p className="text-sm text-yellow-700 mb-1">🟡 Medium Priority</p>
            <p className="text-3xl font-bold text-yellow-900">{alertStats.mediumPriority}</p>
            <p className="text-xs text-yellow-600 mt-1">Requires Follow-up</p>
          </div>
        </Card>

        {/* Total Alerts */}
        <Card className="bg-blue-50 border-l-4 border-blue-500">
          <div className="text-center">
            <p className="text-sm text-blue-700 mb-1">📊 Total Alerts</p>
            <p className="text-3xl font-bold text-blue-900">{alertStats.total}</p>
            <p className="text-xs text-blue-600 mt-1">Active & Resolved</p>
          </div>
        </Card>

        {/* Resolution Rate */}
        <Card className="bg-green-50 border-l-4 border-green-500">
          <div className="text-center">
            <p className="text-sm text-green-700 mb-1">✓ Resolution Rate</p>
            <p className="text-3xl font-bold text-green-900">{alertStats.resolutionRate}%</p>
            <p className="text-xs text-green-600 mt-1">Last 30 Days</p>
          </div>
        </Card>
      </div>

      {/* ✅ Filter Section */}
      <Card>
        <div className="flex flex-wrap gap-3 items-center">
          <span className="text-sm font-semibold text-gray-700">Filter:</span>
          
          {/* Type Filter */}
          <div className="flex gap-1">
            {['all', 'high', 'medium', 'low'].map(type => (
              <button
                key={type}
                onClick={() => {
                  setFilterType(type);
                  if (onAlertFilter) onAlertFilter({ type });
                }}
                className={`px-3 py-1 rounded text-xs font-medium transition-colors ${
                  filterType === type
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {type === 'all' ? 'All Types' : type.charAt(0).toUpperCase() + type.slice(1)}
              </button>
            ))}
          </div>

          {/* Status Filter */}
          <div className="flex gap-1 ml-auto">
            {['all', 'active', 'resolved'].map(status => (
              <button
                key={status}
                onClick={() => {
                  setFilterStatus(status);
                  if (onAlertFilter) onAlertFilter({ status });
                }}
                className={`px-3 py-1 rounded text-xs font-medium transition-colors ${
                  filterStatus === status
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {status === 'all' ? 'All Status' : status.charAt(0).toUpperCase() + status.slice(1)}
              </button>
            ))}
          </div>
        </div>
      </Card>

      {/* Alerts List */}
      {loading ? (
        <Card className="text-center py-8">
          <p className="text-gray-600">Loading alerts...</p>
        </Card>
      ) : filteredAlerts.length > 0 ? (
        <div className="space-y-3">
          {filteredAlerts.map((alert) => (
            <Card key={alert.id} className={getAlertBg(alert.type, alert.status)}>
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-4 flex-1">
                  <div className="flex-shrink-0 pt-1">
                    {getAlertIcon(alert.type)}
                  </div>

                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2 flex-wrap">
                      <h4 className="font-bold text-gray-800">{alert.title}</h4>
                      {getAlertBadge(alert.type, alert.status)}
                      <span className="text-xs text-gray-500 ml-auto flex items-center gap-1">
                        <Clock size={12} />
                        {formatTime(alert.timestamp)}
                      </span>
                    </div>

                    <p className="text-sm text-gray-700 mb-2">{alert.message}</p>

                    {/* Alert Details */}
                    <div className="flex flex-wrap gap-4 text-sm mb-3">
                      <div>
                        <span className="text-gray-600">Borrower:</span>
                        <span className="ml-2 font-medium text-gray-800">{alert.borrower}</span>
                      </div>
                      {alert.loanId !== 'N/A' && (
                        <div>
                          <span className="text-gray-600">Loan ID:</span>
                          <span className="ml-2 font-medium text-gray-800">{alert.loanId}</span>
                        </div>
                      )}
                      {alert.daysOverdue && (
                        <div>
                          <span className="text-gray-600">Days Overdue:</span>
                          <span className="ml-2 font-bold text-red-600">{alert.daysOverdue}</span>
                        </div>
                      )}
                      {alert.amount && (
                        <div>
                          <span className="text-gray-600">Amount:</span>
                          <span className="ml-2 font-medium text-gray-800">₹{alert.amount.toLocaleString()}</span>
                        </div>
                      )}
                      {alert.affectedCount && (
                        <div>
                          <span className="text-gray-600">Affected:</span>
                          <span className="ml-2 font-medium text-gray-800">{alert.affectedCount} borrowers</span>
                        </div>
                      )}
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-2 flex-wrap">
                      {getActionButtons(alert)}
                    </div>
                  </div>
                </div>

                {/* Dismiss Button */}
                <button
                  onClick={() => dismissAlert(alert.id)}
                  className="flex-shrink-0 p-2 hover:bg-white hover:bg-opacity-50 rounded-lg transition-colors ml-2"
                  title="Dismiss alert"
                >
                  <X size={18} className="text-gray-600" />
                </button>
              </div>
            </Card>
          ))}
        </div>
      ) : (
        <Card className="text-center py-8">
          <CheckCircle className="text-green-600 mx-auto mb-4" size={48} />
          <h4 className="text-lg font-semibold text-gray-600 mb-2">No Alerts</h4>
          <p className="text-gray-500">All loans are performing well!</p>
        </Card>
      )}

      {/* Alert Statistics */}
      <Card title="📊 Alert Statistics & Portfolio Health">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center p-4 bg-red-50 rounded-lg">
            <p className="text-sm text-gray-600 mb-1">Default Risk</p>
            <p className="text-2xl font-bold text-red-600">
              {alertStats.total > 0 ? ((alertStats.highPriority / alertStats.total) * 100).toFixed(1) : 0}%
            </p>
            <p className="text-xs text-gray-500 mt-1">Portfolio</p>
          </div>
          <div className="text-center p-4 bg-yellow-50 rounded-lg">
            <p className="text-sm text-gray-600 mb-1">Overdue EMIs</p>
            <p className="text-2xl font-bold text-yellow-600">
              {alertStats.total > 0 ? ((alertStats.mediumPriority / alertStats.total) * 100).toFixed(1) : 0}%
            </p>
            <p className="text-xs text-gray-500 mt-1">Portfolio</p>
          </div>
          <div className="text-center p-4 bg-green-50 rounded-lg">
            <p className="text-sm text-gray-600 mb-1">On-Time Rate</p>
            <p className="text-2xl font-bold text-green-600">
              {alertStats.total > 0 ? (100 - ((alertStats.highPriority + alertStats.mediumPriority) / alertStats.total) * 100).toFixed(1) : 100}%
            </p>
            <p className="text-xs text-gray-500 mt-1">Excellent</p>
          </div>
          <div className="text-center p-4 bg-blue-50 rounded-lg">
            <p className="text-sm text-gray-600 mb-1">Actioned</p>
            <p className="text-2xl font-bold text-blue-600">{alertStats.actioned}</p>
            <p className="text-xs text-gray-500 mt-1">of {alertStats.total}</p>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default RiskAlerts;
