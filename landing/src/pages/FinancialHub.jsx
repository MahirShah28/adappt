import React, { useState, useContext, useMemo, useCallback } from 'react';
import { BankingContext } from '../context/Index';
import { Card, Input, Button, ProgressBar, Badge, Alert } from '../components/common/Index';
import { PieChart, BarChart, LineChart } from '../components/charts/Index';
import { Wallet, TrendingUp, Target, Lightbulb, Save, AlertCircle, Download } from 'lucide-react';

// Import data functions
import {
  getAllBorrowers,
  getAllLoans,
  getAllTransactions,
} from '../data/Index';

/**
 * FinancialHub Component
 * Personal financial insights and planning tools
 */
const FinancialHub = () => {
  const banking = useContext(BankingContext);

  // State management
  const [savingsGoal, setSavingsGoal] = useState(100000);
  const [currentSavings, setCurrentSavings] = useState(45000);
  const [monthlyIncome, setMonthlyIncome] = useState(25500);
  const [selectedMonth, setSelectedMonth] = useState('current');

  // Fetch data
  const borrowers = useMemo(() => getAllBorrowers(), []);
  const loans = useMemo(() => getAllLoans(), []);
  const transactions = useMemo(() => getAllTransactions(), []);

  // Calculate spending from transaction data
  const spendingData = useMemo(() => {
    const defaultSpending = [
      { name: 'Rent', value: 8000 },
      { name: 'Groceries', value: 5000 },
      { name: 'Utilities', value: 2500 },
      { name: 'Transportation', value: 3000 },
      { name: 'Entertainment', value: 2000 },
      { name: 'Savings', value: 5000 },
    ];

    if (transactions.length === 0) return defaultSpending;

    // Simulate category breakdown
    const categories = {
      'Rent': 8000,
      'Groceries': 5000,
      'Utilities': 2500,
      'Transportation': 3000,
      'Entertainment': 2000,
      'Savings': currentSavings > 40000 ? 5000 : 3000,
    };

    return Object.entries(categories).map(([name, value]) => ({ name, value }));
  }, [transactions, currentSavings]);

  // Calculate total expenses
  const totalExpenses = useMemo(() => {
    return spendingData.reduce((sum, item) => sum + item.value, 0);
  }, [spendingData]);

  // Calculate savings rate
  const savingsRate = useMemo(() => {
    return monthlyIncome > 0 ? ((currentSavings / monthlyIncome) * 100).toFixed(1) : 0;
  }, [monthlyIncome, currentSavings]);

  // Calculate goal progress
  const goalProgress = useMemo(() => {
    return savingsGoal > 0 ? ((currentSavings / savingsGoal) * 100).toFixed(1) : 0;
  }, [currentSavings, savingsGoal]);

  // Calculate months to goal
  const monthsToGoal = useMemo(() => {
    const monthlySavings = currentSavings > 0 ? currentSavings / 3 : 5000; // Assuming 3 months of history
    const remaining = savingsGoal - currentSavings;
    return remaining > 0 ? Math.ceil(remaining / monthlySavings) : 0;
  }, [currentSavings, savingsGoal]);

  // Generate financial insights
  const insights = useMemo(() => {
    const insightList = [];

    // Spending insight
    insightList.push({
      icon: TrendingUp,
      title: 'Spending Pattern',
      description: 'Your monthly spending is 15% lower than last month. Great job!',
      color: 'text-green-600',
      type: 'success',
    });

    // Savings goal insight
    insightList.push({
      icon: Target,
      title: 'Savings Goal',
      description: `You're ${goalProgress}% of the way to your ₹${savingsGoal.toLocaleString()} goal. Keep it up!`,
      color: 'text-blue-600',
      type: 'info',
    });

    // Budget optimization
    const entertainmentBudget = spendingData.find(d => d.name === 'Entertainment')?.value || 0;
    if (entertainmentBudget > 2500) {
      insightList.push({
        icon: Lightbulb,
        title: 'Budget Recommendation',
        description: `Consider reducing entertainment expenses by 20% to boost savings by ₹${(entertainmentBudget * 0.2).toFixed(0)}.`,
        color: 'text-orange-600',
        type: 'warning',
      });
    }

    // Financial health
    if (savingsRate > 20) {
      insightList.push({
        icon: Save,
        title: 'Excellent Savings Rate',
        description: `Your savings rate of ${savingsRate}% is excellent. You're building wealth!`,
        color: 'text-green-600',
        type: 'success',
      });
    }

    return insightList;
  }, [goalProgress, savingsGoal, currentSavings, spendingData, savingsRate]);

  // Monthly trends data
  const monthlyTrends = useMemo(() => {
    return [
      { month: 'Jan', income: 25000, expenses: 21000, savings: 4000 },
      { month: 'Feb', income: 25500, expenses: 20500, savings: 5000 },
      { month: 'Mar', income: 26000, expenses: 22000, savings: 4000 },
      { month: 'Apr', income: 26500, expenses: 21500, savings: 5000 },
      { month: 'May', income: 27000, expenses: 21000, savings: 6000 },
      { month: 'Jun', income: monthlyIncome, expenses: totalExpenses, savings: monthlyIncome - totalExpenses },
    ];
  }, [monthlyIncome, totalExpenses]);

  // Handle export
  const handleExport = useCallback(() => {
    const reportData = {
      timestamp: new Date().toISOString(),
      savingsGoal,
      currentSavings,
      goalProgress,
      monthsToGoal,
      monthlyIncome,
      totalExpenses,
      savingsRate,
      spending: spendingData,
      monthlyTrends,
    };

    const dataStr = JSON.stringify(reportData, null, 2);
    const element = document.createElement('a');
    element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(dataStr));
    element.setAttribute('download', `financial_report_${Date.now()}.json`);
    element.style.display = 'none';
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);

    if (banking?.addNotification) {
      banking.addNotification({
        type: 'success',
        message: 'Financial report exported successfully!',
        duration: 2000,
      });
    }
  }, [savingsGoal, currentSavings, goalProgress, monthsToGoal, monthlyIncome, totalExpenses, savingsRate, spendingData, monthlyTrends, banking]);

  // Handle goal update
  const handleSavingsGoalChange = useCallback((value) => {
    setSavingsGoal(Number(value));
    if (banking?.addNotification) {
      banking.addNotification({
        type: 'info',
        message: `Savings goal updated to ₹${Number(value).toLocaleString()}`,
        duration: 1500,
      });
    }
  }, [banking]);

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h2 className="text-3xl font-bold text-gray-800 mb-2 flex items-center gap-2">
            <Wallet className="text-green-600" size={32} />
            💰 Financial Hub
          </h2>
          <p className="text-gray-600">Your personal financial insights and planning tools</p>
        </div>
        <Button
          variant="outline"
          onClick={handleExport}
          className="flex items-center gap-2"
        >
          <Download size={18} />
          Export Report
        </Button>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-blue-50 border border-blue-200">
          <div className="text-center">
            <p className="text-sm text-blue-700 font-semibold">Monthly Income</p>
            <p className="text-2xl font-bold text-blue-900">₹{monthlyIncome.toLocaleString()}</p>
          </div>
        </Card>

        <Card className="bg-red-50 border border-red-200">
          <div className="text-center">
            <p className="text-sm text-red-700 font-semibold">Monthly Expenses</p>
            <p className="text-2xl font-bold text-red-900">₹{totalExpenses.toLocaleString()}</p>
          </div>
        </Card>

        <Card className="bg-green-50 border border-green-200">
          <div className="text-center">
            <p className="text-sm text-green-700 font-semibold">Current Savings</p>
            <p className="text-2xl font-bold text-green-900">₹{currentSavings.toLocaleString()}</p>
          </div>
        </Card>

        <Card className="bg-purple-50 border border-purple-200">
          <div className="text-center">
            <p className="text-sm text-purple-700 font-semibold">Savings Rate</p>
            <p className="text-2xl font-bold text-purple-900">{savingsRate}%</p>
          </div>
        </Card>
      </div>

      {/* Savings Goal */}
      <Card title="🎯 Savings Goal Tracker">
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Savings Goal (₹)"
              type="number"
              value={savingsGoal}
              onChange={(e) => handleSavingsGoalChange(e.target.value)}
            />
            <Input
              label="Current Savings (₹)"
              type="number"
              value={currentSavings}
              onChange={(e) => setCurrentSavings(Number(e.target.value))}
            />
          </div>

          <ProgressBar
            progress={Math.min(100, goalProgress)}
            text={`₹${currentSavings.toLocaleString()} of ₹${savingsGoal.toLocaleString()} (${goalProgress}%)`}
          />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <div className="bg-green-50 p-4 rounded-lg border border-green-200">
              <p className="text-green-800">
                <strong>Remaining:</strong> ₹{(savingsGoal - currentSavings).toLocaleString()}
              </p>
              <p className="text-green-700 text-xs mt-1">Amount left to reach goal</p>
            </div>

            <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
              <p className="text-blue-800">
                <strong>Months to Goal:</strong> {monthsToGoal}
              </p>
              <p className="text-blue-700 text-xs mt-1">At current savings rate</p>
            </div>

            <div className="bg-purple-50 p-4 rounded-lg border border-purple-200">
              <p className="text-purple-800">
                <strong>Monthly Need:</strong> ₹{((savingsGoal - currentSavings) / Math.max(1, monthsToGoal)).toLocaleString()}
              </p>
              <p className="text-purple-700 text-xs mt-1">To reach goal on time</p>
            </div>
          </div>
        </div>
      </Card>

      {/* Spending & Insights */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card title="📊 Monthly Spending Breakdown">
          <PieChart
            data={spendingData}
            height={300}
            showLegend={true}
          />
        </Card>

        <Card title="💡 Financial Insights">
          <div className="space-y-3">
            {insights.map((insight, index) => {
              const Icon = insight.icon;
              return (
                <div key={index} className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                  <Icon className={`${insight.color} flex-shrink-0 mt-1`} size={20} />
                  <div className="flex-1">
                    <h4 className="font-semibold text-gray-800 mb-1">{insight.title}</h4>
                    <p className="text-sm text-gray-600">{insight.description}</p>
                  </div>
                  <Badge variant={insight.type} size="sm">
                    {insight.type.charAt(0).toUpperCase() + insight.type.slice(1)}
                  </Badge>
                </div>
              );
            })}
          </div>
        </Card>
      </div>

      {/* Monthly Trends */}
      <Card title="📈 Income vs Expenses Trend">
        <LineChart
          data={monthlyTrends}
          dataKeys={['income', 'expenses', 'savings']}
          xAxisKey="month"
          title="6-Month Financial Trend"
          height={350}
        />
      </Card>

      {/* Monthly Summary */}
      <Card title="📊 This Month's Summary">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center p-4 bg-blue-50 rounded-lg border border-blue-200">
            <p className="text-sm text-gray-600 mb-1">Income</p>
            <p className="text-2xl font-bold text-blue-600">₹{monthlyIncome.toLocaleString()}</p>
            <p className="text-xs text-blue-600 mt-1">Total earned</p>
          </div>

          <div className="text-center p-4 bg-red-50 rounded-lg border border-red-200">
            <p className="text-sm text-gray-600 mb-1">Expenses</p>
            <p className="text-2xl font-bold text-red-600">₹{totalExpenses.toLocaleString()}</p>
            <p className="text-xs text-red-600 mt-1">{((totalExpenses / monthlyIncome) * 100).toFixed(1)}% of income</p>
          </div>

          <div className="text-center p-4 bg-green-50 rounded-lg border border-green-200">
            <p className="text-sm text-gray-600 mb-1">Savings</p>
            <p className="text-2xl font-bold text-green-600">₹{(monthlyIncome - totalExpenses).toLocaleString()}</p>
            <p className="text-xs text-green-600 mt-1">{savingsRate}% of income</p>
          </div>

          <div className="text-center p-4 bg-purple-50 rounded-lg border border-purple-200">
            <p className="text-sm text-gray-600 mb-1">Budget Health</p>
            <p className="text-2xl font-bold text-purple-600">
              {savingsRate > 20 ? '🟢' : savingsRate > 10 ? '🟡' : '🔴'}
            </p>
            <p className="text-xs text-purple-600 mt-1">
              {savingsRate > 20 ? 'Excellent' : savingsRate > 10 ? 'Good' : 'Needs Work'}
            </p>
          </div>
        </div>
      </Card>

      {/* Recommendations */}
      <Card title="💬 Personalized Recommendations">
        <div className="space-y-3">
          {savingsRate < 15 && (
            <Alert
              type="warning"
              message="Your savings rate is below 15%. Consider reducing discretionary spending to boost savings."
              dismissible={true}
            />
          )}

          {monthlyIncome - totalExpenses < 5000 && (
            <Alert
              type="warning"
              message="Your monthly savings are below ₹5,000. Review your expense categories."
              dismissible={true}
            />
          )}

          {goalProgress >= 100 && (
            <Alert
              type="success"
              message="🎉 Congratulations! You've reached your savings goal. Consider setting a new target!"
              dismissible={true}
            />
          )}

          {monthsToGoal > 0 && monthsToGoal <= 6 && savingsRate > 15 && (
            <Alert
              type="success"
              message={`Great progress! You'll reach your goal in ${monthsToGoal} months at this rate.`}
              dismissible={true}
            />
          )}
        </div>
      </Card>
    </div>
  );
};

export default FinancialHub;
