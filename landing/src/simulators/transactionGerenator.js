/**
 * transactionGenerator.js
 * Generates realistic mock transactions and financial data
 */

class TransactionGenerator {
  constructor() {
    this.name = 'Transaction Generator';
  }

  /**
   * Generate realistic salary transaction
   */
  generateSalaryTransaction(baseAmount, variation = 0.05) {
    const amount = baseAmount * (1 + (Math.random() - 0.5) * variation);

    return {
      type: 'credit',
      category: 'salary',
      description: 'Salary Deposit',
      amount: Math.round(amount),
      reference: `SAL_${Date.now()}`,
    };
  }

  /**
   * Generate business income transaction
   */
  generateBusinessIncome(baseAmount, variation = 0.2) {
    const amount = baseAmount * (1 + (Math.random() - 0.5) * variation);

    return {
      type: 'credit',
      category: 'business_income',
      description: 'Business Income',
      amount: Math.round(amount),
      reference: `BIZ_${Date.now()}`,
    };
  }

  /**
   * Generate expense transaction
   */
  generateExpense(category, minAmount, maxAmount) {
    const amount = Math.floor(Math.random() * (maxAmount - minAmount + 1)) + minAmount;

    const descriptions = {
      utilities: 'Electricity Bill',
      groceries: 'Grocery Store',
      entertainment: 'Movie Theatre',
      transport: 'Taxi/Auto Rickshaw',
      dining: 'Restaurant',
      shopping: 'Retail Store',
    };

    return {
      type: 'debit',
      category,
      description: descriptions[category] || category,
      amount,
      reference: `EXP_${Date.now()}`,
    };
  }

  /**
   * Generate EMI payment
   */
  generateEMIPayment(emiAmount, loanName = 'Loan') {
    return {
      type: 'debit',
      category: 'emi',
      description: `EMI - ${loanName}`,
      amount: emiAmount,
      reference: `EMI_${Date.now()}`,
    };
  }

  /**
   * Generate investment transaction
   */
  generateInvestment(amount, investmentType = 'MF') {
    const investments = {
      MF: 'Mutual Fund',
      SIP: 'SIP Investment',
      FD: 'Fixed Deposit',
      STOCKS: 'Stock Purchase',
    };

    return {
      type: 'debit',
      category: 'investment',
      description: `Investment - ${investments[investmentType] || investmentType}`,
      amount,
      reference: `INV_${Date.now()}`,
    };
  }

  /**
   * Generate realistic monthly transactions
   */
  generateMonthlyTransactions(config = {}) {
    const {
      monthlyIncome = 50000,
      incomeVariation = 0.1,
      expenseToIncomeRatio = 0.6,
      businessIncome = false,
      hasEMI = false,
      emiAmount = 5000,
    } = config;

    const transactions = [];

    // Salary (usually on specific date)
    transactions.push({
      ...this.generateSalaryTransaction(monthlyIncome, incomeVariation),
      date: `15th`,
    });

    // Business income (if applicable)
    if (businessIncome) {
      transactions.push({
        ...this.generateBusinessIncome(monthlyIncome * 0.5),
        date: `20th`,
      });
    }

    // Fixed expenses
    const totalExpenses = monthlyIncome * expenseToIncomeRatio;

    // Utilities
    transactions.push({
      ...this.generateExpense('utilities', 2000, 3500),
      date: `5th`,
    });

    // Groceries
    transactions.push({
      ...this.generateExpense('groceries', 4000, 6000),
      date: `Random`,
    });

    // Transport
    transactions.push({
      ...this.generateExpense('transport', 1000, 2000),
      date: `Random`,
    });

    // Dining
    transactions.push({
      ...this.generateExpense('dining', 2000, 4000),
      date: `Random`,
    });

    // Shopping
    transactions.push({
      ...this.generateExpense('shopping', 2000, 5000),
      date: `Random`,
    });

    // EMI (if applicable)
    if (hasEMI) {
      transactions.push({
        ...this.generateEMIPayment(emiAmount),
        date: `10th`,
      });
    }

    return transactions;
  }

  /**
   * Generate financial profile
   */
  generateFinancialProfile(borrowerProfile = {}) {
    const {
      monthlyIncome = 50000,
      numberOfMonths = 12,
      hasEMI = false,
      emiAmount = 5000,
      creditHistoryMonths = 24,
    } = borrowerProfile;

    const months = [];

    for (let i = 0; i < numberOfMonths; i++) {
      const monthTransactions = this.generateMonthlyTransactions({
        monthlyIncome,
        hasEMI,
        emiAmount,
      });

      const monthData = {
        month: i + 1,
        income: monthTransactions
          .filter(t => t.type === 'credit')
          .reduce((sum, t) => sum + t.amount, 0),
        expenses: monthTransactions
          .filter(t => t.type === 'debit')
          .reduce((sum, t) => sum + t.amount, 0),
        transactions: monthTransactions,
      };

      monthData.netFlow = monthData.income - monthData.expenses;
      months.push(monthData);
    }

    // Calculate profile metrics
    const avgMonthlyIncome = months.reduce((sum, m) => sum + m.income, 0) / numberOfMonths;
    const avgMonthlyExpense = months.reduce((sum, m) => sum + m.expenses, 0) / numberOfMonths;
    const savingsRate = ((avgMonthlyIncome - avgMonthlyExpense) / avgMonthlyIncome) * 100;

    return {
      profile: {
        monthlyIncome: Math.round(avgMonthlyIncome),
        monthlyExpense: Math.round(avgMonthlyExpense),
        savingsRate: Math.round(savingsRate),
        creditHistoryMonths,
        totalTransactions: months.reduce((sum, m) => sum + m.transactions.length, 0),
      },
      monthlyData: months,
      financialHealth: {
        score: savingsRate > 30 ? 'Excellent' : savingsRate > 15 ? 'Good' : 'Fair',
        consistency: 'High',
      },
    };
  }

  /**
   * Generate risk events (defaults, bounces, etc.)
   */
  generateRiskEvents(baseCount = 0) {
    const events = [];

    if (baseCount > 0) {
      for (let i = 0; i < baseCount; i++) {
        events.push({
          type: Math.random() > 0.7 ? 'bounce' : 'default',
          date: new Date(Date.now() - Math.random() * 90 * 24 * 60 * 60 * 1000).toISOString(),
          amount: Math.floor(Math.random() * 10000 + 1000),
          reason: Math.random() > 0.5 ? 'Insufficient Balance' : 'Account Closed',
        });
      }
    }

    return events;
  }
}

export default TransactionGenerator;
