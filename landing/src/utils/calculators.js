/**
 * calculators.js
 * Financial calculation functions
 * Pure functions for EMI, DTI, credit scores, etc.
 */

/**
 * Calculate EMI (Equated Monthly Installment)
 * Formula: EMI = [P × R × (1 + R)^N] / [(1 + R)^N − 1]
 * Where: P = Principal, R = Monthly Interest Rate, N = Number of months
 * 
 * @param {number} principal - Loan principal amount
 * @param {number} annualRate - Annual interest rate (e.g., 12 for 12%)
 * @param {number} tenureMonths - Loan tenure in months
 * @returns {number} - Monthly EMI amount
 * 
 * @example
 * calculateEMI(100000, 12, 12) // 8884 (approximately)
 * calculateEMI(50000, 12.5, 12) // 4395 (approximately)
 */
export const calculateEMI = (principal, annualRate, tenureMonths) => {
  if (principal <= 0 || tenureMonths <= 0) {
    return 0;
  }

  // Convert annual rate to monthly rate
  const monthlyRate = annualRate / 12 / 100;

  // Handle 0% interest rate
  if (monthlyRate === 0) {
    return Math.round(principal / tenureMonths);
  }

  // EMI formula
  const numerator = principal * monthlyRate * Math.pow(1 + monthlyRate, tenureMonths);
  const denominator = Math.pow(1 + monthlyRate, tenureMonths) - 1;
  const emi = numerator / denominator;

  return Math.round(emi);
};

/**
 * Calculate total interest for a loan
 * @param {number} principal - Loan amount
 * @param {number} emi - Monthly EMI
 * @param {number} tenureMonths - Tenure in months
 * @returns {number} - Total interest paid
 * 
 * @example
 * calculateTotalInterest(100000, 8884, 12) // 6608
 */
export const calculateTotalInterest = (principal, emi, tenureMonths) => {
  const totalPaid = emi * tenureMonths;
  return Math.round(totalPaid - principal);
};

/**
 * Calculate total amount to be paid
 * @param {number} principal - Loan amount
 * @param {number} emi - Monthly EMI
 * @param {number} tenureMonths - Tenure in months
 * @returns {number} - Total amount to be paid
 */
export const calculateTotalAmount = (principal, emi, tenureMonths) => {
  return Math.round(emi * tenureMonths);
};

/**
 * Calculate Debt-to-Income (DTI) ratio
 * DTI = (Total Monthly Debt / Monthly Gross Income) × 100
 * 
 * @param {number} monthlyIncome - Monthly gross income
 * @param {number} totalMonthlyDebt - Total monthly debt obligations (EMIs, rent, etc.)
 * @param {number} newLoanEMI - New loan EMI (to be added)
 * @returns {number} - DTI ratio as percentage
 * 
 * @example
 * calculateDTI(50000, 5000, 4500) // 19 (19% DTI)
 * calculateDTI(50000, 5000) // 10 (10% DTI without new loan)
 */
export const calculateDTI = (monthlyIncome, totalMonthlyDebt, newLoanEMI = 0) => {
  if (monthlyIncome <= 0) {
    return 0;
  }

  const totalDebt = totalMonthlyDebt + newLoanEMI;
  const dti = (totalDebt / monthlyIncome) * 100;

  return Math.round(dti * 10) / 10; // Round to 1 decimal place
};

/**
 * Calculate maximum affordable loan amount based on DTI
 * @param {number} monthlyIncome - Monthly gross income
 * @param {number} existingEMI - Existing monthly EMI obligations
 * @param {number} maxDTI - Maximum allowable DTI ratio (default: 50%)
 * @param {number} annualRate - Annual interest rate
 * @param {number} tenureMonths - Loan tenure in months
 * @returns {number} - Maximum loan amount
 * 
 * @example
 * calculateMaxLoanByDTI(100000, 10000, 50, 12, 12)
 */
export const calculateMaxLoanByDTI = (
  monthlyIncome,
  existingEMI,
  maxDTI = 50,
  annualRate,
  tenureMonths
) => {
  // Available debt capacity
  const maxDebt = (monthlyIncome * maxDTI) / 100;
  const availableCapacity = maxDebt - existingEMI;

  if (availableCapacity <= 0) {
    return 0;
  }

  // Reverse calculate principal from EMI
  const monthlyRate = annualRate / 12 / 100;

  if (monthlyRate === 0) {
    return availableCapacity * tenureMonths;
  }

  const principal =
    (availableCapacity * (Math.pow(1 + monthlyRate, tenureMonths) - 1)) /
    (monthlyRate * Math.pow(1 + monthlyRate, tenureMonths));

  return Math.round(principal);
};

/**
 * Calculate maximum affordable loan by income multiple
 * @param {number} monthlyIncome - Monthly income
 * @param {number} multiple - Income multiple (e.g., 6 for 6x monthly income)
 * @returns {number} - Maximum loan amount
 * 
 * @example
 * calculateMaxLoanByIncome(50000, 6) // 300000
 */
export const calculateMaxLoanByIncome = (monthlyIncome, multiple = 6) => {
  return Math.round(monthlyIncome * multiple);
};

/**
 * Calculate loan repayment schedule
 * @param {number} principal - Loan amount
 * @param {number} annualRate - Annual interest rate
 * @param {number} tenureMonths - Tenure in months
 * @returns {array} - Array of payment schedules
 */
export const calculateRepaymentSchedule = (principal, annualRate, tenureMonths) => {
  const emi = calculateEMI(principal, annualRate, tenureMonths);
  const monthlyRate = annualRate / 12 / 100;
  const schedule = [];

  let remainingPrincipal = principal;

  for (let month = 1; month <= tenureMonths; month++) {
    const interestPayment = Math.round(remainingPrincipal * monthlyRate);
    const principalPayment = emi - interestPayment;
    remainingPrincipal -= principalPayment;

    schedule.push({
      month,
      emi,
      principal: Math.max(0, principalPayment),
      interest: interestPayment,
      balance: Math.max(0, remainingPrincipal),
    });
  }

  return schedule;
};

/**
 * Calculate interest rate from EMI (reverse calculation)
 * Uses Newton-Raphson method for approximation
 * 
 * @param {number} principal - Loan amount
 * @param {number} emi - Monthly EMI
 * @param {number} tenureMonths - Tenure in months
 * @returns {number} - Annual interest rate (approximate)
 */
export const calculateRateFromEMI = (principal, emi, tenureMonths) => {
  let rate = 0.1; // Initial guess: 0.1% per month = 1.2% per year
  
  for (let i = 0; i < 100; i++) {
    // Newton-Raphson iteration
    const power = Math.pow(1 + rate, tenureMonths);
    const numerator = principal * rate * power - emi * (power - 1);
    const denominator =
      principal * power * (1 + tenureMonths) -
      emi * (power - 1) * (tenureMonths + 1);

    const nextRate = rate - numerator / denominator;

    if (Math.abs(nextRate - rate) < 0.000001) {
      return nextRate * 12 * 100; // Convert to annual percentage
    }

    rate = nextRate;
  }

  return rate * 12 * 100;
};

/**
 * Calculate remaining loan balance
 * @param {number} principal - Original loan amount
 * @param {number} annualRate - Annual interest rate
 * @param {number} tenureMonths - Original tenure
 * @param {number} paymentsMade - Number of payments made
 * @returns {number} - Remaining balance
 */
export const calculateRemainingBalance = (
  principal,
  annualRate,
  tenureMonths,
  paymentsMade
) => {
  const monthlyRate = annualRate / 12 / 100;
  const emi = calculateEMI(principal, annualRate, tenureMonths);

  const remainingMonths = tenureMonths - paymentsMade;
  
  if (monthlyRate === 0) {
    return Math.max(0, principal - emi * paymentsMade);
  }

  // Formula: Balance = EMI × [(1 + r)^n - 1] / [r × (1 + r)^n]
  const numerator = Math.pow(1 + monthlyRate, remainingMonths) - 1;
  const denominator =
    monthlyRate * Math.pow(1 + monthlyRate, remainingMonths);
  
  return Math.max(0, Math.round(emi * (numerator / denominator)));
};

/**
 * Calculate prepayment savings
 * @param {number} principal - Original loan amount
 * @param {number} annualRate - Annual interest rate
 * @param {number} tenureMonths - Original tenure
 * @param {number} paymentsMade - Number of payments made
 * @param {number} prepaymentAmount - Amount to prepay
 * @returns {object} - { savingsInInterest, newTenure }
 */
export const calculatePrepaymentSavings = (
  principal,
  annualRate,
  tenureMonths,
  paymentsMade,
  prepaymentAmount
) => {
  const balance = calculateRemainingBalance(
    principal,
    annualRate,
    tenureMonths,
    paymentsMade
  );

  const newBalance = Math.max(0, balance - prepaymentAmount);
  const remainingMonths = tenureMonths - paymentsMade;

  // Calculate interest savings
  const totalInterestRemaining = calculateTotalInterest(
    balance,
    calculateEMI(balance, annualRate, remainingMonths),
    remainingMonths
  );

  const newTotalInterest = calculateTotalInterest(
    newBalance,
    calculateEMI(newBalance, annualRate, remainingMonths),
    remainingMonths
  );

  return {
    savingsInInterest: Math.round(totalInterestRemaining - newTotalInterest),
    newTenure: remainingMonths,
    newBalance,
  };
};

export default {
  calculateEMI,
  calculateTotalInterest,
  calculateTotalAmount,
  calculateDTI,
  calculateMaxLoanByDTI,
  calculateMaxLoanByIncome,
  calculateRepaymentSchedule,
  calculateRateFromEMI,
  calculateRemainingBalance,
  calculatePrepaymentSavings,
};
