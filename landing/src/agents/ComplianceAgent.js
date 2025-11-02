/**
 * ComplianceAgent
 * Ensures RBI and regulatory compliance
 */
class ComplianceAgent {
  constructor() {
    this.name = 'ComplianceAgent';
    this.version = '1.0';
  }

  /**
   * Check RBI lending guidelines
   */
  checkRBIGuidelines(features, decision) {
    const violations = [];

    // Check age
    if (features.ageGroup === '18-24' && features.creditScore === 0) {
      violations.push({
        guideline: 'RBI Age Guidelines',
        issue: 'Young first-time borrowers require additional verification',
        action: 'Enhanced KYC required',
      });
    }

    // Check usury laws
    if (features.dtiRatio > 60) {
      violations.push({
        guideline: 'Debt Burden Limit',
        issue: 'DTI ratio exceeds 60% - potential predatory lending risk',
        action: 'Reduce loan amount or increase tenor',
      });
    }

    // Check income documentation
    if (features.creditScore === 0 && features.incomeStability < 40) {
      violations.push({
        guideline: 'Income Documentation',
        issue: 'Income not adequately verified for first-time borrower',
        action: 'Obtain salary slips or income tax returns',
      });
    }

    return violations;
  }

  /**
   * Check customer protection regulations
   */
  checkCustomerProtection(loanAmount, features) {
    const protections = [];

    // Transparency disclosure
    protections.push({
      requirement: 'Loan Agreement Transparency',
      action: 'Provide detailed loan agreement with all terms',
    });

    // Fair pricing
    protections.push({
      requirement: 'Fair Interest Rate',
      action: 'Interest rate calculated based on risk profile',
    });

    // Privacy compliance
    protections.push({
      requirement: 'Data Privacy',
      action: 'Comply with RBI data protection guidelines',
    });

    // Grievance redressal
    protections.push({
      requirement: 'Dispute Resolution',
      action: 'Provide dispute resolution mechanism within 30 days',
    });

    return protections;
  }

  /**
   * Generate compliance report
   */
  generateComplianceReport(features, decision, loanDetails) {
    const rbiViolations = this.checkRBIGuidelines(features, decision);
    const protections = this.checkCustomerProtection(loanDetails.amount, features);

    return {
      isCompliant: rbiViolations.length === 0,
      rbiViolations,
      customerProtections: protections,
      disclosures: this.generateDisclosures(loanDetails),
      timestamp: new Date().toISOString(),
    };
  }

  /**
   * Generate required disclosures
   */
  generateDisclosures(loanDetails) {
    return [
      {
        disclosure: 'All-in-cost (AIC)',
        value: 'Provided in loan agreement',
      },
      {
        disclosure: 'Processing fees',
        value: '2% of loan amount',
      },
      {
        disclosure: 'Insurance (if any)',
        value: 'Optional - Customer choice',
      },
      {
        disclosure: 'Prepayment policy',
        value: 'No prepayment penalty',
      },
      {
        disclosure: 'Late payment charges',
        value: '2% per month on overdue amount',
      },
    ];
  }
}

export default ComplianceAgent;
