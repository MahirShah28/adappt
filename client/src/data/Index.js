/**
 * index.js
 * Export all mock data
 */

export * from './mockLoans';
export * from './mockBorrowers';
export * from './mockSegments';
export * from './mockTransactions';

// Combined exports for convenience
export {
  getAllLoans,
  getLoanById,
  getLoansByBorrower,
  getLoansByStatus,
  getLoansBySegment,
  getLoansByState,
  getOverdueLoans,
  getHighRiskLoans,
} from './mockLoans';

export {
  getAllBorrowers,
  getBorrowerById,
  getBorrowersBySegment,
  getBorrowersByState,
  getBorrowersByLocationTier,
  getHighRiskBorrowers,
  getCIBILLessBorrowers,
} from './mockBorrowers';

export {
  getAllSegments,
  getSegmentByName,
  getSegmentStats,
  getFastGrowingSegments,
  getHighRiskSegments,
} from './mockSegments';

export {
  getAllTransactions,
  getTransactionsByBorrower,
  getTransactionsByLoan,
  getEMIPayments,
  getFailedTransactions,
  getTransactionsByType,
  getTransactionsByStatus,
  getRecentTransactions,
  getTransactionSummary,
} from './mockTransactions';
