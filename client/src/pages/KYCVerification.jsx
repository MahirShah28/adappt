import React, { useState, useContext, useMemo, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BankingContext } from '../context/Index';
import { 
  Video, Fingerprint, FileText, Database, CheckCircle, XCircle, 
  Clock, Shield, AlertCircle, ArrowRight, Download
} from 'lucide-react';
import { getAllBorrowers } from '../data/Index';

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
const Badge = ({ children, variant = 'default', size = 'md' }) => {
  const variants = {
    default: 'bg-blue-100 text-blue-800',
    success: 'bg-green-100 text-green-800',
    warning: 'bg-yellow-100 text-yellow-800',
    danger: 'bg-red-100 text-red-800',
    info: 'bg-cyan-100 text-cyan-800',
    primary: 'bg-purple-100 text-purple-800',
  };

  const sizes = {
    sm: 'px-2 py-1 text-xs',
    md: 'px-3 py-2 text-sm',
  };
  
  return (
    <motion.span
      initial={{ scale: 0 }}
      animate={{ scale: 1 }}
      className={`rounded-full font-black tracking-wide inline-block ${variants[variant]} ${sizes[size]}`}
    >
      {children}
    </motion.span>
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
 * Progress Bar Component
 */
const ProgressBar = ({ progress, text }) => (
  <motion.div className="space-y-2">
    <div className="flex justify-between items-center mb-2">
      <span className="text-sm font-bold text-gray-900 uppercase tracking-wide">Progress</span>
      <span className="text-sm font-black text-blue-600">{text}</span>
    </div>
    <div className="w-full h-4 bg-gray-200 rounded-full overflow-hidden border-2 border-blue-300">
      <motion.div
        className="h-full bg-gradient-to-r from-blue-500 to-cyan-400"
        initial={{ width: 0 }}
        animate={{ width: `${progress}%` }}
        transition={{ duration: 0.8, ease: 'easeOut' }}
      />
    </div>
  </motion.div>
);

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
 * KYCVerification Component - CredBridge
 */
const KYCVerification = () => {
  const banking = useContext(BankingContext);

  // State management
  const [selectedMethod, setSelectedMethod] = useState(null);
  const [isVerifying, setIsVerifying] = useState(false);
  const [verificationResult, setVerificationResult] = useState(null);
  const [selectedBorrower, setSelectedBorrower] = useState(null);
  const [completedSteps, setCompletedSteps] = useState([]);

  // Fetch data
  const borrowers = useMemo(() => getAllBorrowers(), []);

  // KYC Methods
  const kycMethods = [
    {
      id: 'video',
      name: 'Video KYC (V-CIP)',
      icon: Video,
      description: 'Live video call with KYC officer for complete identity verification',
      time: '5-10 minutes',
      compliance: 'RBI Compliant',
      requirements: ['Valid ID Proof', 'Proof of Address', 'Clear lighting'],
      successRate: 92,
    },
    {
      id: 'biometric',
      name: 'Biometric eKYC',
      icon: Fingerprint,
      description: 'Aadhaar-based biometric verification for instant authentication',
      time: '2-3 minutes',
      compliance: 'UIDAI Approved',
      requirements: ['Aadhaar Card', 'Biometric Data', 'Phone Number'],
      successRate: 95,
    },
    {
      id: 'digilocker',
      name: 'DigiLocker KYC',
      icon: FileText,
      description: 'Fetch verified documents directly from Government DigiLocker',
      time: '3-5 minutes',
      compliance: 'Government of India',
      requirements: ['DigiLocker Account', 'Aadhaar', 'Email/Phone'],
      successRate: 98,
    },
    {
      id: 'ckyc',
      name: 'CKYC Registry',
      icon: Database,
      description: 'Check Central KYC Records Registry for existing KYC data',
      time: '1-2 minutes',
      compliance: 'RBI Compliant',
      requirements: ['PAN Card', 'Identification Number'],
      successRate: 99,
    },
  ];

  // Verification steps
  const verificationSteps = [
    { id: 1, name: 'Identity Verification', status: 'pending' },
    { id: 2, name: 'Address Verification', status: 'pending' },
    { id: 3, name: 'Document Validation', status: 'pending' },
    { id: 4, name: 'Compliance Check', status: 'pending' },
    { id: 5, name: 'Final Approval', status: 'pending' },
  ];

  /**
   * Handle verification
   */
  const handleVerify = useCallback(async (methodId) => {
    setSelectedMethod(methodId);
    setIsVerifying(true);
    setVerificationResult(null);
    setCompletedSteps([]);

    try {
      for (let i = 1; i <= 5; i++) {
        await new Promise(resolve => setTimeout(resolve, 800));
        setCompletedSteps(prev => [...prev, i]);
      }

      const method = kycMethods.find(m => m.id === methodId);
      const successProbability = method.successRate / 100;
      const success = Math.random() < successProbability;

      const randomBorrower = borrowers[Math.floor(Math.random() * borrowers.length)];

      const verificationData = {
        success,
        method: method.name,
        methodId,
        timestamp: new Date().toLocaleString(),
        borrowerName: randomBorrower?.name || 'Test User',
        borrowerId: randomBorrower?.id || 'USER001',
        details: success 
          ? {
              message: 'Identity verified successfully!',
              summary: 'All documents validated and cross-checked with government records.',
              verificationId: `KYC${Date.now()}`,
              complianceStatus: 'Compliant',
            }
          : {
              message: 'Verification could not be completed.',
              summary: 'Please verify documents match provided information or try alternative method.',
              reason: 'Document mismatch detected',
            },
        successRate: method.successRate,
        stepsCompleted: 5,
        totalSteps: 5,
      };

      setVerificationResult(verificationData);
      setSelectedBorrower(randomBorrower);

      if (banking?.addNotification) {
        banking.addNotification({
          type: success ? 'success' : 'error',
          message: success 
            ? `KYC Verified via ${method.name}`
            : `KYC Verification Failed via ${method.name}`,
          duration: 3000,
        });
      }

      if (banking?.recordKYCVerification) {
        banking.recordKYCVerification(verificationData);
      }
    } catch (error) {
      console.error('Verification error:', error);
      if (banking?.addNotification) {
        banking.addNotification({
          type: 'error',
          message: 'Verification process encountered an error',
          duration: 2000,
        });
      }
    } finally {
      setIsVerifying(false);
    }
  }, [kycMethods, borrowers, banking]);

  /**
   * Reset
   */
  const handleReset = useCallback(() => {
    setVerificationResult(null);
    setSelectedMethod(null);
    setCompletedSteps([]);
    setSelectedBorrower(null);
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="max-w-6xl mx-auto space-y-8 p-6"
    >
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-5xl font-black text-gray-900 mb-2 tracking-tighter flex items-center gap-3">
          <Shield className="text-blue-600" size={40} />
          🛡️ KYC Verification
        </h1>
        <p className="text-gray-800 font-bold">Choose your preferred verification method to get started</p>
      </motion.div>

      {/* Compliance Notice */}
      <Alert
        type="info"
        message="🔒 As per RBI guidelines, KYC verification is mandatory for opening a bank account or applying for a loan. All data is encrypted and secure with 256-bit encryption."
        dismissible={false}
      />

      {/* System Status */}
      <AnimatePresence>
        {!verificationResult && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
          >
            <Card className="bg-gradient-to-r from-blue-50 via-cyan-50 to-purple-50 border-2 border-blue-300">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                {[
                  { label: 'Total Borrowers', value: borrowers.length, icon: '👥' },
                  { label: 'Verification Methods', value: kycMethods.length, icon: '🔐' },
                  { 
                    label: 'Average Success Rate', 
                    value: `${(kycMethods.reduce((sum, m) => sum + m.successRate, 0) / kycMethods.length).toFixed(1)}%`,
                    icon: '✓'
                  },
                  { label: 'System Status', value: 'Online', icon: '🟢' },
                ].map((item, idx) => (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: idx * 0.1 }}
                    className="text-center"
                  >
                    <div className="text-3xl mb-2">{item.icon}</div>
                    <p className="text-xs text-gray-700 font-bold uppercase tracking-wider mb-1">
                      {item.label}
                    </p>
                    <p className="text-2xl font-black text-gray-900 tracking-tight">
                      {item.value}
                    </p>
                  </motion.div>
                ))}
              </div>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      {/* KYC Methods Grid */}
      <AnimatePresence mode="wait">
        {!verificationResult && !isVerifying && (
          <motion.div
            key="methods"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="grid grid-cols-1 md:grid-cols-2 gap-8"
          >
            {kycMethods.map((method, idx) => {
              const Icon = method.icon;
              return (
                <motion.div
                  key={method.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.1 }}
                >
                  <Card className="h-full hover:shadow-xl transition-all">
                    <div className="space-y-6">
                      {/* Header */}
                      <div className="flex items-start gap-4">
                        <motion.div
                          className="w-16 h-16 bg-gradient-to-br from-blue-500 to-cyan-400 rounded-lg flex items-center justify-center flex-shrink-0 shadow-lg"
                          whileHover={{ rotate: 10, scale: 1.1 }}
                        >
                          <Icon className="text-white" size={32} />
                        </motion.div>
                        <div className="flex-1">
                          <h3 className="font-black text-gray-900 text-lg tracking-tight">
                            {method.name}
                          </h3>
                          <p className="text-sm text-gray-700 font-medium mt-1">
                            {method.description}
                          </p>
                        </div>
                      </div>

                      {/* Info Badges */}
                      <div className="flex flex-wrap gap-2">
                        <Badge variant="info" size="sm">
                          ⏱️ {method.time}
                        </Badge>
                        <Badge variant="success" size="sm">
                          ✓ {method.compliance}
                        </Badge>
                        <Badge variant="primary" size="sm">
                          Success: {method.successRate}%
                        </Badge>
                      </div>

                      {/* Requirements */}
                      <div>
                        <p className="text-xs font-black text-gray-900 mb-3 uppercase tracking-wide">
                          Requirements:
                        </p>
                        <ul className="space-y-2">
                          {method.requirements.map((req, idx) => (
                            <motion.li
                              key={idx}
                              initial={{ opacity: 0, x: -10 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: idx * 0.05 }}
                              className="text-sm text-gray-700 font-bold flex items-center gap-2"
                            >
                              <CheckCircle size={16} className="text-green-600 flex-shrink-0" />
                              {req}
                            </motion.li>
                          ))}
                        </ul>
                      </div>

                      {/* Button */}
                      <Button
                        variant="primary"
                        onClick={() => handleVerify(method.id)}
                        disabled={isVerifying}
                        fullWidth
                        className="flex items-center justify-center gap-2 py-4"
                      >
                        <ArrowRight size={18} />
                        Start Verification
                      </Button>
                    </div>
                  </Card>
                </motion.div>
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Verification In Progress */}
      <AnimatePresence mode="wait">
        {isVerifying && (
          <motion.div
            key="verifying"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
          >
            <Card className="text-center p-12">
              <div className="space-y-8">
                <motion.div
                  animate={{ scale: [1, 1.1, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  <Shield className="text-blue-600 mx-auto mb-4" size={56} />
                </motion.div>

                <div>
                  <h2 className="text-3xl font-black text-gray-900 mb-3 uppercase tracking-tight">
                    Verifying Your Identity...
                  </h2>
                  <p className="text-gray-800 font-bold">
                    Please wait while we verify your KYC documents using{' '}
                    <span className="text-blue-600">
                      {kycMethods.find(m => m.id === selectedMethod)?.name}
                    </span>
                  </p>
                </div>

                {/* Progress Steps */}
                <div className="space-y-4 bg-blue-50 rounded-lg p-6 border-2 border-blue-200">
                  {verificationSteps.map((step, idx) => (
                    <motion.div
                      key={step.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: idx * 0.1 }}
                      className="flex items-center gap-4"
                    >
                      <motion.div
                        className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-black text-white ${
                          completedSteps.includes(step.id) 
                            ? 'bg-green-500' 
                            : 'bg-gray-400'
                        }`}
                        animate={!completedSteps.includes(step.id) && step.id === Math.max(...completedSteps, 0) + 1 ? { scale: [1, 1.2, 1] } : {}}
                        transition={{ duration: 1.5, repeat: Infinity }}
                      >
                        {completedSteps.includes(step.id) ? (
                          <CheckCircle size={20} />
                        ) : (
                          step.id
                        )}
                      </motion.div>
                      <p className="text-sm font-bold text-gray-900 flex-1 text-left">
                        {step.name}
                      </p>
                      {completedSteps.includes(step.id) && (
                        <Badge variant="success" size="sm">Complete</Badge>
                      )}
                    </motion.div>
                  ))}
                </div>

                <ProgressBar
                  progress={(completedSteps.length / 5) * 100}
                  text={`Step ${completedSteps.length} of 5 Complete`}
                />
              </div>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Verification Result */}
      <AnimatePresence mode="wait">
        {verificationResult && (
          <motion.div
            key="result"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-8"
          >
            {/* Result Status */}
            <StatusBox
              type={verificationResult.success ? 'success' : 'error'}
              title={verificationResult.success ? '✅ KYC Verified Successfully!' : '❌ Verification Failed'}
            >
              <div className="mt-6 space-y-6 font-bold text-gray-900">
                <Alert
                  type={verificationResult.success ? 'success' : 'error'}
                  message={verificationResult.details.message}
                  dismissible={false}
                />

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {[
                    { 
                      label: 'Verification ID', 
                      value: verificationResult.details.verificationId || 'N/A',
                      type: 'id'
                    },
                    { 
                      label: 'Method', 
                      value: verificationResult.method,
                      type: 'text'
                    },
                    { 
                      label: 'Time', 
                      value: verificationResult.timestamp,
                      type: 'time'
                    },
                    { 
                      label: 'Borrower', 
                      value: verificationResult.borrowerName,
                      type: 'text'
                    },
                    { 
                      label: 'Status', 
                      value: verificationResult.details.complianceStatus || 'Compliant',
                      type: 'status'
                    },
                    { 
                      label: 'Success Rate', 
                      value: `${verificationResult.successRate}%`,
                      type: 'percent'
                    },
                  ].map((item, idx) => (
                    <motion.div
                      key={idx}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: idx * 0.05 }}
                      className="p-5 bg-gradient-to-br from-blue-50 to-cyan-50 rounded-lg border-2 border-blue-200"
                    >
                      <p className="text-xs text-gray-700 font-black uppercase tracking-wider mb-2">
                        {item.label}
                      </p>
                      {item.type === 'id' ? (
                        <p className="font-mono text-sm text-gray-900">{item.value}</p>
                      ) : item.type === 'status' ? (
                        <Badge variant="success">{item.value}</Badge>
                      ) : (
                        <p className="text-lg font-black text-gray-900">{item.value}</p>
                      )}
                    </motion.div>
                  ))}
                </div>

                {verificationResult.details.summary && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="p-6 bg-green-50 rounded-lg border-2 border-green-300"
                  >
                    <p className="text-sm font-bold text-green-900">
                      ✓ {verificationResult.details.summary}
                    </p>
                  </motion.div>
                )}

                {verificationResult.details.reason && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="p-6 bg-red-50 rounded-lg border-2 border-red-300"
                  >
                    <p className="text-xs font-black text-red-900 uppercase tracking-wide mb-2">
                      Reason for Decline:
                    </p>
                    <p className="text-sm font-bold text-red-900">{verificationResult.details.reason}</p>
                  </motion.div>
                )}
              </div>
            </StatusBox>

            {/* Next Steps */}
            <Card className="bg-gradient-to-r from-green-50 to-blue-50 border-2 border-green-300">
              <h3 className="font-black text-gray-900 mb-4 uppercase tracking-tight text-lg">
                📋 Next Steps
              </h3>
              <ol className="space-y-3">
                {[
                  'Your KYC status has been updated in the system',
                  'A confirmation email has been sent to your registered email address',
                  'You can now proceed with loan application or account opening',
                  'Your KYC is valid for 10 years from the verification date',
                ].map((step, idx) => (
                  <motion.li
                    key={idx}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.1 }}
                    className="text-sm font-bold text-gray-900 flex items-start gap-3"
                  >
                    <span className="text-lg">✓</span>
                    <span>{step}</span>
                  </motion.li>
                ))}
              </ol>
            </Card>

            {/* Action Buttons */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Button
                variant="outline"
                onClick={handleReset}
                fullWidth
                className="py-4 text-base"
              >
                Verify Another Method
              </Button>
              <Button
                variant="primary"
                fullWidth
                className="flex items-center justify-center gap-2 py-4 text-base"
              >
                <ArrowRight size={20} />
                Proceed to Loan Application
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default KYCVerification;
