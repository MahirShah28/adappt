/**
 * RiskAssessmentAgent
 * Assesses credit risk and probability of default
 */
class RiskAssessmentAgent {
  constructor() {
    this.name = 'RiskAssessmentAgent';
    this.version = '1.0';
  }

  /**
   * Calculate probability of default (PD)
   */
  calculateProbabilityOfDefault(creditScore, dtiRatio, features) {
    let pd = 0.5; // Base default probability in percentage

    // Credit score impact (inverse relationship)
    if (creditScore > 0) {
      pd -= (creditScore / 1000) * 0.4;
    }

    // DTI impact
    if (dtiRatio > 60) pd += 0.3;
    else if (dtiRatio > 40) pd += 0.15;
    else if (dtiRatio < 25) pd -= 0.1;

    // Repayment capacity impact
    pd -= (features.repaymentCapacity / 100) * 0.2;

    // Income stability impact
    pd -= (features.incomeStability / 100) * 0.15;

    // Bounce events penalty
    pd += features.bounceEvents * 0.2;

    // Transaction frequency
    pd -= (features.transactionFrequency / 50) * 0.1;

    return Math.max(0.1, Math.min(10, pd));
  }

  /**
   * Calculate loss given default (LGD)
   */
  calculateLossGivenDefault(loanAmount, collateral = 0) {
    const collateralCoverage = collateral / loanAmount;
    
    if (collateralCoverage >= 1.0) return 0.1; // Full coverage
    if (collateralCoverage >= 0.75) return 0.2;
    if (collateralCoverage >= 0.5) return 0.35;
    if (collateralCoverage >= 0.25) return 0.5;
    
    return 0.65; // No collateral
  }

  /**
   * Calculate exposure at default (EAD)
   */
  calculateExposureAtDefault(loanAmount, tenor, disbursementSchedule = null) {
    // For simplicity, assume full amount at risk for entire tenure
    return loanAmount;
  }

  /**
   * Calculate Expected Loss (EL)
   */
  calculateExpectedLoss(pd, lgd, ead) {
    return (pd / 100) * lgd * ead;
  }

  /**
   * Assess segment risk
   */
  assessSegmentRisk(segment, loanAmount) {
    const segmentRiskFactors = {
      'Farmers': { basePD: 2.5, volatility: 1.5 },
      'Women Entrepreneurs': { basePD: 2.0, volatility: 1.2 },
      'Tier 3/4 Cities': { basePD: 2.8, volatility: 1.6 },
      'CIBIL-less Users': { basePD: 3.5, volatility: 2.0 },
      'Small Business Owners': { basePD: 2.2, volatility: 1.3 },
    };

    const factors = segmentRiskFactors[segment] || { basePD: 2.5, volatility: 1.5 };

    // Size impact - larger loans have different risk profiles
    let loanSizeAdjustment = 0;
    if (loanAmount > 300000) loanSizeAdjustment = 0.2;
    else if (loanAmount > 150000) loanSizeAdjustment = 0.1;
    else if (loanAmount < 50000) loanSizeAdjustment = -0.1;

    return {
      segment,
      basePD: factors.basePD,
      volatility: factors.volatility,
      adjustedPD: factors.basePD + loanSizeAdjustment,
    };
  }

  /**
   * Categorize risk level
   */
  categorizeRiskLevel(pd, features) {
    if (pd < 1.0 && features.dtiRatio < 30) return 'Very Low';
    if (pd < 2.0 && features.dtiRatio < 40) return 'Low';
    if (pd < 3.5 && features.dtiRatio < 50) return 'Medium';
    if (pd < 5.0 && features.dtiRatio < 60) return 'High';
    return 'Very High';
  }

  /**
   * Generate risk assessment report
   */
  generateRiskReport(creditScore, features, segment, loanAmount) {
    const pd = this.calculateProbabilityOfDefault(creditScore, features.dtiRatio, features);
    const lgd = this.calculateLossGivenDefault(loanAmount);
    const ead = this.calculateExposureAtDefault(loanAmount, features.loanTenure);
    const el = this.calculateExpectedLoss(pd, lgd, ead);
    const riskLevel = this.categorizeRiskLevel(pd, features);
    const segmentRisk = this.assessSegmentRisk(segment, loanAmount);

    return {
      probabilityOfDefault: pd.toFixed(2),
      lossGivenDefault: (lgd * 100).toFixed(1),
      exposureAtDefault: Math.round(ead),
      expectedLoss: Math.round(el),
      riskLevel,
      riskScore: this.calculateRiskScore(pd, features),
      segmentRisk,
      riskFactors: this.identifyRiskFactors(features, creditScore),
      mitigationStrategies: this.suggestMitigation(riskLevel, features),
    };
  }

  /**
   * Calculate risk score (0-100)
   */
  calculateRiskScore(pd, features) {
    let score = 50;

    // PD component
    score -= Math.min(40, pd * 4);

    // DTI component
    score -= Math.max(0, Math.min(20, (features.dtiRatio - 30) / 2));

    // Repayment capacity
    score += (features.repaymentCapacity / 100) * 15;

    // Income stability
    score += (features.incomeStability / 100) * 10;

    return Math.max(0, Math.min(100, Math.round(score)));
  }

  /**
   * Identify key risk factors
   */
  identifyRiskFactors(features, creditScore) {
    const factors = [];

    if (creditScore === 0) factors.push({ factor: 'No Credit History', severity: 'medium' });
    if (features.dtiRatio > 50) factors.push({ factor: 'High Debt Burden', severity: 'high' });
    if (features.repaymentCapacity < 20) factors.push({ factor: 'Low Repayment Capacity', severity: 'high' });
    if (features.incomeStability < 40) factors.push({ factor: 'Low Income Stability', severity: 'medium' });
    if (features.bounceEvents > 0) factors.push({ factor: 'Payment Bounces', severity: 'high' });
    if (features.digitalScore < 30) factors.push({ factor: 'Low Digital Footprint', severity: 'low' });
    if (features.savingsRate < 5) factors.push({ factor: 'Very Low Savings', severity: 'medium' });

    return factors;
  }

  /**
   * Suggest risk mitigation strategies
   */
  suggestMitigation(riskLevel, features) {
    const strategies = [];

    if (riskLevel === 'High' || riskLevel === 'Very High') {
      strategies.push('Require higher down payment');
      strategies.push('Implement weekly collection schedule');
      strategies.push('Assign dedicated relationship manager');
    }

    if (features.dtiRatio > 50) {
      strategies.push('Reduce loan tenure or amount');
      strategies.push('Consider EMI holiday for first 3 months');
    }

    if (features.digitalScore < 40) {
      strategies.push('Encourage digital payment adoption');
      strategies.push('Provide financial literacy training');
    }

    if (features.incomeStability < 50) {
      strategies.push('Request co-guarantor');
      strategies.push('Monthly income verification');
    }

    return strategies;
  }
}

export default RiskAssessmentAgent;
