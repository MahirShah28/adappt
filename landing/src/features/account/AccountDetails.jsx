import React, { useContext, useState, useCallback } from 'react';
import { BankingContext } from '../../context/Index'; // ✅ Added
import { StatusBox, Card, Button, Badge, Alert } from '../../components/common/Index'; // ✅ Updated
import { CheckCircle, Copy, Download, Share2, CreditCard, Building2, Check } from 'lucide-react';

/**
 * AccountDetails Component
 * Displays newly created account details with download and copy functionality
 * 
 * @param {object} accountDetails - Account information
 * @param {string} userName - Account holder name
 * @param {function} onClose - Close callback
 * @param {boolean} showNextSteps - Show next steps section
 * @param {boolean} showFeatures - Show features section
 * @param {function} onNavigate - Navigation callback
 * @param {boolean} printable - Enable print functionality
 */
const AccountDetails = ({ 
  accountDetails, 
  userName, 
  onClose,
  showNextSteps = true, // ✅ Added
  showFeatures = true, // ✅ Added
  onNavigate = null, // ✅ Added
  printable = true, // ✅ Added
}) => {
  // ✅ Get context
  const banking = useContext(BankingContext);

  // ✅ State for copy feedback
  const [copiedField, setCopiedField] = useState(null); // ✅ Added
  const [shareOpen, setShareOpen] = useState(false); // ✅ Added

  // ✅ Enhanced copy to clipboard with feedback
  const copyToClipboard = useCallback((text, label) => {
    navigator.clipboard.writeText(text)
      .then(() => {
        // ✅ Set feedback
        setCopiedField(label);
        
        // ✅ Show notification in context
        if (banking?.addNotification) {
          banking.addNotification({
            type: 'success',
            message: `${label} copied to clipboard!`,
            duration: 2000,
          });
        }

        // ✅ Reset feedback after 2 seconds
        setTimeout(() => setCopiedField(null), 2000);
      })
      .catch((err) => {
        console.error('Failed to copy:', err);
        if (banking?.addNotification) {
          banking.addNotification({
            type: 'error',
            message: 'Failed to copy. Please try again.',
          });
        }
      });
  }, [banking]);

  // ✅ Enhanced download with better formatting
  const downloadDetails = useCallback(() => {
    const detailsText = `
=====================================
BANK ACCOUNT DETAILS
=====================================
Account Holder: ${userName}
Bank Name: ${accountDetails.bankName}
Account Number: ${accountDetails.accountNumber}
Customer ID: ${accountDetails.customerId}
IFSC Code: ${accountDetails.ifscCode}
Account Type: Savings Account
Account Status: Active
Date Created: ${new Date().toLocaleDateString()}
=====================================

IMPORTANT NOTES:
- Keep these details secure and confidential
- Do not share your Account Number or Customer ID
- For any queries, contact support
- Your debit card will arrive within 7-10 working days

=====================================
Generated on: ${new Date().toLocaleString()}
=====================================
    `.trim();

    try {
      const blob = new Blob([detailsText], { type: 'text/plain' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `account_details_${accountDetails.accountNumber}.txt`;
      link.click();
      URL.revokeObjectURL(url);

      // ✅ Show success notification
      if (banking?.addNotification) {
        banking.addNotification({
          type: 'success',
          message: 'Account details downloaded successfully!',
          duration: 2000,
        });
      }
    } catch (error) {
      console.error('Download failed:', error);
      if (banking?.addNotification) {
        banking.addNotification({
          type: 'error',
          message: 'Failed to download account details. Please try again.',
        });
      }
    }
  }, [accountDetails, userName, banking]);

  // ✅ Print functionality
  const printDetails = useCallback(() => {
    const printWindow = window.open('', '', 'height=500,width=800');
    printWindow.document.write(`
      <html>
        <head>
          <title>Account Details - ${accountDetails.accountNumber}</title>
          <style>
            body { font-family: Arial, sans-serif; padding: 20px; }
            .header { text-align: center; margin-bottom: 30px; }
            .details { margin: 20px 0; }
            .detail-row { display: flex; justify-content: space-between; margin: 10px 0; padding: 10px; border-bottom: 1px solid #ddd; }
            .label { font-weight: bold; color: #666; }
            .value { font-family: monospace; }
            .warning { background-color: #fff3cd; padding: 10px; margin-top: 20px; border-radius: 5px; }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>Bank Account Details</h1>
            <p>${accountDetails.bankName}</p>
          </div>
          <div class="details">
            <div class="detail-row"><span class="label">Account Holder:</span><span>${userName}</span></div>
            <div class="detail-row"><span class="label">Account Number:</span><span class="value">${accountDetails.accountNumber}</span></div>
            <div class="detail-row"><span class="label">Customer ID:</span><span class="value">${accountDetails.customerId}</span></div>
            <div class="detail-row"><span class="label">IFSC Code:</span><span class="value">${accountDetails.ifscCode}</span></div>
            <div class="detail-row"><span class="label">Account Type:</span><span>Savings Account</span></div>
            <div class="detail-row"><span class="label">Date Created:</span><span>${new Date().toLocaleDateString()}</span></div>
          </div>
          <div class="warning">
            <strong>Important:</strong> Keep these details secure and confidential. Do not share your Account Number or Customer ID.
          </div>
        </body>
      </html>
    `);
    printWindow.document.close();
    printWindow.print();
  }, [accountDetails, userName]);

  // ✅ Handle share functionality
  const handleShare = useCallback(() => {
    if (navigator.share) {
      // ✅ Native share API
      navigator.share({
        title: 'Bank Account Details',
        text: `Account Number: ${accountDetails.accountNumber}, Customer ID: ${accountDetails.customerId}`,
      }).catch(err => console.error('Share failed:', err));
    } else {
      // ✅ Fallback: show share options
      setShareOpen(!shareOpen);
    }
  }, [accountDetails, shareOpen]);

  // ✅ Handle navigation to next page
  const handleNext = useCallback(() => {
    if (onNavigate) {
      onNavigate('LoanApplication');
    } else if (banking?.navigateTo) {
      banking.navigateTo('/loan-application');
    }
  }, [onNavigate, banking]);

  return (
    <div className="space-y-6">
      {/* Success Header */}
      <div className="bg-white rounded-lg shadow-lg p-8 text-center">
        <div className="flex justify-center mb-6">
          <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center animate-bounce">
            <CheckCircle className="text-green-600" size={56} />
          </div>
        </div>

        <h2 className="text-3xl font-bold text-green-600 mb-3">
          🎉 Account Created Successfully!
        </h2>
        <p className="text-lg text-gray-600 mb-2">
          Welcome to your new bank account, <strong>{userName}</strong>!
        </p>
        <Badge variant="success" size="lg">
          ✓ Account Activated
        </Badge>
      </div>

      {/* Account Details Card */}
      <Card title="Your New Account Details">
        <div className="space-y-6">
          {/* Bank Information */}
          <div className="flex items-start gap-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
            <Building2 className="text-blue-600 flex-shrink-0 mt-1" size={24} />
            <div className="flex-1">
              <p className="text-sm text-gray-600 mb-1">Bank Name</p>
              <p className="text-lg font-bold text-gray-800">{accountDetails.bankName}</p>
            </div>
          </div>

          {/* Account Number */}
          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-200">
            <div className="flex-1">
              <p className="text-sm text-gray-600 mb-1">Account Number</p>
              <p className="text-2xl font-mono font-bold text-gray-800">
                {accountDetails.accountNumber}
              </p>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => copyToClipboard(accountDetails.accountNumber, 'Account Number')}
                className="p-2 hover:bg-gray-200 rounded-lg transition-colors"
                title="Copy Account Number"
                aria-label="Copy Account Number"
              >
                {copiedField === 'Account Number' ? (
                  <Check size={20} className="text-green-600" />
                ) : (
                  <Copy size={20} className="text-gray-600" />
                )}
              </button>
            </div>
          </div>

          {/* Customer ID */}
          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-200">
            <div className="flex-1">
              <p className="text-sm text-gray-600 mb-1">Customer ID</p>
              <p className="text-xl font-mono font-bold text-gray-800">
                {accountDetails.customerId}
              </p>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => copyToClipboard(accountDetails.customerId, 'Customer ID')}
                className="p-2 hover:bg-gray-200 rounded-lg transition-colors"
                title="Copy Customer ID"
                aria-label="Copy Customer ID"
              >
                {copiedField === 'Customer ID' ? (
                  <Check size={20} className="text-green-600" />
                ) : (
                  <Copy size={20} className="text-gray-600" />
                )}
              </button>
            </div>
          </div>

          {/* IFSC Code */}
          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-200">
            <div className="flex-1">
              <p className="text-sm text-gray-600 mb-1">IFSC Code</p>
              <p className="text-xl font-mono font-bold text-gray-800">
                {accountDetails.ifscCode}
              </p>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => copyToClipboard(accountDetails.ifscCode, 'IFSC Code')}
                className="p-2 hover:bg-gray-200 rounded-lg transition-colors"
                title="Copy IFSC Code"
                aria-label="Copy IFSC Code"
              >
                {copiedField === 'IFSC Code' ? (
                  <Check size={20} className="text-green-600" />
                ) : (
                  <Copy size={20} className="text-gray-600" />
                )}
              </button>
            </div>
          </div>

          {/* Additional Info */}
          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 bg-gray-50 rounded-lg">
              <p className="text-sm text-gray-600 mb-1">Account Type</p>
              <p className="font-semibold text-gray-800">Savings Account</p>
            </div>
            <div className="p-4 bg-gray-50 rounded-lg">
              <p className="text-sm text-gray-600 mb-1">Balance Type</p>
              <p className="font-semibold text-gray-800">Zero Balance</p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4 flex-wrap">
            <Button
              variant="primary"
              onClick={downloadDetails}
              className="flex-1 flex items-center justify-center gap-2"
            >
              <Download size={18} />
              Download Details
            </Button>
            
            {/* ✅ Print Button */}
            {printable && (
              <Button
                variant="secondary"
                onClick={printDetails}
                className="flex items-center justify-center gap-2"
                title="Print account details"
              >
                Print
              </Button>
            )}

            {/* ✅ Share Button */}
            <Button
              variant="outline"
              onClick={handleShare}
              className="flex items-center justify-center gap-2"
              title="Share account details"
            >
              <Share2 size={18} />
              Share
            </Button>
          </div>

          {/* ✅ Share Options Dropdown */}
          {shareOpen && (
            <div className="p-3 bg-gray-50 rounded-lg border border-gray-200 text-sm space-y-2">
              <p className="font-semibold text-gray-700">Share via:</p>
              <button 
                onClick={() => {
                  copyToClipboard(
                    `Account Details - Account: ${accountDetails.accountNumber}, Customer ID: ${accountDetails.customerId}`,
                    'Share text'
                  );
                  setShareOpen(false);
                }}
                className="w-full text-left p-2 hover:bg-gray-100 rounded"
              >
                📋 Copy to share
              </button>
            </div>
          )}
        </div>
      </Card>

      {/* Next Steps */}
      {showNextSteps && (
        <StatusBox type="success" title="🚀 Next Steps">
          <ul className="space-y-2 mt-3">
            <li className="flex items-start gap-2">
              <span className="text-green-600 font-bold">1.</span>
              <span>Your account is now active and ready to use</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-green-600 font-bold">2.</span>
              <span>You can now apply for loans through our platform</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-green-600 font-bold">3.</span>
              <span>
                Visit the <button
                  onClick={handleNext}
                  className="text-blue-600 hover:underline font-semibold"
                >
                  Loan Application
                </button> page to get started
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-green-600 font-bold">4.</span>
              <span>Your debit card will be delivered within 7-10 working days</span>
            </li>
          </ul>
        </StatusBox>
      )}

      {/* Features Card */}
      {showFeatures && (
        <Card title="✨ Account Features">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <CreditCard className="text-blue-600" size={20} />
              </div>
              <div>
                <h4 className="font-semibold text-gray-800 mb-1">Zero Balance</h4>
                <p className="text-sm text-gray-600">No minimum balance required</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <CheckCircle className="text-green-600" size={20} />
              </div>
              <div>
                <h4 className="font-semibold text-gray-800 mb-1">Instant Activation</h4>
                <p className="text-sm text-gray-600">Use your account immediately</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <Building2 className="text-purple-600" size={20} />
              </div>
              <div>
                <h4 className="font-semibold text-gray-800 mb-1">RBI Regulated</h4>
                <p className="text-sm text-gray-600">Fully compliant banking</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <Share2 className="text-orange-600" size={20} />
              </div>
              <div>
                <h4 className="font-semibold text-gray-800 mb-1">UPI Enabled</h4>
                <p className="text-sm text-gray-600">Instant digital payments</p>
              </div>
            </div>
          </div>
        </Card>
      )}

      {/* Important Notice */}
      <Alert type="warning" message="📋 Important: Please save these details securely. You'll need your Account Number and Customer ID for future transactions and loan applications." />

      {/* Close/Next Button */}
      {onClose && (
        <div className="flex gap-3">
          <Button 
            variant="secondary" 
            onClick={onClose}
            fullWidth
          >
            Close
          </Button>
          <Button 
            variant="primary" 
            onClick={handleNext}
            fullWidth
          >
            Apply for Loan
          </Button>
        </div>
      )}
    </div>
  );
};

export default AccountDetails;
