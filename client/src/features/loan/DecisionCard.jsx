import React, { useContext, useMemo, useCallback, useState } from 'react';
import { BankingContext } from '../../context/Index'; // ✅ Added
import { StatusBox, Badge, Button, Card, Alert } from '../../components/common/Index'; // ✅ Updated
import { CheckCircle, XCircle, AlertCircle, Download, Share2, Mail, FileText } from 'lucide-react'; // ✅ Added

/**
 * DecisionCard Component
 * Display loan approval/decline decision with detailed information
 * 
 * @param {object} decision - Decision data
 * @param {function} onClose - Close callback
 * @param {function} onAccept - Accept loan callback
 * @param {function} onReapply - Reapply callback
 * @param {boolean} showDetails - Show detailed breakdown
 */
const DecisionCard = ({ 
  decision, 
  onClose,
  onAccept = null, // ✅ Added
  onReapply = null, // ✅ Added
  showDetails = true, // ✅ Added
}) => {
  // ✅ Get context
  const banking = useContext(BankingContext);

  // ✅ State management
  const [isDownloading, setIsDownloading] = useState(false); // ✅ Added
  const [downloadFormat, setDownloadFormat] = useState('txt'); // ✅ Added
  const [copied, setCopied] = useState(false); // ✅ Added

  // ✅ Get decision configuration
  const getDecisionConfig = useCallback(() => {
    switch (decision.outcome) {
      case 'approved':
        return {
          icon: CheckCircle,
          iconColor: 'text-green-600',
          title: '🎉 Congratulations! Your Loan is Approved',
          type: 'success',
          bgColor: 'bg-green-50',
          borderColor: 'border-green-500',
          emoji: '✓',
        };
      case 'declined':
        return {
          icon: XCircle,
          iconColor: 'text-red-600',
          title: '❌ Loan Application Declined',
          type: 'error',
          bgColor: 'bg-red-50',
          borderColor: 'border-red-500',
          emoji: '✗',
        };
      case 'review':
        return {
          icon: AlertCircle,
          iconColor: 'text-yellow-600',
          title: '⚠️ Manual Review Required',
          type: 'warning',
          bgColor: 'bg-yellow-50',
          borderColor: 'border-yellow-500',
          emoji: '!',
        };
      default:
        return {
          icon: AlertCircle,
          iconColor: 'text-gray-600',
          title: 'Application Under Review',
          type: 'info',
          bgColor: 'bg-gray-50',
          borderColor: 'border-gray-500',
          emoji: '?',
        };
    }
  }, [decision.outcome]);

  const config = getDecisionConfig();
  const Icon = config.icon;

  // ✅ Calculate EMI
  const calculateEMI = useCallback((principal, rate, months) => {
    const monthlyRate = rate / 12 / 100;
    const numerator = principal * monthlyRate * Math.pow(1 + monthlyRate, months);
    const denominator = Math.pow(1 + monthlyRate, months) - 1;
    return Math.round(numerator / denominator);
  }, []);

  // ✅ Memoized EMI
  const monthlyEMI = useMemo(() => {
    if (decision.outcome === 'approved' && decision.loanAmount && decision.interestRate && decision.tenure) {
      return calculateEMI(decision.loanAmount, decision.interestRate, decision.tenure);
    }
    return 0;
  }, [decision, calculateEMI]);

  // ✅ Calculate total interest
  const totalInterest = useMemo(() => {
    if (decision.outcome === 'approved') {
      return Math.round((monthlyEMI * decision.tenure) - decision.loanAmount);
    }
    return 0;
  }, [decision, monthlyEMI]);

  // ✅ Generate decision report
  const generateDecisionReport = useCallback((format = 'txt') => {
    let content = '';

    if (format === 'txt') {
      content = `
LOAN DECISION REPORT
${'='.repeat(50)}

Decision Status: ${decision.outcome.toUpperCase()}
Decision Date: ${new Date().toLocaleString()}
Reference ID: ${decision.referenceId || 'N/A'}

CREDIT INFORMATION
${'='.repeat(50)}
Credit Score: ${decision.creditScore}
Risk Level: ${decision.riskLevel}
Risk Score: ${decision.riskScore || 'N/A'}

DECISION DETAILS
${'='.repeat(50)}
Reason: ${decision.reason}
${decision.remarks ? `Remarks: ${decision.remarks}\n` : ''}

${decision.outcome === 'approved' ? `
APPROVED OFFER
${'='.repeat(50)}
Loan Amount: ₹${decision.loanAmount?.toLocaleString()}
Interest Rate: ${decision.interestRate}% p.a.
Tenure: ${decision.tenure} months
Monthly EMI: ₹${monthlyEMI.toLocaleString()}
Total Interest: ₹${totalInterest.toLocaleString()}
Total Amount to be Paid: ₹${(monthlyEMI * decision.tenure).toLocaleString()}
` : ''}

Processing Fees: ${decision.processingFees || '0'}%
Documentation: ${decision.documentation ? 'Required' : 'Not Required'}

VALIDITY
${'='.repeat(50)}
Offer Valid Until: ${decision.validUntil || new Date(Date.now() + 7*24*60*60*1000).toLocaleDateString()}

Generated: ${new Date().toLocaleString()}
      `.trim();
    } else if (format === 'json') {
      content = JSON.stringify({
        decision,
        monthlyEMI,
        totalInterest,
        generatedAt: new Date().toISOString(),
      }, null, 2);
    }

    return content;
  }, [decision, monthlyEMI, totalInterest]);

  // ✅ Download decision
  const downloadDecision = useCallback(async () => {
    setIsDownloading(true);
    
    try {
      const content = generateDecisionReport(downloadFormat);
      const mimeType = downloadFormat === 'json' ? 'application/json' : 'text/plain';
      const extension = downloadFormat;

      const blob = new Blob([content], { type: mimeType });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `loan_decision_${decision.referenceId || Date.now()}.${extension}`;
      link.click();
      URL.revokeObjectURL(url);

      if (banking?.addNotification) {
        banking.addNotification({
          type: 'success',
          message: 'Decision report downloaded successfully!',
          duration: 2000,
        });
      }

      if (banking?.trackAction) {
        banking.trackAction('decision_downloaded', { format: downloadFormat });
      }
    } catch (err) {
      if (banking?.addNotification) {
        banking.addNotification({
          type: 'error',
          message: 'Failed to download report',
          duration: 2000,
        });
      }
    } finally {
      setIsDownloading(false);
    }
  }, [downloadFormat, decision, generateDecisionReport, banking]);

  // ✅ Share decision
  const shareDecision = useCallback(() => {
    const shareText = `My loan application has been ${decision.outcome}! Check your application status.`;
    
    if (navigator.share) {
      navigator.share({
        title: 'Loan Decision',
        text: shareText,
      });
    } else if (banking?.shareData) {
      banking.shareData({ title: 'Loan Decision', text: shareText });
    }

    if (banking?.addNotification) {
      banking.addNotification({
        type: 'success',
        message: 'Shared successfully!',
        duration: 2000,
      });
    }
  }, [decision, banking]);

  // ✅ Copy decision details
  const copyToClipboard = useCallback(() => {
    const content = generateDecisionReport('txt');
    navigator.clipboard.writeText(content);
    setCopied(true);
    
    if (banking?.addNotification) {
      banking.addNotification({
        type: 'success',
        message: 'Copied to clipboard!',
        duration: 2000,
      });
    }

    setTimeout(() => setCopied(false), 2000);
  }, [generateDecisionReport, banking]);

  // ✅ Handle accept loan
  const handleAccept = useCallback(() => {
    if (onAccept) {
      onAccept(decision);
    } else if (banking?.acceptLoanOffer) {
      banking.acceptLoanOffer(decision);
    }

    if (banking?.addNotification) {
      banking.addNotification({
        type: 'success',
        message: 'Loan offer accepted! Proceeding to documentation...',
        duration: 2000,
      });
    }
  }, [decision, onAccept, banking]);

  // ✅ Handle reapply
  const handleReapply = useCallback(() => {
    if (onReapply) {
      onReapply(decision);
    } else if (banking?.reapplyForLoan) {
      banking.reapplyForLoan();
    }

    if (banking?.addNotification) {
      banking.addNotification({
        type: 'info',
        message: 'Redirecting to application form...',
        duration: 2000,
      });
    }
  }, [decision, onReapply, banking]);

  // ✅ Get credit score rating
  const getCreditScoreRating = useCallback((score) => {
    if (score >= 750) return 'Excellent';
    if (score >= 700) return 'Very Good';
    if (score >= 650) return 'Good';
    if (score >= 600) return 'Fair';
    return 'Poor';
  }, []);

  // ✅ Get first EMI date
  const getFirstEMIDate = useCallback(() => {
    return new Date(Date.now() + 30*24*60*60*1000).toLocaleDateString('en-IN');
  }, []);

  return (
    <div className="space-y-6">
      {/* Decision Header */}
      <div className={`${config.bgColor} border-l-4 ${config.borderColor} rounded-lg p-8`}>
        <div className="flex items-start gap-4">
          <div className={`flex-shrink-0 w-16 h-16 ${config.bgColor} rounded-full flex items-center justify-center border-4 ${config.borderColor}`}>
            <Icon className={config.iconColor} size={36} />
          </div>
          <div className="flex-1">
            <h2 className="text-2xl font-bold text-gray-800 mb-2">{config.title}</h2>
            <p className="text-gray-600">{decision.reason}</p>
            {/* ✅ Reference ID */}
            {decision.referenceId && (
              <p className="text-xs text-gray-500 mt-2">Ref ID: {decision.referenceId}</p>
            )}
          </div>
        </div>
      </div>

      {/* ✅ Status Alert */}
      {decision.remarks && (
        <Alert
          type={config.type}
          message={decision.remarks}
          dismissible={false}
        />
      )}

      {/* Decision Details */}
      <Card title="📋 Decision Details">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Credit Score */}
          <div className="p-4 bg-gray-50 rounded-lg">
            <p className="text-sm text-gray-600 mb-1">Credit Score</p>
            <p className="text-3xl font-bold text-gray-800">{decision.creditScore}</p>
            <Badge 
              variant={decision.creditScore >= 700 ? 'success' : decision.creditScore >= 600 ? 'warning' : 'danger'}
              size="sm"
              className="mt-2"
            >
              {getCreditScoreRating(decision.creditScore)}
            </Badge>
          </div>

          {/* Risk Level */}
          <div className="p-4 bg-gray-50 rounded-lg">
            <p className="text-sm text-gray-600 mb-1">Risk Level</p>
            <p className="text-3xl font-bold text-gray-800">{decision.riskLevel}</p>
            <Badge 
              variant={decision.riskLevel === 'Low' ? 'success' : decision.riskLevel === 'Medium' ? 'warning' : 'danger'}
              size="sm"
              className="mt-2"
            >
              {decision.riskLevel === 'Low' ? '✓ Low Risk' : decision.riskLevel === 'Medium' ? '⚠️ Medium Risk' : '✗ High Risk'}
            </Badge>
          </div>

          {/* ✅ Risk Score */}
          {decision.riskScore && (
            <div className="p-4 bg-gray-50 rounded-lg">
              <p className="text-sm text-gray-600 mb-1">Risk Score</p>
              <p className="text-3xl font-bold text-gray-800">{decision.riskScore}</p>
            </div>
          )}

          {decision.outcome === 'approved' && (
            <>
              {/* Loan Amount */}
              <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                <p className="text-sm text-green-700 mb-1">Approved Amount</p>
                <p className="text-3xl font-bold text-green-800">
                  ₹{decision.loanAmount?.toLocaleString()}
                </p>
              </div>

              {/* Interest Rate */}
              <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                <p className="text-sm text-green-700 mb-1">Interest Rate</p>
                <p className="text-3xl font-bold text-green-800">
                  {decision.interestRate}% p.a.
                </p>
              </div>

              {/* Tenure */}
              <div className="p-4 bg-gray-50 rounded-lg">
                <p className="text-sm text-gray-600 mb-1">Loan Tenure</p>
                <p className="text-3xl font-bold text-gray-800">{decision.tenure} months</p>
              </div>

              {/* Monthly EMI */}
              <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                <p className="text-sm text-blue-700 mb-1">Monthly EMI</p>
                <p className="text-3xl font-bold text-blue-800">
                  ₹{monthlyEMI.toLocaleString()}
                </p>
              </div>

              {/* ✅ Total Interest */}
              <div className="p-4 bg-orange-50 rounded-lg border border-orange-200">
                <p className="text-sm text-orange-700 mb-1">Total Interest</p>
                <p className="text-3xl font-bold text-orange-800">
                  ₹{totalInterest.toLocaleString()}
                </p>
              </div>

              {/* ✅ Total Amount */}
              <div className="p-4 bg-purple-50 rounded-lg border border-purple-200">
                <p className="text-sm text-purple-700 mb-1">Total Amount (Principal + Interest)</p>
                <p className="text-3xl font-bold text-purple-800">
                  ₹{(monthlyEMI * decision.tenure).toLocaleString()}
                </p>
              </div>
            </>
          )}
        </div>

        {/* ✅ Additional Details */}
        {showDetails && decision.processingFees && (
          <div className="mt-4 pt-4 border-t space-y-2">
            <div className="flex justify-between items-center text-sm">
              <span className="text-gray-700">Processing Fees:</span>
              <span className="font-semibold text-gray-800">{decision.processingFees}%</span>
            </div>
            {decision.documentation && (
              <div className="flex justify-between items-center text-sm">
                <span className="text-gray-700">Documentation:</span>
                <span className="font-semibold text-gray-800">Required</span>
              </div>
            )}
          </div>
        )}
      </Card>

      {/* Next Steps */}
      {decision.outcome === 'approved' && (
        <StatusBox type="success" title="🚀 Next Steps">
          <ol className="space-y-2 mt-3 list-decimal list-inside text-sm">
            <li>Review and accept the loan offer</li>
            <li>Complete e-signature process</li>
            <li>Loan amount will be disbursed to your account within 24 hours</li>
            <li>First EMI due date: {getFirstEMIDate()}</li>
          </ol>
        </StatusBox>
      )}

      {decision.outcome === 'declined' && (
        <StatusBox type="error" title="How to Improve">
          <ul className="space-y-2 mt-3 list-disc list-inside text-sm">
            <li>Improve your credit score by paying bills on time</li>
            <li>Reduce existing debt burden</li>
            <li>Increase your savings and emergency fund</li>
            <li>Reapply after 3 months with improved financial profile</li>
          </ul>
        </StatusBox>
      )}

      {decision.outcome === 'review' && (
        <StatusBox type="warning" title="What Happens Next">
          <ul className="space-y-2 mt-3 list-disc list-inside text-sm">
            <li>Our credit team will review your application within 24-48 hours</li>
            <li>We may contact you for additional documentation</li>
            <li>You'll receive an email/SMS with the final decision</li>
            <li>Check your application status on the Monitoring page</li>
          </ul>
        </StatusBox>
      )}

      {/* ✅ Action Buttons */}
      <div className="flex gap-2 flex-wrap">
        {decision.outcome === 'approved' && (
          <Button variant="primary" onClick={handleAccept} fullWidth>
            Accept Loan Offer
          </Button>
        )}
        
        {decision.outcome === 'declined' && (
          <Button 
            variant="primary" 
            onClick={handleReapply}
            fullWidth
            className="flex items-center justify-center gap-2"
          >
            Reapply Now
          </Button>
        )}
        
        <Button
          variant="outline"
          onClick={downloadDecision}
          disabled={isDownloading}
          className="flex items-center justify-center gap-2"
        >
          <Download size={18} />
          {isDownloading ? 'Downloading...' : 'Download'}
        </Button>

        <Button
          variant="outline"
          onClick={copyToClipboard}
          className="flex items-center justify-center gap-2"
        >
          <FileText size={18} />
          {copied ? 'Copied!' : 'Copy'}
        </Button>
        
        <Button
          variant="outline"
          onClick={shareDecision}
          className="flex items-center justify-center gap-2"
        >
          <Share2 size={18} />
          Share
        </Button>

        {onClose && (
          <Button variant="secondary" onClick={onClose}>
            Close
          </Button>
        )}
      </div>

      {/* ✅ Format selector */}
      <div className="p-3 bg-gray-50 rounded-lg border border-gray-200">
        <p className="text-xs text-gray-700 mb-2 font-semibold">Download Format:</p>
        <div className="flex gap-2">
          {['txt', 'json'].map(format => (
            <button
              key={format}
              onClick={() => setDownloadFormat(format)}
              className={`px-3 py-1 rounded text-xs font-medium transition-colors ${
                downloadFormat === format
                  ? 'bg-blue-600 text-white'
                  : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-100'
              }`}
            >
              {format.toUpperCase()}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default DecisionCard;
