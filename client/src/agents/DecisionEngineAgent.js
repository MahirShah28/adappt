/**
 * DecisionEngineAgent
 * Makes final lending decision
 */
class DecisionEngineAgent {
  constructor() {
    this.name = 'DecisionEngineAgent';
    this.version = '1.0';
  }

  /**
   * Make lending decision
   */
  makeDecision(creditScore, riskReport, features, policies) {
    const decision = {
      recommendation: 'pending',
      reasons: [],
      conditions: [],
    };

    // Rule 1: Minimum credit score
    if (creditScore < policies.minCreditScore) {
      decision.recommendation = 'declined';
      decision.reasons.push(`Credit score ${creditScore} below minimum ${policies.minCreditScore}`);
      return decision;
    }

    // Rule 2: Maximum DTI
    if (features.dtiRatio > policies.maxDTI) {
      decision.recommendation = 'declined';
      decision.reasons.push(`DTI ratio ${features.dtiRatio.toFixed(1)}% exceeds maximum ${policies.maxDTI}%`);
      return decision;
    }

    // Rule 3: Maximum PD
    const pd = parseFloat(riskReport.probabilityOfDefault);
    if (pd > policies.maxPD) {
      decision.recommendation = 'declined';
      decision.reasons.push(`Default probability ${pd.toFixed(2)}% exceeds threshold ${policies.maxPD}%`);
      return decision;
    }

    // Rule 4: Positive repayment capacity
    if (features.repaymentCapacity < policies.minRepaymentCapacity) {
      decision.recommendation = 'declined';
      decision.reasons.push(`Insufficient repayment capacity`);
      return decision;
    }

    // Rule 5: Income verification
    if (creditScore < 600 && features.incomeStability < 50) {
      decision.recommendation = 'manual_review';
      decision.reasons.push('Low credit score and income stability - requires manual review');
      decision.conditions.push('Income verification documents required');
      return decision;
    }

    // Rule 6: New borrower without credit history
    if (creditScore === 0 && features.creditHistory === 0) {
      if (features.digitalScore < 40 && features.trustScore < 50) {
        decision.recommendation = 'manual_review';
        decision.reasons.push('New borrower without credit history - requires assessment');
        decision.conditions.push('Video KYC mandatory');
        decision.conditions.push('First loan amount capped at ₹50,000');
      } else {
        decision.recommendation = 'approved';
        decision.reasons.push('Alternative signals strong - first-time borrower eligible');
        decision.conditions.push('First loan amount capped at ₹50,000');
      }
      return decision;
    }

    // Default: Approve
    decision.recommendation = 'approved';
    decision.reasons.push('All eligibility criteria met');

    // Add conditions based on risk level
    if (riskReport.riskLevel === 'High') {
      decision.conditions.push('Weekly collection schedule');
      decision.conditions.push('Higher interest rate (+1%)');
    } else if (riskReport.riskLevel === 'Medium') {
      decision.conditions.push('Standard collection schedule');
    }

    if (features.loanToIncomeRatio > 200) {
      decision.conditions.push('Income verification required');
    }

    return decision;
  }

  /**
   * Determine interest rate
   */
  determineInterestRate(creditScore, riskLevel, baseRate = 12.0) {
    let rate = baseRate;

    // Credit score adjustment
    if (creditScore >= 800) rate -= 2.0;
    else if (creditScore >= 700) rate -= 1.0;
    else if (creditScore >= 600) rate -= 0.5;
    else if (creditScore < 500) rate += 2.0;

    // Risk level adjustment
    if (riskLevel === 'Very Low') rate -= 0.5;
    else if (riskLevel === 'Low') rate += 0;
    else if (riskLevel === 'Medium') rate += 0.5;
    else if (riskLevel === 'High') rate += 1.5;
    else if (riskLevel === 'Very High') rate += 3.0;

    return Math.max(8.0, Math.min(20.0, rate));
  }

  /**
   * Determine loan amount
   */
  determineLoanAmount(requestedAmount, features, riskLevel, maxLoanAmount = 500000) {
    let approvedAmount = requestedAmount;

    // Risk level constraints
    if (riskLevel === 'Very High') {
      approvedAmount = Math.min(approvedAmount, 50000);
    } else if (riskLevel === 'High') {
      approvedAmount = Math.min(approvedAmount, 100000);
    }

    // DTI constraints
    if (features.dtiRatio > 50) {
      approvedAmount = Math.min(approvedAmount, features.monthlyIncome * 12 / 2);
    }

    // Repayment capacity constraints
    const maxAffordable = (features.monthlyIncome * features.repaymentCapacity / 100) * 3;
    approvedAmount = Math.min(approvedAmount, maxAffordable);

    // Max loan cap
    approvedAmount = Math.min(approvedAmount, maxLoanAmount);

    return Math.max(10000, Math.round(approvedAmount));
  }

  /**
   * Generate decision document
   */
  generateDecisionDocument(decision, creditScore, riskReport, features, loanRequest) {
    const approvedAmount = this.determineLoanAmount(
      loanRequest.amount,
      features,
      riskReport.riskLevel
    );
    const interestRate = this.determineInterestRate(creditScore, riskReport.riskLevel);

    return {
      decision: decision.recommendation,
      reasons: decision.reasons,
      conditions: decision.conditions,
      approvedDetails: decision.recommendation === 'approved' ? {
        loanAmount: approvedAmount,
        interestRate: interestRate.toFixed(2),
        tenor: loanRequest.tenure,
        emi: this.calculateEMI(approvedAmount, interestRate, loanRequest.tenure),
      } : null,
      creditScore,
      riskLevel: riskReport.riskLevel,
      timestamp: new Date().toISOString(),
    };
  }

  /**
   * Calculate EMI
   */
  calculateEMI(principal, rate, months) {
    const monthlyRate = rate / 12 / 100;
    const numerator = principal * monthlyRate * Math.pow(1 + monthlyRate, months);
    const denominator = Math.pow(1 + monthlyRate, months) - 1;
    return Math.round(numerator / denominator);
  }
}

export default DecisionEngineAgent;
