import React, { useContext, useState, useCallback, useMemo } from 'react';
import { BankingContext } from '../../context/Index'; // ✅ Added
import { Button, Checkbox, ProgressBar, StatusBox, Badge, Alert } from '../../components/common/Index'; // ✅ Updated
import { Shield, Database, TrendingUp, Clock, AlertCircle } from 'lucide-react'; // ✅ Added

/**
 * AAIntegration Component
 * Account Aggregator integration for fetching financial data
 * 
 * @param {object} formData - Form data state
 * @param {function} onChange - Form change handler
 * @param {function} onFetchComplete - Fetch completion callback
 * @param {boolean} simulateDelay - Simulate processing delay
 * @param {function} onConsentChange - Consent change callback
 * @param {array} linkedAccounts - Pre-linked accounts
 */
const AAIntegration = ({ 
  formData, 
  onChange, 
  onFetchComplete,
  simulateDelay = true, // ✅ Added
  onConsentChange = null, // ✅ Added
  linkedAccounts = null, // ✅ Added
}) => {
  // ✅ Get context
  const banking = useContext(BankingContext);

  // ✅ State management
  const [isConnecting, setIsConnecting] = useState(false);
  const [progress, setProgress] = useState(0);
  const [aaData, setAaData] = useState(null);
  const [errors, setErrors] = useState(null); // ✅ Added
  const [connectionStatus, setConnectionStatus] = useState('idle'); // ✅ Added

  // ✅ Handle AA consent change
  const handleAAConsent = useCallback((e) => {
    const { checked } = e.target;
    onChange({ ...formData, aaConsent: checked });
    
    if (onConsentChange) {
      onConsentChange(checked);
    }

    if (banking?.updateConsent) {
      banking.updateConsent('aa', checked);
    }

    if (banking?.addNotification) {
      banking.addNotification({
        type: checked ? 'success' : 'info',
        message: checked ? 'AA consent provided' : 'AA consent withdrawn',
        duration: 2000,
      });
    }
  }, [formData, onChange, onConsentChange, banking]);

  // ✅ Calculate financial health score
  const calculateFinancialScore = useCallback((data) => {
    let score = 60; // Base score
    
    // ✅ Payment consistency bonus
    if (data.utilityPaymentConsistency >= 90) score += 15;
    else if (data.utilityPaymentConsistency >= 80) score += 10;
    else if (data.utilityPaymentConsistency >= 70) score += 5;
    
    // ✅ Bounce events penalty
    if (data.bounceEvents === 0) score += 10;
    else if (data.bounceEvents === 1) score += 5;
    else score -= (data.bounceEvents * 5);
    
    // ✅ Transaction frequency bonus
    if (data.transactionFrequency > 40) score += 5;
    
    // ✅ Income to expense ratio
    const ratio = data.avgMonthlyIncome / data.avgMonthlyExpenses;
    if (ratio > 2) score += 5;
    else if (ratio < 1) score -= 10;
    
    return Math.min(100, Math.max(0, score));
  }, []);

  // ✅ Simulate AA fetch
  const simulateAAFetch = useCallback(async () => {
    setIsConnecting(true);
    setConnectionStatus('connecting');
    setErrors(null);

    try {
      if (banking?.addNotification) {
        banking.addNotification({
          type: 'info',
          message: 'Connecting to Account Aggregator...',
          duration: 2000,
        });
      }

      // ✅ Simulate AA connection and data fetch
      const steps = [
        { progress: 10, text: 'Creating AA handle...', delay: simulateDelay ? 1000 : 100 },
        { progress: 30, text: 'Requesting consent...', delay: simulateDelay ? 1500 : 100 },
        { progress: 50, text: 'Connecting to financial institutions...', delay: simulateDelay ? 2000 : 100 },
        { progress: 70, text: 'Fetching transaction data...', delay: simulateDelay ? 2500 : 100 },
        { progress: 90, text: 'Processing financial data...', delay: simulateDelay ? 1500 : 100 },
        { progress: 100, text: 'Data fetch complete!', delay: simulateDelay ? 500 : 100 },
      ];

      for (const step of steps) {
        setProgress(step.progress);
        await new Promise(resolve => setTimeout(resolve, step.delay));
      }

      // ✅ Simulate fetched data with realistic variations
      const fetchedData = {
        annualIncome: Math.floor(Math.random() * 3000000 + 500000),
        avgMonthlyIncome: Math.floor(Math.random() * 250000 + 40000),
        avgMonthlyExpenses: Math.floor(Math.random() * 150000 + 20000),
        transactionFrequency: Math.floor(Math.random() * 100 + 30),
        utilityPaymentConsistency: Math.floor(Math.random() * 20 + 75),
        upiTransactionCount: Math.floor(Math.random() * 200 + 50),
        bounceEvents: Math.floor(Math.random() * 4),
        accountAge: Math.floor(Math.random() * 5 + 1),
        accountsLinked: linkedAccounts?.length || Math.floor(Math.random() * 3 + 1),
        fetchedAt: new Date().toISOString(),
      };

      // ✅ Calculate financial health
      fetchedData.financialHealthScore = calculateFinancialScore(fetchedData);

      setAaData(fetchedData);
      setConnectionStatus('connected');

      // ✅ Update context
      if (banking?.updateAAData) {
        banking.updateAAData(fetchedData);
      }

      if (banking?.addNotification) {
        banking.addNotification({
          type: 'success',
          message: 'Financial data fetched successfully!',
          duration: 2000,
        });
      }

      // ✅ Call completion callback
      if (onFetchComplete) {
        onFetchComplete(fetchedData);
      }
    } catch (err) {
      setErrors('Failed to fetch data from Account Aggregator. Please try again.');
      setConnectionStatus('error');

      if (banking?.addNotification) {
        banking.addNotification({
          type: 'error',
          message: 'Failed to fetch financial data',
          duration: 3000,
        });
      }
    } finally {
      setIsConnecting(false);
    }
  }, [simulateDelay, linkedAccounts, calculateFinancialScore, onFetchComplete, banking]);

  // ✅ Handle refetch
  const handleRefetch = useCallback(() => {
    setAaData(null);
    setProgress(0);
    setErrors(null);
    setConnectionStatus('idle');
  }, []);

  // ✅ Get data quality indicator
  const getDataQualityIndicator = useMemo(() => {
    if (!aaData) return null;

    const qualityFactors = [
      aaData.accountAge > 2 ? 1 : 0,
      aaData.accountsLinked > 1 ? 1 : 0,
      aaData.transactionFrequency > 40 ? 1 : 0,
      aaData.bounceEvents === 0 ? 1 : 0,
    ];

    const quality = (qualityFactors.reduce((a, b) => a + b) / qualityFactors.length) * 100;
    
    if (quality >= 75) return 'Excellent';
    if (quality >= 50) return 'Good';
    return 'Fair';
  }, [aaData]);

  return (
    <div className="space-y-4">
      <div className="mb-4">
        <h3 className="text-xl font-semibold text-gray-800 border-b pb-2 flex items-center gap-2">
          Account Aggregator Integration
          <Badge variant="primary" size="sm">RBI Approved</Badge>
        </h3>
        <p className="text-sm text-gray-600 mt-2">
          Securely fetch your financial data with your consent
        </p>
      </div>

      {/* ✅ What is AA */}
      <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded-lg">
        <h4 className="font-semibold text-blue-900 mb-2 flex items-center gap-2">
          <Shield size={20} />
          What is Account Aggregator?
        </h4>
        <p className="text-sm text-blue-800 mb-3">
          Account Aggregator is a secure, RBI-regulated system that allows you to share your 
          financial data directly from your bank with your consent. This helps us assess your 
          creditworthiness without requiring physical documents.
        </p>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mt-3">
          <div className="bg-white p-2 rounded text-center hover:shadow-md transition-all">
            <Shield className="text-blue-600 mx-auto mb-1" size={20} />
            <p className="text-xs font-semibold text-gray-800">100% Secure</p>
          </div>
          <div className="bg-white p-2 rounded text-center hover:shadow-md transition-all">
            <Database className="text-green-600 mx-auto mb-1" size={20} />
            <p className="text-xs font-semibold text-gray-800">Encrypted</p>
          </div>
          <div className="bg-white p-2 rounded text-center hover:shadow-md transition-all">
            <Clock className="text-orange-600 mx-auto mb-1" size={20} />
            <p className="text-xs font-semibold text-gray-800">Real-time</p>
          </div>
          <div className="bg-white p-2 rounded text-center hover:shadow-md transition-all">
            <TrendingUp className="text-purple-600 mx-auto mb-1" size={20} />
            <p className="text-xs font-semibold text-gray-800">Better Rates</p>
          </div>
        </div>
      </div>

      {!aaData ? (
        <>
          {/* ✅ Benefits */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <h4 className="font-semibold text-gray-800 mb-3">Benefits of Using AA</h4>
            <ul className="space-y-2 text-sm text-gray-700">
              <li className="flex items-start gap-2">
                <span className="text-green-600 font-bold">✓</span>
                <span>Faster loan approval (within minutes)</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-600 font-bold">✓</span>
                <span>Better interest rates based on actual financial behavior</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-600 font-bold">✓</span>
                <span>No need to upload bank statements manually</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-600 font-bold">✓</span>
                <span>Helps if you don't have CIBIL score</span>
              </li>
            </ul>
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

          {/* Consent */}
          <div className="border-2 border-blue-200 bg-blue-50 p-4 rounded-lg">
            <Checkbox
              name="aaConsent"
              checked={formData.aaConsent || false}
              onChange={handleAAConsent}
              label={
                <span className="text-sm">
                  <strong>I consent</strong> to fetch my financial data via Account Aggregator 
                  from my linked bank accounts. I understand this data will be used only for 
                  credit assessment and will be kept confidential.
                </span>
              }
            />
          </div>

          {isConnecting ? (
            <div className="bg-white rounded-lg p-6">
              <ProgressBar 
                progress={progress} 
                text="Connecting to Account Aggregator..." 
                color="blue"
                height="lg"
                showStatus={true}
              />
              <p className="text-sm text-gray-600 text-center mt-4">
                Please wait while we securely fetch your financial data...
              </p>
            </div>
          ) : (
            <div className="space-y-2">
              <Button
                variant="primary"
                onClick={simulateAAFetch}
                disabled={!formData.aaConsent || isConnecting}
                fullWidth
              >
                <span className="flex items-center justify-center gap-2">
                  <Database size={20} />
                  Fetch Financial Data via AA
                </span>
              </Button>

              {!formData.aaConsent && (
                <Alert
                  type="warning"
                  message="Please provide consent to fetch your financial data"
                  dismissible={false}
                />
              )}
            </div>
          )}
        </>
      ) : (
        <>
          {/* Success Message */}
          <StatusBox
            type="success"
            title="Financial Data Retrieved Successfully!"
            message="We've securely fetched your financial data from your bank accounts."
          />

          {/* ✅ AA Data Display */}
          <div className="bg-white rounded-lg border-2 border-green-200 p-6">
            <h4 className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
              <Database className="text-green-600" size={20} />
              Retrieved Financial Insights
            </h4>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Annual Income */}
              <div className="p-3 bg-gray-50 rounded-lg">
                <p className="text-xs text-gray-600 mb-1">Annual Income</p>
                <p className="text-xl font-bold text-gray-800">
                  ₹{aaData.annualIncome.toLocaleString()}
                </p>
              </div>
              
              {/* Monthly Income */}
              <div className="p-3 bg-gray-50 rounded-lg">
                <p className="text-xs text-gray-600 mb-1">Avg Monthly Income</p>
                <p className="text-xl font-bold text-gray-800">
                  ₹{aaData.avgMonthlyIncome.toLocaleString()}
                </p>
              </div>
              
              {/* Monthly Expenses */}
              <div className="p-3 bg-gray-50 rounded-lg">
                <p className="text-xs text-gray-600 mb-1">Avg Monthly Expenses</p>
                <p className="text-xl font-bold text-gray-800">
                  ₹{aaData.avgMonthlyExpenses.toLocaleString()}
                </p>
              </div>
              
              {/* Transaction Frequency */}
              <div className="p-3 bg-gray-50 rounded-lg">
                <p className="text-xs text-gray-600 mb-1">Transaction Frequency</p>
                <p className="text-xl font-bold text-gray-800">
                  {aaData.transactionFrequency}/month
                </p>
              </div>
              
              {/* Payment Consistency */}
              <div className="p-3 bg-gray-50 rounded-lg">
                <p className="text-xs text-gray-600 mb-1">Payment Consistency</p>
                <p className={`text-xl font-bold ${aaData.utilityPaymentConsistency >= 85 ? 'text-green-600' : 'text-yellow-600'}`}>
                  {aaData.utilityPaymentConsistency}%
                </p>
              </div>
              
              {/* UPI Transactions */}
              <div className="p-3 bg-gray-50 rounded-lg">
                <p className="text-xs text-gray-600 mb-1">UPI Transactions</p>
                <p className="text-xl font-bold text-gray-800">
                  {aaData.upiTransactionCount}
                </p>
              </div>
              
              {/* Bounce Events */}
              <div className="p-3 bg-gray-50 rounded-lg">
                <p className="text-xs text-gray-600 mb-1">Bounce Events</p>
                <p className={`text-xl font-bold ${aaData.bounceEvents === 0 ? 'text-green-600' : 'text-yellow-600'}`}>
                  {aaData.bounceEvents}
                </p>
              </div>
              
              {/* Financial Health Score */}
              <div className="p-3 bg-green-50 rounded-lg border border-green-200">
                <p className="text-xs text-green-700 mb-1">Financial Health Score</p>
                <p className="text-xl font-bold text-green-600">
                  {aaData.financialHealthScore}/ 100
                </p>
              </div>

              {/* ✅ Data Quality */}
              {getDataQualityIndicator && (
                <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
                  <p className="text-xs text-blue-700 mb-1">Data Quality</p>
                  <Badge 
                    variant={
                      getDataQualityIndicator === 'Excellent' ? 'success' :
                      getDataQualityIndicator === 'Good' ? 'warning' :
                      'info'
                    }
                  >
                    {getDataQualityIndicator}
                  </Badge>
                </div>
              )}

              {/* ✅ Account Details */}
              <div className="p-3 bg-purple-50 rounded-lg border border-purple-200">
                <p className="text-xs text-purple-700 mb-1">Accounts Linked</p>
                <p className="text-xl font-bold text-purple-600">
                  {aaData.accountsLinked}
                </p>
              </div>
            </div>

            {/* ✅ Insights Message */}
            <div className="mt-4 p-3 bg-green-50 rounded-lg border border-green-200">
              <p className="text-sm text-green-800">
                <strong>✓ Great news!</strong> Your financial behavior shows strong repayment 
                capacity. This will help improve your loan approval chances and get better interest rates.
              </p>
            </div>

            {/* ✅ Recommendations */}
            {aaData.financialHealthScore < 75 && (
              <div className="mt-3 p-3 bg-yellow-50 rounded-lg border border-yellow-200">
                <p className="text-sm text-yellow-800">
                  <strong>💡 Tip:</strong> To improve your financial health score, try to:
                </p>
                <ul className="text-sm text-yellow-700 mt-2 list-disc list-inside space-y-1">
                  {aaData.bounceEvents > 0 && <li>Avoid account overdrafts and bounces</li>}
                  {aaData.utilityPaymentConsistency < 85 && <li>Ensure timely bill payments</li>}
                  {(aaData.avgMonthlyIncome / aaData.avgMonthlyExpenses) < 1.5 && <li>Increase savings rate</li>}
                </ul>
              </div>
            )}
          </div>

          {/* ✅ Actions */}
          <div className="flex gap-2">
            <Button
              variant="primary"
              onClick={() => onFetchComplete && onFetchComplete(aaData)}
              fullWidth
            >
              Continue with Application
            </Button>
            <Button
              variant="outline"
              onClick={handleRefetch}
            >
              Refetch Data
            </Button>
          </div>
        </>
      )}
    </div>
  );
};

export default AAIntegration;
