import React, { useContext, useState, useMemo, useCallback } from 'react';
import { BankingContext } from '../../context/Index'; // ✅ Added
import { Input, Select, Badge, Alert } from '../../components/common/Index'; // ✅ Updated
import { User, MapPin, Briefcase, GraduationCap, Phone, AlertCircle, CheckCircle } from 'lucide-react'; // ✅ Added

/**
 * PersonalInfoForm Component
 * Collect and validate personal information
 * 
 * @param {object} formData - Form data state
 * @param {function} onChange - Form change handler
 * @param {function} onValidation - Validation callback
 * @param {boolean} includeVerification - Include verification step
 * @param {object} regionConfig - Region-specific configuration
 */
const PersonalInfoForm = ({ 
  formData, 
  onChange,
  onValidation = null, // ✅ Added
  includeVerification = false, // ✅ Added
  regionConfig = null, // ✅ Added
}) => {
  // ✅ Get context
  const banking = useContext(BankingContext);

  // ✅ State management
  const [errors, setErrors] = useState({}); // ✅ Added
  const [verificationStatus, setVerificationStatus] = useState({}); // ✅ Added
  const [touched, setTouched] = useState({}); // ✅ Added

  // ✅ Default states and options
  const statesList = regionConfig?.states || [
    'Maharashtra', 'Karnataka', 'Tamil Nadu', 'Gujarat', 'Rajasthan',
    'Punjab', 'Uttar Pradesh', 'Bihar', 'West Bengal', 'Madhya Pradesh',
    'Telangana', 'Andhra Pradesh', 'Kerala', 'Haryana', 'Himachal Pradesh',
    'Jharkhand', 'Uttarakhand', 'Assam', 'Tripura', 'Other'
  ];

  const occupationsList = regionConfig?.occupations || [
    'Farmer', 'Small Business Owner', 'Trader', 'Artisan', 'Daily Wage Worker',
    'Salaried Employee', 'Self-Employed Professional', 'Other'
  ];

  // ✅ Validation rules
  const validateField = useCallback((name, value) => {
    const validations = {
      name: (val) => {
        if (!val?.trim()) return 'Name is required';
        if (val.trim().length < 3) return 'Name must be at least 3 characters';
        if (!/^[a-zA-Z\s]+$/.test(val)) return 'Name can only contain letters and spaces';
        return '';
      },
      age: (val) => {
        const age = parseInt(val);
        if (!val) return 'Age is required';
        if (isNaN(age)) return 'Age must be a number';
        if (age < 18) return 'Must be at least 18 years old';
        if (age > 75) return 'Age must be 75 or less';
        return '';
      },
      mobile: (val) => {
        if (!val) return 'Mobile number is required';
        if (!/^\d{10}$/.test(val.replace(/\D/g, ''))) return 'Mobile number must be 10 digits';
        return '';
      },
      email: (val) => {
        if (val && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val)) return 'Invalid email format';
        return '';
      },
    };

    return validations[name]?.(value) || '';
  }, []);

  // ✅ Handle form change with validation
  const handleChange = useCallback((e) => {
    const { name, value } = e.target;
    
    // ✅ Format phone number
    if (name === 'mobile') {
      const numericValue = value.replace(/\D/g, '').slice(0, 10);
      const updatedFormData = { ...formData, [name]: numericValue };
      onChange(updatedFormData);
      
      // ✅ Validate
      const error = validateField(name, numericValue);
      if (error) {
        setErrors(prev => ({ ...prev, [name]: error }));
      } else {
        setErrors(prev => {
          const updated = { ...prev };
          delete updated[name];
          return updated;
        });
      }
      return;
    }

    // ✅ Regular field update
    const error = validateField(name, value);
    if (error) {
      setErrors(prev => ({ ...prev, [name]: error }));
    } else {
      setErrors(prev => {
        const updated = { ...prev };
        delete updated[name];
        return updated;
      });
    }

    const updatedFormData = { ...formData, [name]: value };
    onChange(updatedFormData);

    // ✅ Mark field as touched
    setTouched(prev => ({ ...prev, [name]: true }));

    // ✅ Update context
    if (banking?.updateFormData) {
      banking.updateFormData({ [name]: value });
    }
  }, [formData, onChange, validateField, banking]);

  // ✅ Handle field blur
  const handleBlur = useCallback((e) => {
    const { name } = e.target;
    setTouched(prev => ({ ...prev, [name]: true }));
  }, []);

  // ✅ Verify phone number
  const verifyPhoneNumber = useCallback(async () => {
    if (formData.mobile && formData.mobile.length === 10) {
      setVerificationStatus(prev => ({ ...prev, mobile: 'verifying' }));
      
      try {
        // Simulate OTP sending
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        setVerificationStatus(prev => ({ ...prev, mobile: 'verified' }));
        
        if (banking?.addNotification) {
          banking.addNotification({
            type: 'success',
            message: 'OTP sent to your mobile number',
            duration: 2000,
          });
        }
      } catch (err) {
        setVerificationStatus(prev => ({ ...prev, mobile: 'error' }));
        if (banking?.addNotification) {
          banking.addNotification({
            type: 'error',
            message: 'Failed to send OTP',
            duration: 2000,
          });
        }
      }
    }
  }, [formData.mobile, banking]);

  // ✅ Calculate demographic profile
  const demographicProfile = useMemo(() => {
    const profile = {
      age: formData.age ? parseInt(formData.age) : null,
      ageGroup: formData.age ? (
        formData.age < 30 ? 'Young' :
        formData.age < 50 ? 'Middle-aged' :
        'Senior'
      ) : null,
      location: formData.locationTier === '1' ? 'Metro' :
                formData.locationTier === '2' ? 'Tier-2' :
                formData.locationTier === '3' ? 'Tier-3' :
                'Rural',
      occupation: formData.occupation,
      employment: formData.employmentType,
      education: formData.education,
      state: formData.state,
    };

    return profile;
  }, [formData]);

  // ✅ Validate form completeness
  const formCompleteness = useMemo(() => {
    const requiredFields = ['name', 'age', 'gender', 'mobile', 'state', 'locationTier', 'occupation', 'employmentType'];
    const completedFields = requiredFields.filter(field => formData[field]);
    return (completedFields.length / requiredFields.length) * 100;
  }, [formData]);

  // ✅ Get profile summary
  const getProfileSummary = useCallback(() => {
    if (!formData.name) return null;

    return `${formData.name}, ${formData.age} years, ${demographicProfile.location}, ${formData.occupation}`;
  }, [formData, demographicProfile]);

  // ✅ Check data quality
  const dataQuality = useMemo(() => {
    let quality = 0;
    if (formData.name?.length > 5) quality += 20;
    if (formData.age) quality += 20;
    if (formData.mobile) quality += 20;
    if (formData.state) quality += 20;
    if (formData.education && formData.education !== 'No Formal Education') quality += 20;

    return Math.min(100, quality);
  }, [formData]);

  return (
    <div className="space-y-4">
      <div className="mb-4">
        <h3 className="text-xl font-semibold text-gray-800 border-b pb-2 flex items-center gap-2">
          <User size={22} className="text-blue-600" />
          Personal Information
        </h3>
        <p className="text-sm text-gray-600 mt-2">
          Please provide your basic personal details
        </p>
      </div>

      {/* ✅ Data Quality Indicator */}
      {formCompleteness > 0 && (
        <div className="p-3 bg-blue-50 rounded-lg">
          <div className="flex justify-between items-center mb-2">
            <p className="text-xs text-blue-700 font-semibold">Form Completeness</p>
            <p className="text-xs font-bold text-blue-900">{Math.round(formCompleteness)}%</p>
          </div>
          <div className="w-full bg-blue-200 rounded-full h-2 overflow-hidden">
            <div 
              className="bg-blue-600 h-full transition-all" 
              style={{ width: `${formCompleteness}%` }}
            />
          </div>
        </div>
      )}

      {/* Name & Age */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Input
          label="Full Name"
          name="name"
          value={formData.name}
          onChange={handleChange}
          onBlur={handleBlur}
          placeholder="Enter your full name"
          helperText="First and last name"
          error={touched.name ? errors.name : ''}
          required
        />
        <Input
          label="Age"
          name="age"
          type="number"
          value={formData.age}
          onChange={handleChange}
          onBlur={handleBlur}
          placeholder="Your age"
          helperText="Must be between 18-75 years"
          error={touched.age ? errors.age : ''}
          min="18"
          max="75"
          required
        />
      </div>

      {/* Gender & Mobile */}
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
          required
        />
        <div>
          <Input
            label="Mobile Number"
            name="mobile"
            type="tel"
            value={formData.mobile}
            onChange={handleChange}
            onBlur={handleBlur}
            placeholder="10-digit mobile number"
            helperText="Your 10-digit phone number"
            error={touched.mobile ? errors.mobile : ''}
            maxLength="10"
            required
          />
          {/* ✅ Verification button */}
          {includeVerification && formData.mobile && !errors.mobile && (
            <button
              onClick={verifyPhoneNumber}
              className="mt-1 text-xs text-blue-600 hover:text-blue-700 font-medium"
              disabled={verificationStatus.mobile === 'verified'}
            >
              {verificationStatus.mobile === 'verifying' ? 'Sending OTP...' :
               verificationStatus.mobile === 'verified' ? '✓ Verified' :
               'Verify with OTP'}
            </button>
          )}
        </div>
      </div>

      {/* State & Location Tier */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Select
          label="State"
          name="state"
          value={formData.state}
          onChange={handleChange}
          options={statesList.map(state => ({ value: state, label: state }))}
          required
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
          required
        />
      </div>

      {/* Occupation & Education */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Select
          label="Occupation"
          name="occupation"
          value={formData.occupation}
          onChange={handleChange}
          options={occupationsList.map(occ => ({ value: occ, label: occ }))}
          required
        />
        <Select
          label="Education Level"
          name="education"
          value={formData.education}
          onChange={handleChange}
          options={[
            { value: 'No Formal Education', label: 'No Formal Education' },
            { value: 'Primary School', label: 'Primary School' },
            { value: 'High School', label: 'High School' },
            { value: 'Graduate', label: 'Graduate' },
            { value: 'Post Graduate', label: 'Post Graduate' },
          ]}
        />
      </div>

      {/* Employment Type */}
      <Select
        label="Employment Type"
        name="employmentType"
        value={formData.employmentType}
        onChange={handleChange}
        options={[
          { value: 'Self-Employed', label: 'Self-Employed' },
          { value: 'Salaried', label: 'Salaried' },
          { value: 'Business Owner', label: 'Business Owner' },
          { value: 'Daily Wage', label: 'Daily Wage' },
          { value: 'Farmer', label: 'Farmer' },
          { value: 'Unemployed', label: 'Unemployed' },
        ]}
        required
      />

      {/* ✅ Profile Summary Card */}
      {getProfileSummary() && (
        <div className="p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg border border-blue-200">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-xs text-gray-600 font-semibold mb-1">Profile Summary</p>
              <p className="text-sm font-medium text-gray-800">{getProfileSummary()}</p>
            </div>
            <Badge variant="info" size="sm">
              {demographicProfile.ageGroup}
            </Badge>
          </div>
        </div>
      )}

      {/* ✅ Demographic Profile */}
      {formData.state && formData.occupation && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-xs">
          <div className="p-2 bg-gray-50 rounded text-center">
            <p className="text-gray-600">Location</p>
            <p className="font-bold text-gray-800">{demographicProfile.location}</p>
          </div>
          <div className="p-2 bg-gray-50 rounded text-center">
            <p className="text-gray-600">Age Group</p>
            <p className="font-bold text-gray-800">{demographicProfile.ageGroup}</p>
          </div>
          <div className="p-2 bg-gray-50 rounded text-center">
            <p className="text-gray-600">Occupation</p>
            <p className="font-bold text-gray-800 truncate">{demographicProfile.occupation.split()[0]}</p>
          </div>
          <div className="p-2 bg-gray-50 rounded text-center">
            <p className="text-gray-600">Employment</p>
            <p className="font-bold text-gray-800 truncate">{demographicProfile.employment?.split()[0] || '-'}</p>
          </div>
        </div>
      )}

      {/* ✅ Data Quality Badge */}
      <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg border border-green-200">
        <div>
          <p className="text-xs text-green-700 font-semibold">Data Quality Score</p>
          <p className="text-sm font-bold text-green-900">{dataQuality}%</p>
        </div>
        <Badge 
          variant={dataQuality >= 80 ? 'success' : dataQuality >= 60 ? 'warning' : 'default'}
          size="sm"
        >
          {dataQuality >= 80 ? 'Excellent' : dataQuality >= 60 ? 'Good' : 'Fair'}
        </Badge>
      </div>

      {/* ✅ Error Summary */}
      {Object.keys(errors).length > 0 && (
        <Alert
          type="error"
          message={`${Object.keys(errors).length} field(s) need attention`}
          dismissible={false}
        />
      )}

      {/* ✅ Validation Status */}
      {formCompleteness === 100 && Object.keys(errors).length === 0 && (
        <Alert
          type="success"
          message="✓ All information looks good!"
          dismissible={false}
        />
      )}

      {/* ✅ Instructions */}
      <div className="p-3 bg-blue-50 rounded-lg text-xs text-blue-800 border border-blue-200">
        <p className="font-semibold mb-1">📝 Instructions:</p>
        <ul className="space-y-1 list-disc list-inside">
          <li>Ensure all information is accurate and up-to-date</li>
          <li>Mobile number will be used for verification</li>
          <li>This information is encrypted and secure</li>
        </ul>
      </div>
    </div>
  );
};

export default PersonalInfoForm;
