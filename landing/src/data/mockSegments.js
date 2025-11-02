/**
 * mockSegments.js
 * Mock borrower segment data
 */

export const mockSegments = [
  {
    id: 'SEG001',
    segment: 'Farmers',
    emoji: '🌾',
    borrowers: 3240,
    activeLoans: 3105,
    portfolioSize: 8.5,
    avgLoanSize: 2.74,
    defaultRate: 2.1,
    collectionRate: 97.9,
    approvalRate: 72.3,
    avgCreditScore: 655,
    trend: 'up',
    monthlyGrowth: 18.5,
    riskLevel: 'Low',
    topProducts: ['Agriculture Loan', 'Seasonal Credit', 'Equipment Finance'],
    characteristics: [
      'Rural focus',
      'Income dependent on harvest',
      'Seasonal income patterns',
      'Low digital adoption',
    ],
  },
  {
    id: 'SEG002',
    segment: 'Women Entrepreneurs',
    emoji: '👩‍💼',
    borrowers: 2156,
    activeLoans: 2045,
    portfolioSize: 6.2,
    avgLoanSize: 3.03,
    defaultRate: 1.8,
    collectionRate: 98.2,
    approvalRate: 75.1,
    avgCreditScore: 672,
    trend: 'up',
    monthlyGrowth: 22.3,
    riskLevel: 'Low',
    topProducts: ['Business Loan', 'Working Capital', 'Asset Finance'],
    characteristics: [
      'High repayment discipline',
      'Good growth trajectory',
      'Business-focused',
      'Medium digital adoption',
    ],
  },
  {
    id: 'SEG003',
    segment: 'Tier 3/4 Cities',
    emoji: '🏘️',
    borrowers: 5432,
    activeLoans: 5168,
    portfolioSize: 7.8,
    avgLoanSize: 1.51,
    defaultRate: 2.5,
    collectionRate: 97.4,
    approvalRate: 65.2,
    avgCreditScore: 635,
    trend: 'up',
    monthlyGrowth: 15.8,
    riskLevel: 'Medium',
    topProducts: ['Personal Loan', 'Small Business Loan', 'Consumer Durable'],
    characteristics: [
      'Tier 3 and rural focus',
      'Price-sensitive',
      'Growing digital adoption',
      'Diversified occupations',
    ],
  },
  {
    id: 'SEG004',
    segment: 'CIBIL-less Users',
    emoji: '👤',
    borrowers: 1715,
    activeLoans: 1598,
    portfolioSize: 2.0,
    avgLoanSize: 1.25,
    defaultRate: 3.2,
    collectionRate: 96.8,
    approvalRate: 58.5,
    avgCreditScore: 0,
    trend: 'up',
    monthlyGrowth: 25.6,
    riskLevel: 'High',
    topProducts: ['First Loan', 'Credit Building', 'Micro Loan'],
    characteristics: [
      'No credit history',
      'First-time borrowers',
      'Alternative data usage',
      'High potential',
    ],
  },
  {
    id: 'SEG005',
    segment: 'Small Business Owners',
    emoji: '🏪',
    borrowers: 1850,
    activeLoans: 1702,
    portfolioSize: 9.3,
    avgLoanSize: 5.47,
    defaultRate: 2.8,
    collectionRate: 97.1,
    approvalRate: 68.9,
    avgCreditScore: 668,
    trend: 'up',
    monthlyGrowth: 19.2,
    riskLevel: 'Medium',
    topProducts: ['Business Loan', 'Equipment Finance', 'Overdraft Facility'],
    characteristics: [
      'MSMEs',
      'Registered businesses',
      'Regular income',
      'Growth-oriented',
    ],
  },
];

/**
 * Get all segments
 */
export const getAllSegments = () => mockSegments;

/**
 * Get segment by name
 */
export const getSegmentByName = (name) =>
  mockSegments.find(s => s.segment === name);

/**
 * Get segment statistics
 */
export const getSegmentStats = () => ({
  totalBorrowers: mockSegments.reduce((sum, s) => sum + s.borrowers, 0),
  totalActiveLoans: mockSegments.reduce((sum, s) => sum + s.activeLoans, 0),
  totalPortfolio: mockSegments.reduce((sum, s) => sum + s.portfolioSize, 0),
  avgDefaultRate: (mockSegments.reduce((sum, s) => sum + s.defaultRate, 0) / mockSegments.length).toFixed(2),
  avgCollectionRate: (mockSegments.reduce((sum, s) => sum + s.collectionRate, 0) / mockSegments.length).toFixed(2),
});

/**
 * Get fast-growing segments
 */
export const getFastGrowingSegments = () =>
  mockSegments.filter(s => s.monthlyGrowth > 20).sort((a, b) => b.monthlyGrowth - a.monthlyGrowth);

/**
 * Get high-risk segments
 */
export const getHighRiskSegments = () =>
  mockSegments.filter(s => s.riskLevel === 'High');

export default mockSegments;
