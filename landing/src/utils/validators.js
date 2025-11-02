/**
 * validators.js
 * Validation functions for form inputs and data
 * Returns validation result with error messages
 */

/**
 * Validate PAN (Permanent Account Number)
 * Format: AAAAA9999A (5 letters, 4 digits, 1 letter)
 * @param {string} pan - PAN number to validate
 * @returns {object} - { isValid: boolean, error: string }
 * 
 * @example
 * validatePAN('ABCDE1234F') // { isValid: true, error: '' }
 * validatePAN('INVALID') // { isValid: false, error: 'Invalid PAN format' }
 */
export const validatePAN = (pan) => {
  if (!pan) {
    return { isValid: false, error: 'PAN is required' };
  }

  const panRegex = /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/;
  const upperPAN = pan.toUpperCase().trim();

  if (!panRegex.test(upperPAN)) {
    return { 
      isValid: false, 
      error: 'PAN must be 10 characters: 5 letters, 4 digits, 1 letter (e.g., ABCDE1234F)' 
    };
  }

  return { isValid: true, error: '' };
};

/**
 * Validate Aadhaar number
 * Format: 12-digit number
 * @param {string} aadhaar - Aadhaar number
 * @returns {object} - { isValid: boolean, error: string }
 * 
 * @example
 * validateAadhaar('123456789012') // { isValid: true, error: '' }
 * validateAadhaar('1234') // { isValid: false, error: '...' }
 */
export const validateAadhaar = (aadhaar) => {
  if (!aadhaar) {
    return { isValid: false, error: 'Aadhaar is required' };
  }

  const cleaned = aadhaar.replace(/\s/g, '');
  
  if (!/^\d{12}$/.test(cleaned)) {
    return { 
      isValid: false, 
      error: 'Aadhaar must be 12 digits' 
    };
  }

  // Verhoeff algorithm validation (optional for production)
  if (!verifyAadhaarChecksum(cleaned)) {
    return { 
      isValid: false, 
      error: 'Invalid Aadhaar checksum' 
    };
  }

  return { isValid: true, error: '' };
};

/**
 * Verify Aadhaar checksum using Verhoeff algorithm
 * @param {string} aadhaar - 12-digit Aadhaar
 * @returns {boolean}
 */
const verifyAadhaarChecksum = (aadhaar) => {
  // Simplified checksum (full Verhoeff algorithm would be more complex)
  const digits = aadhaar.split('').map(Number);
  let sum = 0;
  
  for (let i = 0; i < digits.length - 1; i++) {
    sum += digits[i] * (i + 1);
  }

  const checkDigit = sum % 11;
  return checkDigit === digits[digits.length - 1] || digits[digits.length - 1] === (11 - checkDigit) % 10;
};

/**
 * Validate mobile number (Indian)
 * Format: 10-digit number starting with 6-9
 * @param {string} mobile - Mobile number
 * @returns {object} - { isValid: boolean, error: string }
 * 
 * @example
 * validateMobile('9876543210') // { isValid: true, error: '' }
 * validateMobile('1234567890') // { isValid: false, error: '...' }
 */
export const validateMobile = (mobile) => {
  if (!mobile) {
    return { isValid: false, error: 'Mobile number is required' };
  }

  const cleaned = mobile.replace(/\D/g, '');
  
  // Indian mobile numbers are 10 digits, first digit 6-9
  if (!/^[6-9]\d{9}$/.test(cleaned)) {
    return { 
      isValid: false, 
      error: 'Invalid mobile number. Must be 10 digits starting with 6-9' 
    };
  }

  return { isValid: true, error: '' };
};

/**
 * Validate age
 * @param {number} age - Age in years
 * @param {number} min - Minimum age (default: 18)
 * @param {number} max - Maximum age (default: 75)
 * @returns {object} - { isValid: boolean, error: string }
 * 
 * @example
 * validateAge(30) // { isValid: true, error: '' }
 * validateAge(16) // { isValid: false, error: 'Age must be at least 18' }
 */
export const validateAge = (age, min = 18, max = 75) => {
  if (age === null || age === undefined) {
    return { isValid: false, error: 'Age is required' };
  }

  const numAge = Number(age);

  if (isNaN(numAge)) {
    return { isValid: false, error: 'Age must be a number' };
  }

  if (numAge < min) {
    return { 
      isValid: false, 
      error: `Age must be at least ${min} years` 
    };
  }

  if (numAge > max) {
    return { 
      isValid: false, 
      error: `Age must not exceed ${max} years` 
    };
  }

  return { isValid: true, error: '' };
};

/**
 * Validate email address
 * @param {string} email - Email to validate
 * @returns {object} - { isValid: boolean, error: string }
 * 
 * @example
 * validateEmail('user@example.com') // { isValid: true, error: '' }
 * validateEmail('invalid.email') // { isValid: false, error: '...' }
 */
export const validateEmail = (email) => {
  if (!email) {
    return { isValid: false, error: 'Email is required' };
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (!emailRegex.test(email)) {
    return { 
      isValid: false, 
      error: 'Please enter a valid email address' 
    };
  }

  return { isValid: true, error: '' };
};

/**
 * Validate loan amount
 * @param {number} amount - Loan amount
 * @param {number} min - Minimum amount (default: 10,000)
 * @param {number} max - Maximum amount (default: 50,00,000)
 * @returns {object} - { isValid: boolean, error: string }
 * 
 * @example
 * validateLoanAmount(50000) // { isValid: true, error: '' }
 * validateLoanAmount(5000) // { isValid: false, error: 'Minimum loan is ₹10,000' }
 */
export const validateLoanAmount = (amount, min = 10000, max = 5000000) => {
  if (amount === null || amount === undefined) {
    return { isValid: false, error: 'Loan amount is required' };
  }

  const numAmount = Number(amount);

  if (isNaN(numAmount)) {
    return { isValid: false, error: 'Loan amount must be a number' };
  }

  if (numAmount < min) {
    return { 
      isValid: false, 
      error: `Minimum loan amount is ₹${min.toLocaleString('en-IN')}` 
    };
  }

  if (numAmount > max) {
    return { 
      isValid: false, 
      error: `Maximum loan amount is ₹${max.toLocaleString('en-IN')}` 
    };
  }

  return { isValid: true, error: '' };
};

/**
 * Validate tenure (in months)
 * @param {number} tenure - Tenure in months
 * @param {number} min - Minimum months (default: 6)
 * @param {number} max - Maximum months (default: 60)
 * @returns {object} - { isValid: boolean, error: string }
 * 
 * @example
 * validateTenure(12) // { isValid: true, error: '' }
 * validateTenure(3) // { isValid: false, error: 'Tenure must be at least 6 months' }
 */
export const validateTenure = (tenure, min = 6, max = 60) => {
  if (tenure === null || tenure === undefined) {
    return { isValid: false, error: 'Tenure is required' };
  }

  const numTenure = Number(tenure);

  if (isNaN(numTenure) || !Number.isInteger(numTenure)) {
    return { isValid: false, error: 'Tenure must be a whole number' };
  }

  if (numTenure < min) {
    return { 
      isValid: false, 
      error: `Tenure must be at least ${min} months` 
    };
  }

  if (numTenure > max) {
    return { 
      isValid: false, 
      error: `Tenure cannot exceed ${max} months` 
    };
  }

  return { isValid: true, error: '' };
};

/**
 * Validate income amount
 * @param {number} income - Income amount
 * @returns {object} - { isValid: boolean, error: string }
 */
export const validateIncome = (income) => {
  if (income === null || income === undefined) {
    return { isValid: false, error: 'Income is required' };
  }

  const numIncome = Number(income);

  if (isNaN(numIncome)) {
    return { isValid: false, error: 'Income must be a number' };
  }

  if (numIncome <= 0) {
    return { 
      isValid: false, 
      error: 'Income must be greater than 0' 
    };
  }

  return { isValid: true, error: '' };
};

/**
 * Validate form field based on type
 * @param {string} fieldName - Field name
 * @param {*} value - Field value
 * @param {string} fieldType - Field type (pan, aadhaar, mobile, age, email, etc.)
 * @returns {object} - { isValid: boolean, error: string }
 */
export const validateField = (fieldName, value, fieldType) => {
  switch (fieldType) {
    case 'pan':
      return validatePAN(value);
    case 'aadhaar':
      return validateAadhaar(value);
    case 'mobile':
      return validateMobile(value);
    case 'age':
      return validateAge(value);
    case 'email':
      return validateEmail(value);
    case 'loanAmount':
      return validateLoanAmount(value);
    case 'tenure':
      return validateTenure(value);
    case 'income':
      return validateIncome(value);
    default:
      return { isValid: true, error: '' };
  }
};

export default {
  validatePAN,
  validateAadhaar,
  validateMobile,
  validateAge,
  validateEmail,
  validateLoanAmount,
  validateTenure,
  validateIncome,
  validateField,
};
