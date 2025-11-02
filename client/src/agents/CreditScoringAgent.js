/**
 * CreditScoringAgent
 * Calculates credit scores using ML model
 */
class CreditScoringAgent {
  constructor() {
    this.name = 'CreditScoringAgent';
    this.version = '1.0';
    this.maxScore = 1000;
  }

  /**
   * Simple ML model for credit scoring
   */
  calculateCreditScore(features) {
    let score = 500; // Base score

    // Credit history component (max 150 points)
    if (features.creditScore > 0) {
      score += Math.min(150, (features.creditScore / 750) * 150);
    } else {
      score += this.scoreWithoutCIBIL(features);
    }

    // Income stability component (max 150 points)
    score += (features.incomeStability / 100) * 150;

    // Repayment capacity component (max 150 points)
    score += (features.repaymentCapacity / 100) * 150;

    // Savings component (max 100 points)
    const savingsScore = Math.min(100, features.savingsRate * 2);
    score += savingsScore;

    // DTI component (max 100 points)
    const dtiScore = Math.max(0, 100 - features.dtiRatio);
    score += Math.min(100, dtiScore);

    // Digital footprint component (max 100 points)
    score += (features.digitalScore / 100) * 100;

    // Trust score component (max 50 points)
    score += (features.trustScore / 100) * 50;

    // Psychometric component (max 50 points)
    score += (features.psychometricScore / 100) * 50;

    // Transaction frequency bonus
    if (features.transactionFrequency > 40) score += 20;
    else if (features.transactionFrequency > 20) score += 10;

    // Bounce penalty
    score -= features.bounceEvents * 30;

    // Loan-to-income ratio adjustment
    if (features.loanToIncomeRatio > 300) score -= 50;
    else if (features.loanToIncomeRatio > 200) score -= 25;

    return Math.max(300, Math.min(this.maxScore, Math.round(score)));
  }

  /**
   * Alternative scoring when CIBIL not available
   */
  scoreWithoutCIBIL(features) {
    let score = 80; // Base for no CIBIL

    if (features.creditHistory >= 24) score += 40;
    else if (features.creditHistory >= 12) score += 25;
    else if (features.creditHistory >= 6) score += 15;

    // Use digital and trust signals
    score += (features.digitalScore / 100) * 30;
    score += (features.trustScore / 100) * 20;

    return Math.min(150, score);
  }

  /**
   * Score categorization
   */
  categorizeScore(score) {
    if (score >= 800) return { category: 'Excellent', risk: 'Very Low' };
    if (score >= 700) return { category: 'Very Good', risk: 'Low' };
    if (score >= 600) return { category: 'Good', risk: 'Medium' };
    if (score >= 500) return { category: 'Fair', risk: 'Medium-High' };
    if (score >= 400) return { category: 'Poor', risk: 'High' };
    return { category: 'Very Poor', risk: 'Very High' };
  }

  /**
   * Calculate score confidence
   */
  calculateConfidence(features) {
    let confidence = 0;

    if (features.creditScore > 0) confidence += 30;
    if (features.creditHistory >= 12) confidence += 20;
    if (features.digitalScore > 60) confidence += 20;
    if (features.incomeStability > 70) confidence += 15;
    if (features.transactionFrequency > 30) confidence += 15;

    return Math.min(100, confidence);
  }

  /**
   * Generate detailed scoring report
   */
  generateScoringReport(features) {
    const score = this.calculateCreditScore(features);
    const categorization = this.categorizeScore(score);
    const confidence = this.calculateConfidence(features);

    return {
      creditScore: score,
      category: categorization.category,
      riskLevel: categorization.risk,
      confidence: confidence,
      components: {
        creditHistory: Math.min(150, (features.creditScore || 0) / 5),
        incomeStability: (features.incomeStability / 100) * 150,
        repaymentCapacity: (features.repaymentCapacity / 100) * 150,
        savingsRate: Math.min(100, features.savingsRate * 2),
        dtiScore: Math.max(0, 100 - features.dtiRatio),
        digitalFootprint: (features.digitalScore / 100) * 100,
        trustIndicators: (features.trustScore / 100) * 50,
      },
      recommendations: this.generateRecommendations(score, features),
    };
  }

  /**
   * Generate actionable recommendations
   */
  generateRecommendations(score, features) {
    const recommendations = [];

    if (features.dtiRatio > 50) {
      recommendations.push('Reduce existing EMI obligations to improve eligibility');
    }

    if (features.savingsRate < 10) {
      recommendations.push('Increase monthly savings to build financial cushion');
    }

    if (features.digitalScore < 50) {
      recommendations.push('Use digital payment methods more frequently');
    }

    if (features.creditScore === 0) {
      recommendations.push('Consider building credit history with a small loan');
    }

    if (features.repaymentCapacity < 20) {
      recommendations.push('Request a smaller loan amount or longer tenure');
    }

    if (score < 600) {
      recommendations.push('Reapply after 3-6 months with improved financial profile');
    }

    return recommendations.length > 0 ? recommendations : ['Your profile looks strong!'];
  }
}

export default CreditScoringAgent;
