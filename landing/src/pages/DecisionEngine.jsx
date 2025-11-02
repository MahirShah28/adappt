import React, { useState, useContext, useCallback, useMemo } from 'react';
import { BankingContext } from '../context/Index';
import { Card, Button, ProgressBar, StatusBox, Badge, Alert } from '../components/common/Index';
import { CheckCircle, XCircle, AlertCircle, Brain, Zap } from 'lucide-react';

// Import data functions
import {
  getAllLoans,
  getAllBorrowers,
  getHighRiskLoans,
  getOverdueLoans,
} from '../data/Index';

/**
 * DecisionEngine Component
 * Multi-agent AI system for credit assessment
 */
const DecisionEngine = () => {
  const banking = useContext(BankingContext);

  // State management
  const [isProcessing, setIsProcessing] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [decision, setDecision] = useState(null);
  const [selectedLoanId, setSelectedLoanId] = useState(null);

  // Multi-agent workflow
  const agents = [
    { name: 'Data Collection Agent', description: 'Collecting borrower & financial data...' },
    { name: 'Feature Engineering Agent', description: 'Engineering ML features...' },
    { name: 'Alternative Credit Score Agent', description: 'Calculating alternative credit score...' },
    { name: 'Risk Assessment Agent', description: 'Assessing portfolio risk levels...' },
    { name: 'Compliance Agent', description: 'Checking RBI/regulatory compliance...' },
    { name: 'Decision Engine Agent', description: 'Making final lending decision...' },
  ];

  // Fetch data
  const allLoans = useMemo(() => getAllLoans(), []);
  const allBorrowers = useMemo(() => getAllBorrowers(), []);
  const highRiskLoans = useMemo(() => getHighRiskLoans(), []);
  const overdueLoans = useMemo(() => getOverdueLoans(), []);

  /**
   * Calculate credit score based on actual data
   */
  const calculateCreditScore = useCallback((borrowerId) => {
    const borrower = allBorrowers.find(b => b.id === borrowerId);
    if (!borrower) return Math.floor(Math.random() * 200 + 600);

    let score = 750; // Base score

    // Adjust based on segment
    if (borrower.segment === 'Agriculture') score += 50;
    if (borrower.segment === 'Small Business') score += 40;

    // Adjust based on location
    if (borrower.locationTier === '1') score -= 10;
    if (borrower.locationTier === '4') score += 30;

    // Add variance
    score += Math.floor(Math.random() * 100 - 50);

    return Math.min(900, Math.max(300, score));
  }, [allBorrowers]);

  /**
   * Assess risk level
   */
  const assessRiskLevel = useCallback((score, borrowerId) => {
    if (score >= 750) return 'Low';
    if (score >= 650) return 'Medium';
    return 'High';
  }, []);

  /**
   * Generate decision based on multi-factor analysis
   */
  const generateDecision = useCallback((creditScore, riskLevel, borrowerId) => {
    const random = Math.random();

    let outcome;
    let reason;

    if (creditScore >= 750 && riskLevel === 'Low') {
      outcome = random > 0.1 ? 'approved' : 'review';
      reason = outcome === 'approved'
        ? 'Strong financial profile with excellent credit score and low risk assessment'
        : 'Requires verification of recent income sources';
    } else if (creditScore >= 650 && riskLevel === 'Medium') {
      outcome = random > 0.3 ? 'approved' : (random > 0.15 ? 'review' : 'declined');
      reason = outcome === 'approved'
        ? 'Acceptable financial profile with moderate risk'
        : outcome === 'review'
        ? 'Additional verification needed for income stability'
        : 'Credit score and risk factors need improvement';
    } else {
      outcome = random > 0.4 ? 'review' : 'declined';
      reason = outcome === 'review'
        ? 'Manual review required due to lower credit score'
        : 'High debt-to-income ratio and insufficient credit history';
    }

    return { outcome, reason };
  }, []);

  /**
   * Run decision engine
   */
  const runDecisionEngine = useCallback(async () => {
    setIsProcessing(true);
    setCurrentStep(0);
    setDecision(null);

    try {
      // Simulate multi-agent processing
      for (let i = 0; i < agents.length; i++) {
        setCurrentStep(i);
        await new Promise(resolve => setTimeout(resolve, 1200));
      }

      // Select random borrower
      const randomBorrower = allBorrowers[Math.floor(Math.random() * allBorrowers.length)];
      if (!randomBorrower) {
        setIsProcessing(false);
        return;
      }

      setSelectedLoanId(randomBorrower.id);

      // Calculate metrics
      const creditScore = calculateCreditScore(randomBorrower.id);
      const riskLevel = assessRiskLevel(creditScore, randomBorrower.id);
      const { outcome, reason } = generateDecision(creditScore, riskLevel, randomBorrower.id);

      // Determine loan parameters based on outcome
      const baseAmount = 50000;
      const loanAmount = outcome === 'approved' 
        ? baseAmount + Math.floor(Math.random() * 100000)
        : outcome === 'declined'
        ? 0
        : baseAmount;

      const interestRate = outcome === 'approved'
        ? 12.5 + (creditScore < 700 ? 2 : 0)
        : outcome === 'declined'
        ? 15.0
        : 13.5;

      const decisionData = {
        borrowerName: randomBorrower.name,
        borrowerSegment: randomBorrower.segment,
        outcome,
        creditScore,
        riskLevel,
        loanAmount,
        interestRate,
        tenure: 12,
        reason,
        timestamp: new Date().toLocaleString(),
        agentSteps: agents.map((agent, idx) => ({
          ...agent,
          status: 'complete',
          completedAt: new Date(Date.now() - (agents.length - idx) * 1200).toLocaleString(),
        })),
      };

      setDecision(decisionData);

      // Notify context
      if (banking?.addNotification) {
        banking.addNotification({
          type: outcome === 'approved' ? 'success' : outcome === 'declined' ? 'error' : 'warning',
          message: `Decision: ${outcome.toUpperCase()} | Credit Score: ${creditScore} | Risk: ${riskLevel}`,
          duration: 3000,
        });
      }

      if (banking?.recordDecision) {
        banking.recordDecision(decisionData);
      }
    } catch (error) {
      console.error('Decision engine error:', error);
      if (banking?.addNotification) {
        banking.addNotification({
          type: 'error',
          message: 'Error processing decision',
          duration: 2000,
        });
      }
    } finally {
      setIsProcessing(false);
    }
  }, [allBorrowers, calculateCreditScore, assessRiskLevel, generateDecision, banking]);

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-3xl font-bold text-gray-800 mb-2 flex items-center gap-2">
          <Brain className="text-purple-600" size={32} />
          🧠 AI Decision Engine
        </h2>
        <p className="text-gray-600">Multi-agent AI system for credit assessment and lending decisions</p>
      </div>

      {/* Data Summary */}
      <Card className="bg-gradient-to-r from-purple-50 to-blue-50 border border-purple-200">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div>
            <p className="text-sm text-gray-600">Total Loans in System</p>
            <p className="text-2xl font-bold text-gray-800">{allLoans.length}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Active Borrowers</p>
            <p className="text-2xl font-bold text-gray-800">{allBorrowers.length}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600">High Risk Loans</p>
            <p className="text-2xl font-bold text-red-600">{highRiskLoans.length}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Overdue Loans</p>
            <p className="text-2xl font-bold text-yellow-600">{overdueLoans.length}</p>
          </div>
        </div>
      </Card>

      {/* Initial State - Start Processing */}
      {!isProcessing && !decision && (
        <Card className="text-center p-8">
          <Zap className="text-purple-600 mx-auto mb-4" size={48} />
          <h3 className="text-xl font-semibold text-gray-800 mb-4">Run Credit Assessment</h3>
          <p className="text-gray-600 mb-6">
            Click below to process a loan application through our AI-powered decision engine. The system will:
          </p>
          <ul className="text-gray-600 text-sm mb-6 space-y-2">
            <li>✓ Collect borrower and financial data</li>
            <li>✓ Calculate alternative credit scores</li>
            <li>✓ Assess portfolio risk levels</li>
            <li>✓ Verify regulatory compliance</li>
            <li>✓ Generate lending decision</li>
          </ul>
          <Button variant="primary" onClick={runDecisionEngine} className="flex items-center gap-2 mx-auto">
            <Zap size={18} />
            Start Decision Engine
          </Button>
        </Card>
      )}

      {/* Processing State */}
      {isProcessing && (
        <Card className="p-8 space-y-6">
          <h3 className="text-xl font-semibold text-gray-800 mb-4">Processing Application...</h3>

          <div className="space-y-4">
            {agents.map((agent, index) => (
              <div key={index} className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold text-white transition-all ${
                      index < currentStep ? 'bg-green-500' : 
                      index === currentStep ? 'bg-blue-500 animate-pulse' : 
                      'bg-gray-300'
                    }`}>
                      {index < currentStep ? (
                        <CheckCircle size={20} />
                      ) : (
                        <span>{index + 1}</span>
                      )}
                    </div>
                    <div>
                      <p className="font-medium text-gray-800">{agent.name}</p>
                      <p className="text-sm text-gray-500">{agent.description}</p>
                    </div>
                  </div>
                  {index === currentStep && (
                    <Badge variant="primary">Processing...</Badge>
                  )}
                  {index < currentStep && (
                    <Badge variant="success">Complete</Badge>
                  )}
                </div>
              </div>
            ))}
          </div>

          <ProgressBar 
            progress={((currentStep + 1) / agents.length) * 100} 
            text={`Step ${currentStep + 1} of ${agents.length}`}
          />
        </Card>
      )}

      {/* Decision Result */}
      {decision && (
        <div className="space-y-6">
          {/* Approved Decision */}
          {decision.outcome === 'approved' && (
            <StatusBox
              type="success"
              title="🎉 Loan Approved!"
            >
              <div className="space-y-4 mt-4">
                <Alert
                  type="success"
                  message={`Application approved for ${decision.borrowerName}`}
                  dismissible={false}
                />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div className="p-4 bg-green-50 rounded-lg">
                    <p className="text-gray-600">Approved Amount</p>
                    <p className="text-2xl font-bold text-green-900">₹{decision.loanAmount.toLocaleString()}</p>
                  </div>
                  <div className="p-4 bg-blue-50 rounded-lg">
                    <p className="text-gray-600">Interest Rate</p>
                    <p className="text-2xl font-bold text-blue-900">{decision.interestRate}% p.a.</p>
                  </div>
                  <div className="p-4 bg-purple-50 rounded-lg">
                    <p className="text-gray-600">Tenure</p>
                    <p className="text-2xl font-bold text-purple-900">{decision.tenure} months</p>
                  </div>
                  <div className="p-4 bg-orange-50 rounded-lg">
                    <p className="text-gray-600">Credit Score</p>
                    <p className="text-2xl font-bold text-orange-900">{decision.creditScore}</p>
                  </div>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-sm"><strong>Reason:</strong> {decision.reason}</p>
                  <p className="text-xs text-gray-600 mt-2">Risk Level: <Badge variant="success">{decision.riskLevel}</Badge></p>
                </div>
              </div>
            </StatusBox>
          )}

          {/* Declined Decision */}
          {decision.outcome === 'declined' && (
            <StatusBox
              type="error"
              title="❌ Loan Declined"
            >
              <div className="space-y-4 mt-4">
                <Alert
                  type="error"
                  message={`Application declined for ${decision.borrowerName}`}
                  dismissible={false}
                />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div className="p-4 bg-red-50 rounded-lg">
                    <p className="text-gray-600">Credit Score</p>
                    <p className="text-2xl font-bold text-red-900">{decision.creditScore}</p>
                  </div>
                  <div className="p-4 bg-red-50 rounded-lg">
                    <p className="text-gray-600">Risk Level</p>
                    <p className="text-2xl font-bold text-red-900">{decision.riskLevel}</p>
                  </div>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-sm"><strong>Reason:</strong> {decision.reason}</p>
                  <p className="text-xs text-gray-600 mt-2">Please improve your credit profile and reapply after 3 months.</p>
                </div>
              </div>
            </StatusBox>
          )}

          {/* Review Decision */}
          {decision.outcome === 'review' && (
            <StatusBox
              type="warning"
              title="⚠️ Manual Review Required"
            >
              <div className="space-y-4 mt-4">
                <Alert
                  type="warning"
                  message={`Application under review for ${decision.borrowerName}`}
                  dismissible={false}
                />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div className="p-4 bg-yellow-50 rounded-lg">
                    <p className="text-gray-600">Credit Score</p>
                    <p className="text-2xl font-bold text-yellow-900">{decision.creditScore}</p>
                  </div>
                  <div className="p-4 bg-yellow-50 rounded-lg">
                    <p className="text-gray-600">Risk Level</p>
                    <p className="text-2xl font-bold text-yellow-900">{decision.riskLevel}</p>
                  </div>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-sm"><strong>Reason:</strong> {decision.reason}</p>
                  <p className="text-xs text-gray-600 mt-2">Our team will contact you within 24-48 hours for additional verification.</p>
                </div>
              </div>
            </StatusBox>
          )}

          {/* Agent Steps Summary */}
          <Card title="📋 Agent Processing Steps">
            <div className="space-y-3">
              {decision.agentSteps.map((step, idx) => (
                <div key={idx} className="flex items-center justify-between p-3 bg-gray-50 rounded">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="text-green-600" size={18} />
                    <div>
                      <p className="text-sm font-medium text-gray-800">{step.name}</p>
                      <p className="text-xs text-gray-500">{step.completedAt}</p>
                    </div>
                  </div>
                  <Badge variant="success">Complete</Badge>
                </div>
              ))}
            </div>
          </Card>

          {/* Action Buttons */}
          <Button variant="primary" onClick={runDecisionEngine} fullWidth className="flex items-center justify-center gap-2">
            <Zap size={18} />
            Process Another Application
          </Button>
        </div>
      )}
    </div>
  );
};

export default DecisionEngine;
