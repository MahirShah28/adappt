import React, { useState, useContext, useMemo, useCallback } from 'react';
import { BankingContext } from '../context/Index';
import { Button, StatusBox, Badge, Card, Alert, ProgressBar } from '../components/common/Index';
import { Video, Fingerprint, FileText, Database, CheckCircle, XCircle, Clock, Shield } from 'lucide-react';

// Import data functions
import {
  getAllBorrowers,
} from '../data/Index';

/**
 * KYCVerification Component
 * Multi-method KYC verification system
 */
const KYCVerification = () => {
  const banking = useContext(BankingContext);

  // State management
  const [selectedMethod, setSelectedMethod] = useState(null);
  const [isVerifying, setIsVerifying] = useState(false);
  const [verificationResult, setVerificationResult] = useState(null);
  const [selectedBorrower, setSelectedBorrower] = useState(null);
  const [completedSteps, setCompletedSteps] = useState([]);

  // Fetch data
  const borrowers = useMemo(() => getAllBorrowers(), []);

  // KYC Methods with detailed information
  const kycMethods = [
    {
      id: 'video',
      name: 'Video KYC (V-CIP)',
      icon: Video,
      description: 'Live video call with KYC officer for complete identity verification',
      time: '5-10 minutes',
      compliance: 'RBI Compliant',
      requirements: ['Valid ID Proof', 'Proof of Address', 'Clear lighting'],
      successRate: 92,
    },
    {
      id: 'biometric',
      name: 'Biometric eKYC',
      icon: Fingerprint,
      description: 'Aadhaar-based biometric verification for instant authentication',
      time: '2-3 minutes',
      compliance: 'UIDAI Approved',
      requirements: ['Aadhaar Card', 'Biometric Data', 'Phone Number'],
      successRate: 95,
    },
    {
      id: 'digilocker',
      name: 'DigiLocker KYC',
      icon: FileText,
      description: 'Fetch verified documents directly from Government DigiLocker',
      time: '3-5 minutes',
      compliance: 'Government of India',
      requirements: ['DigiLocker Account', 'Aadhaar', 'Email/Phone'],
      successRate: 98,
    },
    {
      id: 'ckyc',
      name: 'CKYC Registry',
      icon: Database,
      description: 'Check Central KYC Records Registry for existing KYC data',
      time: '1-2 minutes',
      compliance: 'RBI Compliant',
      requirements: ['PAN Card', 'Identification Number'],
      successRate: 99,
    },
  ];

  // Verification steps
  const verificationSteps = [
    { id: 1, name: 'Identity Verification', status: 'pending' },
    { id: 2, name: 'Address Verification', status: 'pending' },
    { id: 3, name: 'Document Validation', status: 'pending' },
    { id: 4, name: 'Compliance Check', status: 'pending' },
    { id: 5, name: 'Final Approval', status: 'pending' },
  ];

  /**
   * Handle verification process
   */
  const handleVerify = useCallback(async (methodId) => {
    setSelectedMethod(methodId);
    setIsVerifying(true);
    setVerificationResult(null);
    setCompletedSteps([]);

    try {
      // Simulate multi-step verification
      for (let i = 1; i <= 5; i++) {
        await new Promise(resolve => setTimeout(resolve, 800));
        setCompletedSteps(prev => [...prev, i]);
      }

      // Determine success based on method success rate
      const method = kycMethods.find(m => m.id === methodId);
      const successProbability = method.successRate / 100;
      const success = Math.random() < successProbability;

      // Get random borrower
      const randomBorrower = borrowers[Math.floor(Math.random() * borrowers.length)];

      const verificationData = {
        success,
        method: method.name,
        methodId,
        timestamp: new Date().toLocaleString(),
        borrowerName: randomBorrower?.name || 'Test User',
        borrowerId: randomBorrower?.id || 'USER001',
        details: success 
          ? {
              message: 'Identity verified successfully!',
              summary: 'All documents validated and cross-checked with government records.',
              verificationId: `KYC${Date.now()}`,
              complianceStatus: 'Compliant',
            }
          : {
              message: 'Verification could not be completed.',
              summary: 'Please verify documents match provided information or try alternative method.',
              reason: 'Document mismatch detected',
            },
        successRate: method.successRate,
        stepsCompleted: 5,
        totalSteps: 5,
      };

      setVerificationResult(verificationData);
      setSelectedBorrower(randomBorrower);

      if (banking?.addNotification) {
        banking.addNotification({
          type: success ? 'success' : 'error',
          message: success 
            ? `KYC Verified via ${method.name}`
            : `KYC Verification Failed via ${method.name}`,
          duration: 3000,
        });
      }

      if (banking?.recordKYCVerification) {
        banking.recordKYCVerification(verificationData);
      }
    } catch (error) {
      console.error('Verification error:', error);
      if (banking?.addNotification) {
        banking.addNotification({
          type: 'error',
          message: 'Verification process encountered an error',
          duration: 2000,
        });
      }
    } finally {
      setIsVerifying(false);
    }
  }, [kycMethods, borrowers, banking]);

  /**
   * Reset verification
   */
  const handleReset = useCallback(() => {
    setVerificationResult(null);
    setSelectedMethod(null);
    setCompletedSteps([]);
    setSelectedBorrower(null);
  }, []);

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h2 className="text-3xl font-bold text-gray-800 mb-2 flex items-center gap-2">
            <Shield className="text-blue-600" size={32} />
            🛡️ KYC Verification
          </h2>
          <p className="text-gray-600">Choose your preferred verification method</p>
        </div>
      </div>

      {/* Compliance Notice */}
      <Alert
        type="info"
        message="As per RBI guidelines, KYC verification is mandatory for opening a bank account or applying for a loan. All data is encrypted and secure."
        dismissible={false}
      />

      {/* System Status */}
      {!verificationResult && (
        <Card className="bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div>
              <p className="text-sm text-gray-600">Total Borrowers in System</p>
              <p className="text-2xl font-bold text-gray-800">{borrowers.length}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Verification Methods</p>
              <p className="text-2xl font-bold text-gray-800">{kycMethods.length}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Average Success Rate</p>
              <p className="text-2xl font-bold text-green-600">
                {(kycMethods.reduce((sum, m) => sum + m.successRate, 0) / kycMethods.length).toFixed(1)}%
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-600">System Status</p>
              <Badge variant="success">Online</Badge>
            </div>
          </div>
        </Card>
      )}

      {/* KYC Methods Grid */}
      {!verificationResult && !isVerifying && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {kycMethods.map((method) => {
            const Icon = method.icon;
            return (
              <Card key={method.id} className="hover:shadow-lg transition-all">
                <div className="space-y-4">
                  {/* Header */}
                  <div className="flex items-start gap-4">
                    <div className="w-14 h-14 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Icon className="text-blue-600" size={28} />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-bold text-gray-800 text-lg">{method.name}</h3>
                      <p className="text-sm text-gray-600">{method.description}</p>
                    </div>
                  </div>

                  {/* Info Badges */}
                  <div className="flex flex-wrap gap-2">
                    <Badge variant="info" size="sm">⏱️ {method.time}</Badge>
                    <Badge variant="success" size="sm">✓ {method.compliance}</Badge>
                    <Badge variant="primary" size="sm">Success: {method.successRate}%</Badge>
                  </div>

                  {/* Requirements */}
                  <div>
                    <p className="text-xs font-semibold text-gray-700 mb-2">Requirements:</p>
                    <ul className="space-y-1">
                      {method.requirements.map((req, idx) => (
                        <li key={idx} className="text-xs text-gray-600">✓ {req}</li>
                      ))}
                    </ul>
                  </div>

                  {/* Button */}
                  <Button
                    variant="primary"
                    onClick={() => handleVerify(method.id)}
                    disabled={isVerifying}
                    fullWidth
                  >
                    {isVerifying ? 'Verifying...' : 'Start Verification'}
                  </Button>
                </div>
              </Card>
            );
          })}
        </div>
      )}

      {/* Verification In Progress */}
      {isVerifying && (
        <Card className="text-center p-8">
          <div className="space-y-6">
            <div>
              <div className="w-20 h-20 border-4 border-blue-600 border-t-transparent rounded-full mx-auto animate-spin mb-4"></div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">Verifying Your Identity...</h3>
              <p className="text-gray-600">Please wait while we verify your KYC documents using {
                kycMethods.find(m => m.id === selectedMethod)?.name
              }</p>
            </div>

            {/* Progress Steps */}
            <div className="space-y-2">
              {verificationSteps.map((step) => (
                <div key={step.id} className="flex items-center gap-3">
                  <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold text-white ${
                    completedSteps.includes(step.id) ? 'bg-green-500' : 'bg-gray-300'
                  }`}>
                    {completedSteps.includes(step.id) ? <CheckCircle size={16} /> : step.id}
                  </div>
                  <p className="text-sm text-gray-700">{step.name}</p>
                  {completedSteps.includes(step.id) && (
                    <Badge variant="success" size="sm">Complete</Badge>
                  )}
                </div>
              ))}
            </div>

            <ProgressBar
              progress={(completedSteps.length / 5) * 100}
              text={`Step ${completedSteps.length} of 5`}
            />
          </div>
        </Card>
      )}

      {/* Verification Result */}
      {verificationResult && (
        <div className="space-y-6">
          {/* Result Status */}
          <StatusBox
            type={verificationResult.success ? 'success' : 'error'}
            title={verificationResult.success ? '✅ KYC Verification Successful' : '❌ KYC Verification Failed'}
          >
            <div className="mt-4 space-y-3">
              <Alert
                type={verificationResult.success ? 'success' : 'error'}
                message={verificationResult.details.message}
                dismissible={false}
              />

              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
                <div className="p-3 bg-gray-50 rounded">
                  <p className="text-gray-600">Verification ID</p>
                  <p className="font-mono text-xs text-gray-800">
                    {verificationResult.details.verificationId || 'N/A'}
                  </p>
                </div>
                <div className="p-3 bg-gray-50 rounded">
                  <p className="text-gray-600">Method</p>
                  <p className="font-semibold text-gray-800">{verificationResult.method}</p>
                </div>
                <div className="p-3 bg-gray-50 rounded">
                  <p className="text-gray-600">Time</p>
                  <p className="text-xs text-gray-800">{verificationResult.timestamp}</p>
                </div>
                <div className="p-3 bg-gray-50 rounded">
                  <p className="text-gray-600">Borrower</p>
                  <p className="font-semibold text-gray-800">{verificationResult.borrowerName}</p>
                </div>
                <div className="p-3 bg-gray-50 rounded">
                  <p className="text-gray-600">Compliance</p>
                  <Badge variant="success" size="sm">
                    {verificationResult.details.complianceStatus || 'Compliant'}
                  </Badge>
                </div>
                <div className="p-3 bg-gray-50 rounded">
                  <p className="text-gray-600">Success Rate</p>
                  <p className="font-semibold text-gray-800">{verificationResult.successRate}%</p>
                </div>
              </div>

              {verificationResult.details.summary && (
                <div className="p-4 bg-blue-50 rounded border border-blue-200">
                  <p className="text-sm text-blue-900">{verificationResult.details.summary}</p>
                </div>
              )}

              {verificationResult.details.reason && (
                <div className="p-4 bg-red-50 rounded border border-red-200">
                  <p className="text-sm font-semibold text-red-900">Reason:</p>
                  <p className="text-sm text-red-800">{verificationResult.details.reason}</p>
                </div>
              )}
            </div>
          </StatusBox>

          {/* Next Steps */}
          <Card className="bg-gradient-to-r from-green-50 to-blue-50 border border-green-200">
            <h4 className="font-semibold text-gray-800 mb-3">📋 Next Steps</h4>
            <ol className="space-y-2 text-sm text-gray-700">
              <li>1. Your KYC status has been updated in the system</li>
              <li>2. A confirmation email has been sent to your registered email</li>
              <li>3. You can now proceed with loan application or account opening</li>
              <li>4. Your KYC is valid for 10 years from the verification date</li>
            </ol>
          </Card>

          {/* Action Buttons */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Button
              variant="outline"
              onClick={handleReset}
              fullWidth
            >
              Verify Another Method
            </Button>
            <Button
              variant="primary"
              fullWidth
            >
              Proceed to Loan Application
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default KYCVerification;
