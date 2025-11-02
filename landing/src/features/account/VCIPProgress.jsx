import React, { useContext, useMemo, useEffect } from 'react';
import { BankingContext } from '../../context/Index'; // ✅ Added
import { ProgressBar, Alert } from '../../components/common/Index'; // ✅ Updated
import { CheckCircle, Loader, AlertCircle, Clock } from 'lucide-react'; // ✅ Added

/**
 * VCIPProgress Component
 * Displays multi-step progress tracking for account opening process
 * 
 * @param {number} progress - Progress percentage (0-100)
 * @param {number} currentStep - Current step index
 * @param {array} steps - Array of step objects with text and description
 * @param {string} status - Overall status ('processing', 'completed', 'failed')
 * @param {string} errorMessage - Error message if failed
 * @param {function} onRetry - Retry callback if failed
 * @param {number} estimatedTime - Estimated completion time in seconds
 * @param {boolean} autoAdvance - Auto-advance steps
 * @param {function} onStepComplete - Callback when step completes
 * @param {boolean} showEstimatedTime - Show estimated time
 */
const VCIPProgress = ({ 
  progress, 
  currentStep, 
  steps,
  status = 'processing', // ✅ Added
  errorMessage = '', // ✅ Added
  onRetry = null, // ✅ Added
  estimatedTime = null, // ✅ Added
  autoAdvance = false, // ✅ Added
  onStepComplete = null, // ✅ Added
  showEstimatedTime = true, // ✅ Added
}) => {
  // ✅ Get context
  const banking = useContext(BankingContext);

  // ✅ Calculate estimated time remaining
  const timeRemaining = useMemo(() => {
    if (!estimatedTime) return null;
    
    const progressPercentage = progress / 100;
    const remaining = Math.ceil(estimatedTime * (1 - progressPercentage));
    
    if (remaining <= 0) return null;
    if (remaining < 60) return `${remaining}s`;
    return `${Math.ceil(remaining / 60)}m`;
  }, [progress, estimatedTime]);

  // ✅ Format step details with validation
  const formattedSteps = useMemo(() => {
    return (steps || []).map((step, idx) => ({
      id: step.id || `step-${idx}`,
      text: step.text || `Step ${idx + 1}`,
      description: step.description || '',
      timestamp: step.timestamp || null,
      duration: step.duration || null,
    }));
  }, [steps]);

  // ✅ Track step completions
  useEffect(() => {
    if (currentStep < formattedSteps.length && onStepComplete) {
      const completedStep = formattedSteps[currentStep];
      if (completedStep) {
        onStepComplete({
          stepIndex: currentStep,
          stepId: completedStep.id,
          stepText: completedStep.text,
          timestamp: new Date(),
        });
      }
    }
  }, [currentStep, formattedSteps, onStepComplete]);

  // ✅ Track progress in context
  useEffect(() => {
    if (banking?.updateProgress) {
      banking.updateProgress({
        progress,
        currentStep,
        status,
        totalSteps: formattedSteps.length,
      });
    }
  }, [progress, currentStep, status, formattedSteps, banking]);

  // ✅ Handle retry
  const handleRetry = () => {
    if (onRetry) {
      onRetry();
    } else if (banking?.retryProcess) {
      banking.retryProcess();
    }
  };

  // ✅ Calculate completion time
  const completionPercentage = Math.round(progress);
  const allStepsCompleted = currentStep >= formattedSteps.length - 1;

  return (
    <div className="bg-white rounded-lg shadow-lg p-8 space-y-6">
      {/* Header */}
      <div className="text-center mb-6">
        <h3 className="text-2xl font-bold text-gray-800 mb-2">
          {status === 'completed' ? '✅ Process Completed' :
           status === 'failed' ? '❌ Process Failed' :
           'Processing Your Application'}
        </h3>
        <p className="text-gray-600">
          {status === 'completed' 
            ? 'Your account has been created successfully!'
            : status === 'failed'
            ? 'Something went wrong. Please try again.'
            : 'Please wait while we verify your details and create your account'}
        </p>
      </div>

      {/* ✅ Error Alert */}
      {status === 'failed' && errorMessage && (
        <Alert 
          type="error"
          message={errorMessage}
          dismissible={true}
        />
      )}

      {/* ✅ Success Alert */}
      {status === 'completed' && (
        <Alert 
          type="success"
          message="All steps completed successfully. Your account is now active!"
          dismissible={false}
        />
      )}

      {/* Progress Bar */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-semibold text-gray-700">Overall Progress</span>
          <span className="text-sm font-bold text-gray-900">{completionPercentage}%</span>
        </div>
        <ProgressBar
          progress={progress}
          text={formattedSteps[currentStep]?.text || 'Processing...'}
          color={status === 'failed' ? 'red' : 'blue'}
          height="lg"
          showStatus={true}
          status={status === 'completed' ? 'success' : status === 'failed' ? 'error' : 'info'}
        />
      </div>

      {/* ✅ Time Remaining */}
      {showEstimatedTime && timeRemaining && status === 'processing' && (
        <div className="flex items-center justify-center gap-2 text-sm text-gray-600 bg-gray-50 p-3 rounded-lg">
          <Clock size={16} />
          <span>Estimated time remaining: <strong>{timeRemaining}</strong></span>
        </div>
      )}

      {/* Step-by-step Progress */}
      <div className="space-y-4 mt-8">
        {formattedSteps.map((step, index) => {
          const isCompleted = index < currentStep;
          const isCurrent = index === currentStep;
          const isPending = index > currentStep;

          return (
            <div
              key={step.id}
              className={`flex items-center gap-4 p-4 rounded-lg transition-all ${
                isCompleted
                  ? 'bg-green-50 border-l-4 border-green-500'
                  : isCurrent
                  ? 'bg-blue-50 border-l-4 border-blue-500'
                  : 'bg-gray-50 border-l-4 border-gray-300'
              }`}
            >
              {/* Step Icon */}
              <div
                className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center ${
                  isCompleted
                    ? 'bg-green-500'
                    : isCurrent
                    ? 'bg-blue-500'
                    : 'bg-gray-300'
                }`}
              >
                {isCompleted ? (
                  <CheckCircle className="text-white" size={24} />
                ) : isCurrent ? (
                  <Loader className="text-white animate-spin" size={24} />
                ) : (
                  <span className="text-white font-semibold">{index + 1}</span>
                )}
              </div>

              {/* Step Details */}
              <div className="flex-1">
                <p
                  className={`font-semibold ${
                    isCompleted
                      ? 'text-green-800'
                      : isCurrent
                      ? 'text-blue-800'
                      : 'text-gray-600'
                  }`}
                >
                  {step.text}
                </p>
                {step.description && (
                  <p
                    className={`text-sm mt-1 ${
                      isCompleted
                        ? 'text-green-600'
                        : isCurrent
                        ? 'text-blue-600'
                        : 'text-gray-500'
                    }`}
                  >
                    {step.description}
                  </p>
                )}

                {/* ✅ Duration info */}
                {step.duration && (
                  <p className="text-xs text-gray-400 mt-1">
                    ⏱️ {step.duration}
                  </p>
                )}
              </div>

              {/* Status Badge */}
              <div>
                {isCompleted && (
                  <span className="px-3 py-1 bg-green-100 text-green-800 text-xs font-semibold rounded-full">
                    Completed
                  </span>
                )}
                {isCurrent && (
                  <span className="px-3 py-1 bg-blue-100 text-blue-800 text-xs font-semibold rounded-full animate-pulse">
                    In Progress...
                  </span>
                )}
                {isPending && (
                  <span className="px-3 py-1 bg-gray-100 text-gray-600 text-xs font-semibold rounded-full">
                    Pending
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* ✅ Process Summary */}
      {status === 'completed' && (
        <div className="mt-8 p-4 bg-green-50 rounded-lg border border-green-200">
          <div className="space-y-2">
            <p className="text-sm font-semibold text-green-900">Process Summary:</p>
            <ul className="text-sm text-green-800 space-y-1 list-disc list-inside">
              <li>All verification steps completed successfully</li>
              <li>Your account has been activated</li>
              <li>You can now proceed with loan applications</li>
              <li>Your account details have been sent to your email</li>
            </ul>
          </div>
        </div>
      )}

      {/* ✅ Failure Actions */}
      {status === 'failed' && onRetry && (
        <div className="mt-6 flex gap-3">
          <button
            onClick={handleRetry}
            className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
          >
            Retry Process
          </button>
          <button
            onClick={() => banking?.navigateTo?.('/dashboard')}
            className="flex-1 px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors font-medium"
          >
            Go to Dashboard
          </button>
        </div>
      )}

      {/* Additional Info */}
      <div className="mt-8 p-4 bg-blue-50 rounded-lg border border-blue-200">
        <p className="text-sm text-blue-800">
          <strong>💡 Tip:</strong> Keep your PAN and Aadhaar cards ready. The Video KYC 
          session will begin shortly after verification.
        </p>
      </div>

      {/* ✅ Debug Info (development only) */}
      {process.env.NODE_ENV === 'development' && (
        <div className="mt-6 p-3 bg-gray-100 rounded text-xs font-mono text-gray-700 max-h-24 overflow-y-auto">
          <p>Progress: {progress}% | Step: {currentStep}/{formattedSteps.length} | Status: {status}</p>
        </div>
      )}
    </div>
  );
};

export default VCIPProgress;
