import React, { useState, useContext, useMemo, useCallback } from 'react';
import { BankingContext } from '../context/Index';
import { Input, Select, Button, Checkbox, ProgressBar, StatusBox, Card, Alert, Badge } from '../components/common/Index';
import { CheckCircle, AlertCircle, Save, Send } from 'lucide-react';

// Import data functions
import {
  getAllBorrowers,
  getAllLoans,
} from '../data/Index';

/**
 * LoanApplication Component
 * Comprehensive loan application with alternative data
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
  const [currentStep, setCurrentStep] = useState(1);
  const [errors, setErrors] = useState({});

  // Fetch data
  const borrowers = useMemo(() => getAllBorrowers(), []);
  const loans = useMemo(() => getAllLoans(), []);

  /**
   * Validate form data
   */
  const validateForm = useCallback(() => {
    const newErrors = {};

    // Personal information validation
    if (!formData.name.trim()) newErrors.name = 'Full name is required';
    if (!formData.age || formData.age < 18 || formData.age > 75) newErrors.age = 'Age must be between 18-75';
    if (!formData.mobile || formData.mobile.length !== 10) newErrors.mobile = 'Valid 10-digit mobile required';

    // Financial information validation
    if (!formData.monthlyIncome || formData.monthlyIncome < 10000) {
      newErrors.monthlyIncome = 'Monthly income must be at least ₹10,000';
    }
    if (!formData.loanAmount || formData.loanAmount < 10000) {
      newErrors.loanAmount = 'Loan amount must be at least ₹10,000';
    }

    // Debt-to-income ratio check
    const dti = (parseInt(formData.existingEmi || 0) / parseInt(formData.monthlyIncome || 1)) * 100;
    if (dti > 50) {
      newErrors.existingEmi = 'Debt-to-income ratio exceeds 50%. Consider reducing existing loans.';
    }

    // AA Consent validation
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

    // Clear error for this field
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
      // Simulate submission
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
    const maxEmi = Math.round(availableIncome * 0.40); // 40% of available income
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

  if (submitted) {
    return (
      <div className="max-w-4xl mx-auto space-y-6">
        <StatusBox
          type="success"
          title="✅ Application Submitted Successfully!"
        >
          <div className="mt-4 space-y-4">
            <p className="text-gray-700">
              Your loan application has been received and is being processed by our AI Decision Engine.
            </p>
            <div className="bg-blue-50 p-4 rounded border border-blue-200">
              <p className="font-semibold text-blue-900 mb-2">📊 Next Steps:</p>
              <ol className="space-y-1 text-sm text-blue-800">
                <li>1. Your application is queued for AI assessment</li>
                <li>2. Multi-agent processing will begin shortly</li>
                <li>3. You'll receive the decision within 24 hours</li>
                <li>4. Check your email and dashboard for updates</li>
              </ol>
            </div>
            <Button
              variant="primary"
              onClick={() => window.location.href = '/decision-engine'}
              fullWidth
            >
              View Decision Engine
            </Button>
          </div>
        </StatusBox>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-3xl font-bold text-gray-800 mb-2">📝 Loan Application</h2>
        <p className="text-gray-600">Complete the form to apply for a loan</p>
      </div>

      {/* Summary Stats */}
      {formData.monthlyIncome && (
        <Card className="bg-gradient-to-r from-green-50 to-blue-50 border border-green-200">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
            <div>
              <p className="text-gray-600">Monthly Income</p>
              <p className="text-lg font-bold text-gray-800">₹{parseInt(formData.monthlyIncome).toLocaleString()}</p>
            </div>
            <div>
              <p className="text-gray-600">Loan Requested</p>
              <p className="text-lg font-bold text-gray-800">₹{parseInt(formData.loanAmount || 0).toLocaleString()}</p>
            </div>
            <div>
              <p className="text-gray-600">Max Eligible</p>
              <p className="text-lg font-bold text-gray-800">₹{loanEligibility.maxLoan.toLocaleString()}</p>
            </div>
            <div>
              <p className="text-gray-600">Eligibility</p>
              <Badge variant={loanEligibility.isEligible ? 'success' : 'warning'}>
                {loanEligibility.eligibilityPercentage}%
              </Badge>
            </div>
          </div>

          {loanEligibility.maxEmi > 0 && (
            <ProgressBar
              progress={Math.min(100, loanEligibility.eligibilityPercentage)}
              text={`Eligible EMI: ₹${loanEligibility.maxEmi}`}
            />
          )}
        </Card>
      )}

      {/* Main Form */}
      <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-lg p-8 space-y-8">
        
        {/* Personal Information */}
        <div className="space-y-4">
          <h3 className="text-xl font-semibold text-gray-800 border-b pb-2 flex items-center gap-2">
            <CheckCircle size={24} className="text-blue-600" />
            Personal Information
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
        </div>

        {/* Financial Information */}
        <div className="space-y-4">
          <h3 className="text-xl font-semibold text-gray-800 border-b pb-2 flex items-center gap-2">
            <CheckCircle size={24} className="text-blue-600" />
            Financial Information
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
        </div>

        {/* Alternative Data */}
        <div className="space-y-4">
          <h3 className="text-xl font-semibold text-gray-800 border-b pb-2 flex items-center gap-2">
            <CheckCircle size={24} className="text-blue-600" />
            Alternative Data & Credits
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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

          <div className="space-y-3">
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
        </div>

        {/* Account Aggregator Consent */}
        <div className="bg-blue-50 border-l-4 border-blue-500 p-6 rounded-lg space-y-4">
          <h4 className="font-bold text-blue-900 flex items-center gap-2">
            <AlertCircle size={20} />
            📊 Account Aggregator Integration
          </h4>
          <p className="text-blue-800 text-sm">
            We use Account Aggregator to securely fetch your financial data with your consent. This helps us assess your creditworthiness better and provide you with the best rates.
          </p>
          <Checkbox
            name="aaConsent"
            checked={formData.aaConsent}
            onChange={handleChange}
            label="I consent to fetch my financial data via Account Aggregator"
            error={errors.aaConsent}
          />
        </div>

        {/* Submit Progress */}
        {isSubmitting && (
          <ProgressBar 
            progress={100} 
            text="Submitting your application..." 
          />
        )}

        {/* Submit Button */}
        <Button
          type="submit"
          variant="primary"
          fullWidth
          disabled={isSubmitting}
          className="flex items-center justify-center gap-2"
        >
          <Send size={20} />
          {isSubmitting ? 'Submitting...' : 'Submit Loan Application'}
        </Button>
      </form>
    </div>
  );
};

export default LoanApplication;
