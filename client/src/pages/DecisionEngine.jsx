import React, { useState, useContext, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BankingContext } from '../context/Index';
import { 
  CheckCircle, XCircle, AlertCircle, Brain, Zap, 
  TrendingUp, BarChart3, PieChart as PieChartIcon,
  Award, Shield, Cpu, Users  // ✅ ADD Users HERE
} from 'lucide-react';
import { getAllLoans, getAllBorrowers, getHighRiskLoans, getOverdueLoans } from '../data/Index';

/**
 * Card Component
 */
const Card = ({ children, className = '', title = null }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    className={`bg-white rounded-lg border-2 border-blue-200 shadow-sm hover:shadow-md transition-shadow p-6 ${className}`}
  >
    {title && <h3 className="text-lg font-bold text-gray-900 mb-6 tracking-tight uppercase">{title}</h3>}
    {children}
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
    primary: 'bg-cyan-100 text-cyan-800',
  };
  
  return (
    <motion.span
      initial={{ scale: 0 }}
      animate={{ scale: 1 }}
      className={`px-3 py-1 rounded-full text-xs font-black tracking-wide inline-block ${variants[variant]}`}
    >
      {children}
    </motion.span>
  );
};

/**
 * Progress Bar Component
 */
const ProgressBar = ({ progress, text }) => (
  <motion.div className="space-y-2">
    <div className="flex justify-between items-center mb-2">
      <span className="text-sm font-bold text-gray-900 uppercase tracking-wide">Progress</span>
      <span className="text-sm font-black text-blue-600">{text}</span>
    </div>
    <div className="w-full h-3 bg-gray-200 rounded-full overflow-hidden border-2 border-blue-300">
      <motion.div
        className="h-full bg-gradient-to-r from-blue-500 to-cyan-400"
        initial={{ width: 0 }}
        animate={{ width: `${progress}%` }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
      />
    </div>
  </motion.div>
);

/**
 * StatusBox Component
 */
const StatusBox = ({ type = 'success', title, children }) => {
  const typeStyles = {
    success: 'bg-green-50 border-green-300 text-green-900',
    error: 'bg-red-50 border-red-300 text-red-900',
    warning: 'bg-yellow-50 border-yellow-300 text-yellow-900',
  };
  
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className={`rounded-lg border-2 p-8 ${typeStyles[type]}`}
    >
      <h3 className="font-black text-2xl mb-4 tracking-tighter">{title}</h3>
      {children}
    </motion.div>
  );
};

/**
 * Alert Component
 */
const Alert = ({ type = 'info', message, dismissible = true }) => {
  const [show, setShow] = useState(true);
  
  if (!show) return null;
  
  const typeStyles = {
    info: 'bg-blue-50 border-blue-300 text-blue-900',
    success: 'bg-green-50 border-green-300 text-green-900',
    warning: 'bg-yellow-50 border-yellow-300 text-yellow-900',
    error: 'bg-red-50 border-red-300 text-red-900',
  };
  
  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className={`rounded-lg border-2 p-4 flex items-start gap-3 ${typeStyles[type]}`}
    >
      <AlertCircle size={20} className="flex-shrink-0 mt-0.5 font-bold" />
      <p className="font-bold text-sm flex-1 tracking-tight">{message}</p>
      {dismissible && (
        <button
          onClick={() => setShow(false)}
          className="text-lg font-black hover:opacity-70 flex-shrink-0"
        >
          ×
        </button>
      )}
    </motion.div>
  );
};

/**
 * Button Component
 */
const Button = ({ children, variant = 'primary', onClick, fullWidth, disabled, className = '' }) => {
  const variants = {
    primary: 'bg-gradient-to-r from-blue-500 to-cyan-400 text-white hover:shadow-lg font-bold disabled:opacity-50',
    outline: 'bg-white border-2 border-blue-300 text-blue-700 hover:bg-blue-50 font-bold',
  };
  
  return (
    <motion.button
      onClick={onClick}
      disabled={disabled}
      className={`px-6 py-3 rounded-lg transition-all text-sm tracking-wide uppercase ${variants[variant]} ${fullWidth ? 'w-full' : ''} ${className}`}
      whileHover={{ scale: disabled ? 1 : 1.05 }}
      whileTap={{ scale: disabled ? 1 : 0.98 }}
    >
      {children}
    </motion.button>
  );
};

/**
 * DecisionEngine Component - CredBridge
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
    { 
      name: 'Data Collection Agent', 
      description: 'Collecting borrower & financial data...',
      icon: Cpu
    },
    { 
      name: 'Feature Engineering Agent', 
      description: 'Engineering ML features from alternative data...',
      icon: BarChart3
    },
    { 
      name: 'Alternative Credit Score Agent', 
      description: 'Calculating AI-powered credit score...',
      icon: TrendingUp
    },
    { 
      name: 'Risk Assessment Agent', 
      description: 'Assessing portfolio risk levels...',
      icon: Shield
    },
    { 
      name: 'Compliance Agent', 
      description: 'Checking RBI/regulatory compliance...',
      icon: Award
    },
    { 
      name: 'Decision Engine Agent', 
      description: 'Making final lending decision...',
      icon: Brain
    },
  ];

  // Fetch data
  const allLoans = useMemo(() => getAllLoans(), []);
  const allBorrowers = useMemo(() => getAllBorrowers(), []);
  const highRiskLoans = useMemo(() => getHighRiskLoans(), []);
  const overdueLoans = useMemo(() => getOverdueLoans(), []);

  /**
   * Calculate credit score
   */
  const calculateCreditScore = useCallback((borrowerId) => {
    const borrower = allBorrowers.find(b => b.id === borrowerId);
    if (!borrower) return Math.floor(Math.random() * 200 + 600);

    let score = 750;
    if (borrower.segment === 'Agriculture') score += 50;
    if (borrower.segment === 'Small Business') score += 40;
    if (borrower.locationTier === '1') score -= 10;
    if (borrower.locationTier === '4') score += 30;
    score += Math.floor(Math.random() * 100 - 50);

    return Math.min(900, Math.max(300, score));
  }, [allBorrowers]);

  /**
   * Assess risk level
   */
  const assessRiskLevel = useCallback((score) => {
    if (score >= 750) return 'Low';
    if (score >= 650) return 'Medium';
    return 'High';
  }, []);

  /**
   * Generate decision
   */
  const generateDecision = useCallback((creditScore, riskLevel) => {
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
      for (let i = 0; i < agents.length; i++) {
        setCurrentStep(i);
        await new Promise(resolve => setTimeout(resolve, 1200));
      }

      const randomBorrower = allBorrowers[Math.floor(Math.random() * allBorrowers.length)];
      if (!randomBorrower) {
        setIsProcessing(false);
        return;
      }

      setSelectedLoanId(randomBorrower.id);

      const creditScore = calculateCreditScore(randomBorrower.id);
      const riskLevel = assessRiskLevel(creditScore);
      const { outcome, reason } = generateDecision(creditScore, riskLevel);

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
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="max-w-5xl mx-auto space-y-8 p-6"
    >
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-5xl font-black text-gray-900 mb-2 tracking-tighter flex items-center gap-3">
          <Brain className="text-blue-600" size={40} />
          🧠 AI Decision Engine
        </h1>
        <p className="text-gray-800 font-bold">Multi-agent AI system for intelligent credit assessment and lending decisions</p>
      </motion.div>

      {/* Data Summary */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <Card className="bg-gradient-to-r from-purple-50 via-blue-50 to-cyan-50 border-2 border-blue-300">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { label: 'Total Loans', value: allLoans.length, Icon: BarChart3 },
              { label: 'Active Borrowers', value: allBorrowers.length, Icon: Users },
              { label: 'High Risk Loans', value: highRiskLoans.length, Icon: AlertCircle, color: 'text-red-600' },
              { label: 'Overdue Loans', value: overdueLoans.length, Icon: AlertCircle, color: 'text-yellow-600' },
            ].map((item, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: idx * 0.1 }}
                className="text-center"
              >
                <div className="flex justify-center mb-2">
                  <item.Icon className={item.color || 'text-blue-600'} size={24} />
                </div>
                <p className="text-xs text-gray-700 font-bold uppercase tracking-wider mb-2">
                  {item.label}
                </p>
                <p className={`text-3xl font-black tracking-tight ${item.color || 'text-blue-600'}`}>
                  {item.value}
                </p>
              </motion.div>
            ))}
          </div>
        </Card>
      </motion.div>

      {/* Initial State - Start Processing */}
      <AnimatePresence mode="wait">
        {!isProcessing && !decision && (
          <motion.div
            key="initial"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
          >
            <Card className="text-center p-12">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
              >
                <Zap className="text-blue-600 mx-auto mb-6" size={56} />
              </motion.div>
              <h2 className="text-3xl font-black text-gray-900 mb-4 tracking-tight uppercase">
                Run AI Credit Assessment
              </h2>
              <p className="text-gray-800 font-bold mb-8 max-w-xl mx-auto leading-relaxed">
                Analyze a loan application through our intelligent multi-agent decision engine.
              </p>
              <ul className="text-gray-800 text-sm font-bold mb-10 space-y-3 max-w-lg mx-auto text-left">
                <li className="flex items-center gap-3">
                  <CheckCircle className="text-green-600 flex-shrink-0" size={20} />
                  <span>Collect borrower and financial data</span>
                </li>
                <li className="flex items-center gap-3">
                  <CheckCircle className="text-green-600 flex-shrink-0" size={20} />
                  <span>Calculate alternative credit scores</span>
                </li>
                <li className="flex items-center gap-3">
                  <CheckCircle className="text-green-600 flex-shrink-0" size={20} />
                  <span>Assess portfolio risk levels</span>
                </li>
                <li className="flex items-center gap-3">
                  <CheckCircle className="text-green-600 flex-shrink-0" size={20} />
                  <span>Verify regulatory compliance</span>
                </li>
                <li className="flex items-center gap-3">
                  <CheckCircle className="text-green-600 flex-shrink-0" size={20} />
                  <span>Generate lending decision</span>
                </li>
              </ul>
              <Button 
                variant="primary" 
                onClick={runDecisionEngine} 
                className="flex items-center justify-center gap-2 mx-auto py-4 px-8 text-base"
              >
                <Zap size={24} />
                Start Decision Engine
              </Button>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Processing State */}
      <AnimatePresence mode="wait">
        {isProcessing && (
          <motion.div
            key="processing"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
          >
            <Card className="p-8 space-y-8">
              <h2 className="text-2xl font-black text-gray-900 uppercase tracking-tight">
                Processing Application...
              </h2>

              <div className="space-y-6">
                {agents.map((agent, index) => {
                  const Icon = agent.icon;
                  return (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="space-y-3"
                    >
                      <div className="flex items-center gap-4">
                        <motion.div
                          className={`w-14 h-14 rounded-full flex items-center justify-center flex-shrink-0 border-2 font-bold text-white ${
                            index < currentStep 
                              ? 'bg-green-500 border-green-600' 
                              : index === currentStep 
                              ? 'bg-blue-500 border-blue-600'
                              : 'bg-gray-300 border-gray-400'
                          }`}
                          animate={index === currentStep ? { scale: [1, 1.1, 1] } : {}}
                          transition={{ duration: 1.5, repeat: Infinity }}
                        >
                          {index < currentStep ? (
                            <CheckCircle size={24} />
                          ) : (
                            <Icon size={24} />
                          )}
                        </motion.div>

                        <div className="flex-1">
                          <p className={`font-black ${
                            index < currentStep
                              ? 'text-green-900'
                              : index === currentStep
                              ? 'text-blue-900'
                              : 'text-gray-600'
                          } uppercase tracking-tight text-lg`}>
                            {agent.name}
                          </p>
                          <p className="text-sm text-gray-700 font-bold mt-1">
                            {agent.description}
                          </p>
                        </div>

                        {index === currentStep && (
                          <Badge variant="primary">In Progress</Badge>
                        )}
                        {index < currentStep && (
                          <Badge variant="success">Complete</Badge>
                        )}
                      </div>
                    </motion.div>
                  );
                })}
              </div>

              <ProgressBar 
                progress={((currentStep + 1) / agents.length) * 100} 
                text={`Step ${currentStep + 1} of ${agents.length}`}
              />
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Decision Result */}
      <AnimatePresence mode="wait">
        {decision && (
          <motion.div
            key="decision"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-8"
          >
            {/* Approved */}
            {decision.outcome === 'approved' && (
              <StatusBox
                type="success"
                title="✅ Loan Approved!"
              >
                <div className="mt-6 space-y-6 font-bold text-green-900">
                  <Alert
                    type="success"
                    message={`Application approved for ${decision.borrowerName}`}
                    dismissible={false}
                  />

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {[
                      { label: 'Approved Amount', value: `₹${decision.loanAmount.toLocaleString()}`, color: 'bg-green-50 border-green-300' },
                      { label: 'Interest Rate', value: `${decision.interestRate}% p.a.`, color: 'bg-blue-50 border-blue-300' },
                      { label: 'Tenure', value: `${decision.tenure} months`, color: 'bg-cyan-50 border-cyan-300' },
                      { label: 'Credit Score', value: decision.creditScore, color: 'bg-purple-50 border-purple-300' },
                    ].map((item, idx) => (
                      <motion.div
                        key={idx}
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: idx * 0.1 }}
                        className={`p-6 rounded-lg border-2 ${item.color}`}
                      >
                        <p className="text-xs text-gray-700 font-black uppercase tracking-wider mb-2">
                          {item.label}
                        </p>
                        <p className="text-2xl font-black text-gray-900">
                          {item.value}
                        </p>
                      </motion.div>
                    ))}
                  </div>

                  <div className="bg-white rounded-lg border-2 border-green-300 p-6">
                    <p className="font-black text-lg mb-2 uppercase tracking-tight">✓ Approval Details</p>
                    <p className="mb-3">{decision.reason}</p>
                    <Badge variant="success">Risk Level: {decision.riskLevel}</Badge>
                  </div>
                </div>
              </StatusBox>
            )}

            {/* Declined */}
            {decision.outcome === 'declined' && (
              <StatusBox
                type="error"
                title="❌ Loan Declined"
              >
                <div className="mt-6 space-y-6 font-bold text-red-900">
                  <Alert
                    type="error"
                    message={`Application declined for ${decision.borrowerName}`}
                    dismissible={false}
                  />

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="p-6 bg-red-50 rounded-lg border-2 border-red-300">
                      <p className="text-xs text-gray-700 font-black uppercase tracking-wider mb-2">
                        Credit Score
                      </p>
                      <p className="text-2xl font-black text-red-900">
                        {decision.creditScore}
                      </p>
                    </div>
                    <div className="p-6 bg-red-50 rounded-lg border-2 border-red-300">
                      <p className="text-xs text-gray-700 font-black uppercase tracking-wider mb-2">
                        Risk Level
                      </p>
                      <p className="text-2xl font-black text-red-900">
                        {decision.riskLevel}
                      </p>
                    </div>
                  </div>

                  <div className="bg-white rounded-lg border-2 border-red-300 p-6">
                    <p className="font-black text-lg mb-2 uppercase tracking-tight">✗ Decline Reason</p>
                    <p className="mb-4">{decision.reason}</p>
                    <p className="text-sm">Please improve your credit profile and reapply after 3 months.</p>
                  </div>
                </div>
              </StatusBox>
            )}

            {/* Review */}
            {decision.outcome === 'review' && (
              <StatusBox
                type="warning"
                title="⚠️ Manual Review Required"
              >
                <div className="mt-6 space-y-6 font-bold text-yellow-900">
                  <Alert
                    type="warning"
                    message={`Application under review for ${decision.borrowerName}`}
                    dismissible={false}
                  />

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="p-6 bg-yellow-50 rounded-lg border-2 border-yellow-300">
                      <p className="text-xs text-gray-700 font-black uppercase tracking-wider mb-2">
                        Credit Score
                      </p>
                      <p className="text-2xl font-black text-yellow-900">
                        {decision.creditScore}
                      </p>
                    </div>
                    <div className="p-6 bg-yellow-50 rounded-lg border-2 border-yellow-300">
                      <p className="text-xs text-gray-700 font-black uppercase tracking-wider mb-2">
                        Risk Level
                      </p>
                      <p className="text-2xl font-black text-yellow-900">
                        {decision.riskLevel}
                      </p>
                    </div>
                  </div>

                  <div className="bg-white rounded-lg border-2 border-yellow-300 p-6">
                    <p className="font-black text-lg mb-2 uppercase tracking-tight">🔍 Review Details</p>
                    <p className="mb-4">{decision.reason}</p>
                    <p className="text-sm">Our team will contact you within 24-48 hours for additional verification.</p>
                  </div>
                </div>
              </StatusBox>
            )}

            {/* Agent Steps */}
            <Card title="📋 Agent Processing Steps">
              <div className="space-y-4">
                {decision.agentSteps.map((step, idx) => (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.05 }}
                    className="flex items-center justify-between p-4 bg-gradient-to-r from-blue-50 to-cyan-50 rounded-lg border-2 border-blue-200"
                  >
                    <div className="flex items-center gap-3">
                      <CheckCircle className="text-green-600 flex-shrink-0" size={20} />
                      <div>
                        <p className="text-sm font-bold text-gray-900 tracking-tight">
                          {step.name}
                        </p>
                        <p className="text-xs text-gray-600 font-medium">
                          {step.completedAt}
                        </p>
                      </div>
                    </div>
                    <Badge variant="success">Complete</Badge>
                  </motion.div>
                ))}
              </div>
            </Card>

            {/* Action Button */}
            <Button 
              variant="primary" 
              onClick={runDecisionEngine} 
              fullWidth 
              className="flex items-center justify-center gap-2 py-4 text-base"
            >
              <Zap size={24} />
              Process Another Application
            </Button>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default DecisionEngine;
