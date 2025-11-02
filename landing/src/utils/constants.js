/**
 * constants.js
 * Application-wide constants
 * Fixed for Vite (process.env not available in browser directly)
 */

// ==================== ENVIRONMENT ====================
export const APP_NAME = 'AI Digital Banking Platform';
export const APP_VERSION = '1.0.0';
// ✅ Fixed: Use import.meta.env instead of process.env for Vite
export const APP_ENVIRONMENT = import.meta.env.MODE || 'development';

// ==================== API ====================
// ✅ Fixed: Use import.meta.env.VITE_* for Vite environment variables
export const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';
export const API_TIMEOUT = 30000; // 30 seconds

// ==================== LENDING POLICIES ====================
export const LENDING_POLICIES = {
  minCreditScore: 400,
  maxDTI: 60,
  maxPD: 5.0,
  minRepaymentCapacity: 10,
  minAge: 18,
  maxAge: 75,
  minLoanAmount: 10000,
  maxLoanAmount: 5000000,
  minTenure: 6, // months
  maxTenure: 60, // months
  minIncome: 5000,
  baseInterestRate: 12.0,
};

// ==================== AGE GROUPS ====================
export const AGE_GROUPS = {
  '18-24': { min: 18, max: 24, label: '18-24 years' },
  '25-34': { min: 25, max: 34, label: '25-34 years' },
  '35-44': { min: 35, max: 44, label: '35-44 years' },
  '45-54': { min: 45, max: 54, label: '45-54 years' },
  '55+': { min: 55, max: 75, label: '55+ years' },
};

// ==================== DOCUMENT TYPES ====================
export const DOCUMENT_TYPES = {
  PAN: 'pan',
  AADHAAR: 'aadhaar',
  DRIVER_LICENSE: 'driver_license',
  PASSPORT: 'passport',
  VOTER_ID: 'voter_id',
};

// ==================== KYC METHODS ====================
export const KYC_METHODS = {
  VIDEO_KYC: 'video_kyc',
  BIOMETRIC: 'biometric_ekyc',
  DIGILOCKER: 'digilocker',
  CKYC: 'ckyc_registry',
};

// ==================== LOAN STATUSES ====================
export const LOAN_STATUSES = {
  INITIATED: 'initiated',
  FORM_FILLED: 'form_filled',
  KYC_VERIFIED: 'kyc_verified',
  DECISION_PENDING: 'decision_pending',
  APPROVED: 'approved',
  DECLINED: 'declined',
  MANUAL_REVIEW: 'manual_review',
  DISBURSED: 'disbursed',
  ACTIVE: 'active',
  CLOSED: 'closed',
  DEFAULTED: 'defaulted',
};

// ==================== ACCOUNT STATUSES ====================
export const ACCOUNT_STATUSES = {
  PENDING: 'pending',
  ACTIVE: 'active',
  SUSPENDED: 'suspended',
  CLOSED: 'closed',
  KYC_PENDING: 'kyc_pending',
};

// ==================== CREDIT DECISION ====================
export const CREDIT_DECISIONS = {
  APPROVED: 'approved',
  DECLINED: 'declined',
  MANUAL_REVIEW: 'manual_review',
};

// ==================== RISK LEVELS ====================
export const RISK_LEVELS = {
  VERY_LOW: 'Very Low',
  LOW: 'Low',
  MEDIUM: 'Medium',
  HIGH: 'High',
  VERY_HIGH: 'Very High',
};

// ==================== OCCUPATIONS ====================
export const OCCUPATIONS = [
  'Farmer',
  'Small Business Owner',
  'Trader',
  'Artisan',
  'Daily Wage Worker',
  'Salaried Employee',
  'Self-Employed Professional',
  'Shop Owner',
  'Healthcare Worker',
  'Education Professional',
  'Transportation Worker',
  'Other',
];

// ==================== EMPLOYMENT TYPES ====================
export const EMPLOYMENT_TYPES = [
  'Self-Employed',
  'Salaried',
  'Business Owner',
  'Daily Wage',
  'Farmer',
  'Unemployed',
  'Other',
];

// ==================== EDUCATION LEVELS ====================
export const EDUCATION_LEVELS = [
  'No Formal Education',
  'Primary School',
  'Middle School',
  'High School',
  'Intermediate',
  'Graduate',
  'Post Graduate',
  'Doctorate',
];

// ==================== STATES ====================
export const STATES = [
  'Andaman and Nicobar Islands',
  'Andhra Pradesh',
  'Arunachal Pradesh',
  'Assam',
  'Bihar',
  'Chandigarh',
  'Chhattisgarh',
  'Dadra and Nagar Haveli',
  'Daman and Diu',
  'Delhi',
  'Goa',
  'Gujarat',
  'Haryana',
  'Himachal Pradesh',
  'Jharkhand',
  'Karnataka',
  'Kerala',
  'Lakshadweep',
  'Madhya Pradesh',
  'Maharashtra',
  'Manipur',
  'Meghalaya',
  'Mizoram',
  'Nagaland',
  'Odisha',
  'Puducherry',
  'Punjab',
  'Rajasthan',
  'Sikkim',
  'Tamil Nadu',
  'Telangana',
  'Tripura',
  'Uttar Pradesh',
  'Uttarakhand',
  'West Bengal',
];

// ==================== LOCATION TIERS ====================
export const LOCATION_TIERS = {
  TIER_1: { value: '1', label: 'Tier 1 (Metro)', cities: ['Delhi', 'Mumbai', 'Bangalore', 'Hyderabad'] },
  TIER_2: { value: '2', label: 'Tier 2 City', cities: ['Pune', 'Ahmedabad', 'Surat', 'Chennai'] },
  TIER_3: { value: '3', label: 'Tier 3 City', cities: ['Other Cities'] },
  RURAL: { value: '4', label: 'Rural', cities: ['Villages'] },
};

// ==================== LOAN PURPOSES ====================
export const LOAN_PURPOSES = [
  'Business Expansion',
  'Working Capital',
  'Agriculture',
  'Equipment Purchase',
  'Education',
  'Medical/Healthcare',
  'Home Improvement',
  'Vehicle Purchase',
  'Debt Consolidation',
  'Personal Use',
  'Other',
];

// ==================== NOTIFICATIONS ====================
export const NOTIFICATION_TYPES = {
  SUCCESS: 'success',
  ERROR: 'error',
  WARNING: 'warning',
  INFO: 'info',
};

// ==================== VALIDATION RULES ====================
export const VALIDATION_RULES = {
  PAN: /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/,
  AADHAAR: /^\d{12}$/,
  MOBILE: /^[6-9]\d{9}$/,
  EMAIL: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  IFSC: /^[A-Z]{4}0[A-Z0-9]{6}$/,
  ACCOUNT_NUMBER: /^\d{9,18}$/,
};

// ==================== PAYMENT STATUSES ====================
export const PAYMENT_STATUSES = {
  PENDING: 'pending',
  COMPLETED: 'completed',
  FAILED: 'failed',
  BOUNCED: 'bounced',
  OVERDUE: 'overdue',
};

// ==================== BORROWER SEGMENTS ====================
export const BORROWER_SEGMENTS = [
  'Farmers',
  'Women Entrepreneurs',
  'Tier 3/4 Cities',
  'CIBIL-less Users',
  'Small Business Owners',
];

// ==================== COLORS ====================
export const COLORS = {
  SUCCESS: '#10b981',
  ERROR: '#ef4444',
  WARNING: '#f59e0b',
  INFO: '#3b82f6',
  SECONDARY: '#6b7280',
  LIGHT: '#f3f4f6',
  DARK: '#111827',
};

// ==================== STORAGE KEYS ====================
export const STORAGE_KEYS = {
  USER: 'app_user',
  BANK_ACCOUNT: 'app_bank_account',
  KYC_STATUS: 'app_kyc_status',
  LOAN_APPLICATION: 'app_loan_application',
  THEME: 'app_theme',
  LANGUAGE: 'app_language',
};

// ==================== PAGINATION ====================
export const PAGINATION = {
  DEFAULT_PAGE_SIZE: 10,
  PAGE_SIZE_OPTIONS: [10, 25, 50, 100],
};

// ==================== FEATURE FLAGS ====================
export const FEATURE_FLAGS = {
  ENABLE_VIDEO_KYC: true,
  ENABLE_BIOMETRIC_KYC: true,
  ENABLE_AA_INTEGRATION: true,
  ENABLE_ML_SCORING: true,
  ENABLE_MULTI_AGENT: true,
};

export default {
  APP_NAME,
  LENDING_POLICIES,
  LOAN_STATUSES,
  OCCUPATIONS,
  STATES,
  LOAN_PURPOSES,
  COLORS,
  STORAGE_KEYS,
};
