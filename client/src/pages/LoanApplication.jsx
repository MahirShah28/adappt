import React, { useState, useContext, useMemo, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BankingContext } from '../context/Index';
import { 
  CheckCircle, AlertCircle, Save, Send, TrendingUp, 
  DollarSign, User, Briefcase, CreditCard, Shield
} from 'lucide-react';
import { getAllBorrowers, getAllLoans } from '../data/Index';

/**
 * Input Component
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
 * Select Component
 */
const Select = ({ label, name, value, onChange, options = [], error }) => (
  <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
    <label className="block text-sm font-bold text-gray-900 mb-2 uppercase tracking-wide">
      {label}
    </label>
    <select
      name={name}
      value={value}
      onChange={onChange}
      className={`w-full px-4 py-3 rounded-lg border-2 font-bold text-gray-900 transition-all focus:outline-none ${
        error
          ? 'border-red-500 focus:border-red-600 bg-red-50'
          : 'border-blue-300 focus:border-blue-500 bg-white'
      }`}
    >
      {options.map(opt => (
        <option key={typeof opt === 'string' ? opt : opt.value} value={typeof opt === 'string' ? opt : opt.value}>
          {typeof opt === 'string' ? opt : opt.label}
        </option>
      ))}
    </select>
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
 * Checkbox Component
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
 * Badge Component
 */
const Badge = ({ children, variant = 'default' }) => {
  const variants = {
    default: 'bg-blue-100 text-blue-800',
    success: 'bg-green-100 text-green-800',
    warning: 'bg-yellow-100 text-yellow-800',
    danger: 'bg-red-100 text-red-800',
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
const Button = ({ children, variant = 'primary', onClick, fullWidth, type = 'button', disabled, className = '' }) => {
  const variants = {
    primary: 'bg-gradient-to-r from-blue-500 to-cyan-400 text-white hover:shadow-lg font-bold disabled:opacity-50',
    outline: 'bg-white border-2 border-blue-300 text-blue-700 hover:bg-blue-50 font-bold',
  };
  
  return (
    <motion.button
      type={type}
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
 * LoanApplication Component - CredBridge
 */
const LoanApplication = () => {
  const banking = useContext(BankingContext);

  // State management
  const [formData, setFormData] = useState({
    name: '',
    age: '',
    gender: 'Male',
    mobile: '',
    state: 'Maharashtra',
    locationTier: '3',
    occupation: 'Farmer',
    employmentType: 'Self-Employed',
    education: 'High School',
    monthlyIncome: '',
    loanAmount: '',
    tenure: '12',
    existingLoans: '0',
    existingEmi: '0',
    savings: '',
    cibilScore: '',
    creditHistory: '0',
    digitalScore: '50',
    psychometricScore: '50',
    fpoMember: false,
    businessRegistered: false,
    aaConsent: false,
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [errors, setErrors] = useState({});

  /**
   * Validate form data
   */
  const validateForm = useCallback(() => {
    const newErrors = {};

    if (!formData.name.trim()) newErrors.name = 'Full name is required';
    if (!formData.age || formData.age < 18 || formData.age > 75) newErrors.age = 'Age must be between 18-75';
    if (!formData.mobile || formData.mobile.length !== 10) newErrors.mobile = 'Valid 10-digit mobile required';

    if (!formData.monthlyIncome || formData.monthlyIncome < 10000) {
      newErrors.monthlyIncome = 'Monthly income must be at least ₹10,000';
    }
    if (!formData.loanAmount || formData.loanAmount < 10000) {
      newErrors.loanAmount = 'Loan amount must be at least ₹10,000';
    }

    const dti = (parseInt(formData.existingEmi || 0) / parseInt(formData.monthlyIncome || 1)) * 100;
    if (dti > 50) {
      newErrors.existingEmi = 'Debt-to-income ratio exceeds 50%. Consider reducing existing loans.';
    }

    if (!formData.aaConsent) {
      newErrors.aaConsent = 'Account Aggregator consent is required';
    }

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
      [name]: type === 'checkbox' ? checked : value
    }));

    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  }, [errors]);

  /**
   * Handle form submission
   */
  const handleSubmit = useCallback(async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      if (banking?.addNotification) {
        banking.addNotification({
          type: 'error',
          message: 'Please fix the validation errors',
          duration: 2000,
        });
      }
      return;
    }

    setIsSubmitting(true);

    try {
      await new Promise(resolve => setTimeout(resolve, 2000));

      const applicationData = {
        applicationId: `APP${Date.now()}`,
        timestamp: new Date().toISOString(),
        borrowerInfo: {
          name: formData.name,
          age: formData.age,
          gender: formData.gender,
          mobile: formData.mobile,
          state: formData.state,
          locationTier: formData.locationTier,
        },
        financialInfo: {
          occupation: formData.occupation,
          employmentType: formData.employmentType,
          monthlyIncome: parseInt(formData.monthlyIncome),
          savings: parseInt(formData.savings || 0),
          loanAmount: parseInt(formData.loanAmount),
          tenure: formData.tenure,
          existingLoans: parseInt(formData.existingLoans),
          existingEmi: parseInt(formData.existingEmi || 0),
        },
        alternativeData: {
          cibilScore: formData.cibilScore || null,
          creditHistory: parseInt(formData.creditHistory),
          fpoMember: formData.fpoMember,
          businessRegistered: formData.businessRegistered,
          aaConsent: formData.aaConsent,
        },
        status: 'submitted',
      };

      setSubmitted(true);

      if (banking?.addNotification) {
        banking.addNotification({
          type: 'success',
          message: 'Loan application submitted successfully!',
          duration: 3000,
        });
      }

      if (banking?.recordLoanApplication) {
        banking.recordLoanApplication(applicationData);
      }
    } catch (error) {
      console.error('Submission error:', error);
      if (banking?.addNotification) {
        banking.addNotification({
          type: 'error',
          message: 'Error submitting application. Please try again.',
          duration: 2000,
        });
      }
    } finally {
      setIsSubmitting(false);
    }
  }, [validateForm, formData, banking]);

  /**
   * Calculate loan eligibility
   */
  const loanEligibility = useMemo(() => {
    const monthlyIncome = parseInt(formData.monthlyIncome || 0);
    const existingEmi = parseInt(formData.existingEmi || 0);
    const availableIncome = monthlyIncome - existingEmi;
    const maxEmi = Math.round(availableIncome * 0.40);
    const maxLoan = maxEmi * parseInt(formData.tenure);

    return {
      monthlyIncome,
      existingEmi,
      availableIncome,
      maxEmi,
      maxLoan,
      eligibilityPercentage: Math.round((parseInt(formData.loanAmount || 0) / maxLoan) * 100),
      isEligible: parseInt(formData.loanAmount || 0) <= maxLoan,
    };
  }, [formData.monthlyIncome, formData.existingEmi, formData.loanAmount, formData.tenure]);

  // Success Screen
  if (submitted) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="max-w-4xl mx-auto space-y-8 p-6"
      >
        <StatusBox
          type="success"
          title="✅ Application Submitted Successfully!"
        >
          <div className="mt-4 space-y-6 font-bold text-green-900">
            <p className="text-lg">
              Your loan application has been received and is being processed by our AI Decision Engine.
            </p>
            <div className="bg-white rounded-lg border-2 border-green-300 p-6 space-y-4">
              <p className="font-black text-lg flex items-center gap-2">
                <TrendingUp className="text-green-600" size={24} />
                📊 What Happens Next:
              </p>
              <ol className="space-y-2 text-sm font-semibold">
                <li className="flex items-start gap-2">
                  <span className="font-black">1.</span>
                  <span>Your application is queued for AI assessment</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="font-black">2.</span>
                  <span>Multi-agent processing will begin shortly</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="font-black">3.</span>
                  <span>You'll receive the decision within 24 hours</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="font-black">4.</span>
                  <span>Check your email and dashboard for updates</span>
                </li>
              </ol>
            </div>
            <Button
              variant="primary"
              onClick={() => window.location.href = '/decision-engine'}
              fullWidth
              className="py-4 text-base"
            >
              View Decision Engine
            </Button>
          </div>
        </StatusBox>
      </motion.div>
    );
  }

  // Main Form
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="max-w-4xl mx-auto space-y-8 p-6"
    >
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-5xl font-black text-gray-900 mb-2 tracking-tighter flex items-center gap-3">
          <CreditCard className="text-blue-600" size={40} />
          Loan Application
        </h1>
        <p className="text-gray-800 font-bold">Complete the form to apply for a CredBridge loan</p>
      </motion.div>

      {/* Summary Stats */}
      <AnimatePresence>
        {formData.monthlyIncome && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
          >
            <Card className="bg-gradient-to-r from-green-50 to-blue-50 border-2 border-green-300 p-6">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-6">
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0 }}>
                  <p className="text-xs text-gray-700 font-bold uppercase tracking-wider mb-1">Monthly Income</p>
                  <p className="text-2xl font-black text-gray-900">₹{parseInt(formData.monthlyIncome).toLocaleString()}</p>
                </motion.div>
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1 }}>
                  <p className="text-xs text-gray-700 font-bold uppercase tracking-wider mb-1">Loan Requested</p>
                  <p className="text-2xl font-black text-gray-900">₹{parseInt(formData.loanAmount || 0).toLocaleString()}</p>
                </motion.div>
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}>
                  <p className="text-xs text-gray-700 font-bold uppercase tracking-wider mb-1">Max Eligible</p>
                  <p className="text-2xl font-black text-gray-900">₹{loanEligibility.maxLoan.toLocaleString()}</p>
                </motion.div>
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}>
                  <p className="text-xs text-gray-700 font-bold uppercase tracking-wider mb-1">Eligibility</p>
                  <Badge variant={loanEligibility.isEligible ? 'success' : 'warning'}>
                    {loanEligibility.eligibilityPercentage}%
                  </Badge>
                </motion.div>
              </div>

              {loanEligibility.maxEmi > 0 && (
                <ProgressBar
                  progress={Math.min(100, loanEligibility.eligibilityPercentage)}
                  text={`Max Eligible EMI: ₹${loanEligibility.maxEmi}`}
                />
              )}
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Form */}
      <form onSubmit={handleSubmit} className="bg-white rounded-lg border-2 border-blue-200 shadow-lg p-8 space-y-10">
        
        {/* Personal Information */}
        <motion.div className="space-y-6" initial={{ opacity: 0 }} whileInView={{ opacity: 1 }}>
          <h2 className="text-2xl font-black text-gray-900 border-b-2 border-blue-200 pb-4 flex items-center gap-3 uppercase tracking-tight">
            <User className="text-blue-600" size={28} />
            Personal Information
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Input
              label="Full Name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              error={errors.name}
              required
            />
            <Input
              label="Age"
              name="age"
              type="number"
              value={formData.age}
              onChange={handleChange}
              error={errors.age}
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Select
              label="Gender"
              name="gender"
              value={formData.gender}
              onChange={handleChange}
              options={[
                { value: 'Male', label: 'Male' },
                { value: 'Female', label: 'Female' },
                { value: 'Other', label: 'Other' },
              ]}
            />
            <Input
              label="Mobile Number"
              name="mobile"
              type="tel"
              value={formData.mobile}
              onChange={handleChange}
              error={errors.mobile}
              placeholder="10-digit number"
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Select
              label="State"
              name="state"
              value={formData.state}
              onChange={handleChange}
              options={['Maharashtra', 'Karnataka', 'Tamil Nadu', 'Gujarat', 'Rajasthan', 'Punjab', 'Other']}
            />
            <Select
              label="Location Tier"
              name="locationTier"
              value={formData.locationTier}
              onChange={handleChange}
              options={[
                { value: '1', label: 'Tier 1 (Metro)' },
                { value: '2', label: 'Tier 2 City' },
                { value: '3', label: 'Tier 3 City' },
                { value: '4', label: 'Rural' },
              ]}
            />
          </div>
        </motion.div>

        {/* Financial Information */}
        <motion.div className="space-y-6 border-t-2 border-blue-200 pt-10" initial={{ opacity: 0 }} whileInView={{ opacity: 1 }}>
          <h2 className="text-2xl font-black text-gray-900 pb-4 flex items-center gap-3 uppercase tracking-tight">
            <DollarSign className="text-blue-600" size={28} />
            Financial Information
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Select
              label="Occupation"
              name="occupation"
              value={formData.occupation}
              onChange={handleChange}
              options={['Farmer', 'Small Business Owner', 'Trader', 'Artisan', 'Daily Wage Worker', 'Other']}
            />
            <Select
              label="Employment Type"
              name="employmentType"
              value={formData.employmentType}
              onChange={handleChange}
              options={['Self-Employed', 'Salaried', 'Business Owner', 'Daily Wage']}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Input
              label="Monthly Income (₹)"
              name="monthlyIncome"
              type="number"
              value={formData.monthlyIncome}
              onChange={handleChange}
              error={errors.monthlyIncome}
              required
            />
            <Input
              label="Savings (₹)"
              name="savings"
              type="number"
              value={formData.savings}
              onChange={handleChange}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Input
              label="Loan Amount Requested (₹)"
              name="loanAmount"
              type="number"
              value={formData.loanAmount}
              onChange={handleChange}
              error={errors.loanAmount}
              required
            />
            <Select
              label="Loan Tenure (months)"
              name="tenure"
              value={formData.tenure}
              onChange={handleChange}
              options={['6', '12', '18', '24', '36']}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Input
              label="Existing Loans"
              name="existingLoans"
              type="number"
              value={formData.existingLoans}
              onChange={handleChange}
            />
            <Input
              label="Existing EMI (₹)"
              name="existingEmi"
              type="number"
              value={formData.existingEmi}
              onChange={handleChange}
              error={errors.existingEmi}
            />
          </div>
        </motion.div>

        {/* Alternative Data */}
        <motion.div className="space-y-6 border-t-2 border-blue-200 pt-10" initial={{ opacity: 0 }} whileInView={{ opacity: 1 }}>
          <h2 className="text-2xl font-black text-gray-900 pb-4 flex items-center gap-3 uppercase tracking-tight">
            <CreditCard className="text-blue-600" size={28} />
            Alternative Data & Credits
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Input
              label="CIBIL Score (leave blank if none)"
              name="cibilScore"
              type="number"
              value={formData.cibilScore}
              onChange={handleChange}
              placeholder="300-900"
            />
            <Input
              label="Credit History (months)"
              name="creditHistory"
              type="number"
              value={formData.creditHistory}
              onChange={handleChange}
            />
          </div>

          <div className="space-y-4">
            <Checkbox
              name="fpoMember"
              checked={formData.fpoMember}
              onChange={handleChange}
              label="Are you a member of an FPO (Farmer Producer Organization)?"
            />
            <Checkbox
              name="businessRegistered"
              checked={formData.businessRegistered}
              onChange={handleChange}
              label="Is your business registered?"
            />
          </div>
        </motion.div>

        {/* Account Aggregator Consent */}
        <motion.div
          className="bg-gradient-to-r from-blue-50 to-cyan-50 border-l-4 border-blue-500 p-8 rounded-lg space-y-4"
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
        >
          <h3 className="font-black text-blue-900 flex items-center gap-2 uppercase tracking-tight text-lg">
            <Shield size={24} className="text-blue-600" />
            📊 Account Aggregator Integration
          </h3>
          <p className="text-blue-900 font-bold">
            We use Account Aggregator to securely fetch your financial data with your consent. This helps us assess your creditworthiness better and provide you with the best rates.
          </p>
          <Checkbox
            name="aaConsent"
            checked={formData.aaConsent}
            onChange={handleChange}
            label="I consent to fetch my financial data via Account Aggregator"
            error={errors.aaConsent}
          />
        </motion.div>

        {/* Submit Progress */}
        <AnimatePresence>
          {isSubmitting && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <ProgressBar 
                progress={100} 
                text="Submitting your application..." 
              />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Submit Button */}
        <Button
          type="submit"
          variant="primary"
          fullWidth
          disabled={isSubmitting}
          className="flex items-center justify-center gap-2 py-4 text-base"
        >
          <Send size={24} />
          {isSubmitting ? 'Submitting...' : 'Submit Loan Application'}
        </Button>
      </form>
    </motion.div>
  );
};

export default LoanApplication;
