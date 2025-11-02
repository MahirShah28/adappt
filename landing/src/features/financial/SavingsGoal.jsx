import React, { useContext, useState, useMemo, useCallback } from 'react';
import { BankingContext } from '../../context/Index'; // ✅ Added
import { Input, Button, ProgressBar, Badge, Card, Alert } from '../../components/common/Index'; // ✅ Updated
import { Target, TrendingUp, Calendar, PiggyBank, Plus, Edit2, Trash2, Check, AlertCircle } from 'lucide-react'; // ✅ Added

// ✅ Mock data import
import { getUserSavingsGoals } from '../../data/Index'; // ✅ Added

/**
 * SavingsGoals Component
 * Manage and track savings goals with progress monitoring
 * 
 * @param {array} initialGoals - Initial goals data (optional)
 * @param {boolean} loading - Is data loading
 * @param {function} onGoalAdded - Goal added callback
 * @param {function} onGoalUpdated - Goal updated callback
 * @param {function} onGoalDeleted - Goal deleted callback
 * @param {function} onGoalCompleted - Goal completed callback
 * @param {boolean} editable - Enable edit/delete functionality
 */
const SavingsGoals = ({ 
  initialGoals = null, // ✅ Added
  loading = false, // ✅ Added
  onGoalAdded = null, // ✅ Added
  onGoalUpdated = null, // ✅ Added
  onGoalDeleted = null, // ✅ Added
  onGoalCompleted = null, // ✅ Added
  editable = true, // ✅ Added
}) => {
  // ✅ Get context
  const banking = useContext(BankingContext);

  // ✅ State management
  const [goals, setGoals] = useState(initialGoals || getUserSavingsGoals()); // ✅ Updated
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingGoalId, setEditingGoalId] = useState(null); // ✅ Added
  const [newGoal, setNewGoal] = useState({
    name: '',
    targetAmount: '',
    currentAmount: '',
    deadline: '',
    monthlyContribution: '',
    priority: 'medium',
  });
  const [errors, setErrors] = useState({}); // ✅ Added

  // ✅ Validate goal form
  const validateGoal = useCallback((goal) => {
    const newErrors = {};
    
    if (!goal.name?.trim()) newErrors.name = 'Goal name is required';
    if (!goal.targetAmount || parseFloat(goal.targetAmount) <= 0) newErrors.targetAmount = 'Valid amount required';
    if (!goal.deadline) newErrors.deadline = 'Deadline is required';
    if (!goal.monthlyContribution || parseFloat(goal.monthlyContribution) <= 0) newErrors.monthlyContribution = 'Valid contribution required';
    
    // ✅ Validate deadline is in future
    if (goal.deadline && new Date(goal.deadline) <= new Date()) {
      newErrors.deadline = 'Deadline must be in the future';
    }
    
    // ✅ Validate contribution can reach target
    const current = parseFloat(goal.currentAmount) || 0;
    const target = parseFloat(goal.targetAmount);
    const monthsRemaining = calculateMonthsRemaining(goal.deadline);
    const contribution = parseFloat(goal.monthlyContribution);
    
    if (current + (contribution * monthsRemaining) < target) {
      newErrors.monthlyContribution = `Increase contribution to meet target`;
    }

    return newErrors;
  }, []);

  // ✅ Calculate progress
  const calculateProgress = useCallback((current, target) => {
    return Math.min(100, (current / target) * 100);
  }, []);

  // ✅ Calculate months remaining
  const calculateMonthsRemaining = useCallback((deadline) => {
    const today = new Date();
    const deadlineDate = new Date(deadline);
    const diffTime = Math.abs(deadlineDate - today);
    const diffMonths = Math.ceil(diffTime / (1000 * 60 * 60 * 24 * 30));
    return Math.max(0, diffMonths);
  }, []);

  // ✅ Check if goal is on track
  const isGoalOnTrack = useCallback((goal) => {
    const monthsRemaining = calculateMonthsRemaining(goal.deadline);
    const requiredAmount = goal.targetAmount - goal.currentAmount;
    const projectedAmount = goal.monthlyContribution * monthsRemaining;
    return projectedAmount >= requiredAmount;
  }, [calculateMonthsRemaining]);

  // ✅ Get priority color
  const getPriorityColor = useCallback((priority) => {
    const colorMap = {
      high: 'danger',
      medium: 'warning',
      low: 'info',
    };
    return colorMap[priority] || 'default';
  }, []);

  // ✅ Handle add goal
  const handleAddGoal = useCallback((e) => {
    e.preventDefault();
    
    // ✅ Validate
    const validationErrors = validateGoal(newGoal);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      if (banking?.addNotification) {
        banking.addNotification({
          type: 'error',
          message: 'Please fix validation errors',
          duration: 3000,
        });
      }
      return;
    }

    const goal = {
      id: Math.max(0, ...goals.map(g => g.id)) + 1,
      ...newGoal,
      targetAmount: parseFloat(newGoal.targetAmount),
      currentAmount: parseFloat(newGoal.currentAmount) || 0,
      monthlyContribution: parseFloat(newGoal.monthlyContribution),
      createdAt: new Date(),
    };

    const updatedGoals = [...goals, goal];
    setGoals(updatedGoals);

    // ✅ Call callback
    if (onGoalAdded) {
      onGoalAdded(goal);
    } else if (banking?.addGoal) {
      banking.addGoal(goal);
    }

    // ✅ Show success notification
    if (banking?.addNotification) {
      banking.addNotification({
        type: 'success',
        message: `Goal "${goal.name}" added successfully!`,
        duration: 2000,
      });
    }

    // ✅ Reset form
    setNewGoal({
      name: '',
      targetAmount: '',
      currentAmount: '',
      deadline: '',
      monthlyContribution: '',
      priority: 'medium',
    });
    setShowAddForm(false);
    setErrors({});
  }, [goals, newGoal, validateGoal, onGoalAdded, banking]);

  // ✅ Handle update goal
  const handleUpdateGoal = useCallback((id, updatedData) => {
    const updatedGoals = goals.map(goal =>
      goal.id === id ? { ...goal, ...updatedData } : goal
    );
    setGoals(updatedGoals);

    if (onGoalUpdated) {
      onGoalUpdated({ id, ...updatedData });
    } else if (banking?.updateGoal) {
      banking.updateGoal(id, updatedData);
    }

    if (banking?.addNotification) {
      banking.addNotification({
        type: 'success',
        message: 'Goal updated successfully!',
        duration: 2000,
      });
    }

    setEditingGoalId(null);
  }, [goals, onGoalUpdated, banking]);

  // ✅ Handle delete goal
  const handleDeleteGoal = useCallback((id, goalName) => {
    setGoals(goals.filter(goal => goal.id !== id));

    if (onGoalDeleted) {
      onGoalDeleted(id);
    } else if (banking?.deleteGoal) {
      banking.deleteGoal(id);
    }

    if (banking?.addNotification) {
      banking.addNotification({
        type: 'success',
        message: `Goal "${goalName}" deleted!`,
        duration: 2000,
      });
    }
  }, [goals, onGoalDeleted, banking]);

  // ✅ Calculate summary metrics
  const summaryMetrics = useMemo(() => {
    const totalSavings = goals.reduce((sum, goal) => sum + goal.currentAmount, 0);
    const totalTarget = goals.reduce((sum, goal) => sum + goal.targetAmount, 0);
    const completedGoals = goals.filter(goal => goal.currentAmount >= goal.targetAmount).length;
    const onTrackGoals = goals.filter(goal => isGoalOnTrack(goal) && goal.currentAmount < goal.targetAmount).length;

    return {
      totalSavings,
      totalTarget,
      completedGoals,
      onTrackGoals,
      overallProgress: totalTarget > 0 ? (totalSavings / totalTarget) * 100 : 0,
    };
  }, [goals, isGoalOnTrack]);

  // ✅ Get recommended contribution
  const getRecommendedContribution = useCallback((goal) => {
    const monthsRemaining = calculateMonthsRemaining(goal.deadline);
    const remaining = goal.targetAmount - goal.currentAmount;
    return Math.ceil(remaining / monthsRemaining);
  }, [calculateMonthsRemaining]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h3 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
            <Target className="text-blue-600" size={28} />
            Savings Goals
          </h3>
          <p className="text-gray-600 mt-1">Track and achieve your financial goals</p>
        </div>
        {editable && (
          <Button
            variant="primary"
            onClick={() => setShowAddForm(!showAddForm)}
          >
            <Plus size={18} className="mr-2" />
            Add Goal
          </Button>
        )}
      </div>

      {/* Overall Progress Card */}
      <Card className="bg-gradient-to-br from-blue-50 to-purple-50 border-2 border-blue-200">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {/* ✅ Total Saved */}
          <div className="text-center">
            <PiggyBank className="text-blue-600 mx-auto mb-2" size={32} />
            <p className="text-sm text-gray-600 mb-1">Total Saved</p>
            <p className="text-3xl font-bold text-gray-800">
              ₹{summaryMetrics.totalSavings.toLocaleString()}
            </p>
            <p className="text-xs text-gray-500 mt-1">{goals.length} goals</p>
          </div>

          {/* ✅ Total Target */}
          <div className="text-center">
            <Target className="text-purple-600 mx-auto mb-2" size={32} />
            <p className="text-sm text-gray-600 mb-1">Total Target</p>
            <p className="text-3xl font-bold text-gray-800">
              ₹{summaryMetrics.totalTarget.toLocaleString()}
            </p>
            <p className="text-xs text-gray-500 mt-1">Combined target</p>
          </div>

          {/* ✅ Overall Progress */}
          <div className="text-center">
            <TrendingUp className="text-green-600 mx-auto mb-2" size={32} />
            <p className="text-sm text-gray-600 mb-1">Overall Progress</p>
            <p className="text-3xl font-bold text-green-600">
              {summaryMetrics.overallProgress.toFixed(1)}%
            </p>
            <p className="text-xs text-gray-500 mt-1">Of target</p>
          </div>

          {/* ✅ Goal Status */}
          <div className="text-center">
            <Check className="text-blue-600 mx-auto mb-2" size={32} />
            <p className="text-sm text-gray-600 mb-1">Completed</p>
            <p className="text-3xl font-bold text-blue-600">
              {summaryMetrics.completedGoals}
            </p>
            <p className="text-xs text-gray-500 mt-1">{summaryMetrics.onTrackGoals} on track</p>
          </div>
        </div>
      </Card>

      {/* Add Goal Form */}
      {showAddForm && (
        <Card className="border-2 border-blue-300">
          <form onSubmit={handleAddGoal} className="space-y-4">
            <h4 className="font-semibold text-gray-800 mb-4">Add New Savings Goal</h4>
            
            <Input
              label="Goal Name"
              name="name"
              value={newGoal.name}
              onChange={(e) => setNewGoal({ ...newGoal, name: e.target.value })}
              placeholder="e.g., New Car, Vacation, etc."
              error={errors.name}
              required
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="Target Amount (₹)"
                name="targetAmount"
                type="number"
                value={newGoal.targetAmount}
                onChange={(e) => setNewGoal({ ...newGoal, targetAmount: e.target.value })}
                placeholder="100000"
                error={errors.targetAmount}
                required
              />
              <Input
                label="Current Amount (₹)"
                name="currentAmount"
                type="number"
                value={newGoal.currentAmount}
                onChange={(e) => setNewGoal({ ...newGoal, currentAmount: e.target.value })}
                placeholder="0"
                error={errors.currentAmount}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="Deadline"
                name="deadline"
                type="date"
                value={newGoal.deadline}
                onChange={(e) => setNewGoal({ ...newGoal, deadline: e.target.value })}
                error={errors.deadline}
                required
              />
              <Input
                label="Monthly Contribution (₹)"
                name="monthlyContribution"
                type="number"
                value={newGoal.monthlyContribution}
                onChange={(e) => setNewGoal({ ...newGoal, monthlyContribution: e.target.value })}
                placeholder="5000"
                error={errors.monthlyContribution}
                helperText="Required to meet deadline"
                required
              />
            </div>

            {/* Priority Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Priority
              </label>
              <div className="flex gap-3 flex-wrap">
                {['high', 'medium', 'low'].map((priority) => (
                  <label key={priority} className="flex items-center cursor-pointer">
                    <input
                      type="radio"
                      name="priority"
                      value={priority}
                      checked={newGoal.priority === priority}
                      onChange={(e) => setNewGoal({ ...newGoal, priority: e.target.value })}
                      className="mr-2"
                    />
                    <span className="capitalize text-sm">{priority}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Form Actions */}
            <div className="flex gap-3">
              <Button type="submit" variant="primary">
                Add Goal
              </Button>
              <Button type="button" variant="outline" onClick={() => {
                setShowAddForm(false);
                setErrors({});
              }}>
                Cancel
              </Button>
            </div>
          </form>
        </Card>
      )}

      {/* Goals List */}
      <div className="space-y-4">
        {goals.map((goal) => {
          const progress = calculateProgress(goal.currentAmount, goal.targetAmount);
          const monthsRemaining = calculateMonthsRemaining(goal.deadline);
          const remaining = goal.targetAmount - goal.currentAmount;
          const isOnTrack = isGoalOnTrack(goal);
          const isCompleted = goal.currentAmount >= goal.targetAmount;
          const recommendedContribution = getRecommendedContribution(goal);

          return (
            <Card 
              key={goal.id} 
              className={`hover:shadow-lg transition-shadow ${
                isCompleted ? 'border-l-4 border-green-500 bg-green-50' : ''
              }`}
            >
              <div className="space-y-4">
                {/* Header */}
                <div className="flex items-start justify-between flex-wrap gap-2">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-2 flex-wrap">
                      <h4 className="text-lg font-bold text-gray-800">{goal.name}</h4>
                      <Badge variant={getPriorityColor(goal.priority)} size="sm">
                        {goal.priority} priority
                      </Badge>
                      {isCompleted ? (
                        <Badge variant="success" size="sm">✓ Completed</Badge>
                      ) : isOnTrack ? (
                        <Badge variant="success" size="sm">On Track</Badge>
                      ) : (
                        <Badge variant="warning" size="sm">Behind Schedule</Badge>
                      )}
                    </div>
                  </div>

                  {/* Actions */}
                  {editable && (
                    <div className="flex gap-2">
                      <button
                        onClick={() => setEditingGoalId(editingGoalId === goal.id ? null : goal.id)}
                        className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                        title="Edit goal"
                      >
                        <Edit2 size={18} className="text-gray-600" />
                      </button>
                      <button
                        onClick={() => handleDeleteGoal(goal.id, goal.name)}
                        className="p-2 hover:bg-red-50 rounded-lg transition-colors"
                        title="Delete goal"
                      >
                        <Trash2 size={18} className="text-red-600" />
                      </button>
                    </div>
                  )}
                </div>

                {/* Progress Bar */}
                <div>
                  <div className="flex justify-between mb-2">
                    <span className="text-sm text-gray-600">Progress</span>
                    <span className="text-sm font-semibold text-gray-900">
                      ₹{goal.currentAmount.toLocaleString()} / ₹{goal.targetAmount.toLocaleString()}
                    </span>
                  </div>
                  <ProgressBar
                    progress={progress}
                    color={isCompleted ? 'green' : progress >= 50 ? 'blue' : 'yellow'}
                    height="lg"
                    showPercentage={true}
                    status={isCompleted ? 'success' : 'info'}
                  />
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
                  <div className="p-3 bg-gray-50 rounded-lg">
                    <p className="text-gray-600 mb-1">Remaining</p>
                    <p className="font-bold text-gray-800">₹{remaining.toLocaleString()}</p>
                  </div>
                  <div className="p-3 bg-gray-50 rounded-lg">
                    <p className="text-gray-600 mb-1 flex items-center gap-1">
                      <Calendar size={14} />
                      Deadline
                    </p>
                    <p className="font-bold text-gray-800">
                      {new Date(goal.deadline).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="p-3 bg-gray-50 rounded-lg">
                    <p className="text-gray-600 mb-1">Current/Month</p>
                    <p className="font-bold text-gray-800">₹{goal.monthlyContribution.toLocaleString()}</p>
                  </div>
                  <div className="p-3 bg-gray-50 rounded-lg">
                    <p className="text-gray-600 mb-1">Time Left</p>
                    <p className="font-bold text-gray-800">{monthsRemaining} months</p>
                  </div>
                </div>

                {/* ✅ Recommendation Alert */}
                {!isCompleted && !isOnTrack && (
                  <Alert
                    type="warning"
                    message={`💡 To meet your deadline, increase monthly contribution to ₹${recommendedContribution.toLocaleString()}`}
                    dismissible={false}
                  />
                )}

                {/* ✅ Completion Alert */}
                {isCompleted && (
                  <Alert
                    type="success"
                    message="🎉 Congratulations! You've achieved this goal!"
                    dismissible={false}
                  />
                )}

                {/* ✅ On Track Alert */}
                {!isCompleted && isOnTrack && (
                  <Alert
                    type="success"
                    message="✓ Great progress! You're on track to achieve this goal."
                    dismissible={false}
                  />
                )}
              </div>
            </Card>
          );
        })}
      </div>

      {/* Empty State */}
      {goals.length === 0 && (
        <Card className="text-center py-12">
          <Target className="text-gray-400 mx-auto mb-4" size={64} />
          <h4 className="text-lg font-semibold text-gray-600 mb-2">No Savings Goals Yet</h4>
          <p className="text-gray-500 mb-4">Start by adding your first savings goal</p>
          {editable && (
            <Button variant="primary" onClick={() => setShowAddForm(true)}>
              <Plus size={18} className="mr-2" />
              Add Your First Goal
            </Button>
          )}
        </Card>
      )}
    </div>
  );
};

export default SavingsGoals;
