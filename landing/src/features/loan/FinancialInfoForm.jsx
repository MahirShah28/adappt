import React, { useContext, useState, useMemo, useCallback } from 'react';
import { BankingContext } from '../../context/Index'; // ✅ Added
import { Input, Select, Badge, Alert } from '../../components/common/Index'; // ✅ Updated
import { TrendingUp, AlertCircle, CheckCircle, Calculator } from 'lucide-react'; // ✅ Added

/**
 * FinancialInfoForm Component
 * Collect financial information and calculate loan EMI
 * 
 * @param {object} formData - Form data state
 * @param {function} onChange - Form change handler
 * @param {function} onCalculation - Calculation callback
 * @param {object} customRates - Custom interest rates
 * @param {boolean} showAdvanced - Show advanced options
 */
const FinancialInfoForm = ({ 
  formData, 
  onChange,
  onCalculation = null, // ✅ Added
  customRates = null, // ✅ Added
  showAdvanced = true, // ✅ Added
}) => {
  // ✅ Get context
  const banking = useContext(BankingContext);

  // ✅ State management
  const [errors, setErrors] = useState({}); // ✅ Added
  const [showWarnings, setShowWarnings] = useState(false); // ✅ Added
  const [rateType, setRateType] = useState('base'); // ✅ Added

  // ✅ Interest rate configuration
  const interestRates = customRates || {
    base: 12,
    secured: 10,
    unsecured: 14,
    agricultural: 8,
    business: 11,
  };

  // ✅ Get applicable rate
  const getApplicableRate = useCallback(() => {
    if (rateType && interestRates[rateType]) {
      return interestRates[rateType];
    }
    return interestRates.base;
  }, [rateType, interestRates]);

  // ✅ Handle form change with validation
  const handleChange = useCallback((e) => {
    const { name, value } = e.target;
    
    // ✅ Validate numeric inputs
    if (['monthlyIncome', 'monthlyExpenses', 'savings', 'existingLoans', 'existingEmi', 'loanAmount'].includes(name)) {
      const numValue = parseFloat(value);
      if (value && isNaN(numValue)) {
        setErrors(prev => ({ ...prev, [name]: 'Invalid number' }));
        return;
      }
      
      // ✅ Specific validations
      if (name === 'loanAmount' && numValue < 10000) {
        setErrors(prev => ({ ...prev, [name]: 'Minimum loan amount is ₹10,000' }));
        return;
      }
      if (name === 'loanAmount' && numValue > 500000) {
        setErrors(prev => ({ ...prev, [name]: 'Maximum loan amount is ₹5,00,000' }));
        return;
      }
    }

    // ✅ Clear error on valid input
    if (name in errors) {
      setErrors(prev => {
        const updated = { ...prev };
        delete updated[name];
        return updated;
      });
    }

    const updatedFormData = { ...formData, [name]: value };
    onChange(updatedFormData);

    // ✅ Update context
    if (banking?.updateFormData) {
      banking.updateFormData({ [name]: value });
    }
  }, [formData, onChange, errors, banking]);

  // ✅ Calculate EMI with configurable rate
  const calculateEMI = useCallback((principal, tenure, customRate = null) => {
    if (!principal || !tenure) return 0;

    const rate = customRate || getApplicableRate();
    const monthlyRate = rate / 12 / 100;
    
    if (monthlyRate === 0) {
      return Math.round(principal / tenure);
    }
    
    const numerator = principal * monthlyRate * Math.pow(1 + monthlyRate, tenure);
    const denominator = Math.pow(1 + monthlyRate, tenure) - 1;
    const emi = numerator / denominator;
    
    return isNaN(emi) ? 0 : Math.round(emi);
  }, [getApplicableRate]);

  // ✅ Memoized EMI and calculations
  const loanCalculations = useMemo(() => {
    const principal = parseFloat(formData.loanAmount) || 0;
    const tenure = parseInt(formData.tenure) || 12;
    const rate = getApplicableRate();
    
    const monthlyEMI = calculateEMI(principal, tenure, rate);
    const totalAmount = monthlyEMI * tenure;
    const totalInterest = totalAmount - principal;

    // ✅ Calculate debt ratios
    const monthlyIncome = parseFloat(formData.monthlyIncome) || 0;
    const existingEmi = parseFloat(formData.existingEmi) || 0;
    const totalMonthlyObligation = monthlyEMI + existingEmi;
    
    const dtiRatio = monthlyIncome > 0 ? (totalMonthlyObligation / monthlyIncome) * 100 : 0;
    const emiToIncomeRatio = monthlyIncome > 0 ? (monthlyEMI / monthlyIncome) * 100 : 0;

    // ✅ Calculate affordability score
    const monthlyExpenses = parseFloat(formData.monthlyExpenses) || monthlyIncome * 0.6;
    const availableAmount = monthlyIncome - monthlyExpenses - totalMonthlyObligation;

    return {
      monthlyEMI,
      totalAmount,
      totalInterest,
      dtiRatio: Math.round(dtiRatio),
      emiToIncomeRatio: Math.round(emiToIncomeRatio),
      availableAmount: Math.max(0, Math.round(availableAmount)),
      isAffordable: dtiRatio <= 50 && emiToIncomeRatio <= 40,
      rate,
    };
  }, [formData, calculateEMI, getApplicableRate]);

  // ✅ Check financial health
  const financialHealth = useMemo(() => {
    const monthlyIncome = parseFloat(formData.monthlyIncome) || 0;
    const savings = parseFloat(formData.savings) || 0;
    const monthlyExpenses = parseFloat(formData.monthlyExpenses) || monthlyIncome * 0.6;
    
    const savingsToIncomeRatio = monthlyIncome > 0 ? (savings / (monthlyIncome * 12)) : 0;
    const savingsToExpenseRatio = monthlyExpenses > 0 ? (savings / monthlyExpenses) : 0;

    let healthStatus = 'Good';
    let color = 'green';
    let score = 70;

    if (savingsToIncomeRatio < 0.5) {
      healthStatus = 'Needs Improvement';
      color = 'red';
      score = 40;
    } else if (savingsToIncomeRatio < 1) {
      healthStatus = 'Fair';
      color = 'yellow';
      score = 55;
    } else if (savingsToIncomeRatio >= 2) {
      healthStatus = 'Excellent';
      color = 'green';
      score = 85;
    }

    return {
      status: healthStatus,
      color,
      score,
      savingsRatio: (savingsToIncomeRatio * 100).toFixed(0),
    };
  }, [formData]);

  // ✅ Get warnings
  const getWarnings = useCallback(() => {
    const warnings = [];
    const monthlyIncome = parseFloat(formData.monthlyIncome) || 0;
    const existingEmi = parseFloat(formData.existingEmi) || 0;

    if (loanCalculations.dtiRatio > 50) {
      warnings.push('⚠️ DTI Ratio exceeds recommended limit. Your debt obligations are high.');
    }
    if (loanCalculations.emiToIncomeRatio > 40) {
      warnings.push('⚠️ EMI to income ratio is high. Consider reducing loan amount or tenure.');
    }
    if (loanCalculations.availableAmount < 5000) {
      warnings.push('⚠️ Limited monthly available amount after expenses and EMIs.');
    }
    if (parseFloat(formData.savings) < monthlyIncome) {
      warnings.push('💡 Building an emergency fund of 3-6 months expenses is recommended.');
    }

    return warnings;
  }, [formData, loanCalculations]);

  // ✅ Validate form completeness
  const formCompleteness = useMemo(() => {
    const requiredFields = ['monthlyIncome', 'loanAmount', 'tenure'];
    const completedFields = requiredFields.filter(field => formData[field]);
    return (completedFields.length / requiredFields.length) * 100;
  }, [formData]);

  const warnings = getWarnings();

  return (
    <div className="space-y-4">
      <div className="mb-4">
        <h3 className="text-xl font-semibold text-gray-800 border-b pb-2 flex items-center gap-2">
          Financial Information
          {formCompleteness === 100 && <Badge variant="success" size="sm">Complete</Badge>}
        </h3>
        <p className="text-sm text-gray-600 mt-2">
          Tell us about your income and financial requirements
        </p>
      </div>

      {/* Income & Expenses */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Input
          label="Monthly Income (₹)"
          name="monthlyIncome"
          type="number"
          value={formData.monthlyIncome}
          onChange={handleChange}
          placeholder="Your monthly income"
          helperText="Enter your gross monthly income"
          error={errors.monthlyIncome}
          required
          min="0"
        />
        <Input
          label="Monthly Expenses (₹)"
          name="monthlyExpenses"
          type="number"
          value={formData.monthlyExpenses || ''}
          onChange={handleChange}
          placeholder="Your monthly expenses"
          helperText="Approximate monthly household expenses"
          min="0"
        />
      </div>

      {/* Savings & Existing Loans */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Input
          label="Savings (₹)"
          name="savings"
          type="number"
          value={formData.savings}
          onChange={handleChange}
          placeholder="Total savings amount"
          helperText="Include bank balance and other savings"
          min="0"
        />
        <Input
          label="Existing Loans"
          name="existingLoans"
          type="number"
          value={formData.existingLoans}
          onChange={handleChange}
          placeholder="Number of existing loans"
          helperText="Total number of active loans"
          min="0"
        />
      </div>

      {/* Existing EMI */}
      <Input
        label="Total Existing EMI (₹)"
        name="existingEmi"
        type="number"
        value={formData.existingEmi}
        onChange={handleChange}
        placeholder="Total monthly EMI payments"
        helperText="Sum of all monthly loan payments"
        min="0"
      />

      {/* ✅ Financial Health Score */}
      {formData.monthlyIncome && formData.savings && (
        <div className={`p-3 bg-${financialHealth.color}-50 rounded-lg border border-${financialHealth.color}-200`}>
          <div className="flex items-center justify-between">
            <div>
              <p className={`text-xs text-${financialHealth.color}-700 font-semibold`}>Financial Health</p>
              <p className={`text-lg font-bold text-${financialHealth.color}-900`}>{financialHealth.score}/100</p>
            </div>
            <div className="text-right">
              <Badge 
                variant={financialHealth.color === 'green' ? 'success' : financialHealth.color === 'yellow' ? 'warning' : 'danger'}
                size="sm"
              >
                {financialHealth.status}
              </Badge>
              <p className={`text-xs text-${financialHealth.color}-600 mt-1`}>Savings: {financialHealth.savingsRatio}% of annual income</p>
            </div>
          </div>
        </div>
      )}

      {/* Loan Requirements */}
      <div className="border-t pt-4 mt-6">
        <h4 className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
          <Calculator size={18} className="text-blue-600" />
          Loan Requirements
        </h4>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            label="Loan Amount Requested (₹)"
            name="loanAmount"
            type="number"
            value={formData.loanAmount}
            onChange={handleChange}
            placeholder="Amount you need"
            helperText="Minimum ₹10,000, Maximum ₹5,00,000"
            error={errors.loanAmount}
            required
            min="10000"
            max="500000"
          />
          <Select
            label="Loan Tenure (months)"
            name="tenure"
            value={formData.tenure}
            onChange={handleChange}
            options={[
              { value: '6', label: '6 months' },
              { value: '12', label: '12 months' },
              { value: '18', label: '18 months' },
              { value: '24', label: '24 months' },
              { value: '36', label: '36 months' },
              { value: '48', label: '48 months' },
            ]}
            required
          />
        </div>

        <Select
          label="Loan Purpose"
          name="loanPurpose"
          value={formData.loanPurpose || 'Business'}
          onChange={handleChange}
          options={[
            { value: 'Business Expansion', label: 'Business Expansion' },
            { value: 'Working Capital', label: 'Working Capital' },
            { value: 'Agriculture', label: 'Agriculture' },
            { value: 'Equipment Purchase', label: 'Equipment Purchase' },
            { value: 'Education', label: 'Education' },
            { value: 'Medical Emergency', label: 'Medical Emergency' },
            { value: 'Home Improvement', label: 'Home Improvement' },
            { value: 'Personal Use', label: 'Personal Use' },
            { value: 'Other', label: 'Other' },
          ]}
        />

        {/* ✅ Rate Type Selection */}
        {showAdvanced && (
          <Select
            label="Interest Rate Type"
            value={rateType}
            onChange={(e) => setRateType(e.target.value)}
            options={[
              { value: 'base', label: `Base Rate - ${interestRates.base}% p.a.` },
              { value: 'secured', label: `Secured Loan - ${interestRates.secured}% p.a.` },
              { value: 'unsecured', label: `Unsecured - ${interestRates.unsecured}% p.a.` },
              { value: 'agricultural', label: `Agricultural - ${interestRates.agricultural}% p.a.` },
              { value: 'business', label: `Business - ${interestRates.business}% p.a.` },
            ]}
          />
        )}
      </div>

      {/* EMI Calculation & Display */}
      {formData.loanAmount && formData.tenure && (
        <div className="mt-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {/* Monthly EMI */}
            <div>
              <p className="text-xs text-blue-600 font-semibold">Monthly EMI</p>
              <p className="text-xl font-bold text-blue-900">₹{loanCalculations.monthlyEMI.toLocaleString()}</p>
            </div>

            {/* Total Amount */}
            <div>
              <p className="text-xs text-blue-600 font-semibold">Total Amount</p>
              <p className="text-xl font-bold text-blue-900">₹{loanCalculations.totalAmount.toLocaleString()}</p>
            </div>

            {/* Total Interest */}
            <div>
              <p className="text-xs text-blue-600 font-semibold">Total Interest</p>
              <p className="text-xl font-bold text-blue-900">₹{loanCalculations.totalInterest.toLocaleString()}</p>
            </div>

            {/* Interest Rate */}
            <div>
              <p className="text-xs text-blue-600 font-semibold">Interest Rate</p>
              <p className="text-xl font-bold text-blue-900">{loanCalculations.rate}% p.a.</p>
            </div>
          </div>

          {/* ✅ Debt Ratios */}
          <div className="mt-3 pt-3 border-t border-blue-300 grid grid-cols-3 gap-2 text-xs">
            <div>
              <p className="text-blue-600 font-semibold">DTI Ratio</p>
              <p className={`font-bold ${loanCalculations.dtiRatio <= 50 ? 'text-green-600' : 'text-red-600'}`}>
                {loanCalculations.dtiRatio}%
              </p>
              <p className="text-blue-500">{loanCalculations.dtiRatio <= 50 ? '✓ Good' : '⚠️ High'}</p>
            </div>
            <div>
              <p className="text-blue-600 font-semibold">EMI/Income</p>
              <p className={`font-bold ${loanCalculations.emiToIncomeRatio <= 40 ? 'text-green-600' : 'text-red-600'}`}>
                {loanCalculations.emiToIncomeRatio}%
              </p>
              <p className="text-blue-500">{loanCalculations.emiToIncomeRatio <= 40 ? '✓ Good' : '⚠️ High'}</p>
            </div>
            <div>
              <p className="text-blue-600 font-semibold">Available/Month</p>
              <p className={`font-bold ${loanCalculations.availableAmount > 5000 ? 'text-green-600' : 'text-yellow-600'}`}>
                ₹{loanCalculations.availableAmount.toLocaleString()}
              </p>
              <p className="text-blue-500">{loanCalculations.availableAmount > 5000 ? '✓ Healthy' : '⚠️ Low'}</p>
            </div>
          </div>

          {/* ✅ Affordability Indicator */}
          <div className="mt-3 pt-3 border-t border-blue-300">
            <div className="flex items-center justify-between">
              <p className="text-xs text-blue-700 font-medium">Affordability Assessment</p>
              <Badge 
                variant={loanCalculations.isAffordable ? 'success' : 'warning'}
                size="sm"
              >
                {loanCalculations.isAffordable ? '✓ Affordable' : '⚠️ Tight Budget'}
              </Badge>
            </div>
          </div>

          <p className="text-xs text-blue-600 mt-2">
            * This is an indicative EMI. Actual rate may vary based on credit assessment.
          </p>
        </div>
      )}

      {/* ✅ Warnings & Alerts */}
      {showWarnings && warnings.length > 0 && (
        <div className="space-y-2">
          {warnings.map((warning, idx) => (
            <Alert
              key={idx}
              type={warning.includes('⚠️') ? 'warning' : 'info'}
              message={warning}
              dismissible={false}
            />
          ))}
        </div>
      )}

      {/* ✅ Show Warnings Toggle */}
      {warnings.length > 0 && (
        <button
          onClick={() => setShowWarnings(!showWarnings)}
          className="text-sm text-blue-600 hover:text-blue-700 font-medium"
        >
          {showWarnings ? 'Hide' : `Show ${warnings.length} Warning(s)`}
        </button>
      )}

      {/* ✅ Form Summary */}
      {formCompleteness > 0 && (
        <div className="p-3 bg-gray-50 rounded-lg">
          <div className="flex justify-between items-center mb-2">
            <p className="text-xs text-gray-700 font-semibold">Form Completeness</p>
            <p className="text-xs font-bold text-gray-800">{Math.round(formCompleteness)}%</p>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
            <div 
              className="bg-blue-600 h-full transition-all" 
              style={{ width: `${formCompleteness}%` }}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default FinancialInfoForm;
