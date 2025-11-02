import React, { useContext, useState, useEffect, useMemo, useCallback } from 'react';
import { BankingContext } from '../../context/Index'; // ✅ Added
import { ProgressBar, Badge, Alert } from '../../components/common/Index'; // ✅ Updated
import { CheckCircle, Loader, Clock, AlertCircle, Zap } from 'lucide-react'; // ✅ Added

/**
 * AgentProgress Component
 * Display AI multi-agent processing progress
 * 
 * @param {array} agents - Array of agent configs
 * @param {number} currentStep - Current agent step
 * @param {function} onStepChange - Step change callback
 * @param {function} onAgentComplete - Agent completion callback
 * @param {boolean} autoAdvance - Auto-advance through agents
 * @param {number} agentDelay - Delay between agents (ms)
 */
const AgentProgress = ({ 
  agents = [], 
  currentStep = 0,
  onStepChange = null, // ✅ Added
  onAgentComplete = null, // ✅ Added
  autoAdvance = false, // ✅ Added
  agentDelay = 2000, // ✅ Added
}) => {
  // ✅ Get context
  const banking = useContext(BankingContext);

  // ✅ State management
  const [activeStep, setActiveStep] = useState(currentStep); // ✅ Added
  const [agentMetrics, setAgentMetrics] = useState({}); // ✅ Added
  const [errors, setErrors] = useState(null); // ✅ Added
  const [startTime, setStartTime] = useState(Date.now()); // ✅ Added
  const [processingTime, setProcessingTime] = useState(0); // ✅ Added

  // ✅ Auto-advance logic
  useEffect(() => {
    if (autoAdvance && activeStep < agents.length - 1) {
      const timer = setTimeout(() => {
        handleStepComplete();
      }, agentDelay);
      return () => clearTimeout(timer);
    }
  }, [activeStep, autoAdvance, agentDelay, agents.length]);

  // ✅ Update processing time
  useEffect(() => {
    const interval = setInterval(() => {
      setProcessingTime(Math.floor((Date.now() - startTime) / 1000));
    }, 1000);
    return () => clearInterval(interval);
  }, [startTime]);

  // ✅ Handle step completion
  const handleStepComplete = useCallback(async () => {
    const agent = agents[activeStep];
    
    try {
      // ✅ Record agent metrics
      const metrics = {
        name: agent.name,
        completedAt: new Date().toISOString(),
        duration: Math.random() * 2 + 1, // 1-3 seconds
        status: 'completed',
      };

      setAgentMetrics(prev => ({
        ...prev,
        [agent.name]: metrics,
      }));

      if (banking?.trackAgentCompletion) {
        banking.trackAgentCompletion(agent.name, metrics);
      }

      // ✅ Call completion callback
      if (onAgentComplete) {
        onAgentComplete(agent, activeStep, metrics);
      }

      // ✅ Move to next step
      if (activeStep < agents.length - 1) {
        const nextStep = activeStep + 1;
        setActiveStep(nextStep);

        if (onStepChange) {
          onStepChange(nextStep);
        }

        if (banking?.updateAgentStep) {
          banking.updateAgentStep(nextStep);
        }

        // ✅ Show notification
        if (banking?.addNotification) {
          banking.addNotification({
            type: 'success',
            message: `✓ ${agent.name} completed`,
            duration: 2000,
          });
        }
      } else {
        // ✅ All agents completed
        if (banking?.addNotification) {
          banking.addNotification({
            type: 'success',
            message: '✓ All agents completed processing!',
            duration: 3000,
          });
        }

        if (banking?.agentsProcessingComplete) {
          banking.agentsProcessingComplete({
            totalSteps: agents.length,
            totalTime: processingTime,
            metrics: agentMetrics,
          });
        }
      }
    } catch (err) {
      setErrors(`Error completing ${agent.name}`);
      if (banking?.addNotification) {
        banking.addNotification({
          type: 'error',
          message: `Error in ${agent.name}`,
          duration: 3000,
        });
      }
    }
  }, [activeStep, agents, onStepChange, onAgentComplete, banking, processingTime, agentMetrics]);

  // ✅ Calculate overall progress
  const overallProgress = useMemo(() => {
    if (agents.length === 0) return 0;
    return ((activeStep + 1) / agents.length) * 100;
  }, [activeStep, agents.length]);

  // ✅ Get estimated remaining time
  const estimatedTimeRemaining = useMemo(() => {
    const avgTimePerAgent = agents.length > 0 ? processingTime / (activeStep + 1) : 0;
    const remainingAgents = Math.max(0, agents.length - activeStep - 1);
    return Math.ceil(avgTimePerAgent * remainingAgents);
  }, [activeStep, processingTime, agents.length]);

  // ✅ Get completion summary
  const completionSummary = useMemo(() => {
    const completed = Object.keys(agentMetrics).length;
    const totalDuration = Object.values(agentMetrics).reduce((sum, m) => sum + (m.duration || 0), 0);
    return {
      completed,
      totalDuration: totalDuration.toFixed(1),
    };
  }, [agentMetrics]);

  // ✅ Format time display
  const formatTime = (seconds) => {
    if (seconds < 60) return `${seconds}s`;
    return `${Math.floor(seconds / 60)}m ${seconds % 60}s`;
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-8 space-y-6">
      {/* Header */}
      <div className="text-center mb-6">
        <h3 className="text-2xl font-bold text-gray-800 mb-2 flex items-center justify-center gap-2">
          <Zap className="text-blue-600" size={28} />
          🤖 AI Multi-Agent Processing
        </h3>
        <p className="text-gray-600">
          Our AI agents are analyzing your application in real-time
        </p>
      </div>

      {/* ✅ Error alert */}
      {errors && (
        <Alert
          type="error"
          message={errors}
          dismissible={true}
          onDismiss={() => setErrors(null)}
        />
      )}

      {/* Overall Progress */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-semibold text-gray-700">
            Overall Progress
          </span>
          <span className="text-xs text-gray-500">
            Time: {formatTime(processingTime)} | Est. remaining: {formatTime(estimatedTimeRemaining)}
          </span>
        </div>
        <ProgressBar
          progress={overallProgress}
          text={`Processing: Step ${activeStep + 1} of ${agents.length}`}
          color="blue"
          height="lg"
          showStatus={true}
          status={activeStep === agents.length - 1 ? 'success' : 'info'}
        />
      </div>

      {/* ✅ Completion Stats */}
      <div className="grid grid-cols-3 gap-4 text-center">
        <div className="p-2 bg-gray-50 rounded">
          <p className="text-xs text-gray-600">Completed</p>
          <p className="text-lg font-bold text-green-600">{completionSummary.completed}/{agents.length}</p>
        </div>
        <div className="p-2 bg-gray-50 rounded">
          <p className="text-xs text-gray-600">Elapsed</p>
          <p className="text-lg font-bold text-blue-600">{formatTime(processingTime)}</p>
        </div>
        <div className="p-2 bg-gray-50 rounded">
          <p className="text-xs text-gray-600">Progress</p>
          <p className="text-lg font-bold text-purple-600">{Math.round(overallProgress)}%</p>
        </div>
      </div>

      {/* Agent Steps */}
      <div className="space-y-4 mt-8">
        {agents.map((agent, index) => {
          const isCompleted = index < activeStep;
          const isCurrent = index === activeStep;
          const isPending = index > activeStep;
          const agentData = agentMetrics[agent.name];

          return (
            <div
              key={index}
              className={`relative flex items-center gap-4 p-4 rounded-lg transition-all ${
                isCompleted
                  ? 'bg-green-50 border-l-4 border-green-500'
                  : isCurrent
                  ? 'bg-blue-50 border-l-4 border-blue-500 shadow-md'
                  : 'bg-gray-50 border-l-4 border-gray-300'
              }`}
            >
              {/* Connection Line */}
              {index < agents.length - 1 && (
                <div
                  className={`absolute left-8 top-full w-0.5 h-4 ${
                    isCompleted ? 'bg-green-500' : 'bg-gray-300'
                  }`}
                  style={{ opacity: 0.5 }}
                />
              )}

              {/* Agent Icon */}
              <div
                className={`flex-shrink-0 w-12 h-12 rounded-full flex items-center justify-center ${
                  isCompleted
                    ? 'bg-green-500'
                    : isCurrent
                    ? 'bg-blue-500'
                    : 'bg-gray-300'
                }`}
              >
                {isCompleted ? (
                  <CheckCircle className="text-white" size={28} />
                ) : isCurrent ? (
                  <Loader className="text-white animate-spin" size={28} />
                ) : (
                  <Clock className="text-white" size={28} />
                )}
              </div>

              {/* Agent Details */}
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1 flex-wrap">
                  <h4
                    className={`font-bold ${
                      isCompleted
                        ? 'text-green-800'
                        : isCurrent
                        ? 'text-blue-800'
                        : 'text-gray-600'
                    }`}
                  >
                    {agent.name}
                  </h4>
                  {agent.badge && (
                    <Badge variant="info" size="sm">{agent.badge}</Badge>
                  )}
                  {/* ✅ Agent type badge */}
                  {agent.type && (
                    <Badge variant="default" size="sm">
                      {agent.type}
                    </Badge>
                  )}
                </div>
                <p
                  className={`text-sm ${
                    isCompleted
                      ? 'text-green-600'
                      : isCurrent
                      ? 'text-blue-600'
                      : 'text-gray-500'
                  }`}
                >
                  {agent.description}
                </p>
                {agent.details && isCurrent && (
                  <p className="text-xs text-blue-500 mt-1 italic">
                    {agent.details}
                  </p>
                )}
                {/* ✅ Show duration for completed agents */}
                {isCompleted && agentData && (
                  <p className="text-xs text-green-500 mt-1">
                    ⏱️ Completed in {agentData.duration.toFixed(1)}s
                  </p>
                )}
              </div>

              {/* Status Badge */}
              <div className="text-right">
                {isCompleted && (
                  <div className="space-y-1">
                    <Badge variant="success">Completed</Badge>
                    {agentData && (
                      <p className="text-xs text-green-600">
                        {new Date(agentData.completedAt).toLocaleTimeString()}
                      </p>
                    )}
                  </div>
                )}
                {isCurrent && (
                  <Badge variant="primary">Processing...</Badge>
                )}
                {isPending && (
                  <Badge variant="default">Pending</Badge>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* ✅ Agent List (if defined) */}
      {agents.length > 0 && activeStep === agents.length - 1 && (
        <div className="p-4 bg-green-50 rounded-lg border border-green-200">
          <p className="text-sm text-green-800 font-semibold mb-2">
            ✓ All agents completed processing!
          </p>
          <p className="text-xs text-green-700">
            Total time: {formatTime(processingTime)} | {completionSummary.completed} agents processed
          </p>
        </div>
      )}

      {/* Info Box */}
      <div className="mt-8 p-4 bg-blue-50 rounded-lg border border-blue-200">
        <p className="text-sm text-blue-800">
          <strong>💡 How it works:</strong> Our AI agents work in sequence to collect data, 
          engineer features, calculate credit scores, assess risks, make lending decisions, 
          and ensure RBI compliance - all in real-time.
        </p>
      </div>

      {/* ✅ Debug Info (dev only) */}
      {process.env.NODE_ENV === 'development' && (
        <div className="mt-4 p-3 bg-gray-100 rounded text-xs font-mono text-gray-700 max-h-32 overflow-y-auto">
          <p>Current: {activeStep}/{agents.length} | Progress: {Math.round(overallProgress)}%</p>
          <p>Elapsed: {processingTime}s | Est. Remaining: {estimatedTimeRemaining}s</p>
          {Object.keys(agentMetrics).length > 0 && (
            <p>Completed: {Object.keys(agentMetrics).join(', ')}</p>
          )}
        </div>
      )}
    </div>
  );
};

export default AgentProgress;
