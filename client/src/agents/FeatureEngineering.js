/**
 * FeatureEngineeringAgent
 * Transforms raw data into ML-ready features
 */
class FeatureEngineeringAgent {
  constructor() {
    this.name = 'FeatureEngineeringAgent';
    this.version = '1.0';
  }

  /**
   * Calculate Debt-to-Income ratio
   */
  calculateDTI(monthlyIncome, totalEmi) {
    if (monthlyIncome === 0) return 100;
    return (totalEmi / monthlyIncome) * 100;
  }

  /**
   * Calculate income stability score
   */
  calculateIncomeStability(aaData) {
    if (!aaData) return 50;
    
    const { avgMonthlyIncome, accountAge, bankTransactionFrequency } = aaData;
    
    let stability = 50;
    
    if (accountAge >= 36) stability += 20;
    else if (accountAge >= 24) stability += 15;
    else if (accountAge >= 12) stability += 10;
    
    if (bankTransactionFrequency >= 40) stability += 15;
    else if (bankTransactionFrequency >= 20) stability += 10;
    
    return Math.min(100, stability);
  }

  /**
   * Calculate repayment capacity
   */
  calculateRepaymentCapacity(monthlyIncome, monthlyExpense, existingEmi, requestedEmi) {
    const availableIncome = monthlyIncome - monthlyExpense - existingEmi;
    
    if (availableIncome <= 0) return 0;
    
    const repaymentCapacity = (availableIncome - requestedEmi) / monthlyIncome;
    
    return Math.max(0, Math.min(100, repaymentCapacity * 100));
  }

  /**
   * Calculate savings rate
   */
  calculateSavingsRate(monthlyIncome, monthlyExpense, existingEmi) {
    const availableForSavings = monthlyIncome - monthlyExpense - existingEmi;
    
    if (monthlyIncome === 0) return 0;
    
    return (availableForSavings / monthlyIncome) * 100;
  }

  /**
   * Calculate credit utilization score
   */
  calculateCreditUtilizationScore(cibilScore, creditHistoryMonths) {
    let score = 50;
    
    if (cibilScore === null) {
      if (creditHistoryMonths >= 12) score += 15;
      else if (creditHistoryMonths >= 6) score += 10;
    } else {
      if (cibilScore >= 750) score += 25;
      else if (cibilScore >= 700) score += 20;
      else if (cibilScore >= 650) score += 15;
      else if (cibilScore >= 600) score += 10;
    }
    
    return Math.min(100, score);
  }

  /**
   * Calculate employment stability score
   */
  calculateEmploymentStability(occupation, employmentType, locationTier) {
    let score = 50;
    
    // Employment type boost
    if (employmentType === 'Salaried') score += 20;
    else if (employmentType === 'Self-Employed') score += 10;
    
    // Occupation boost
    const stableOccupations = ['Farmer', 'Salaried Employee', 'Business Owner'];
    if (stableOccupations.includes(occupation)) score += 15;
    
    // Location tier boost (rural can be stable for farmers)
    if (locationTier === '1' || locationTier === '2') score += 5;
    
    return Math.min(100, score);
  }

  /**
   * Digital footprint contribution
   */
  calculateDigitalScore(aaData, alternativeData) {
    if (!aaData) return alternativeData.digitalScore || 50;
    
    let score = 0;
    
    // UPI usage
    if (aaData.upiTransactionCount > 50) score += 25;
    else if (aaData.upiTransactionCount > 20) score += 15;
    else if (aaData.upiTransactionCount > 0) score += 10;
    
    // Transaction frequency
    if (aaData.bankTransactionFrequency > 40) score += 20;
    else if (aaData.bankTransactionFrequency > 20) score += 15;
    else if (aaData.bankTransactionFrequency > 0) score += 10;
    
    // Bounce events penalty
    if (aaData.bounceEvents === 0) score += 15;
    else if (aaData.bounceEvents === 1) score += 5;
    
    return Math.min(100, score);
  }

  /**
   * Trust indicators score
   */
  calculateTrustScore(alternativeData) {
    let score = 50;
    
    if (alternativeData.fpoMembership) score += 10;
    if (alternativeData.businessRegistration) score += 15;
    if (alternativeData.utilityPaymentConsistency) score += 5;
    if (alternativeData.rentPaymentConsistency) score += 8;
    
    return Math.min(100, score);
  }

  /**
   * Engineer all features
   */
  engineerFeatures(aggregatedData) {
    const personal = aggregatedData.personal;
    const financial = aggregatedData.financial;
    const credit = aggregatedData.credit;
    const alternative = aggregatedData.alternative;
    const aaData = aggregatedData.accountAggregator;

    const requestedEmi = this.calculateEMI(
      financial.loanAmountRequested,
      12.5,
      financial.loanTenure
    );

    return {
      // Demographic features
      ageGroup: this.categorizeAge(personal.age),
      educationLevel: personal.education,
      occupationStability: this.calculateEmploymentStability(
        personal.occupation,
        personal.employmentType,
        personal.locationTier
      ),

      // Financial features
      dtiRatio: this.calculateDTI(financial.monthlyIncome, financial.existingEmi + requestedEmi),
      savingsRate: this.calculateSavingsRate(financial.monthlyIncome, financial.monthlyExpenses, financial.existingEmi),
      repaymentCapacity: this.calculateRepaymentCapacity(
        financial.monthlyIncome,
        financial.monthlyExpenses,
        financial.existingEmi,
        requestedEmi
      ),
      savingsToLoanRatio: financial.savings > 0 ? (financial.savings / financial.loanAmountRequested) * 100 : 0,

      // Credit features
      creditScore: credit.cibilScore || 0,
      creditHistory: credit.creditHistoryMonths,
      creditUtilizationScore: this.calculateCreditUtilizationScore(credit.cibilScore, credit.creditHistoryMonths),

      // Alternative features
      digitalScore: this.calculateDigitalScore(aaData, alternative),
      psychometricScore: alternative.psychometricScore,
      trustScore: this.calculateTrustScore(alternative),

      // AA features
      incomeStability: this.calculateIncomeStability(aaData),
      transactionFrequency: aaData?.bankTransactionFrequency || 0,
      bounceEvents: aaData?.bounceEvents || 0,

      // Loan features
      loanAmount: financial.loanAmountRequested,
      loanTenure: financial.loanTenure,
      requestedEmi: requestedEmi,
      loanToIncomeRatio: (financial.loanAmountRequested / (financial.monthlyIncome * 12)) * 100,
    };
  }

  /**
   * Calculate EMI
   */
  calculateEMI(principal, ratePerAnnum, tenureMonths) {
    if (principal === 0 || tenureMonths === 0) return 0;
    
    const monthlyRate = ratePerAnnum / 12 / 100;
    const numerator = principal * monthlyRate * Math.pow(1 + monthlyRate, tenureMonths);
    const denominator = Math.pow(1 + monthlyRate, tenureMonths) - 1;
    
    return Math.round(numerator / denominator);
  }

  /**
   * Categorize age
   */
  categorizeAge(age) {
    if (age < 25) return '18-24';
    if (age < 35) return '25-34';
    if (age < 45) return '35-44';
    if (age < 55) return '45-54';
    return '55+';
  }
}

export default FeatureEngineeringAgent;
