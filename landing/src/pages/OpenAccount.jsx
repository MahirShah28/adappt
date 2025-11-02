import React, { useState, useContext, useMemo, useCallback } from 'react';
import { BankingContext } from '../context/Index';
import { StatusBox, Card, Button, Input, Checkbox, Alert, Badge, ProgressBar } from '../components/common/Index';
import { CheckCircle, AlertCircle, Loader, FileCheck, CreditCard, DollarSign } from 'lucide-react';

// Import data functions
import {
  getAllBorrowers,
} from '../data/Index';

/**
 * OpenAccount Component
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

  // Fetch data
  const borrowers = useMemo(() => getAllBorrowers(), []);

  // V-CIP Process Steps with realistic delays
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
        ifscCode: 'EQUIT001001',
        bankName: 'Partner Bank (via BaaS)',
        customerId,
        accountType: 'Savings Account',
        openingDate: new Date().toLocaleDateString(),
        status: 'Active',
        coreId: `CORE${customerId}`,
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
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-3xl font-bold text-gray-800 mb-2 flex items-center gap-2">
          🏦 Open Your First Bank Account
        </h2>
        <p className="text-gray-600">
          We've partnered with an RBI-approved bank to offer you a{' '}
          <strong>100% digital, zero-balance account</strong> in under 5 minutes.
        </p>
      </div>

      {/* Info Banner */}
      {stage === 'form' && (
        <Alert
          type="info"
          message="All you need is your PAN Card, Aadhaar Card, and a Mobile Number linked to your Aadhaar."
          dismissible={false}
        />
      )}

      {/* Stage 1: Form */}
      {stage === 'form' && (
        <Card className="p-8">
          <h3 className="text-xl font-semibold text-gray-800 mb-6">Account Opening Details</h3>

          <form onSubmit={handleFormSubmit} className="space-y-6">
            {/* Personal Information */}
            <div className="space-y-4">
              <h4 className="font-semibold text-gray-700">Personal Information</h4>

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
            </div>

            {/* Document Information */}
            <div className="space-y-4 border-t pt-6">
              <h4 className="font-semibold text-gray-700">Document Information</h4>

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
            </div>

            {/* Consents */}
            <div className="space-y-4 border-t pt-6">
              <h4 className="font-semibold text-gray-700">Consents & Agreements</h4>

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
            </div>

            {/* Benefits */}
            <div className="bg-green-50 border border-green-200 rounded-lg p-4 space-y-2">
              <h4 className="font-semibold text-green-900 flex items-center gap-2">
                <CheckCircle size={20} />
                Account Benefits
              </h4>
              <ul className="text-sm text-green-800 space-y-1">
                <li>✓ Zero balance account - no minimum balance required</li>
                <li>✓ Digital statements and instant notifications</li>
                <li>✓ Access to credit products and loan schemes</li>
                <li>✓ DICGC insurance coverage up to ₹5,00,000</li>
                <li>✓ 24x7 customer support</li>
              </ul>
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              variant="primary"
              fullWidth
              className="flex items-center justify-center gap-2"
            >
              <FileCheck size={20} />
              Proceed to V-CIP Verification
            </Button>
          </form>
        </Card>
      )}

      {/* Stage 2: Processing (V-CIP) */}
      {stage === 'processing' && (
        <Card className="p-8 space-y-6">
          <h3 className="text-xl font-semibold text-gray-800">Video KYC in Progress</h3>

          {/* Progress Bar */}
          <ProgressBar
            progress={progress}
            text={`Step ${currentStep + 1} of ${vcipSteps.length}`}
          />

          {/* Current Step Detail */}
          <div className="space-y-6">
            {vcipSteps.map((step, idx) => {
              const Icon = step.icon;
              const isCompleted = idx < currentStep;
              const isCurrent = idx === currentStep;
              const isPending = idx > currentStep;

              return (
                <div key={idx} className="flex items-start gap-4">
                  <div
                    className={`w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0 ${
                      isCompleted
                        ? 'bg-green-100'
                        : isCurrent
                        ? 'bg-blue-100 animate-pulse'
                        : 'bg-gray-100'
                    }`}
                  >
                    <Icon
                      className={
                        isCompleted
                          ? 'text-green-600'
                          : isCurrent
                          ? 'text-blue-600 animate-spin'
                          : 'text-gray-400'
                      }
                      size={24}
                    />
                  </div>

                  <div className="flex-1">
                    <p
                      className={`font-semibold ${
                        isCompleted
                          ? 'text-green-700'
                          : isCurrent
                          ? 'text-blue-700'
                          : 'text-gray-600'
                      }`}
                    >
                      {step.text}
                    </p>
                    <p className="text-sm text-gray-600 mt-1">{step.description}</p>
                  </div>

                  {isCompleted && (
                    <Badge variant="success" size="sm">
                      Complete
                    </Badge>
                  )}
                  {isCurrent && (
                    <Badge variant="primary" size="sm">
                      Processing...
                    </Badge>
                  )}
                </div>
              );
            })}
          </div>

          {/* Info Box */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <p className="text-sm text-blue-900">
              ℹ️ Your account is being created. Please don't close this window or refresh the page.
            </p>
          </div>
        </Card>
      )}

      {/* Stage 3: Success */}
      {stage === 'success' && accountDetails && (
        <div className="space-y-6">
          {/* Success Message */}
          <StatusBox
            type="success"
            title="✅ Congratulations! Your Account is Ready"
          >
            <div className="mt-4 space-y-3">
              <p>
                Welcome, <strong>{formData.name}</strong>! Your bank account has been successfully created.
              </p>
              <p className="text-sm">
                You can now start using your account for deposits, transfers, and availing loans.
              </p>
            </div>
          </StatusBox>

          {/* Account Details Card */}
          <Card className="bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200 p-8">
            <h3 className="text-lg font-bold text-gray-800 mb-6 flex items-center gap-2">
              <CreditCard size={24} className="text-blue-600" />
              Your Account Details
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              {/* Account Number */}
              <div className="p-4 bg-white rounded-lg border border-gray-200">
                <p className="text-xs text-gray-600 font-semibold uppercase">Account Number</p>
                <p className="text-xl font-mono font-bold text-gray-900 mt-2">
                  {accountDetails.accountNumber}
                </p>
              </div>

              {/* IFSC Code */}
              <div className="p-4 bg-white rounded-lg border border-gray-200">
                <p className="text-xs text-gray-600 font-semibold uppercase">IFSC Code</p>
                <p className="text-xl font-mono font-bold text-gray-900 mt-2">
                  {accountDetails.ifscCode}
                </p>
              </div>

              {/* Bank Name */}
              <div className="p-4 bg-white rounded-lg border border-gray-200">
                <p className="text-xs text-gray-600 font-semibold uppercase">Bank Name</p>
                <p className="text-lg font-bold text-gray-900 mt-2">{accountDetails.bankName}</p>
              </div>

              {/* Customer ID */}
              <div className="p-4 bg-white rounded-lg border border-gray-200">
                <p className="text-xs text-gray-600 font-semibold uppercase">Customer ID</p>
                <p className="text-xl font-mono font-bold text-gray-900 mt-2">
                  {accountDetails.customerId}
                </p>
              </div>

              {/* Account Type */}
              <div className="p-4 bg-white rounded-lg border border-gray-200">
                <p className="text-xs text-gray-600 font-semibold uppercase">Account Type</p>
                <Badge variant="success">{accountDetails.accountType}</Badge>
              </div>

              {/* Status */}
              <div className="p-4 bg-white rounded-lg border border-gray-200">
                <p className="text-xs text-gray-600 font-semibold uppercase">Status</p>
                <Badge variant="success">{accountDetails.status}</Badge>
              </div>
            </div>

            {/* Additional Info */}
            <div className="bg-white rounded-lg border border-gray-200 p-4 space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Opening Date:</span>
                <span className="font-semibold text-gray-900">{accountDetails.openingDate}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Insurance Coverage:</span>
                <span className="font-semibold text-gray-900">₹{accountDetails.depositInsuranceLimit.toLocaleString()}</span>
              </div>
            </div>
          </Card>

          {/* Next Steps */}
          <Card className="bg-gradient-to-r from-green-50 to-blue-50 border border-green-200">
            <h4 className="font-bold text-green-900 mb-3 flex items-center gap-2">
              <CheckCircle size={20} />
              Next Steps
            </h4>
            <ol className="space-y-2 text-sm text-green-800">
              <li>1. Download your account statement</li>
              <li>2. Set up mobile banking and enable notifications</li>
              <li>3. Link your savings account to our loan application</li>
              <li>4. Complete your financial profile for better loan offers</li>
              <li>5. Apply for credit products and avail special rates</li>
            </ol>
          </Card>

          {/* Action Buttons */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Button variant="outline" onClick={handleReset} fullWidth>
              Create Another Account
            </Button>
            <Button variant="primary" fullWidth>
              Download Account Statement
            </Button>
            <Button variant="primary" fullWidth>
              Proceed to Loan Application
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default OpenAccount;
