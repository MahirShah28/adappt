import React, { useContext, useState, useMemo, useCallback } from 'react';
import { BankingContext } from '../../context/Index'; // ✅ Added
import { Card, Badge, Button, Select, Alert } from '../../components/common/Index'; // ✅ Updated
import { LineChart, BarChart } from '../../components/charts/Index'; // ✅ Updated
import { Calendar, DollarSign, TrendingUp, CheckCircle, Clock, AlertCircle, Download, Bell } from 'lucide-react'; // ✅ Added

/**
 * PaymentSchedule Component
 * Display and manage loan payment schedules
 * 
 * @param {function} onLoanSelect - Loan selection callback
 * @param {object} customSchedules - Custom schedule data
 * @param {boolean} loading - Is data loading
 * @param {function} onPaymentAction - Payment action callback
 * @param {function} onDownload - Download callback
 */
const PaymentSchedule = ({ 
  onLoanSelect = null, // ✅ Added
  customSchedules = null, // ✅ Added
  loading = false, // ✅ Added
  onPaymentAction = null, // ✅ Added
  onDownload = null, // ✅ Added
}) => {
  // ✅ Get context
  const banking = useContext(BankingContext);

  // ✅ State management
  const [selectedLoan, setSelectedLoan] = useState('L001');
  const [showReminders, setShowReminders] = useState(false); // ✅ Added

  // ✅ Default loan schedules
  const defaultLoanPaymentSchedules = {
    L001: {
      loanId: 'L001',
      borrowerName: 'Ramesh Kumar',
      amount: 50000,
      emi: 4500,
      rate: 12.5,
      tenure: 12,
      startDate: '2025-06-15',
      endDate: '2026-06-15',
      status: 'active',
      createdAt: '2025-06-15',
      schedule: [
        { month: 1, dueDate: '2025-07-15', principalDue: 4250, interestDue: 250, principalPaid: 4250, interestPaid: 250, paidDate: '2025-07-15', status: 'paid' },
        { month: 2, dueDate: '2025-08-15', principalDue: 4265, interestDue: 235, principalPaid: 4265, interestPaid: 235, paidDate: '2025-08-15', status: 'paid' },
        { month: 3, dueDate: '2025-09-15', principalDue: 4280, interestDue: 220, principalPaid: 4280, interestPaid: 220, paidDate: '2025-09-15', status: 'paid' },
        { month: 4, dueDate: '2025-10-15', principalDue: 4295, interestDue: 205, principalPaid: 4295, interestPaid: 205, paidDate: '2025-10-15', status: 'paid' },
        { month: 5, dueDate: '2025-11-15', principalDue: 4310, interestDue: 190, principalPaid: 4310, interestPaid: 190, paidDate: '2025-11-10', status: 'paid' },
        { month: 6, dueDate: '2025-12-15', principalDue: 4325, interestDue: 175, principalPaid: 0, interestPaid: 0, status: 'upcoming' },
        { month: 7, dueDate: '2026-01-15', principalDue: 4340, interestDue: 160, principalPaid: 0, interestPaid: 0, status: 'upcoming' },
        { month: 8, dueDate: '2026-02-15', principalDue: 4355, interestDue: 145, principalPaid: 0, interestPaid: 0, status: 'upcoming' },
        { month: 9, dueDate: '2026-03-15', principalDue: 4370, interestDue: 130, principalPaid: 0, interestPaid: 0, status: 'upcoming' },
        { month: 10, dueDate: '2026-04-15', principalDue: 4385, interestDue: 115, principalPaid: 0, interestPaid: 0, status: 'upcoming' },
        { month: 11, dueDate: '2026-05-15', principalDue: 4400, interestDue: 100, principalPaid: 0, interestPaid: 0, status: 'upcoming' },
        { month: 12, dueDate: '2026-06-15', principalDue: 4415, interestDue: 85, principalPaid: 0, interestPaid: 0, status: 'upcoming' },
      ],
    },
    L002: {
      loanId: 'L002',
      borrowerName: 'Priya Sharma',
      amount: 75000,
      emi: 6800,
      rate: 13.5,
      tenure: 12,
      startDate: '2025-04-20',
      endDate: '2026-04-20',
      status: 'active',
      createdAt: '2025-04-20',
      schedule: Array.from({ length: 12 }, (_, i) => ({
        month: i + 1,
        dueDate: new Date(2025, 3 + i, 20).toISOString().split('T')[0],
        principalDue: 6200,
        interestDue: 600,
        principalPaid: i < 8 ? 6200 : 0,
        interestPaid: i < 8 ? 600 : 0,
        paidDate: i < 8 ? new Date(2025, 3 + i, 18).toISOString().split('T')[0] : null,
        status: i < 8 ? 'paid' : 'upcoming',
      })),
    },
  };

  const loanPaymentSchedules = customSchedules || defaultLoanPaymentSchedules;
  const schedule = loanPaymentSchedules[selectedLoan];

  // ✅ Handle loan selection
  const handleLoanSelect = useCallback((e) => {
    const loanId = e.target.value;
    setSelectedLoan(loanId);

    if (onLoanSelect) {
      onLoanSelect(loanId);
    } else if (banking?.selectPaymentSchedule) {
      banking.selectPaymentSchedule(loanId);
    }
  }, [onLoanSelect, banking]);

  // ✅ Calculate payment metrics
  const paymentMetrics = useMemo(() => {
    if (!schedule) return null;

    const totalDisbursed = schedule.amount;
    const totalPrincipalPaid = schedule.schedule.reduce((sum, s) => sum + s.principalPaid, 0);
    const totalInterestPaid = schedule.schedule.reduce((sum, s) => sum + s.interestPaid, 0);
    const principalRemaining = totalDisbursed - totalPrincipalPaid;
    const interestRemaining = schedule.schedule.reduce((sum, s) => sum + s.interestDue, 0) - totalInterestPaid;

    const upcomingPayment = schedule.schedule.find(s => s.status === 'upcoming');
    const overduePayments = schedule.schedule.filter(s => s.status === 'overdue');
    const paidPayments = schedule.schedule.filter(s => s.status === 'paid');

    const completionPercentage = (paidPayments.length / schedule.tenure) * 100;
    const avgPaymentOnTime = paidPayments.filter(p => {
      if (!p.paidDate) return false;
      return new Date(p.paidDate) <= new Date(p.dueDate);
    }).length / Math.max(1, paidPayments.length);

    return {
      totalDisbursed,
      totalPrincipalPaid,
      totalInterestPaid,
      principalRemaining,
      interestRemaining,
      upcomingPayment,
      overduePayments,
      paidPayments,
      completionPercentage,
      avgPaymentOnTime: Math.round(avgPaymentOnTime * 100),
      totalAmount: totalPrincipalPaid + totalInterestPaid,
      remainingAmount: principalRemaining + interestRemaining,
    };
  }, [schedule]);

  // ✅ Calculate chart data
  const chartData = useMemo(() => {
    if (!schedule) return { monthlyData: [], accumulatedData: [] };

    const monthlyData = schedule.schedule.map(item => ({
      month: `M${item.month}`,
      principal: item.principalDue,
      interest: item.interestDue,
    }));

    const accumulatedData = schedule.schedule.map((item, idx) => ({
      month: `M${item.month}`,
      principal: schedule.schedule.slice(0, idx + 1).reduce((sum, s) => sum + s.principalPaid, 0),
      interest: schedule.schedule.slice(0, idx + 1).reduce((sum, s) => sum + s.interestPaid, 0),
    }));

    return { monthlyData, accumulatedData };
  }, [schedule]);

  // ✅ Get status badge
  const getStatusBadge = useCallback((status) => {
    switch (status) {
      case 'paid':
        return <Badge variant="success"><CheckCircle size={12} className="mr-1 inline" />Paid</Badge>;
      case 'upcoming':
        return <Badge variant="warning"><Clock size={12} className="mr-1 inline" />Upcoming</Badge>;
      case 'overdue':
        return <Badge variant="danger"><AlertCircle size={12} className="mr-1 inline" />Overdue</Badge>;
      default:
        return <Badge variant="default">Unknown</Badge>;
    }
  }, []);

  // ✅ Handle payment action
  const handlePaymentAction = useCallback((payment) => {
    if (onPaymentAction) {
      onPaymentAction({ loanId: selectedLoan, payment });
    } else if (banking?.recordPayment) {
      banking.recordPayment({ loanId: selectedLoan, payment });
    }

    if (banking?.addNotification) {
      banking.addNotification({
        type: 'success',
        message: `Payment recorded for ${payment.month}`,
        duration: 2000,
      });
    }
  }, [selectedLoan, onPaymentAction, banking]);

  // ✅ Handle download schedule
  const handleDownload = useCallback(() => {
    const scheduleData = {
      loanId: schedule.loanId,
      borrowerName: schedule.borrowerName,
      schedule: schedule.schedule,
      metrics: paymentMetrics,
      downloadedAt: new Date().toISOString(),
    };

    if (onDownload) {
      onDownload(scheduleData);
    } else if (banking?.downloadSchedule) {
      banking.downloadSchedule(scheduleData);
    }

    if (banking?.addNotification) {
      banking.addNotification({
        type: 'success',
        message: 'Schedule downloaded successfully!',
        duration: 2000,
      });
    }
  }, [schedule, paymentMetrics, onDownload, banking]);

  // ✅ Get payment reminders
  const getPaymentReminders = useCallback(() => {
    const reminders = [];

    if (paymentMetrics?.overduePayments.length > 0) {
      reminders.push({
        type: 'error',
        message: `${paymentMetrics.overduePayments.length} payment(s) overdue. Please pay immediately.`,
      });
    }

    if (paymentMetrics?.upcomingPayment) {
      const daysUntilDue = Math.ceil((new Date(paymentMetrics.upcomingPayment.dueDate) - new Date()) / (1000 * 60 * 60 * 24));
      if (daysUntilDue <= 7 && daysUntilDue > 0) {
        reminders.push({
          type: 'warning',
          message: `Next payment of ₹${(paymentMetrics.upcomingPayment.principalDue + paymentMetrics.upcomingPayment.interestDue).toLocaleString()} due in ${daysUntilDue} days`,
        });
      }
    }

    return reminders;
  }, [paymentMetrics]);

  if (!schedule || !paymentMetrics) {
    return <div>Loading...</div>;
  }

  const reminders = getPaymentReminders();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h3 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
            <Calendar className="text-blue-600" size={28} />
            Payment Schedule
          </h3>
          <p className="text-gray-600 mt-1">Track EMI payment schedule and status</p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={handleDownload}
            className="flex items-center gap-2"
          >
            <Download size={18} />
            Download
          </Button>
          <Select
            value={selectedLoan}
            onChange={handleLoanSelect}
            options={Object.keys(loanPaymentSchedules).map(id => ({ value: id, label: id }))}
          />
        </div>
      </div>

      {/* ✅ Payment Reminders */}
      {reminders.length > 0 && (
        <div className="space-y-2">
          {reminders.map((reminder, idx) => (
            <Alert
              key={idx}
              type={reminder.type}
              message={reminder.message}
              dismissible={true}
            />
          ))}
        </div>
      )}

      {/* Loan Summary */}
      <Card className="bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          <div className="text-center">
            <p className="text-sm text-gray-600 mb-1">Borrower</p>
            <p className="font-bold text-gray-800">{schedule.borrowerName}</p>
          </div>
          <div className="text-center">
            <p className="text-sm text-gray-600 mb-1">Loan Amount</p>
            <p className="text-lg font-bold text-blue-600">₹{schedule.amount.toLocaleString()}</p>
          </div>
          <div className="text-center">
            <p className="text-sm text-gray-600 mb-1">Monthly EMI</p>
            <p className="text-lg font-bold text-blue-600">₹{schedule.emi.toLocaleString()}</p>
          </div>
          <div className="text-center">
            <p className="text-sm text-gray-600 mb-1">Rate of Interest</p>
            <p className="text-lg font-bold text-blue-600">{schedule.rate}% p.a.</p>
          </div>
          <div className="text-center">
            <p className="text-sm text-gray-600 mb-1">Tenure</p>
            <p className="text-lg font-bold text-blue-600">{schedule.tenure} Months</p>
          </div>
        </div>
      </Card>

      {/* Payment Progress */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {/* Principal Paid */}
        <Card className="bg-green-50 border-l-4 border-green-500">
          <div className="text-center">
            <p className="text-sm text-green-700 mb-1">Principal Paid</p>
            <p className="text-2xl font-bold text-green-900">₹{paymentMetrics.totalPrincipalPaid.toLocaleString()}</p>
            <p className="text-xs text-green-600 mt-1">{((paymentMetrics.totalPrincipalPaid / paymentMetrics.totalDisbursed) * 100).toFixed(1)}% of total</p>
          </div>
        </Card>

        {/* Interest Paid */}
        <Card className="bg-blue-50 border-l-4 border-blue-500">
          <div className="text-center">
            <p className="text-sm text-blue-700 mb-1">Interest Paid</p>
            <p className="text-2xl font-bold text-blue-900">₹{paymentMetrics.totalInterestPaid.toLocaleString()}</p>
            <p className="text-xs text-blue-600 mt-1">Total cost of borrowing</p>
          </div>
        </Card>

        {/* Principal Remaining */}
        <Card className="bg-orange-50 border-l-4 border-orange-500">
          <div className="text-center">
            <p className="text-sm text-orange-700 mb-1">Principal Remaining</p>
            <p className="text-2xl font-bold text-orange-900">₹{paymentMetrics.principalRemaining.toLocaleString()}</p>
            <p className="text-xs text-orange-600 mt-1">Yet to be paid</p>
          </div>
        </Card>

        {/* Next Due */}
        <Card className="bg-purple-50 border-l-4 border-purple-500">
          <div className="text-center">
            <p className="text-sm text-purple-700 mb-1">Next Due</p>
            {paymentMetrics.upcomingPayment && (
              <>
                <p className="text-2xl font-bold text-purple-900">
                  ₹{(paymentMetrics.upcomingPayment.principalDue + paymentMetrics.upcomingPayment.interestDue).toLocaleString()}
                </p>
                <p className="text-xs text-purple-600 mt-1">{new Date(paymentMetrics.upcomingPayment.dueDate).toLocaleDateString()}</p>
              </>
            )}
          </div>
        </Card>
      </div>

      {/* ✅ Performance Metrics */}
      <Card className="bg-gradient-to-r from-green-50 to-blue-50 border border-green-200">
        <h4 className="font-semibold text-gray-800 mb-3">📊 Payment Performance</h4>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
          <div>
            <p className="text-gray-600">Completion Rate</p>
            <p className="text-2xl font-bold text-green-600">{Math.round(paymentMetrics.completionPercentage)}%</p>
          </div>
          <div>
            <p className="text-gray-600">On-Time Payment Rate</p>
            <p className="text-2xl font-bold text-blue-600">{paymentMetrics.avgPaymentOnTime}%</p>
          </div>
          <div>
            <p className="text-gray-600">Paid EMIs</p>
            <p className="text-2xl font-bold text-green-600">{paymentMetrics.paidPayments.length}</p>
          </div>
          <div>
            <p className="text-gray-600">Overdue EMIs</p>
            <p className="text-2xl font-bold text-red-600">{paymentMetrics.overduePayments.length}</p>
          </div>
        </div>
      </Card>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <BarChart
            data={chartData.monthlyData}
            dataKeys={['principal', 'interest']}
            xAxisKey="month"
            title="Monthly EMI Breakdown"
            height={300}
            colors={['#3b82f6', '#f59e0b']}
          />
        </Card>

        <Card>
          <LineChart
            data={chartData.accumulatedData}
            dataKeys={['principal', 'interest']}
            xAxisKey="month"
            title="Accumulated Repayment Trend"
            height={300}
            colors={['#10b981', '#ef4444']}
          />
        </Card>
      </div>

      {/* Payment Schedule Table */}
      <Card title="📋 Detailed Payment Schedule">
        {loading ? (
          <div className="text-center py-8">
            <p className="text-gray-600">Loading schedule...</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Month</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Due Date</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Principal Due</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Interest Due</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Total EMI</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Principal Paid</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Interest Paid</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {schedule.schedule.map((payment) => (
                  <tr key={payment.month} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      Month {payment.month}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      {new Date(payment.dueDate).toLocaleDateString('en-IN')}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      ₹{payment.principalDue.toLocaleString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      ₹{payment.interestDue.toLocaleString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900">
                      ₹{(payment.principalDue + payment.interestDue).toLocaleString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      ₹{payment.principalPaid.toLocaleString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      ₹{payment.interestPaid.toLocaleString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      {getStatusBadge(payment.status)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>

      {/* Payment Instructions */}
      <Card title="💳 Payment Instructions">
        <div className="space-y-3 text-sm">
          <div className="flex items-start gap-3">
            <span className="text-blue-600 font-bold">1.</span>
            <p className="text-gray-700">EMI payments are due on the date mentioned in the schedule</p>
          </div>
          <div className="flex items-start gap-3">
            <span className="text-blue-600 font-bold">2.</span>
            <p className="text-gray-700">
              Pay through bank transfer, online portal, or standing instruction setup
            </p>
          </div>
          <div className="flex items-start gap-3">
            <span className="text-blue-600 font-bold">3.</span>
            <p className="text-gray-700">
              Allow 2-3 business days for payment confirmation
            </p>
          </div>
          <div className="flex items-start gap-3">
            <span className="text-blue-600 font-bold">4.</span>
            <p className="text-gray-700">
              In case of any queries, contact your loan officer
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default PaymentSchedule;
