/**
 * DataCollectionAgent
 * Collects and organizes borrower data from multiple sources
 */
class DataCollectionAgent {
  constructor() {
    this.name = 'DataCollectionAgent';
    this.version = '1.0';
  }

  /**
   * Collects personal information from application form
   */
  collectPersonalData(formData) {
    return {
      borrowerId: formData.borrowerId || `BID_${Date.now()}`,
      name: formData.name || 'N/A',
      age: parseInt(formData.age) || 0,
      gender: formData.gender || 'Not Specified',
      mobile: formData.mobile || 'N/A',
      state: formData.state || 'Unknown',
      locationTier: formData.locationTier || '3',
      occupation: formData.occupation || 'Unknown',
      employmentType: formData.employmentType || 'Self-Employed',
      education: formData.education || 'High School',
      collectionTimestamp: new Date().toISOString(),
    };
  }

  /**
   * Collects financial information
   */
  collectFinancialData(formData) {
    return {
      monthlyIncome: parseFloat(formData.monthlyIncome) || 0,
      monthlyExpenses: parseFloat(formData.monthlyExpenses) || 0,
      savings: parseFloat(formData.savings) || 0,
      existingLoans: parseInt(formData.existingLoans) || 0,
      existingEmi: parseFloat(formData.existingEmi) || 0,
      loanAmountRequested: parseFloat(formData.loanAmount) || 0,
      loanTenure: parseInt(formData.tenure) || 12,
      loanPurpose: formData.loanPurpose || 'Personal',
    };
  }

  /**
   * Collects credit history data
   */
  collectCreditData(formData) {
    return {
      cibilScore: formData.cibilScore ? parseInt(formData.cibilScore) : null,
      creditHistoryMonths: parseInt(formData.creditHistory) || 0,
      existingCreditAccounts: 0,
      totalCreditLimit: 0,
      creditUtilization: 0,
    };
  }

  /**
   * Collects alternative data signals
   */
  collectAlternativeData(formData) {
    return {
      digitalScore: parseInt(formData.digitalScore) || 0,
      psychometricScore: parseInt(formData.psychometricScore) || 0,
      fpoMembership: formData.fpoMember || false,
      businessRegistration: formData.businessRegistered || false,
      utilityPaymentConsistency: formData.utilityBillsPaid || false,
      rentPaymentConsistency: formData.rentPaidRegularly || false,
    };
  }

  /**
   * Simulates Account Aggregator data fetch
   */
  async fetchAccountAggregatorData(mobileNumber, isNewlyBanked = false) {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 2000));

    if (isNewlyBanked) {
      return {
        annualIncomeVerified: 0,
        avgMonthlyIncomeVerified: 0,
        avgMonthlyExpenseVerified: 0,
        bankTransactionFrequency: 0,
        utilityPaymentConsistency: 0,
        upiTransactionCount: 0,
        bounceEvents: 0,
        accountAge: 0,
      };
    }

    // Generate realistic transaction data
    const baseIncome = Math.random() * 300000 + 200000;
    const baseExpense = Math.random() * 150000 + 80000;

    return {
      annualIncomeVerified: Math.round(baseIncome),
      avgMonthlyIncomeVerified: Math.round(baseIncome / 12),
      avgMonthlyExpenseVerified: Math.round(baseExpense / 12),
      bankTransactionFrequency: Math.floor(Math.random() * 60 + 30),
      utilityPaymentConsistency: Math.random() * 20 + 80,
      upiTransactionCount: Math.floor(Math.random() * 100 + 50),
      bounceEvents: Math.floor(Math.random() * 3),
      accountAge: Math.floor(Math.random() * 60 + 12),
    };
  }

  /**
   * Validates collected data
   */
  validateData(data) {
    const errors = [];

    if (data.age < 18 || data.age > 75) {
      errors.push('Age must be between 18-75 years');
    }

    if (!data.mobile || data.mobile.length !== 10) {
      errors.push('Valid 10-digit mobile number required');
    }

    if (data.monthlyIncome <= 0) {
      errors.push('Monthly income must be positive');
    }

    if (data.loanAmountRequested <= 0 || data.loanAmountRequested > 5000000) {
      errors.push('Loan amount must be between ₹1,000 and ₹50,00,000');
    }

    if (data.loanTenure < 6 || data.loanTenure > 60) {
      errors.push('Tenure must be between 6-60 months');
    }

    return {
      isValid: errors.length === 0,
      errors,
    };
  }

  /**
   * Aggregates all collected data
   */
  aggregateData(formData, aaData = null) {
    return {
      personal: this.collectPersonalData(formData),
      financial: this.collectFinancialData(formData),
      credit: this.collectCreditData(formData),
      alternative: this.collectAlternativeData(formData),
      accountAggregator: aaData,
      collectionTime: new Date().toISOString(),
    };
  }
}

export default DataCollectionAgent;
