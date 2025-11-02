/**
 * mockBorrowers.js
 * Mock borrower data
 */

export const mockBorrowers = [
  {
    id: 'B001',
    name: 'Ramesh Kumar',
    age: 45,
    gender: 'Male',
    mobile: '9876543210',
    email: 'ramesh@example.com',
    state: 'Maharashtra',
    city: 'Pune',
    locationTier: '3',
    occupation: 'Farmer',
    employmentType: 'Self-Employed',
    education: 'High School',
    pan: 'ABCDE1234F',
    aadhaar: '123456789012',
    accountStatus: 'active',
    kycStatus: 'verified',
    kycMethod: 'video_kyc',
    createdAt: '2025-01-10',
    segment: 'Farmers',
    monthlyIncome: 45000,
    monthlyExpenses: 25000,
    savings: 150000,
    cibilScore: 680,
    creditHistoryMonths: 24,
    activeLoans: 1,
    defaultRate: 0,
    collectionRate: 100,
    digitalScore: 65,
    psychometricScore: 72,
    trustScore: 78,
  },
  {
    id: 'B002',
    name: 'Priya Sharma',
    age: 32,
    gender: 'Female',
    mobile: '9765432109',
    email: 'priya@example.com',
    state: 'Karnataka',
    city: 'Bangalore',
    locationTier: '1',
    occupation: 'Small Business Owner',
    employmentType: 'Self-Employed',
    education: 'Graduate',
    pan: 'XYXYZ5678Y',
    aadhaar: '987654321098',
    accountStatus: 'active',
    kycStatus: 'verified',
    kycMethod: 'biometric',
    createdAt: '2024-12-15',
    segment: 'Women Entrepreneurs',
    monthlyIncome: 80000,
    monthlyExpenses: 40000,
    savings: 300000,
    cibilScore: 720,
    creditHistoryMonths: 36,
    activeLoans: 1,
    defaultRate: 0,
    collectionRate: 98,
    digitalScore: 85,
    psychometricScore: 88,
    trustScore: 92,
  },
  {
    id: 'B003',
    name: 'Arjun Patel',
    age: 38,
    gender: 'Male',
    mobile: '8765432109',
    email: 'arjun@example.com',
    state: 'Punjab',
    city: 'Ludhiana',
    locationTier: '4',
    occupation: 'Farmer',
    employmentType: 'Self-Employed',
    education: 'Primary School',
    pan: 'PQRST9876P',
    aadhaar: '456789123456',
    accountStatus: 'active',
    kycStatus: 'verified',
    kycMethod: 'digilocker',
    createdAt: '2024-11-20',
    segment: 'Farmers',
    monthlyIncome: 55000,
    monthlyExpenses: 30000,
    savings: 200000,
    cibilScore: 690,
    creditHistoryMonths: 30,
    activeLoans: 1,
    defaultRate: 0,
    collectionRate: 100,
    digitalScore: 45,
    psychometricScore: 65,
    trustScore: 70,
  },
  {
    id: 'B004',
    name: 'Deepa Singh',
    age: 28,
    gender: 'Female',
    mobile: '7654321098',
    email: 'deepa@example.com',
    state: 'Tamil Nadu',
    city: 'Chennai',
    locationTier: '2',
    occupation: 'Trader',
    employmentType: 'Self-Employed',
    education: 'High School',
    pan: 'LMNOP2468L',
    aadhaar: '789123456789',
    accountStatus: 'active',
    kycStatus: 'verified',
    kycMethod: 'video_kyc',
    createdAt: '2024-10-05',
    segment: 'Small Business Owners',
    monthlyIncome: 50000,
    monthlyExpenses: 35000,
    savings: 80000,
    cibilScore: 580,
    creditHistoryMonths: 12,
    activeLoans: 1,
    defaultRate: 1,
    collectionRate: 95,
    digitalScore: 35,
    psychometricScore: 50,
    trustScore: 55,
  },
  {
    id: 'B005',
    name: 'Aisha Khan',
    age: 35,
    gender: 'Female',
    mobile: '6543210987',
    email: 'aisha@example.com',
    state: 'Delhi',
    city: 'New Delhi',
    locationTier: '1',
    occupation: 'Small Business Owner',
    employmentType: 'Business Owner',
    education: 'Post Graduate',
    pan: 'UVWXY3579U',
    aadhaar: '321654987321',
    accountStatus: 'active',
    kycStatus: 'verified',
    kycMethod: 'video_kyc',
    createdAt: '2024-09-12',
    segment: 'Small Business Owners',
    monthlyIncome: 150000,
    monthlyExpenses: 60000,
    savings: 500000,
    cibilScore: 750,
    creditHistoryMonths: 48,
    activeLoans: 1,
    defaultRate: 0,
    collectionRate: 100,
    digitalScore: 95,
    psychometricScore: 92,
    trustScore: 95,
  },
];

/**
 * Get all borrowers
 */
export const getAllBorrowers = () => mockBorrowers;

/**
 * Get borrower by ID
 */
export const getBorrowerById = (id) => mockBorrowers.find(b => b.id === id);

/**
 * Get borrowers by segment
 */
export const getBorrowersBySegment = (segment) =>
  mockBorrowers.filter(b => b.segment === segment);

/**
 * Get borrowers by state
 */
export const getBorrowersByState = (state) =>
  mockBorrowers.filter(b => b.state === state);

/**
 * Get borrowers by location tier
 */
export const getBorrowersByLocationTier = (tier) =>
  mockBorrowers.filter(b => b.locationTier === tier);

/**
 * Get high-risk borrowers
 */
export const getHighRiskBorrowers = () =>
  mockBorrowers.filter(b => (b.cibilScore || 0) < 600);

/**
 * Get borrowers without credit history
 */
export const getCIBILLessBorrowers = () =>
  mockBorrowers.filter(b => !b.cibilScore);

export default mockBorrowers;
