import React, { useContext, useState, useCallback, useMemo } from 'react';
import { BankingContext } from '../../context/Index'; // ✅ Added
import { Input, Checkbox, Alert } from '../../components/common/Index'; // ✅ Updated
import { VALIDATION_RULES } from '../../utils/constants'; // ✅ Added
import { 
  validatePAN, 
  validateAadhaar, 
  validateMobile,
  validateEmail 
} from '../../utils/validators'; // ✅ Added

/**
 * AccountForm Component
 * Form for collecting account opening details with validation
 * 
 * @param {object} formData - Form data state
 * @param {function} onChange - Change handler
 * @param {function} onSubmit - Submit handler
 * @param {boolean} isProcessing - Is form processing
 * @param {array} errors - Validation errors
 * @param {boolean} showValidation - Show validation feedback
 * @param {function} onFieldBlur - Field blur handler
 * @param {boolean} allowPartialSubmit - Allow partial submission
 */
const AccountForm = ({ 
  formData, 
  onChange, 
  onSubmit, 
  isProcessing,
  errors = {}, // ✅ Added
  showValidation = true, // ✅ Added
  onFieldBlur = null, // ✅ Added
  allowPartialSubmit = false, // ✅ Added
}) => {
  // ✅ Get context
  const banking = useContext(BankingContext);

  // ✅ State for field-level errors
  const [fieldErrors, setFieldErrors] = useState({}); // ✅ Added
  const [touchedFields, setTouchedFields] = useState({}); // ✅ Added

  // ✅ Validate individual fields
  const validateField = useCallback((name, value) => {
    let error = '';

    switch (name) {
      case 'name':
        if (!value.trim()) {
          error = 'Full name is required';
        } else if (value.trim().length < 3) {
          error = 'Name must be at least 3 characters';
        } else if (!/^[a-zA-Z\s]+$/.test(value)) {
          error = 'Name should contain only letters and spaces';
        }
        break;

      case 'mobile':
        const mobileValidation = validateMobile(value);
        error = mobileValidation.isValid ? '' : mobileValidation.error;
        break;

      case 'pan':
        const panValidation = validatePAN(value);
        error = panValidation.isValid ? '' : panValidation.error;
        break;

      case 'aadhaar':
        const aadhaarValidation = validateAadhaar(value);
        error = aadhaarValidation.isValid ? '' : aadhaarValidation.error;
        break;

      case 'email':
        if (value && !validateEmail(value).isValid) {
          error = 'Please enter a valid email address';
        }
        break;

      case 'consent':
        if (!value) {
          error = 'You must consent to Video KYC';
        }
        break;

      case 'termsAccepted':
        if (!value) {
          error = 'You must accept Terms & Conditions';
        }
        break;

      default:
        break;
    }

    return error;
  }, []);

  // ✅ Enhanced input change handler with validation
  const handleInputChange = useCallback((e) => {
    const { name, value, type, checked } = e.target;
    const newValue = type === 'checkbox' ? checked : value;

    // ✅ Update form data
    onChange({
      ...formData,
      [name]: newValue
    });

    // ✅ Validate field
    if (touchedFields[name]) {
      const error = validateField(name, newValue);
      setFieldErrors(prev => ({
        ...prev,
        [name]: error
      }));
    }

    // ✅ Call banking context if needed
    if (banking?.updateFormData) {
      banking.updateFormData({ [name]: newValue });
    }
  }, [formData, onChange, touchedFields, validateField, banking]);

  // ✅ Handle field blur for validation
  const handleFieldBlur = useCallback((e) => {
    const { name, value } = e.target;

    // ✅ Mark field as touched
    setTouchedFields(prev => ({
      ...prev,
      [name]: true
    }));

    // ✅ Validate field
    const error = validateField(name, value);
    setFieldErrors(prev => ({
      ...prev,
      [name]: error
    }));

    // ✅ Call external blur handler
    if (onFieldBlur) {
      onFieldBlur(name, value);
    }
  }, [validateField, onFieldBlur]);

  // ✅ Validate entire form
  const validateForm = useMemo(() => {
    return () => {
      const newErrors = {};
      const requiredFields = ['name', 'mobile', 'pan', 'aadhaar', 'consent', 'termsAccepted'];

      requiredFields.forEach(field => {
        const value = formData[field];
        const error = validateField(field, value);
        if (error) {
          newErrors[field] = error;
        }
      });

      return newErrors;
    };
  }, [formData, validateField]);

  // ✅ Check if form is valid
  const isFormValid = useMemo(() => {
    const validationErrors = validateForm();
    return Object.keys(validationErrors).length === 0;
  }, [validateForm]);

  // ✅ Enhanced submit handler
  const handleSubmit = useCallback((e) => {
    e.preventDefault();

    // ✅ Mark all fields as touched
    const allFields = ['name', 'mobile', 'pan', 'aadhaar', 'consent', 'termsAccepted'];
    setTouchedFields(allFields.reduce((acc, field) => ({ ...acc, [field]: true }), {}));

    // ✅ Validate form
    const validationErrors = validateForm();
    setFieldErrors(validationErrors);

    // ✅ Check if form is valid
    if (Object.keys(validationErrors).length > 0) {
      // ✅ Show error notification
      if (banking?.addNotification) {
        banking.addNotification({
          type: 'error',
          message: 'Please fix the validation errors and try again.',
          duration: 3000,
        });
      }
      return;
    }

    // ✅ Show processing state
    if (banking?.setLoading) {
      banking.setLoading(true);
    }

    // ✅ Call submit handler
    if (onSubmit) {
      onSubmit(e);
    }
  }, [formData, validateForm, onSubmit, banking]);

  // ✅ Handle PAN number formatting
  const handlePanChange = useCallback((e) => {
    const value = e.target.value.toUpperCase();
    
    handleInputChange({
      target: {
        name: 'pan',
        value: value,
        type: 'text'
      }
    });
  }, [handleInputChange]);

  // ✅ Handle Aadhaar formatting
  const handleAadhaarChange = useCallback((e) => {
    let value = e.target.value.replace(/\D/g, ''); // Remove non-digits
    
    // Format as XXXX XXXX XXXX
    if (value.length > 4) {
      value = value.slice(0, 4) + ' ' + value.slice(4);
    }
    if (value.length > 9) {
      value = value.slice(0, 9) + ' ' + value.slice(9);
    }

    handleInputChange({
      target: {
        name: 'aadhaar',
        value: value.slice(0, 14),
        type: 'text'
      }
    });
  }, [handleInputChange]);

  // ✅ Handle Mobile formatting
  const handleMobileChange = useCallback((e) => {
    const value = e.target.value.replace(/\D/g, '').slice(0, 10);
    
    handleInputChange({
      target: {
        name: 'mobile',
        value: value,
        type: 'tel'
      }
    });
  }, [handleInputChange]);

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-lg p-8 space-y-6" noValidate>
      <div className="mb-6">
        <h3 className="text-xl font-semibold text-gray-800 mb-2">Enter Your Details</h3>
        <p className="text-sm text-gray-600">
          Please provide accurate information as per your government-issued documents
        </p>
      </div>

      {/* ✅ Global error message */}
      {Object.keys(fieldErrors).length > 0 && (
        <Alert 
          type="error" 
          message="Please fix the highlighted errors before submitting."
          dismissible={false}
        />
      )}

      {/* Full Name */}
      <Input
        label="Full Name"
        name="name"
        value={formData.name}
        onChange={handleInputChange}
        onBlur={handleFieldBlur}
        placeholder="Enter your full name as on PAN card"
        helperText="This should match your PAN card exactly"
        error={touchedFields.name && fieldErrors.name ? fieldErrors.name : ''}
        showValidation={showValidation && touchedFields.name}
        required
      />

      {/* Mobile Number */}
      <Input
        label="Mobile Number"
        name="mobile"
        type="tel"
        value={formData.mobile}
        onChange={handleMobileChange} // ✅ Custom handler
        onBlur={handleFieldBlur}
        placeholder="10-digit mobile number"
        helperText="This number should be linked to your Aadhaar"
        error={touchedFields.mobile && fieldErrors.mobile ? fieldErrors.mobile : ''}
        showValidation={showValidation && touchedFields.mobile}
        maxLength="10"
        required
      />

      {/* PAN Number */}
      <Input
        label="PAN Number"
        name="pan"
        value={formData.pan}
        onChange={handlePanChange} // ✅ Custom handler
        onBlur={handleFieldBlur}
        placeholder="ABCDE1234F"
        helperText="10-character alphanumeric PAN number"
        error={touchedFields.pan && fieldErrors.pan ? fieldErrors.pan : ''}
        showValidation={showValidation && touchedFields.pan}
        pattern={VALIDATION_RULES.PAN.source}
        maxLength="10"
        required
      />

      {/* Aadhaar Number */}
      <Input
        label="Aadhaar Number"
        name="aadhaar"
        value={formData.aadhaar}
        onChange={handleAadhaarChange} // ✅ Custom handler
        onBlur={handleFieldBlur}
        placeholder="1234 5678 9012"
        helperText="12-digit Aadhaar number"
        error={touchedFields.aadhaar && fieldErrors.aadhaar ? fieldErrors.aadhaar : ''}
        showValidation={showValidation && touchedFields.aadhaar}
        maxLength="14"
        required
      />

      {/* Email (Optional) */}
      <Input
        label="Email Address (Optional)"
        name="email"
        type="email"
        value={formData.email || ''}
        onChange={handleInputChange}
        onBlur={handleFieldBlur}
        placeholder="your.email@example.com"
        helperText="We'll send account details to this email"
        error={touchedFields.email && fieldErrors.email ? fieldErrors.email : ''}
        showValidation={showValidation && touchedFields.email}
      />

      {/* Consent Checkbox */}
      <div className="pt-4 border-t border-gray-200">
        <Checkbox
          name="consent"
          checked={formData.consent}
          onChange={handleInputChange}
          error={touchedFields.consent && fieldErrors.consent ? fieldErrors.consent : ''} // ✅ Added
          label={
            <span className="text-sm">
              I consent to open a new bank account and allow <strong>Video KYC (V-CIP)</strong> to be 
              conducted as per RBI guidelines. I understand that my identity will be verified through 
              a live video call.
            </span>
          }
        />
      </div>

      {/* Additional Consents */}
      <div className="bg-gray-50 p-4 rounded-lg space-y-3">
        <p className="text-sm font-medium text-gray-700">Additional Consents:</p>
        
        <Checkbox
          name="termsAccepted"
          checked={formData.termsAccepted || false}
          onChange={handleInputChange}
          error={touchedFields.termsAccepted && fieldErrors.termsAccepted ? fieldErrors.termsAccepted : ''} // ✅ Added
          label={
            <span className="text-sm">
              I agree to the <a href="#terms" className="text-blue-600 hover:underline">Terms & Conditions</a> and{' '}
              <a href="#privacy" className="text-blue-600 hover:underline">Privacy Policy</a>
            </span>
          }
        />
        
        <Checkbox
          name="marketingConsent"
          checked={formData.marketingConsent || false}
          onChange={handleInputChange}
          label={
            <span className="text-sm">
              I agree to receive promotional emails and SMS (optional)
            </span>
          }
        />
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        disabled={isProcessing || !isFormValid}
        className={`w-full py-3 px-6 rounded-lg font-semibold text-white transition-all duration-200 ${
          isProcessing || !isFormValid
            ? 'bg-gray-400 cursor-not-allowed'
            : 'bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2'
        }`}
        aria-label="Start Video KYC and open account"
      >
        {isProcessing ? (
          <span className="flex items-center justify-center gap-2">
            <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
            </svg>
            Processing...
          </span>
        ) : (
          'Start Video KYC & Open Account'
        )}
      </button>

      {/* Help Text */}
      <div className="text-center text-sm text-gray-500">
        <p>Need help? Call us at <strong>1800-XXX-XXXX</strong> (Toll Free)</p>
      </div>

      {/* ✅ Form status info */}
      {showValidation && (
        <div className="text-xs text-gray-500 text-center">
          <p>Required fields: Full Name, Mobile, PAN, Aadhaar, Consent & Terms</p>
        </div>
      )}
    </form>
  );
};

export default AccountForm;
