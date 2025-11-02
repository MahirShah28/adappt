/**
 * mockTransactions.js
 * Mock transaction data
 */

export const mockTransactions = [
  {
    id: 'TXN001',
    borrowerId: 'B001',
    loanId: 'L001',
    type: 'EMI Payment',
    amount: 4500,
    date: '2025-10-15',
    status: 'completed',
    method: 'NEFT',
    reference: 'REF123456789',
    description: 'EMI Payment - Loan L001',
  },
  {
    id: 'TXN002',
    borrowerId: 'B001',
    type: 'Salary Deposit',
    amount: 45000,
    date: '2025-10-01',
    status: 'completed',
    method: 'Bank Transfer',
    reference: 'SAL20251001',
    description: 'Monthly Salary',
  },
  {
    id: 'TXN003',
    borrowerId: 'B002',
    loanId: 'L002',
    type: 'EMI Payment',
    amount: 6800,
    date: '2025-10-10',
    status: 'bounced',
    method: 'ECS',
    reference: 'ECS201025',
    description: 'EMI Payment Failed - Insufficient Balance',
  },
  {
    id: 'TXN004',
    borrowerId: 'B002',
    type: 'Business Income',
    amount: 65000,
    date: '2025-10-20',
    status: 'completed',
    method: 'Bank Transfer',
    reference: 'BIZ20251020',
    description: 'Business Income Deposit',
  },
  {
    id: 'TXN005',
    borrowerId: 'B003',
    type: 'Utility Payment',
    amount: 2500,
    date: '2025-10-05',
    status: 'completed',
    method: 'UPI',
    reference: 'UPI121003',
    description: 'Electricity Bill Payment',
  },
  {
    id: 'TXN006',
    borrowerId: 'B003',
    loanId: 'L003',
    type: 'EMI Payment',
    amount: 9200,
    date: '2025-10-10',
    status: 'completed',
    method: 'Standing Order',
    reference: 'SO20251010',
    description: 'EMI Payment - Loan L003',
  },
  {
    id: 'TXN007',
    borrowerId: 'B004',
    type: 'Grocery Purchase',
    amount: 5000,
    date: '2025-10-12',
    status: 'completed',
    method: 'Debit Card',
    reference: 'DC1012G',
    description: 'Grocery Store Purchase',
  },
  {
    id: 'TXN008',
    borrowerId: 'B004',
    loanId: 'L004',
    type: 'EMI Payment',
    amount: 5600,
    date: '2025-10-05',
    status: 'overdue',
    method: 'NEFT',
    reference: 'REF654321',
    description: 'EMI Payment - Overdue',
  },
  {
    id: 'TXN009',
    borrowerId: 'B005',
    loanId: 'L005',
    type: 'EMI Payment',
    amount: 18500,
    date: '2025-10-10',
    status: 'completed',
    method: 'Standing Order',
    reference: 'SO20251010',
    description: 'EMI Payment - Loan L005',
  },
  {
    id: 'TXN010',
    borrowerId: 'B005',
    type: 'Business Income',
    amount: 150000,
    date: '2025-10-01',
    status: 'completed',
    method: 'Bank Transfer',
    reference: 'BIZ20251001',
    description: 'Business Income - Sales',
  },
];

/**
 * Get all transactions
 */
export const getAllTransactions = () => mockTransactions;

/**
 * Get transactions by borrower
 */
export const getTransactionsByBorrower = (borrowerId) =>
  mockTransactions.filter(t => t.borrowerId === borrowerId);

/**
 * Get transactions by loan
 */
export const getTransactionsByLoan = (loanId) =>
  mockTransactions.filter(t => t.loanId === loanId);

/**
 * Get EMI payments
 */
export const getEMIPayments = () =>
  mockTransactions.filter(t => t.type === 'EMI Payment');

/**
 * Get failed/bounced transactions
 */
export const getFailedTransactions = () =>
  mockTransactions.filter(t => ['bounced', 'failed', 'overdue'].includes(t.status));

/**
 * Get transactions by type
 */
export const getTransactionsByType = (type) =>
  mockTransactions.filter(t => t.type === type);

/**
 * Get transactions by status
 */
export const getTransactionsByStatus = (status) =>
  mockTransactions.filter(t => t.status === status);

/**
 * Get recent transactions
 */
export const getRecentTransactions = (days = 30) => {
  const cutoffDate = new Date();
  cutoffDate.setDate(cutoffDate.getDate() - days);

  return mockTransactions.filter(
    t => new Date(t.date) >= cutoffDate
  );
};

/**
 * Calculate transaction summary
 */
export const getTransactionSummary = (borrowerId) => {
  const transactions = getTransactionsByBorrower(borrowerId);
  
  return {
    totalTransactions: transactions.length,
    completedCount: transactions.filter(t => t.status === 'completed').length,
    failedCount: transactions.filter(t => t.status === 'bounced' || t.status === 'failed').length,
    overdueCount: transactions.filter(t => t.status === 'overdue').length,
    totalAmount: transactions.reduce((sum, t) => sum + t.amount, 0),
    avgTransactionAmount: Math.round(
      transactions.reduce((sum, t) => sum + t.amount, 0) / transactions.length
    ),
  };
};

export default mockTransactions;
