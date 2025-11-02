/**
 * formatters.js
 * Pure utility functions for formatting data display
 * All functions are side-effect free and deterministic
 */

/**
 * Format currency to Indian Rupee format
 * @param {number} amount - Amount to format
 * @param {boolean} showSymbol - Whether to show ₹ symbol
 * @param {number} decimals - Number of decimal places
 * @returns {string} - Formatted currency string
 * 
 * @example
 * formatCurrency(123456.78) // "₹1,23,456.78"
 * formatCurrency(50000, false) // "50,000.00"
 */
export const formatCurrency = (amount, showSymbol = true, decimals = 2) => {
  if (amount === null || amount === undefined || isNaN(amount)) {
    return showSymbol ? '₹0.00' : '0.00';
  }

  // Convert to number if string
  const num = typeof amount === 'string' ? parseFloat(amount) : amount;

  // Format with Indian numbering system
  const absNum = Math.abs(num);
  const isNegative = num < 0;

  // Split into integer and decimal parts
  const parts = absNum.toFixed(decimals).split('.');
  let integerPart = parts[0];
  const decimalPart = parts[1] || '00';

  // Add Indian comma separators (reversed approach)
  let formattedInteger = '';
  let digitCount = 0;

  for (let i = integerPart.length - 1; i >= 0; i--) {
    if (digitCount === 3 || (digitCount > 3 && (digitCount - 3) % 2 === 0)) {
      formattedInteger = ',' + formattedInteger;
    }
    formattedInteger = integerPart[i] + formattedInteger;
    digitCount++;
  }

  const result = `${formattedInteger}.${decimalPart}`;
  const withSign = isNegative ? `-${result}` : result;
  
  return showSymbol ? `₹${withSign}` : withSign;
};

/**
 * Format date to readable format
 * @param {Date|string} date - Date to format
 * @param {string} format - Format type: 'short', 'long', 'numeric', 'time'
 * @returns {string} - Formatted date string
 * 
 * @example
 * formatDate(new Date(), 'short') // "02 Nov 2025"
 * formatDate('2025-11-02', 'long') // "Sunday, November 02, 2025"
 * formatDate(new Date(), 'time') // "03:50 AM"
 */
export const formatDate = (date, format = 'short') => {
  if (!date) return 'N/A';

  const dateObj = typeof date === 'string' ? new Date(date) : date;

  if (isNaN(dateObj.getTime())) {
    return 'Invalid Date';
  }

  const day = String(dateObj.getDate()).padStart(2, '0');
  const month = String(dateObj.getMonth() + 1).padStart(2, '0');
  const year = dateObj.getFullYear();

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];
  const monthShort = monthNames[dateObj.getMonth()].substring(0, 3);
  const monthFull = monthNames[dateObj.getMonth()];

  const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const dayName = dayNames[dateObj.getDay()];

  let hours = dateObj.getHours();
  const minutes = String(dateObj.getMinutes()).padStart(2, '0');
  const ampm = hours >= 12 ? 'PM' : 'AM';
  hours = hours % 12;
  hours = hours ? hours : 12;
  const hoursFormatted = String(hours).padStart(2, '0');

  switch (format) {
    case 'short':
      return `${day} ${monthShort} ${year}`;
    case 'long':
      return `${dayName}, ${monthFull} ${day}, ${year}`;
    case 'numeric':
      return `${day}/${month}/${year}`;
    case 'time':
      return `${hoursFormatted}:${minutes} ${ampm}`;
    case 'datetime':
      return `${day} ${monthShort} ${year} at ${hoursFormatted}:${minutes} ${ampm}`;
    case 'iso':
      return dateObj.toISOString();
    default:
      return dateObj.toLocaleDateString();
  }
};

/**
 * Format percentage value
 * @param {number} value - Value to format (0-1 or 0-100)
 * @param {number} decimals - Number of decimal places
 * @param {boolean} auto100 - Whether value is 0-100 (true) or 0-1 (false)
 * @returns {string} - Formatted percentage
 * 
 * @example
 * formatPercentage(0.856) // "85.6%"
 * formatPercentage(85.6, 1, true) // "85.6%"
 * formatPercentage(0.333, 1) // "33.3%"
 */
export const formatPercentage = (value, decimals = 1, auto100 = false) => {
  if (value === null || value === undefined || isNaN(value)) {
    return '0%';
  }

  // Convert 0-1 to 0-100 if needed
  const percentage = auto100 ? value : value * 100;

  // Handle edge cases
  if (percentage < 0) return '0%';
  if (percentage > 100) return '100%';

  return `${percentage.toFixed(decimals)}%`;
};

/**
 * Format phone number to Indian format
 * @param {string} phoneNumber - Phone number without country code
 * @returns {string} - Formatted phone number
 * 
 * @example
 * formatPhoneNumber('9876543210') // "+91 98765 43210"
 * formatPhoneNumber('8765432109') // "+91 87654 32109"
 */
export const formatPhoneNumber = (phoneNumber) => {
  if (!phoneNumber) return '';

  // Remove all non-digit characters
  const cleaned = phoneNumber.replace(/\D/g, '');

  // Take last 10 digits (in case country code was included)
  const last10 = cleaned.slice(-10);

  // Check if it's a valid 10-digit number
  if (last10.length !== 10) {
    return phoneNumber;
  }

  // Format as +91 XXXXX XXXXX
  return `+91 ${last10.slice(0, 5)} ${last10.slice(5)}`;
};

/**
 * Format pan number
 * @param {string} pan - PAN number
 * @returns {string} - Formatted PAN
 * 
 * @example
 * formatPAN('ABCDE1234F') // "ABCDE1234F"
 */
export const formatPAN = (pan) => {
  if (!pan) return '';
  return pan.toUpperCase().slice(0, 10);
};

/**
 * Format Aadhaar number
 * @param {string} aadhaar - Aadhaar number
 * @returns {string} - Formatted Aadhaar (last 4 digits visible)
 * 
 * @example
 * formatAadhaar('123456789012') // "1234 5678 9012"
 * formatAadhaar('123456789012', true) // "XXXX XXXX 9012"
 */
export const formatAadhaar = (aadhaar, masked = false) => {
  if (!aadhaar) return '';

  const cleaned = aadhaar.replace(/\D/g, '');
  
  if (cleaned.length !== 12) {
    return aadhaar;
  }

  if (masked) {
    return `XXXX XXXX ${cleaned.slice(8)}`;
  }

  return `${cleaned.slice(0, 4)} ${cleaned.slice(4, 8)} ${cleaned.slice(8)}`;
};

/**
 * Format account number (mask middle digits)
 * @param {string} accountNumber - Account number
 * @returns {string} - Formatted account number
 * 
 * @example
 * formatAccountNumber('50100123456789') // "501001*****789"
 */
export const formatAccountNumber = (accountNumber) => {
  if (!accountNumber || accountNumber.length < 6) return accountNumber;

  const first = accountNumber.slice(0, 6);
  const last = accountNumber.slice(-3);
  const masked = '*'.repeat(Math.max(0, accountNumber.length - 9));

  return `${first}${masked}${last}`;
};

/**
 * Format loan amount with proper units (L/Cr)
 * @param {number} amount - Amount in rupees
 * @returns {string} - Formatted amount with units
 * 
 * @example
 * formatLoanAmount(500000) // "5.0 L"
 * formatLoanAmount(25000000) // "2.5 Cr"
 * formatLoanAmount(50000) // "₹50,000"
 */
export const formatLoanAmount = (amount) => {
  if (amount === null || amount === undefined || isNaN(amount)) {
    return '₹0';
  }

  const absAmount = Math.abs(amount);

  if (absAmount >= 10000000) {
    // Crores
    const crores = (absAmount / 10000000).toFixed(1);
    return `₹${crores} Cr`;
  } else if (absAmount >= 100000) {
    // Lakhs
    const lakhs = (absAmount / 100000).toFixed(1);
    return `₹${lakhs} L`;
  } else {
    // Regular currency format
    return formatCurrency(amount);
  }
};

/**
 * Format time duration (e.g., "2 months", "15 days")
 * @param {number} days - Number of days
 * @returns {string} - Formatted duration
 * 
 * @example
 * formatDuration(5) // "5 days"
 * formatDuration(60) // "2 months"
 * formatDuration(365) // "1 year"
 */
export const formatDuration = (days) => {
  if (days === null || days === undefined || isNaN(days)) {
    return 'N/A';
  }

  const absDay = Math.abs(Math.round(days));

  if (absDay < 1) return 'Today';
  if (absDay === 1) return '1 day';
  if (absDay < 30) return `${absDay} days`;
  
  const months = Math.round(absDay / 30);
  if (months === 1) return '1 month';
  if (months < 12) return `${months} months`;

  const years = (absDay / 365).toFixed(1);
  return `${years} years`;
};

/**
 * Format EMI amount
 * @param {number} emi - EMI amount
 * @returns {string} - Formatted EMI
 * 
 * @example
 * formatEMI(4500) // "₹4,500"
 */
export const formatEMI = (emi) => {
  return formatCurrency(emi);
};

/**
 * Format loan tenure (in months to readable format)
 * @param {number} months - Number of months
 * @returns {string} - Formatted tenure
 * 
 * @example
 * formatTenure(12) // "12 months"
 * formatTenure(24) // "2 years"
 * formatTenure(6) // "6 months"
 */
export const formatTenure = (months) => {
  if (months === null || months === undefined || isNaN(months)) {
    return 'N/A';
  }

  if (months < 12) return `${months} months`;

  const years = Math.floor(months / 12);
  const remainingMonths = months % 12;

  if (remainingMonths === 0) {
    return `${years} year${years > 1 ? 's' : ''}`;
  }

  return `${years} year${years > 1 ? 's' : ''} ${remainingMonths} month${remainingMonths > 1 ? 's' : ''}`;
};

/**
 * Format interest rate
 * @param {number} rate - Interest rate
 * @param {number} decimals - Number of decimal places
 * @returns {string} - Formatted rate
 * 
 * @example
 * formatInterestRate(12.5) // "12.5% p.a."
 * formatInterestRate(11) // "11.0% p.a."
 */
export const formatInterestRate = (rate, decimals = 1) => {
  if (rate === null || rate === undefined || isNaN(rate)) {
    return 'N/A';
  }

  return `${rate.toFixed(decimals)}% p.a.`;
};

/**
 * Format credit score
 * @param {number} score - Credit score
 * @returns {object} - Score with category
 * 
 * @example
 * formatCreditScore(750) // { score: 750, category: 'Excellent', color: 'green' }
 */
export const formatCreditScore = (score) => {
  if (score === null || score === undefined || isNaN(score)) {
    return { score: 0, category: 'N/A', color: 'gray' };
  }

  let category = '';
  let color = '';

  if (score >= 800) {
    category = 'Excellent';
    color = 'green';
  } else if (score >= 700) {
    category = 'Very Good';
    color = 'green';
  } else if (score >= 600) {
    category = 'Good';
    color = 'yellow';
  } else if (score >= 500) {
    category = 'Fair';
    color = 'orange';
  } else if (score >= 300) {
    category = 'Poor';
    color = 'red';
  } else {
    category = 'Very Poor';
    color = 'red';
  }

  return { score, category, color };
};

/**
 * Format DTI ratio
 * @param {number} ratio - DTI ratio
 * @returns {string} - Formatted DTI
 * 
 * @example
 * formatDTI(45.5) // "45.5%"
 */
export const formatDTI = (ratio) => {
  return formatPercentage(ratio, 1, true);
};

/**
 * Format byte size to readable format
 * @param {number} bytes - Size in bytes
 * @returns {string} - Formatted size
 * 
 * @example
 * formatFileSize(1024) // "1 KB"
 * formatFileSize(1048576) // "1 MB"
 */
export const formatFileSize = (bytes) => {
  if (!bytes) return '0 Bytes';

  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
};

/**
 * Format relative time (e.g., "2 hours ago")
 * @param {Date|string} date - Date to format
 * @returns {string} - Relative time string
 * 
 * @example
 * formatRelativeTime(new Date(Date.now() - 3600000)) // "1 hour ago"
 * formatRelativeTime(new Date(Date.now() - 60000)) // "1 minute ago"
 */
export const formatRelativeTime = (date) => {
  if (!date) return 'N/A';

  const dateObj = typeof date === 'string' ? new Date(date) : date;
  const now = new Date();
  const diff = now.getTime() - dateObj.getTime();

  const seconds = Math.floor(diff / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  if (seconds < 60) return 'just now';
  if (minutes === 1) return '1 minute ago';
  if (minutes < 60) return `${minutes} minutes ago`;
  if (hours === 1) return '1 hour ago';
  if (hours < 24) return `${hours} hours ago`;
  if (days === 1) return 'yesterday';
  if (days < 7) return `${days} days ago`;

  return formatDate(dateObj, 'short');
};

/**
 * Capitalize first letter
 * @param {string} str - String to capitalize
 * @returns {string} - Capitalized string
 */
export const capitalize = (str) => {
  if (!str) return '';
  return str.charAt(0).toUpperCase() + str.slice(1);
};

/**
 * Convert snake_case to Title Case
 * @param {string} str - String in snake_case
 * @returns {string} - String in Title Case
 */
export const snakeCaseToTitleCase = (str) => {
  if (!str) return '';
  return str
    .split('_')
    .map(word => capitalize(word))
    .join(' ');
};

export default {
  formatCurrency,
  formatDate,
  formatPercentage,
  formatPhoneNumber,
  formatPAN,
  formatAadhaar,
  formatAccountNumber,
  formatLoanAmount,
  formatDuration,
  formatEMI,
  formatTenure,
  formatInterestRate,
  formatCreditScore,
  formatDTI,
  formatFileSize,
  formatRelativeTime,
  capitalize,
  snakeCaseToTitleCase,
};
