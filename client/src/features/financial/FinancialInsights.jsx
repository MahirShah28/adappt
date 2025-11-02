import React, { useContext, useMemo, useState, useCallback } from 'react';
import { BankingContext } from '../../context/Index'; // ✅ Added
import { Card, Badge } from '../../components/common/Index'; // ✅ Updated
import { LineChart } from '../../components/charts/Index'; // ✅ Updated
import { Lightbulb, TrendingUp, AlertTriangle, CheckCircle, Target, Zap, Share2, Bookmark } from 'lucide-react'; // ✅ Added

// ✅ Mock data import
import { 
  getUserFinancialHealth,
  getCreditScoreTrend,
  getFinancialInsights,
  getRecommendations,
  getFinancialSnapshot,
} from '../../data/Index'; // ✅ Added

/**
 * FinancialInsights Component
 * AI-powered financial insights and recommendations dashboard
 * 
 * @param {object} userData - User financial data (optional)
 * @param {boolean} loading - Is data loading
 * @param {function} onInsightClick - Insight interaction handler
 * @param {function} onRecommendationActed - Recommendation action callback
 * @param {boolean} showChart - Show credit score chart
 * @param {boolean} showRecommendations - Show recommendations
 * @param {number} customHealthScore - Custom health score (optional)
 */
const FinancialInsights = ({ 
  userData = null, // ✅ Added
  loading = false, // ✅ Added
  onInsightClick = null, // ✅ Added
  onRecommendationActed = null, // ✅ Added
  showChart = true, // ✅ Added
  showRecommendations = true, // ✅ Added
  customHealthScore = null, // ✅ Added
}) => {
  // ✅ Get context
  const banking = useContext(BankingContext);

  // ✅ State management
  const [expandedRecommendation, setExpandedRecommendation] = useState(null); // ✅ Added
  const [savedInsights, setSavedInsights] = useState([]); // ✅ Added

  // ✅ Get user financial data
  const financialData = useMemo(() => {
    if (userData) return userData;
    return getUserFinancialHealth();
  }, [userData]);

  // ✅ Get credit score trend
  const creditScoreTrend = useMemo(() => {
    if (userData?.creditScoreTrend) return userData.creditScoreTrend;
    return getCreditScoreTrend();
  }, [userData]);

  // ✅ Get insights
  const insights = useMemo(() => {
    if (userData?.insights) return userData.insights;
    return getFinancialInsights();
  }, [userData]);

  // ✅ Get recommendations
  const recommendations = useMemo(() => {
    if (userData?.recommendations) return userData.recommendations;
    return getRecommendations();
  }, [userData]);

  // ✅ Get financial snapshot
  const snapshot = useMemo(() => {
    if (userData?.snapshot) return userData.snapshot;
    return getFinancialSnapshot();
  }, [userData]);

  // ✅ Calculate or use custom health score
  const financialHealthScore = useMemo(() => {
    if (customHealthScore) return customHealthScore;
    return financialData?.healthScore || 78;
  }, [customHealthScore, financialData]);

  // ✅ Calculate health score change
  const healthScoreChange = useMemo(() => {
    return financialData?.scoreChange || 8;
  }, [financialData]);

  // ✅ Get health score status
  const getHealthScoreStatus = useCallback((score) => {
    if (score >= 80) return 'Excellent';
    if (score >= 70) return 'Good Standing';
    if (score >= 60) return 'Fair';
    return 'Needs Improvement';
  }, []);

  // ✅ Get health score color
  const getHealthScoreColor = useCallback((score) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 70) return 'text-blue-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-red-600';
  }, []);

  // ✅ Get status badge variant
  const getStatusBadgeVariant = useCallback((score) => {
    if (score >= 80) return 'success';
    if (score >= 70) return 'info';
    if (score >= 60) return 'warning';
    return 'danger';
  }, []);

  // ✅ Handle insight click
  const handleInsightClick = useCallback((insight) => {
    if (onInsightClick) {
      onInsightClick(insight);
    } else if (banking?.selectInsight) {
      banking.selectInsight(insight);
    }
  }, [onInsightClick, banking]);

  // ✅ Toggle save insight
  const toggleSaveInsight = useCallback((insightId) => {
    setSavedInsights(prev => {
      if (prev.includes(insightId)) {
        return prev.filter(id => id !== insightId);
      }
      return [...prev, insightId];
    });
  }, []);

  // ✅ Share insight
  const shareInsight = useCallback((insight) => {
    if (navigator.share) {
      navigator.share({
        title: 'Financial Insight',
        text: `${insight.title}: ${insight.description}`,
      });
    } else if (banking?.shareInsight) {
      banking.shareInsight(insight);
    }
  }, [banking]);

  // ✅ Handle recommendation action
  const handleRecommendationAction = useCallback((recommendation) => {
    if (onRecommendationActed) {
      onRecommendationActed(recommendation);
    } else if (banking?.actOnRecommendation) {
      banking.actOnRecommendation(recommendation);
    }
  }, [onRecommendationActed, banking]);

  // ✅ Calculate circle progress
  const calculateCircleProgress = (score) => {
    return (score / 100) * 2 * Math.PI * 50;
  };

  // ✅ Filter insights by priority
  const sortedInsights = useMemo(() => {
    const typeOrder = { positive: 0, opportunity: 1, action: 2, warning: 3 };
    return [...insights].sort((a, b) => typeOrder[a.type] - typeOrder[b.type]);
  }, [insights]);

  // ✅ Filter recommendations by priority
  const sortedRecommendations = useMemo(() => {
    const priorityOrder = { high: 0, medium: 1, low: 2 };
    return [...recommendations].sort((a, b) => priorityOrder[a.priority] - priorityOrder[b.priority]);
  }, [recommendations]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h3 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
          <Lightbulb className="text-yellow-500" size={28} />
          Financial Insights & Recommendations
        </h3>
        <p className="text-gray-600 mt-1">AI-powered analysis of your financial health</p>
      </div>

      {/* Financial Health Score */}
      <Card className="bg-gradient-to-br from-purple-50 via-blue-50 to-green-50">
        <div className="text-center py-4">
          {/* ✅ Progress Circle */}
          <div className="relative inline-block mb-4">
            <svg className="w-32 h-32" viewBox="0 0 120 120">
              {/* Background circle */}
              <circle cx="60" cy="60" r="50" fill="none" stroke="#e5e7eb" strokeWidth="8" />
              
              {/* Progress circle */}
              <circle
                cx="60"
                cy="60"
                r="50"
                fill="none"
                stroke="#10b981"
                strokeWidth="8"
                strokeDasharray={calculateCircleProgress(financialHealthScore)}
                strokeDashoffset={calculateCircleProgress(100 - financialHealthScore)}
                strokeLinecap="round"
                style={{
                  transform: 'rotate(-90deg)',
                  transformOrigin: '60px 60px',
                  transition: 'stroke-dashoffset 1s ease',
                }}
              />
            </svg>

            {/* Center text */}
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <p className={`text-4xl font-bold ${getHealthScoreColor(financialHealthScore)}`}>
                {financialHealthScore}
              </p>
              <p className="text-xs text-gray-600">out of 100</p>
            </div>
          </div>

          <h4 className="text-xl font-bold text-gray-800 mb-2">Financial Health Score</h4>
          <Badge 
            variant={getStatusBadgeVariant(financialHealthScore)} 
            size="lg"
          >
            {getHealthScoreStatus(financialHealthScore)}
          </Badge>
          
          {/* ✅ Health score change */}
          <p className="text-sm text-gray-600 mt-3">
            Your financial health has improved by <strong>{healthScoreChange} points</strong> in the last 3 months
          </p>

          {/* ✅ Recommendation pills */}
          <div className="mt-4 flex flex-wrap justify-center gap-2">
            {healthScoreChange > 0 && (
              <Badge variant="success" size="sm">
                📈 {healthScoreChange} points up
              </Badge>
            )}
            <Badge variant="info" size="sm">
              🎯 Goal: 85 points
            </Badge>
          </div>
        </div>
      </Card>

      {/* Credit Score Trend */}
      {showChart && (
        <Card>
          <LineChart
            data={creditScoreTrend}
            dataKeys={['score']}
            xAxisKey="month"
            title="Credit Score Trend (Last 6 Months)"
            height={300}
            colors={['#10b981']}
            loading={loading}
            referenceLine={750}
            referenceLineColor="#f59e0b"
          />
        </Card>
      )}

      {/* Key Insights */}
      <div>
        <h4 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
          <Zap className="text-yellow-500" size={20} />
          Key Insights
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {sortedInsights.map((insight, index) => {
            const Icon = insight.icon;
            const isSaved = savedInsights.includes(insight.id || index);
            
            return (
              <Card 
                key={index}
                className={`${insight.bgColor} border-l-4 ${insight.borderColor} cursor-pointer hover:shadow-md transition-all`}
                onClick={() => handleInsightClick(insight)}
              >
                <div className="flex items-start gap-3">
                  {/* Icon */}
                  <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center flex-shrink-0">
                    <Icon className={insight.iconColor} size={20} />
                  </div>

                  {/* Content */}
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-2">
                      <h5 className="font-bold text-gray-800">{insight.title}</h5>
                      <Badge 
                        variant={
                          insight.type === 'positive' ? 'success' :
                          insight.type === 'warning' ? 'warning' :
                          insight.type === 'opportunity' ? 'info' :
                          'default'
                        }
                        size="sm"
                      >
                        {insight.impact}
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-700 mb-2">{insight.description}</p>

                    {/* ✅ Action buttons */}
                    <div className="flex gap-2">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleSaveInsight(insight.id || index);
                        }}
                        className="text-xs text-gray-600 hover:text-blue-600 transition-colors flex items-center gap-1"
                      >
                        <Bookmark 
                          size={14} 
                          fill={isSaved ? 'currentColor' : 'none'}
                        />
                        {isSaved ? 'Saved' : 'Save'}
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          shareInsight(insight);
                        }}
                        className="text-xs text-gray-600 hover:text-blue-600 transition-colors flex items-center gap-1"
                      >
                        <Share2 size={14} />
                        Share
                      </button>
                    </div>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      </div>

      {/* AI Recommendations */}
      {showRecommendations && (
        <Card title="🤖 AI-Powered Recommendations">
          <div className="space-y-4">
            {sortedRecommendations.map((rec, index) => (
              <div 
                key={index}
                className="p-4 bg-gray-50 rounded-lg border border-gray-200 hover:shadow-md transition-shadow cursor-pointer"
                onClick={() => setExpandedRecommendation(expandedRecommendation === index ? null : index)}
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="flex-1">
                    <h5 className="font-semibold text-gray-800">{rec.title}</h5>
                  </div>
                  <Badge 
                    variant={
                      rec.priority === 'high' ? 'danger' :
                      rec.priority === 'medium' ? 'warning' :
                      'info'
                    }
                    size="sm"
                  >
                    {rec.priority} priority
                  </Badge>
                </div>

                <p className="text-sm text-gray-700 mb-2">{rec.description}</p>

                {/* ✅ Expanded content */}
                {expandedRecommendation === index && (
                  <div className="mt-3 pt-3 border-t border-gray-200 space-y-2">
                    <div className="flex items-center gap-2 text-sm">
                      <span className="text-blue-600 font-medium">💡 Action:</span>
                      <span className="text-gray-600">{rec.action}</span>
                    </div>

                    {/* ✅ Potential impact */}
                    {rec.impact && (
                      <div className="flex items-center gap-2 text-sm">
                        <span className="text-green-600 font-medium">✓ Impact:</span>
                        <span className="text-gray-600">{rec.impact}</span>
                      </div>
                    )}

                    {/* ✅ Action button */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleRecommendationAction(rec);
                      }}
                      className="mt-2 px-3 py-1 bg-blue-600 text-white text-xs rounded hover:bg-blue-700 transition-colors"
                    >
                      Take Action
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* Quick Stats */}
      <Card title="📊 Financial Snapshot">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {/* ✅ Dynamic stat cards */}
          {[
            {
              label: 'Credit Score',
              value: snapshot?.creditScore || '712',
              change: snapshot?.creditScoreChange || '+32 points',
              color: 'blue',
              icon: '📊',
            },
            {
              label: 'Savings Rate',
              value: snapshot?.savingsRate || '20%',
              change: snapshot?.savingsTarget || 'Target: 20%',
              color: 'green',
              icon: '💰',
            },
            {
              label: 'DTI Ratio',
              value: snapshot?.dtiRatio || '35%',
              change: snapshot?.dtiStatus || 'Healthy range',
              color: 'purple',
              icon: '📈',
            },
            {
              label: 'Net Worth',
              value: snapshot?.netWorth || '₹4.2L',
              change: snapshot?.netWorthChange || '↑ +12% YoY',
              color: 'orange',
              icon: '💎',
            },
          ].map((stat, idx) => (
            <div 
              key={idx}
              className={`text-center p-4 bg-${stat.color}-50 rounded-lg hover:shadow-md transition-shadow cursor-pointer`}
            >
              <p className="text-2xl mb-1">{stat.icon}</p>
              <p className="text-sm text-gray-600 mb-1">{stat.label}</p>
              <p className={`text-2xl font-bold text-${stat.color}-600`}>
                {stat.value}
              </p>
              <p className={`text-xs text-${stat.change.includes('↑') ? 'green' : stat.change.includes('Healthy') ? 'green' : 'gray'}-600 mt-1`}>
                {stat.change}
              </p>
            </div>
          ))}
        </div>
      </Card>

      {/* ✅ Footer disclaimer */}
      <div className="text-xs text-gray-500 text-center p-3 bg-gray-50 rounded-lg border border-gray-200">
        <p>📌 This analysis is AI-generated and for informational purposes only. Consult with a financial advisor for personalized advice.</p>
      </div>
    </div>
  );
};

export default FinancialInsights;
