import React, { useContext, useState, useMemo, useCallback } from 'react';
import { BankingContext } from '../../context/Index'; // ✅ Added
import { Input, Checkbox, Badge, Alert } from '../../components/common/Index'; // ✅ Updated
import { TrendingUp, AlertCircle, CheckCircle } from 'lucide-react'; // ✅ Added

/**
 * AlternativeDataForm Component
 * Collect alternative credit data for credit-less users
 * 
 * @param {object} formData - Form data state
 * @param {function} onChange - Form change handler
 * @param {function} onScoreChange - Score calculation callback
 * @param {object} scoreWeights - Custom score weights
 * @param {boolean} showPredictions - Show score predictions
 */
const AlternativeDataForm = ({ 
  formData, 
  onChange,
  onScoreChange = null, // ✅ Added
  scoreWeights = null, // ✅ Added
  showPredictions = true, // ✅ Added
}) => {
  // ✅ Get context
  const banking = useContext(BankingContext);

  // ✅ State management
  const [errors, setErrors] = useState({}); // ✅ Added
  const [scoreBreakdown, setScoreBreakdown] = useState(null); // ✅ Added

  // ✅ Default score weights
  const defaultWeights = {
    digital: 0.35,
    psychometric: 0.35,
    trustIndicators: 0.30,
  };

  const weights = scoreWeights || defaultWeights;

  // ✅ Handle form change with validation
  const handleChange = useCallback((e) => {
    const { name, value, type, checked } = e.target;
    const newValue = type === 'checkbox' ? checked : value;

    // ✅ Validate numeric inputs
    if (type === 'number' && newValue) {
      const numValue = parseFloat(newValue);
      if (name === 'cibilScore' && (numValue < 0 || numValue > 900)) {
        setErrors(prev => ({ ...prev, [name]: 'CIBIL score must be between 0-900' }));
        return;
      }
      if (name === 'creditHistory' && numValue < 0) {
        setErrors(prev => ({ ...prev, [name]: 'Credit history cannot be negative' }));
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

    const updatedFormData = { 
      ...formData, 
      [name]: newValue 
    };

    onChange(updatedFormData);

    // ✅ Recalculate scores if score field changed
    if (['digitalScore', 'psychometricScore', 'fpoMember', 'businessRegistered', 'utilityBillsPaid', 'rentPaidRegularly'].includes(name)) {
      calculateAlternativeScore(updatedFormData);
    }

    // ✅ Update context
    if (banking?.updateFormData) {
      banking.updateFormData({ [name]: newValue });
    }
  }, [formData, onChange, errors, banking]);

  // ✅ Calculate alternative credit score
  const calculateAlternativeScore = useCallback((data) => {
    const digitalScore = (data.digitalScore || 50) / 100;
    const psychometricScore = (data.psychometricScore || 50) / 100;
    
    // ✅ Calculate trust bonus
    const trustBonus = 
      (data.fpoMember ? 10 : 0) + 
      (data.businessRegistered ? 15 : 0) + 
      (data.utilityBillsPaid ? 5 : 0) + 
      (data.rentPaidRegularly ? 8 : 0);

    const trustScore = Math.min(100, trustBonus) / 100;

    // ✅ Calculate weighted score
    const alternativeScore = Math.round(
      (digitalScore * weights.digital * 100 +
       psychometricScore * weights.psychometric * 100 +
       trustScore * weights.trustIndicators * 100)
    );

    // ✅ Create detailed breakdown
    const breakdown = {
      digitalScore: Math.round(digitalScore * weights.digital * 100),
      psychometricScore: Math.round(psychometricScore * weights.psychometric * 100),
      trustScore: Math.round(trustScore * weights.trustIndicators * 100),
      totalScore: alternativeScore,
      trustBonus,
      factors: {
        fpoMember: data.fpoMember,
        businessRegistered: data.businessRegistered,
        utilityBillsPaid: data.utilityBillsPaid,
        rentPaidRegularly: data.rentPaidRegularly,
      },
    };

    setScoreBreakdown(breakdown);

    // ✅ Call callback
    if (onScoreChange) {
      onScoreChange(breakdown);
    }

    if (banking?.updateAlternativeScore) {
      banking.updateAlternativeScore(breakdown);
    }
  }, [weights, onScoreChange, banking]);

  // ✅ Get digital activity assessment
  const getDigitalActivityAssessment = useCallback((score) => {
    if (score > 80) return { level: 'Very High', color: 'text-green-600', icon: '📈' };
    if (score > 60) return { level: 'High', color: 'text-green-500', icon: '📊' };
    if (score > 40) return { level: 'Medium', color: 'text-yellow-600', icon: '📉' };
    return { level: 'Low', color: 'text-red-600', icon: '⚠️' };
  }, []);

  // ✅ Get trust score interpretation
  const getTrustInterpretation = useCallback((score) => {
    if (score >= 30) return { level: 'Excellent', recommendation: 'Strong lending potential' };
    if (score >= 20) return { level: 'Good', recommendation: 'Good lending potential' };
    if (score >= 10) return { level: 'Fair', recommendation: 'Moderate lending potential' };
    return { level: 'Basic', recommendation: 'Limited trust indicators' };
  }, []);

  // ✅ Memoized calculations
  const calculations = useMemo(() => {
    if (!scoreBreakdown) return null;

    const assessment = getDigitalActivityAssessment(formData.digitalScore || 50);
    const trustInterp = getTrustInterpretation(scoreBreakdown.trustBonus);
    const overallRating = scoreBreakdown.totalScore >= 70 ? 'Good' : scoreBreakdown.totalScore >= 50 ? 'Fair' : 'Poor';

    return { assessment, trustInterp, overallRating };
  }, [scoreBreakdown, formData.digitalScore, getDigitalActivityAssessment, getTrustInterpretation]);

  // ✅ Validate form completeness
  const formCompleteness = useMemo(() => {
    const fields = [
      formData.cibilScore !== undefined,
      formData.creditHistory !== undefined,
      formData.digitalScore !== undefined,
      formData.psychometricScore !== undefined,
    ];
    return (fields.filter(f => f).length / fields.length) * 100;
  }, [formData]);

  return (
    <div className="space-y-4">
      <div className="mb-4">
        <h3 className="text-xl font-semibold text-gray-800 border-b pb-2 flex items-center gap-2">
          Alternative Credit Data
          <Badge variant="primary" size="sm">RBI Approved</Badge>
        </h3>
        <p className="text-sm text-gray-600 mt-2">
          This information helps us assess your creditworthiness better
        </p>
      </div>

      {/* ✅ Form completeness indicator */}
      {showPredictions && (
        <div className="bg-blue-50 border-l-4 border-blue-500 p-3 rounded">
          <p className="text-xs text-blue-700 mb-1">Form Completeness</p>
          <div className="flex items-center gap-2">
            <div className="flex-1 bg-blue-200 rounded-full h-2 overflow-hidden">
              <div 
                className="bg-blue-600 h-full transition-all" 
                style={{ width: `${formCompleteness}%` }}
              />
            </div>
            <span className="text-xs font-semibold text-blue-700">{Math.round(formCompleteness)}%</span>
          </div>
        </div>
      )}

      {/* Credit History */}
      <div className="bg-gray-50 p-4 rounded-lg">
        <h4 className="font-semibold text-gray-800 mb-3">Credit History</h4>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            label="CIBIL Score"
            name="cibilScore"
            type="number"
            value={formData.cibilScore || ''}
            onChange={handleChange}
            placeholder="Leave blank if you don't have"
            helperText="Not mandatory - we use alternative data"
            error={errors.cibilScore}
            min="0"
            max="900"
          />
          <Input
            label="Credit History (months)"
            name="creditHistory"
            type="number"
            value={formData.creditHistory || ''}
            onChange={handleChange}
            placeholder="Length of credit history"
            helperText="Total months of credit history"
            error={errors.creditHistory}
            min="0"
          />
        </div>

        {/* ✅ Info alert */}
        {!formData.cibilScore && (
          <Alert
            type="info"
            message="✓ Don't have CIBIL? No problem! We'll use your digital and psychometric scores."
            dismissible={false}
          />
        )}
      </div>

      {/* Digital Footprint */}
      <div className="bg-gray-50 p-4 rounded-lg">
        <h4 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
          Digital Footprint Score
          <Badge variant="info" size="sm">New!</Badge>
        </h4>
        <p className="text-sm text-gray-600 mb-3">
          Based on your digital transactions, mobile usage, and online presence
        </p>
        
        <div className="space-y-3">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Digital Activity Score (0-100)
            </label>
            <input
              type="range"
              name="digitalScore"
              min="0"
              max="100"
              step="5"
              value={formData.digitalScore || 50}
              onChange={handleChange}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
            />
            <div className="flex justify-between items-center text-xs text-gray-500 mt-1">
              <span>Low Activity</span>
              <span className={`font-semibold ${calculations?.assessment.color || 'text-gray-600'}`}>
                {calculations?.assessment.icon} {formData.digitalScore || 50}
              </span>
              <span>High Activity</span>
            </div>
          </div>

          {/* ✅ Digital metrics breakdown */}
          <div className="grid grid-cols-2 gap-3 text-sm">
            <div className="p-2 bg-white rounded border border-gray-200">
              <p className="text-gray-600">UPI Transactions</p>
              <p className="font-semibold text-gray-800">
                {formData.digitalScore > 70 ? '📱 High' : formData.digitalScore > 40 ? '📊 Medium' : '⚠️ Low'}
              </p>
            </div>
            <div className="p-2 bg-white rounded border border-gray-200">
              <p className="text-gray-600">Mobile Banking</p>
              <p className="font-semibold text-gray-800">
                {formData.digitalScore > 60 ? '✓ Active' : '○ Limited'}
              </p>
            </div>
          </div>

          {/* ✅ Digital assessment */}
          {calculations && (
            <div className="p-2 bg-blue-50 rounded border border-blue-200">
              <p className="text-xs text-blue-700">
                <strong>Digital Profile:</strong> {calculations.assessment.level}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Psychometric Assessment */}
      <div className="bg-gray-50 p-4 rounded-lg">
        <h4 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
          Psychometric Score
          <Badge variant="info" size="sm">AI-Powered</Badge>
        </h4>
        <p className="text-sm text-gray-600 mb-3">
          Based on behavioral patterns and financial discipline indicators
        </p>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Financial Responsibility Score (0-100)
          </label>
          <input
            type="range"
            name="psychometricScore"
            min="0"
            max="100"
            step="5"
            value={formData.psychometricScore || 50}
            onChange={handleChange}
            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-green-600"
          />
          <div className="flex justify-between items-center text-xs text-gray-500 mt-1">
            <span>Low Discipline</span>
            <span className="font-semibold text-green-600">
              {formData.psychometricScore > 70 ? '🌟' : formData.psychometricScore > 40 ? '⭐' : '○'} {formData.psychometricScore || 50}
            </span>
            <span>High Discipline</span>
          </div>
        </div>

        {/* ✅ Psychometric interpretation */}
        {formData.psychometricScore && (
          <div className="mt-3 p-2 bg-green-50 rounded border border-green-200">
            <p className="text-xs text-green-700">
              <strong>Responsibility Level:</strong> {
                formData.psychometricScore > 70 ? 'Very High' :
                formData.psychometricScore > 50 ? 'High' :
                formData.psychometricScore > 30 ? 'Moderate' :
                'Needs Improvement'
              }
            </p>
          </div>
        )}
      </div>

      {/* Additional Indicators */}
      <div className="bg-gray-50 p-4 rounded-lg">
        <h4 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
          <TrendingUp size={18} className="text-green-600" />
          Additional Trust Indicators
        </h4>
        
        <div className="space-y-3">
          <Checkbox
            name="fpoMember"
            checked={formData.fpoMember || false}
            onChange={handleChange}
            label={
              <span className="flex items-center gap-2">
                Member of FPO (Farmer Producer Organization)
                <Badge variant="success" size="sm">+10 points</Badge>
              </span>
            }
          />
          
          <Checkbox
            name="businessRegistered"
            checked={formData.businessRegistered || false}
            onChange={handleChange}
            label={
              <span className="flex items-center gap-2">
                Business is officially registered (GST/MSME)
                <Badge variant="success" size="sm">+15 points</Badge>
              </span>
            }
          />
          
          <Checkbox
            name="utilityBillsPaid"
            checked={formData.utilityBillsPaid || false}
            onChange={handleChange}
            label={
              <span className="flex items-center gap-2">
                Regular utility bill payments
                <Badge variant="success" size="sm">+5 points</Badge>
              </span>
            }
          />
          
          <Checkbox
            name="rentPaidRegularly"
            checked={formData.rentPaidRegularly || false}
            onChange={handleChange}
            label={
              <span className="flex items-center gap-2">
                Regular rent payments (verifiable)
                <Badge variant="success" size="sm">+8 points</Badge>
              </span>
            }
          />
        </div>
      </div>

      {/* Score Summary */}
      {scoreBreakdown && showPredictions && (
        <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded-lg">
          <h4 className="font-semibold text-blue-900 mb-3">📊 Alternative Credit Score Preview</h4>
          
          <div className="grid grid-cols-3 gap-3 text-center mb-4">
            <div className="bg-white rounded-lg p-3 border border-blue-200">
              <p className="text-xs text-blue-700">Digital Score</p>
              <p className="text-2xl font-bold text-blue-900">{scoreBreakdown.digitalScore}</p>
              <p className="text-xs text-blue-600 mt-1">{Math.round(weights.digital * 100)}% weight</p>
            </div>
            <div className="bg-white rounded-lg p-3 border border-blue-200">
              <p className="text-xs text-blue-700">Psychometric</p>
              <p className="text-2xl font-bold text-blue-900">{scoreBreakdown.psychometricScore}</p>
              <p className="text-xs text-blue-600 mt-1">{Math.round(weights.psychometric * 100)}% weight</p>
            </div>
            <div className="bg-white rounded-lg p-3 border border-blue-200">
              <p className="text-xs text-blue-700">Trust Bonus</p>
              <p className="text-2xl font-bold text-blue-900">+{scoreBreakdown.trustBonus}</p>
              <p className="text-xs text-blue-600 mt-1">{Math.round(weights.trustIndicators * 100)}% weight</p>
            </div>
          </div>

          {/* ✅ Overall score display */}
          <div className="bg-gradient-to-r from-blue-100 to-purple-100 rounded-lg p-4 text-center">
            <p className="text-xs text-blue-700 mb-1">Your Alternative Credit Score</p>
            <p className={`text-4xl font-bold ${
              scoreBreakdown.totalScore >= 70 ? 'text-green-600' :
              scoreBreakdown.totalScore >= 50 ? 'text-yellow-600' :
              'text-red-600'
            }`}>
              {scoreBreakdown.totalScore}
            </p>
            <p className="text-sm text-blue-800 mt-2">
              {calculations?.trustInterp.recommendation}
            </p>
          </div>

          {/* ✅ Detailed insights */}
          <div className="mt-3 space-y-2 text-sm">
            <div className="flex items-start gap-2">
              <CheckCircle size={16} className="text-green-600 flex-shrink-0 mt-0.5" />
              <p className="text-blue-800">
                <strong>Overall Rating:</strong> {calculations?.overallRating}
              </p>
            </div>
            <div className="flex items-start gap-2">
              <TrendingUp size={16} className="text-green-600 flex-shrink-0 mt-0.5" />
              <p className="text-blue-800">
                <strong>Trust Interpretation:</strong> {calculations?.trustInterp.level}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* ✅ Score factors summary */}
      {scoreBreakdown && (
        <div className="bg-green-50 border-l-4 border-green-500 p-3 rounded-lg">
          <p className="text-sm text-green-800 mb-2">
            <strong>✓ Your Trust Factors:</strong>
          </p>
          <ul className="text-sm text-green-700 space-y-1">
            {scoreBreakdown.factors.fpoMember && <li>• FPO Member (+10 points)</li>}
            {scoreBreakdown.factors.businessRegistered && <li>• Registered Business (+15 points)</li>}
            {scoreBreakdown.factors.utilityBillsPaid && <li>• Regular Bill Payments (+5 points)</li>}
            {scoreBreakdown.factors.rentPaidRegularly && <li>• Regular Rent Payments (+8 points)</li>}
            {Object.values(scoreBreakdown.factors).every(f => !f) && <li>• Add trust indicators to improve your score</li>}
          </ul>
        </div>
      )}
    </div>
  );
};

export default AlternativeDataForm;
