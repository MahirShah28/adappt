/**
 * aaSimulator.js
 * Simulates Account Aggregator data fetch
 * Mimics RBI-regulated Account Aggregator system
 */

class AccountAggregatorSimulator {
  constructor() {
    this.name = 'Account Aggregator Simulator';
  }

  /**
   * Generate realistic bank transactions
   */
  generateTransactions(monthCount = 6) {
    const transactions = [];
    const categories = ['salary', 'business_income', 'investment', 'withdrawal', 'utilities', 'shopping', 'transfer'];

    for (let month = 0; month < monthCount; month++) {
      const monthStart = new Date();
      monthStart.setMonth(monthStart.getMonth() - month);

      // Generate 10-20 transactions per month
      const txnCount = Math.floor(Math.random() * 10) + 10;

      for (let i = 0; i < txnCount; i++) {
        const day = Math.floor(Math.random() * 28) + 1;
        const date = new Date(monthStart.getFullYear(), monthStart.getMonth(), day);

        const category = categories[Math.floor(Math.random() * categories.length)];
        let amount = 0;

        if (['salary', 'business_income', 'investment'].includes(category)) {
          amount = Math.floor(Math.random() * 100000 + 20000); // 20K-120K
        } else {
          amount = Math.floor(Math.random() * 50000 + 500); // 500-50K
        }

        transactions.push({
          transactionId: `TXN_${Date.now()}_${i}`,
          date: date.toISOString(),
          description: `${category.replace('_', ' ')} - Transaction`,
          category,
          amount,
          type: category.includes('income') || category === 'investment' ? 'credit' : 'debit',
          balance: Math.random() * 500000 + 50000,
          reference: `REF${Math.random().toString(36).substring(7)}`,
        });
      }
    }

    return transactions.sort((a, b) => new Date(b.date) - new Date(a.date));
  }

  /**
   * Fetch financial data via AA
   */
  async fetchFinancialData(aaHandle, borrowerData) {
    console.log('📊 Fetching data via Account Aggregator...');

    const transactions = this.generateTransactions(6);

    // Calculate financial metrics
    const creditTransactions = transactions.filter(t => t.type === 'credit');
    const debitTransactions = transactions.filter(t => t.type === 'debit');

    const avgMonthlyIncome = creditTransactions.reduce((sum, t) => sum + t.amount, 0) / 6;
    const avgMonthlyExpense = debitTransactions.reduce((sum, t) => sum + t.amount, 0) / 6;

    await new Promise(resolve => setTimeout(resolve, 2500));

    return {
      aaHandle,
      accountsLinked: 3,
      accountTypes: ['Savings', 'Current', 'Investment'],
      dataFetchStatus: 'success',
      financialSummary: {
        transactionCount: transactions.length,
        avgMonthlyIncome: Math.round(avgMonthlyIncome),
        avgMonthlyExpense: Math.round(avgMonthlyExpense),
        maxMonthlyTransaction: Math.max(...transactions.map(t => t.amount)),
        minMonthlyTransaction: Math.min(...transactions.map(t => t.amount)),
      },
      transactionHistory: transactions,
      accounts: [
        {
          accountNumber: '****' + Math.random().toString(36).substring(7),
          accountType: 'Savings',
          balance: Math.random() * 500000 + 50000,
          lastUpdated: new Date().toISOString(),
        },
        {
          accountNumber: '****' + Math.random().toString(36).substring(7),
          accountType: 'Current',
          balance: Math.random() * 1000000 + 100000,
          lastUpdated: new Date().toISOString(),
        },
      ],
      fetchedAt: new Date().toISOString(),
      dataValidity: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString(),
    };
  }

  /**
   * Analyze transaction patterns
   */
  analyzePatterns(transactions) {
    console.log('🔬 Analyzing transaction patterns...');

    const incomePattern = {
      frequency: 'Monthly',
      consistency: 95,
      averageAmount: 0,
      variance: 5,
    };

    const expensePattern = {
      frequency: 'Variable',
      consistency: 70,
      averageAmount: 0,
      variance: 30,
    };

    // Calculate pattern metrics
    const incomeTransactions = transactions.filter(t => t.type === 'credit');
    const expenseTransactions = transactions.filter(t => t.type === 'debit');

    incomePattern.averageAmount = Math.round(
      incomeTransactions.reduce((sum, t) => sum + t.amount, 0) / Math.max(1, incomeTransactions.length)
    );

    expensePattern.averageAmount = Math.round(
      expenseTransactions.reduce((sum, t) => sum + t.amount, 0) / Math.max(1, expenseTransactions.length)
    );

    return {
      incomePattern,
      expensePattern,
      anomalies: [],
      riskFactors: [],
      patterns: 'Healthy financial behavior',
    };
  }

  /**
   * Complete AA flow
   */
  async completeAAFlow(borrowerData) {
    try {
      console.log('🚀 Starting Account Aggregator Flow...');

      const aaHandle = `AA_${borrowerData.mobile}_${Date.now()}`;

      // Fetch financial data
      const financialData = await this.fetchFinancialData(aaHandle, borrowerData);

      // Analyze patterns
      const patterns = this.analyzePatterns(financialData.transactionHistory);

      return {
        success: true,
        aaHandle,
        financialData,
        patterns,
        consentStatus: 'active',
        completedAt: new Date().toISOString(),
      };
    } catch (error) {
      console.error('AA Error:', error);
      return {
        success: false,
        error: error.message,
      };
    }
  }
}

export default AccountAggregatorSimulator;
