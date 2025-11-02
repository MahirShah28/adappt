import React, { useState, useContext, useMemo, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BankingContext } from '../context/Index';
import { 
  CheckCircle, AlertCircle, Loader, FileCheck, CreditCard, 
  DollarSign, Eye, EyeOff, Copy, Download, ArrowRight
} from 'lucide-react';

// Import data functions
import { getAllBorrowers } from '../data/Index';

/**
 * Reusable Input Component
 */
const Input = ({ label, name, value, onChange, error, type = 'text', placeholder, required }) => (
  <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
    <label className="block text-sm font-bold text-gray-900 mb-2 uppercase tracking-wide">
      {label}
      {required && <span className="text-red-600 ml-1">*</span>}
    </label>
    <input
      type={type}
      name={name}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      className={`w-full px-4 py-3 rounded-lg border-2 font-semibold text-gray-900 placeholder-gray-500 transition-all focus:outline-none ${
        error
          ? 'border-red-500 focus:border-red-600 bg-red-50'
          : 'border-blue-300 focus:border-blue-500 bg-white'
      }`}
    />
    {error && (
      <motion.p
        initial={{ opacity: 0, y: -5 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-red-600 text-xs mt-2 font-bold tracking-tight"
      >
        ✗ {error}
      </motion.p>
    )}
  </motion.div>
);

/**
 * Reusable Checkbox Component
 */
const Checkbox = ({ name, checked, onChange, label, error }) => (
  <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}>
    <label className="flex items-start gap-3 cursor-pointer">
      <motion.input
        type="checkbox"
        name={name}
        checked={checked}
        onChange={onChange}
        className="w-5 h-5 rounded border-2 border-blue-300 text-blue-600 focus:ring-2 focus:ring-blue-500 cursor-pointer accent-blue-600 mt-1"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
      />
      <span className={`text-sm font-bold tracking-tight ${error ? 'text-red-700' : 'text-gray-900'}`}>
        {label}
      </span>
    </label>
    {error && (
      <motion.p
        initial={{ opacity: 0, y: -5 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-red-600 text-xs mt-1 font-bold ml-8 tracking-tight"
      >
        ✗ {error}
      </motion.p>
    )}
  </motion.div>
);

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
 * Card Component
 */
const Card = ({ children, className = '' }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    className={`bg-white rounded-lg border-2 border-blue-200 shadow-sm hover:shadow-md transition-shadow ${className}`}
  >
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
    info: 'bg-blue-50 border-blue-300 text-blue-900',
  };
  
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className={`rounded-lg border-2 p-6 ${typeStyles[type]}`}
    >
      <h3 className="font-black text-lg mb-2 tracking-tight">{title}</h3>
      {children}
    </motion.div>
  );
};

/**
 * Button Component
 */
const Button = ({ children, variant = 'primary', onClick, fullWidth, type = 'button', className = '' }) => {
  const variants = {
    primary: 'bg-gradient-to-r from-blue-500 to-cyan-400 text-white hover:shadow-lg font-bold',
    outline: 'bg-white border-2 border-blue-300 text-blue-700 hover:bg-blue-50 font-bold',
  };
  
  return (
    <motion.button
      type={type}
      onClick={onClick}
      className={`px-6 py-3 rounded-lg transition-all text-sm tracking-wide uppercase ${variants[variant]} ${fullWidth ? 'w-full' : ''} ${className}`}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.98 }}
    >
      {children}
    </motion.button>
  );
};

/**
 * OpenAccount Component - CredBridge
 * Complete digital bank account opening with V-CIP
 */
const OpenAccount = () => {
  const banking = useContext(BankingContext);

  // State management
  const [formData, setFormData] = useState({
    name: '',
    mobile: '',
    pan: '',
    aadhaar: '',
    email: '',
    consent: false,
    termsAccepted: false,
    marketingConsent: false,
  });

  const [stage, setStage] = useState('form'); // 'form', 'processing', 'success'
  const [progress, setProgress] = useState(0);
  const [currentStep, setCurrentStep] = useState(0);
  const [accountDetails, setAccountDetails] = useState(null);
  const [errors, setErrors] = useState({});

  // V-CIP Process Steps
  const vcipSteps = [
    {
      text: 'Embedding BaaS SDK...',
      description: 'Initializing secure banking infrastructure',
      delay: 1000,
      icon: Loader,
    },
    {
      text: 'Validating PAN...',
      description: 'Verifying PAN card details with Income Tax Department',
      delay: 1500,
      icon: FileCheck,
    },
    {
      text: 'Verifying Aadhaar via OTP...',
      description: 'Sending OTP to your registered mobile number',
      delay: 1500,
      icon: AlertCircle,
    },
    {
      text: 'Connecting to V-CIP agent...',
      description: 'Establishing secure video call connection',
      delay: 2000,
      icon: Loader,
    },
    {
      text: 'V-CIP call in progress...',
      description: 'Video KYC verification with bank officer',
      delay: 3000,
      icon: CheckCircle,
    },
    {
      text: 'Generating account details...',
      description: 'Creating your new bank account',
      delay: 1000,
      icon: CreditCard,
    },
  ];

  /**
   * Validate form
   */
  const validateForm = useCallback(() => {
    const newErrors = {};

    if (!formData.name.trim()) newErrors.name = 'Full name is required';
    if (!/^\d{10}$/.test(formData.mobile)) newErrors.mobile = 'Valid 10-digit mobile required';
    if (!formData.pan.trim() || formData.pan.length !== 10) newErrors.pan = 'Valid PAN required';
    if (!formData.aadhaar.trim() || formData.aadhaar.length !== 12) newErrors.aadhaar = 'Valid Aadhaar required';
    if (!formData.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Valid email required';
    }
    if (!formData.consent) newErrors.consent = 'You must provide consent';
    if (!formData.termsAccepted) newErrors.termsAccepted = 'You must accept terms';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [formData]);

  /**
   * Handle form change
   */
  const handleChange = useCallback((e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));

    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: '',
      }));
    }
  }, [errors]);

  /**
   * Handle form submission
   */
  const handleFormSubmit = useCallback(async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      if (banking?.addNotification) {
        banking.addNotification({
          type: 'error',
          message: 'Please fix validation errors',
          duration: 2000,
        });
      }
      return;
    }

    setStage('processing');

    try {
      // Simulate V-CIP process
      for (let i = 0; i < vcipSteps.length; i++) {
        setCurrentStep(i);
        setProgress(((i + 1) / vcipSteps.length) * 100);
        await new Promise(resolve => setTimeout(resolve, vcipSteps[i].delay));
      }

      // Generate account details
      const customerId = Math.floor(Math.random() * 9000000 + 1000000).toString();
      const accountNumber = '50100' + Math.floor(Math.random() * 90000000 + 10000000);

      const newAccountDetails = {
        accountNumber: accountNumber.toString(),
        ifscCode: 'CBID001001',
        bankName: 'CredBridge Partner Bank',
        customerId,
        accountType: 'Savings Account',
        openingDate: new Date().toLocaleDateString(),
        status: 'Active',
        coreId: `CRED${customerId}`,
        depositInsuranceLimit: 500000,
      };

      setAccountDetails(newAccountDetails);
      setStage('success');

      if (banking?.addNotification) {
        banking.addNotification({
          type: 'success',
          message: 'Account opened successfully!',
          duration: 3000,
        });
      }

      if (banking?.createBankAccount) {
        banking.createBankAccount({
          ...formData,
          accountDetails: newAccountDetails,
          createdAt: new Date().toISOString(),
        });
      }
    } catch (error) {
      console.error('Account creation error:', error);
      if (banking?.addNotification) {
        banking.addNotification({
          type: 'error',
          message: 'Error creating account. Please try again.',
          duration: 2000,
        });
      }
      setStage('form');
    }
  }, [formData, validateForm, vcipSteps, banking]);

  /**
   * Handle reset
   */
  const handleReset = useCallback(() => {
    setStage('form');
    setProgress(0);
    setCurrentStep(0);
    setAccountDetails(null);
    setErrors({});
    setFormData({
      name: '',
      mobile: '',
      pan: '',
      aadhaar: '',
      email: '',
      consent: false,
      termsAccepted: false,
      marketingConsent: false,
    });
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="max-w-4xl mx-auto space-y-6 p-6"
    >
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-5xl font-black text-gray-900 mb-2 tracking-tighter flex items-center gap-3">
          <CreditCard className="text-blue-600" size={40} />
          Open Your Bank Account
        </h1>
        <p className="text-gray-800 font-bold">
          Get a <span className="text-blue-600">100% digital, zero-balance account</span> in under 5 minutes with CredBridge.
        </p>
      </motion.div>

      {/* Info Banner */}
      <AnimatePresence>
        {stage === 'form' && (
          <Alert
            type="info"
            message="📋 All you need: PAN Card, Aadhaar Card, and Mobile Number linked to your Aadhaar."
            dismissible={false}
          />
        )}
      </AnimatePresence>

      {/* Stage 1: Form */}
      <AnimatePresence mode="wait">
        {stage === 'form' && (
          <motion.div
            key="form"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
          >
            <Card className="p-8">
              <h2 className="text-2xl font-black text-gray-900 mb-8 uppercase tracking-tight">
                Account Opening Details
              </h2>

              <form onSubmit={handleFormSubmit} className="space-y-8">
                {/* Personal Information */}
                <motion.div className="space-y-6">
                  <h3 className="text-lg font-bold text-gray-900 uppercase tracking-wide">Personal Information</h3>

                  <Input
                    label="Full Name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    error={errors.name}
                    required
                  />

                  <Input
                    label="Email Address"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    error={errors.email}
                    required
                  />

                  <Input
                    label="Mobile Number (10-digit)"
                    name="mobile"
                    type="tel"
                    value={formData.mobile}
                    onChange={handleChange}
                    error={errors.mobile}
                    placeholder="9876543210"
                    required
                  />
                </motion.div>

                {/* Document Information */}
                <motion.div className="space-y-6 border-t-2 border-blue-200 pt-8">
                  <h3 className="text-lg font-bold text-gray-900 uppercase tracking-wide">Document Information</h3>

                  <Input
                    label="PAN Number (10-character)"
                    name="pan"
                    value={formData.pan}
                    onChange={handleChange}
                    error={errors.pan}
                    placeholder="ABCTY1234X"
                    required
                  />

                  <Input
                    label="Aadhaar Number (12-digit)"
                    name="aadhaar"
                    type="tel"
                    value={formData.aadhaar}
                    onChange={handleChange}
                    error={errors.aadhaar}
                    placeholder="123456789012"
                    required
                  />
                </motion.div>

                {/* Consents */}
                <motion.div className="space-y-6 border-t-2 border-blue-200 pt-8">
                  <h3 className="text-lg font-bold text-gray-900 uppercase tracking-wide">Consents & Agreements</h3>

                  <Checkbox
                    name="consent"
                    checked={formData.consent}
                    onChange={handleChange}
                    label="I give my consent for account opening and KYC verification"
                    error={errors.consent}
                  />

                  <Checkbox
                    name="termsAccepted"
                    checked={formData.termsAccepted}
                    onChange={handleChange}
                    label="I accept the terms and conditions and privacy policy"
                    error={errors.termsAccepted}
                  />

                  <Checkbox
                    name="marketingConsent"
                    checked={formData.marketingConsent}
                    onChange={handleChange}
                    label="I agree to receive marketing communications"
                  />
                </motion.div>

                {/* Benefits */}
                <motion.div className="bg-gradient-to-br from-green-50 to-emerald-50 border-2 border-green-300 rounded-lg p-6 space-y-3">
                  <h4 className="font-black text-green-900 flex items-center gap-2 uppercase tracking-tight text-lg">
                    <CheckCircle size={24} className="text-green-600" />
                    Account Benefits
                  </h4>
                  <ul className="text-sm text-green-900 space-y-2 font-bold">
                    <li>✓ Zero balance account - no minimum balance required</li>
                    <li>✓ Digital statements and instant notifications</li>
                    <li>✓ Access to credit products and loan schemes</li>
                    <li>✓ DICGC insurance coverage up to ₹5,00,000</li>
                    <li>✓ 24x7 customer support</li>
                  </ul>
                </motion.div>

                {/* Submit Button */}
                <Button
                  type="submit"
                  variant="primary"
                  fullWidth
                  className="flex items-center justify-center gap-2 py-4 text-base"
                >
                  <FileCheck size={20} />
                  Proceed to V-CIP Verification
                </Button>
              </form>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Stage 2: Processing (V-CIP) */}
      <AnimatePresence mode="wait">
        {stage === 'processing' && (
          <motion.div
            key="processing"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
          >
            <Card className="p-8 space-y-8">
              <h2 className="text-2xl font-black text-gray-900 uppercase tracking-tight">
                Video KYC in Progress
              </h2>

              <ProgressBar
                progress={progress}
                text={`Step ${currentStep + 1} of ${vcipSteps.length}`}
              />

              <div className="space-y-6 border-t-2 border-blue-200 pt-8">
                {vcipSteps.map((step, idx) => {
                  const Icon = step.icon;
                  const isCompleted = idx < currentStep;
                  const isCurrent = idx === currentStep;

                  return (
                    <motion.div
                      key={idx}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: idx * 0.05 }}
                      className="flex items-start gap-4"
                    >
                      <motion.div
                        className={`w-14 h-14 rounded-full flex items-center justify-center flex-shrink-0 border-2 ${
                          isCompleted
                            ? 'bg-green-50 border-green-300'
                            : isCurrent
                            ? 'bg-blue-50 border-blue-400'
                            : 'bg-gray-50 border-gray-300'
                        }`}
                        animate={isCurrent ? { scale: [1, 1.05, 1] } : {}}
                        transition={{ duration: 1.5, repeat: Infinity }}
                      >
                        <Icon
                          className={`font-bold ${
                            isCompleted
                              ? 'text-green-600'
                              : isCurrent
                              ? 'text-blue-600'
                              : 'text-gray-400'
                          }`}
                          size={24}
                        />
                      </motion.div>

                      <div className="flex-1">
                        <p
                          className={`font-black ${
                            isCompleted
                              ? 'text-green-900'
                              : isCurrent
                              ? 'text-blue-900'
                              : 'text-gray-600'
                          } uppercase tracking-tight`}
                        >
                          {step.text}
                        </p>
                        <p className="text-sm text-gray-700 mt-1 font-bold">
                          {step.description}
                        </p>
                      </div>

                      {isCompleted && <Badge variant="success">Complete</Badge>}
                      {isCurrent && <Badge variant="primary">Processing...</Badge>}
                    </motion.div>
                  );
                })}
              </div>

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="bg-blue-50 border-2 border-blue-300 rounded-lg p-4"
              >
                <p className="text-sm text-blue-900 font-bold">
                  ℹ️ Your account is being created. Please don't close this window or refresh the page.
                </p>
              </motion.div>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Stage 3: Success */}
      <AnimatePresence mode="wait">
        {stage === 'success' && accountDetails && (
          <motion.div
            key="success"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-8"
          >
            {/* Success Message */}
            <StatusBox
              type="success"
              title="✅ Account Successfully Created!"
            >
              <div className="mt-4 space-y-3 font-bold text-green-900">
                <p>
                  Welcome, <span className="text-lg font-black">{formData.name}</span>! Your bank account has been successfully created with CredBridge.
                </p>
                <p className="text-sm">
                  You can now start using your account for deposits, transfers, and availing loans instantly.
                </p>
              </div>
            </StatusBox>

            {/* Account Details Card */}
            <Card className="bg-gradient-to-br from-blue-50 to-cyan-50 border-2 border-blue-300 p-8">
              <h2 className="text-2xl font-black text-gray-900 mb-8 flex items-center gap-3 uppercase tracking-tight">
                <CreditCard size={28} className="text-blue-600" />
                Your Account Details
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                {[
                  { label: 'Account Number', value: accountDetails.accountNumber },
                  { label: 'IFSC Code', value: accountDetails.ifscCode },
                  { label: 'Bank Name', value: accountDetails.bankName },
                  { label: 'Customer ID', value: accountDetails.customerId },
                ].map((item, idx) => (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.1 }}
                    className="p-5 bg-white rounded-lg border-2 border-blue-200"
                  >
                    <p className="text-xs text-gray-700 font-black uppercase tracking-wider mb-2">
                      {item.label}
                    </p>
                    <p className="text-lg font-mono font-black text-gray-900">
                      {item.value}
                    </p>
                  </motion.div>
                ))}
              </div>

              <div className="bg-white rounded-lg border-2 border-blue-200 p-5 space-y-4">
                <div className="flex justify-between items-center py-3 border-b-2 border-blue-200">
                  <span className="text-sm font-bold text-gray-700 uppercase tracking-wide">Account Type</span>
                  <Badge variant="success">{accountDetails.accountType}</Badge>
                </div>
                <div className="flex justify-between items-center py-3 border-b-2 border-blue-200">
                  <span className="text-sm font-bold text-gray-700 uppercase tracking-wide">Status</span>
                  <Badge variant="success">{accountDetails.status}</Badge>
                </div>
                <div className="flex justify-between items-center py-3">
                  <span className="text-sm font-bold text-gray-700 uppercase tracking-wide">Insurance Coverage</span>
                  <span className="font-black text-gray-900">₹{accountDetails.depositInsuranceLimit.toLocaleString()}</span>
                </div>
              </div>
            </Card>

            {/* Next Steps */}
            <Card className="bg-gradient-to-br from-green-50 to-emerald-50 border-2 border-green-300 p-8">
              <h3 className="font-black text-green-900 mb-6 flex items-center gap-2 uppercase tracking-tight text-lg">
                <CheckCircle size={24} className="text-green-600" />
                Next Steps to Maximize Your Account
              </h3>
              <ol className="space-y-3 text-sm text-green-900 font-bold">
                <li>1. Download your account statement and save securely</li>
                <li>2. Set up mobile banking and enable notifications</li>
                <li>3. Link your account to CredBridge loan application</li>
                <li>4. Complete your financial profile for better loan offers</li>
                <li>5. Apply for credit products and avail special rates</li>
              </ol>
            </Card>

            {/* Action Buttons */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Button variant="outline" onClick={handleReset} fullWidth className="py-4">
                Create Another Account
              </Button>
              <Button variant="primary" fullWidth className="py-4 flex items-center justify-center gap-2">
                <Download size={20} />
                Download Statement
              </Button>
              <Button variant="primary" fullWidth className="py-4 flex items-center justify-center gap-2">
                Apply for Loan
                <ArrowRight size={20} />
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default OpenAccount;
