/**
 * mockLoans.js
 * Mock loan data for development and testing
 */

export const mockLoans = [
  {
    id: 'L001',
    borrowerId: 'B001',
    borrowerName: 'Ramesh Kumar',
    loanAmount: 50000,
    emi: 4500,
    rateOfInterest: 12.5,
    tenure: 12,
    startDate: '2025-06-15',
    endDate: '2026-06-15',
    paidEMIs: 6,
    totalEMIs: 12,
    nextDueDate: '2025-11-15',
    status: 'current',
    daysOverdue: 0,
    disbursedAmount: 50000,
    principalPaid: 24500,
    interestPaid: 3200,
    balanceAmount: 25500,
    riskLevel: 'low',
    loanPurpose: 'Business Expansion',
    segment: 'Farmers',
    state: 'Maharashtra',
    locationTier: '3',
    paymentMode: 'NEFT',
  },
  {
    id: 'L002',
    borrowerId: 'B002',
    borrowerName: 'Priya Sharma',
    loanAmount: 75000,
    emi: 6800,
    rateOfInterest: 13.5,
    tenure: 12,
    startDate: '2025-04-20',
    endDate: '2026-04-20',
    paidEMIs: 8,
    totalEMIs: 12,
    nextDueDate: '2025-11-10',
    status: 'overdue',
    daysOverdue: 12,
    disbursedAmount: 75000,
    principalPaid: 35000,
    interestPaid: 4200,
    balanceAmount: 40000,
    riskLevel: 'medium',
    loanPurpose: 'Working Capital',
    segment: 'Women Entrepreneurs',
    state: 'Karnataka',
    locationTier: '1',
    paymentMode: 'Standing Order',
  },
  {
    id: 'L003',
    borrowerId: 'B003',
    borrowerName: 'Arjun Patel',
    loanAmount: 100000,
    emi: 9200,
    rateOfInterest: 12.0,
    tenure: 18,
    startDate: '2025-03-10',
    endDate: '2026-09-10',
    paidEMIs: 3,
    totalEMIs: 18,
    nextDueDate: '2025-11-20',
    status: 'current',
    daysOverdue: 0,
    disbursedAmount: 100000,
    principalPaid: 24000,
    interestPaid: 4800,
    balanceAmount: 76000,
    riskLevel: 'low',
    loanPurpose: 'Agricultural Loan',
    segment: 'Farmers',
    state: 'Punjab',
    locationTier: '4',
    paymentMode: 'NEFT',
  },
  {
    id: 'L004',
    borrowerId: 'B004',
    borrowerName: 'Deepa Singh',
    loanAmount: 60000,
    emi: 5600,
    rateOfInterest: 14.0,
    tenure: 12,
    startDate: '2025-02-15',
    endDate: '2026-02-15',
    paidEMIs: 10,
    totalEMIs: 12,
    nextDueDate: '2025-11-05',
    status: 'default',
    daysOverdue: 45,
    disbursedAmount: 60000,
    principalPaid: 45000,
    interestPaid: 5400,
    balanceAmount: 15000,
    riskLevel: 'high',
    loanPurpose: 'Personal Use',
    segment: 'Small Business Owners',
    state: 'Tamil Nadu',
    locationTier: '2',
    paymentMode: 'Manual Transfer',
  },
  {
    id: 'L005',
    borrowerId: 'B005',
    borrowerName: 'Aisha Khan',
    loanAmount: 200000,
    emi: 18500,
    rateOfInterest: 11.5,
    tenure: 18,
    startDate: '2025-01-10',
    endDate: '2026-07-10',
    paidEMIs: 11,
    totalEMIs: 18,
    nextDueDate: '2025-12-10',
    status: 'current',
    daysOverdue: 0,
    disbursedAmount: 200000,
    principalPaid: 108000,
    interestPaid: 15200,
    balanceAmount: 92000,
    riskLevel: 'low',
    loanPurpose: 'Equipment Purchase',
    segment: 'Small Business Owners',
    state: 'Delhi',
    locationTier: '1',
    paymentMode: 'Standing Order',
  },
];

/**
 * Get all loans
 */
export const getAllLoans = () => mockLoans;

/**
 * Get loan by ID
 */
export const getLoanById = (id) => mockLoans.find(loan => loan.id === id);

/**
 * Get loans by borrower ID
 */
export const getLoansByBorrower = (borrowerId) =>
  mockLoans.filter(loan => loan.borrowerId === borrowerId);

/**
 * Get loans by status
 */
export const getLoansByStatus = (status) =>
  mockLoans.filter(loan => loan.status === status);

/**
 * Get loans by segment
 */
export const getLoansBySegment = (segment) =>
  mockLoans.filter(loan => loan.segment === segment);

/**
 * Get loans by state
 */
export const getLoansByState = (state) =>
  mockLoans.filter(loan => loan.state === state);

/**
 * Get overdue loans
 */
export const getOverdueLoans = () =>
  mockLoans.filter(loan => loan.daysOverdue > 0);

/**
 * Get high-risk loans
 */
export const getHighRiskLoans = () =>
  mockLoans.filter(loan => loan.riskLevel === 'high');

export default mockLoans;
