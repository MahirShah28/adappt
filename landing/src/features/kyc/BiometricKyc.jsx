import React, { useContext, useState, useCallback, useEffect } from 'react';
import { BankingContext } from '../../context/Index'; // ✅ Added
import { Button, Input, ProgressBar, StatusBox, Badge, Alert } from '../../components/common/Index'; // ✅ Updated
import { Fingerprint, CheckCircle, Smartphone, Shield, AlertCircle, Clock } from 'lucide-react'; // ✅ Added

/**
 * BiometricKYC Component
 * UIDAI biometric eKYC verification flow
 * 
 * @param {function} onComplete - Completion callback
 * @param {function} onCancel - Cancel callback
 * @param {function} onStageChange - Stage change callback
 * @param {object} prefilledData - Pre-filled data (optional)
 * @param {boolean} simulateDelay - Simulate processing delay
 * @param {number} maxRetries - Max OTP retries
 */
const BiometricKYC = ({ 
  onComplete, 
  onCancel,
  onStageChange = null, // ✅ Added
  prefilledData = null, // ✅ Added
  simulateDelay = true, // ✅ Added
  maxRetries = 3, // ✅ Added
}) => {
  // ✅ Get context
  const banking = useContext(BankingContext);

  // ✅ State management
  const [stage, setStage] = useState('input'); // ✅ Updated
  const [aadhaarNumber, setAadhaarNumber] = useState(prefilledData?.aadhaar || '');
  const [otp, setOtp] = useState('');
  const [progress, setProgress] = useState(0);
  const [errors, setErrors] = useState({}); // ✅ Added
  const [otpRetries, setOtpRetries] = useState(0); // ✅ Added
  const [otpExpiry, setOtpExpiry] = useState(null); // ✅ Added
  const [isResendingOtp, setIsResendingOtp] = useState(false); // ✅ Added
  const [verificationData, setVerificationData] = useState({}); // ✅ Added

  // ✅ Track OTP expiry
  useEffect(() => {
    if (stage === 'otp' && !otpExpiry) {
      const expiry = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes
      setOtpExpiry(expiry);
    }
  }, [stage, otpExpiry]);

  // ✅ OTP expiry timer
  useEffect(() => {
    if (otpExpiry && stage === 'otp') {
      const interval = setInterval(() => {
        const now = new Date();
        if (now >= otpExpiry) {
          setStage('input');
          if (banking?.addNotification) {
            banking.addNotification({
              type: 'error',
              message: 'OTP expired. Please start over.',
              duration: 3000,
            });
          }
          clearInterval(interval);
        }
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [otpExpiry, stage, banking]);

  // ✅ Validate Aadhaar number
  const validateAadhaar = useCallback((value) => {
    const cleaned = value.replace(/\s/g, '');
    if (cleaned.length !== 12) {
      return 'Aadhaar must be 12 digits';
    }
    if (!/^\d+$/.test(cleaned)) {
      return 'Aadhaar must contain only digits';
    }
    return '';
  }, []);

  // ✅ Validate OTP
  const validateOTP = useCallback((value) => {
    if (value.length !== 6) {
      return 'OTP must be 6 digits';
    }
    if (!/^\d+$/.test(value)) {
      return 'OTP must contain only digits';
    }
    return '';
  }, []);

  // ✅ Handle Aadhaar submit
  const handleAadhaarSubmit = useCallback(async (e) => {
    e.preventDefault();
    
    // ✅ Validate
    const error = validateAadhaar(aadhaarNumber);
    if (error) {
      setErrors({ aadhaar: error });
      if (banking?.addNotification) {
        banking.addNotification({
          type: 'error',
          message: error,
          duration: 2000,
        });
      }
      return;
    }

    setErrors({});

    try {
      // ✅ Call API (mock for now)
      if (banking?.addNotification) {
        banking.addNotification({
          type: 'info',
          message: 'Sending OTP...',
          duration: 2000,
        });
      }

      setStage('otp');
      setOtpRetries(0);
      setOtpExpiry(null);

      // ✅ Call stage change callback
      if (onStageChange) {
        onStageChange('otp');
      }

      if (banking?.updateKYCStage) {
        banking.updateKYCStage('otp');
      }
    } catch (err) {
      setErrors({ aadhaar: 'Failed to send OTP. Please try again.' });
      if (banking?.addNotification) {
        banking.addNotification({
          type: 'error',
          message: 'Failed to send OTP',
          duration: 3000,
        });
      }
    }
  }, [aadhaarNumber, validateAadhaar, banking, onStageChange]);

  // ✅ Handle OTP submit
  const handleOTPSubmit = useCallback(async (e) => {
    e.preventDefault();
    
    // ✅ Validate
    const error = validateOTP(otp);
    if (error) {
      setErrors({ otp: error });
      if (banking?.addNotification) {
        banking.addNotification({
          type: 'error',
          message: error,
          duration: 2000,
        });
      }
      return;
    }

    // ✅ Check retries
    if (otpRetries >= maxRetries) {
      setErrors({ otp: `Maximum retries exceeded. Please start over.` });
      if (banking?.addNotification) {
        banking.addNotification({
          type: 'error',
          message: 'Maximum retries exceeded',
          duration: 3000,
        });
      }
      return;
    }

    setErrors({});
    setStage('processing');

    // ✅ Call stage change callback
    if (onStageChange) {
      onStageChange('processing');
    }

    try {
      // ✅ Simulate biometric verification
      const steps = [
        { progress: 20, label: 'Aadhaar Authentication', delay: simulateDelay ? 1000 : 100 },
        { progress: 40, label: 'Validating OTP', delay: simulateDelay ? 1500 : 100 },
        { progress: 60, label: 'Biometric Verification', delay: simulateDelay ? 1000 : 100 },
        { progress: 80, label: 'KYC Processing', delay: simulateDelay ? 1500 : 100 },
        { progress: 100, label: 'Verification Complete', delay: simulateDelay ? 1000 : 100 },
      ];

      for (const step of steps) {
        setProgress(step.progress);
        await new Promise(resolve => setTimeout(resolve, step.delay));
      }

      // ✅ Store verification data
      const verifiedData = {
        method: 'Biometric eKYC',
        verified: true,
        aadhaar: aadhaarNumber.replace(/\s/g, '').slice(-4),
        timestamp: new Date().toISOString(),
        status: 'VERIFIED',
        verifiedBy: 'UIDAI',
      };

      setVerificationData(verifiedData);
      setStage('completed');

      if (onStageChange) {
        onStageChange('completed');
      }

      if (banking?.updateKYCStage) {
        banking.updateKYCStage('completed', verifiedData);
      }

      // ✅ Show success notification
      if (banking?.addNotification) {
        banking.addNotification({
          type: 'success',
          message: 'eKYC verification successful!',
          duration: 2000,
        });
      }

      // ✅ Call completion callback
      setTimeout(() => {
        if (onComplete) {
          onComplete(verifiedData);
        }
      }, 2000);
    } catch (err) {
      setStage('otp');
      setErrors({ otp: 'Verification failed. Please try again.' });
      if (banking?.addNotification) {
        banking.addNotification({
          type: 'error',
          message: 'Verification failed',
          duration: 3000,
        });
      }
    }
  }, [otp, validateOTP, otpRetries, maxRetries, aadhaarNumber, simulateDelay, banking, onStageChange, onComplete]);

  // ✅ Handle OTP resend
  const handleResendOTP = useCallback(async () => {
    setIsResendingOtp(true);
    
    try {
      // ✅ Show notification
      if (banking?.addNotification) {
        banking.addNotification({
          type: 'success',
          message: 'OTP resent successfully!',
          duration: 2000,
        });
      }

      // ✅ Reset OTP and expiry
      setOtp('');
      setOtpExpiry(null);
      
      // ✅ Simulate delay
      await new Promise(resolve => setTimeout(resolve, 1000));
    } catch (err) {
      if (banking?.addNotification) {
        banking.addNotification({
          type: 'error',
          message: 'Failed to resend OTP',
          duration: 2000,
        });
      }
    } finally {
      setIsResendingOtp(false);
    }
  }, [banking]);

  // ✅ Get remaining time
  const getRemainingTime = useCallback(() => {
    if (!otpExpiry) return '';
    const now = new Date();
    const diff = otpExpiry - now;
    if (diff <= 0) return 'Expired';
    const minutes = Math.floor(diff / 60000);
    const seconds = Math.floor((diff % 60000) / 1000);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  }, [otpExpiry]);

  // ✅ Format Aadhaar display
  const formatAadhaarDisplay = (value) => {
    const cleaned = value.replace(/\D/g, '');
    if (cleaned.length === 0) return '';
    if (cleaned.length <= 4) return cleaned;
    if (cleaned.length <= 8) return `${cleaned.slice(0, 4)} ${cleaned.slice(4)}`;
    return `${cleaned.slice(0, 4)} ${cleaned.slice(4, 8)} ${cleaned.slice(8)}`;
  };

  return (
    <div className="space-y-6">
      {/* Aadhaar Input Stage */}
      {stage === 'input' && (
        <>
          <div>
            <h3 className="text-2xl font-bold text-gray-800 mb-2 flex items-center gap-2">
              <Fingerprint className="text-green-600" size={28} />
              Biometric eKYC Verification
            </h3>
            <p className="text-gray-600">
              Instant verification using your Aadhaar and biometric authentication
            </p>
          </div>

          <StatusBox
            type="info"
            title="UIDAI Approved Method"
            message="This method uses UIDAI's secure biometric authentication system for instant KYC verification."
          />

          <div className="bg-white rounded-lg shadow-lg p-8">
            <form onSubmit={handleAadhaarSubmit} className="space-y-6">
              <div>
                <h4 className="font-semibold text-gray-800 mb-4">Enter Your Aadhaar Number</h4>
                
                <Input
                  label="Aadhaar Number"
                  name="aadhaar"
                  value={formatAadhaarDisplay(aadhaarNumber)}
                  onChange={(e) => setAadhaarNumber(e.target.value.replace(/\D/g, ''))}
                  placeholder="1234 5678 9012"
                  helperText="Your Aadhaar number is encrypted and secure"
                  error={errors.aadhaar}
                  maxLength="12"
                  required
                />
              </div>

              {/* ✅ Security information */}
              <div className="bg-green-50 rounded-lg p-4 border border-green-200">
                <h5 className="font-semibold text-green-900 mb-2 flex items-center gap-2">
                  <Shield size={18} />
                  Security & Privacy
                </h5>
                <ul className="space-y-1 text-sm text-green-800">
                  <li>✓ Your Aadhaar data is encrypted end-to-end</li>
                  <li>✓ We don't store your biometric information</li>
                  <li>✓ UIDAI compliant verification process</li>
                  <li>✓ Your data is protected by law</li>
                </ul>
              </div>

              <div className="flex gap-3 flex-wrap">
                <Button type="submit" variant="primary" fullWidth>
                  <span className="flex items-center justify-center gap-2">
                    <Fingerprint size={20} />
                    Proceed to Verification
                  </span>
                </Button>
                <Button type="button" variant="outline" onClick={onCancel}>
                  Cancel
                </Button>
              </div>
            </form>
          </div>
        </>
      )}

      {/* OTP Verification Stage */}
      {stage === 'otp' && (
        <>
          <div>
            <h3 className="text-2xl font-bold text-gray-800 mb-2 flex items-center gap-2">
              <Smartphone className="text-blue-600" size={28} />
              OTP Verification
            </h3>
            <p className="text-gray-600">
              Enter the OTP sent to your Aadhaar-linked mobile number
            </p>
          </div>

          <StatusBox
            type="success"
            message={`OTP has been sent to your mobile number ending with **${aadhaarNumber.slice(-4)}`}
          />

          <div className="bg-white rounded-lg shadow-lg p-8">
            <form onSubmit={handleOTPSubmit} className="space-y-6">
              <Input
                label="Enter 6-Digit OTP"
                name="otp"
                type="text"
                value={otp}
                onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                placeholder="000000"
                helperText="Check your SMS for the verification code"
                error={errors.otp}
                maxLength="6"
                required
              />

              {/* ✅ OTP expiry and retry info */}
              <div className="flex justify-between items-center text-sm">
                <div className="flex items-center gap-2 text-gray-500">
                  <Clock size={14} />
                  <span>OTP valid for {getRemainingTime()}</span>
                </div>
                <div className="text-gray-500">
                  Attempt {otpRetries + 1} of {maxRetries}
                </div>
              </div>

              {/* ✅ Retry warning */}
              {otpRetries >= maxRetries - 1 && (
                <Alert
                  type="warning"
                  message={`⚠️ Only ${maxRetries - otpRetries} attempt(s) remaining`}
                  dismissible={false}
                />
              )}

              <div className="flex flex-wrap justify-between items-center">
                <button
                  type="button"
                  className="text-blue-600 hover:underline text-sm disabled:opacity-50"
                  onClick={handleResendOTP}
                  disabled={isResendingOtp}
                >
                  {isResendingOtp ? 'Resending...' : 'Resend OTP'}
                </button>
              </div>

              <div className="flex gap-3 flex-wrap">
                <Button type="submit" variant="primary" fullWidth>
                  Verify & Complete KYC
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setStage('input');
                    setOtp('');
                    setErrors({});
                    if (onStageChange) {
                      onStageChange('input');
                    }
                  }}
                >
                  Back
                </Button>
              </div>
            </form>
          </div>
        </>
      )}

      {/* Processing Stage */}
      {stage === 'processing' && (
        <div className="bg-white rounded-lg shadow-lg p-8">
          <div className="text-center mb-6">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Fingerprint className="text-green-600 animate-pulse" size={40} />
            </div>
            <h3 className="text-xl font-bold text-gray-800 mb-2">
              Verifying Your Identity...
            </h3>
            <p className="text-gray-600">Please wait while we verify your Aadhaar details</p>
          </div>

          <ProgressBar 
            progress={progress} 
            text={`Authenticating with UIDAI... ${progress}%`}
            color="green"
            height="lg"
            showStatus={true}
          />

          {/* ✅ Step-by-step verification */}
          <div className="mt-6 space-y-3">
            <div className={`flex items-center gap-3 p-3 rounded-lg transition-all ${progress >= 20 ? 'bg-green-50' : 'bg-gray-50'}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${progress >= 20 ? 'bg-green-500' : 'bg-gray-300'}`}>
                {progress >= 20 ? (
                  <CheckCircle className="text-white" size={18} />
                ) : (
                  <span className="text-white text-sm font-bold">1</span>
                )}
              </div>
              <span className={`text-sm ${progress >= 20 ? 'text-green-800 font-medium' : 'text-gray-600'}`}>
                Aadhaar Authentication
              </span>
            </div>
            
            <div className={`flex items-center gap-3 p-3 rounded-lg transition-all ${progress >= 50 ? 'bg-green-50' : 'bg-gray-50'}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${progress >= 50 ? 'bg-green-500' : 'bg-gray-300'}`}>
                {progress >= 50 ? (
                  <CheckCircle className="text-white" size={18} />
                ) : (
                  <span className="text-white text-sm font-bold">2</span>
                )}
              </div>
              <span className={`text-sm ${progress >= 50 ? 'text-green-800 font-medium' : 'text-gray-600'}`}>
                Biometric Verification
              </span>
            </div>
            
            <div className={`flex items-center gap-3 p-3 rounded-lg transition-all ${progress >= 100 ? 'bg-green-50' : 'bg-gray-50'}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${progress >= 100 ? 'bg-green-500' : 'bg-gray-300'}`}>
                {progress >= 100 ? (
                  <CheckCircle className="text-white" size={18} />
                ) : (
                  <span className="text-white text-sm font-bold">3</span>
                )}
              </div>
              <span className={`text-sm ${progress >= 100 ? 'text-green-800 font-medium' : 'text-gray-600'}`}>
                KYC Completion
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Completed Stage */}
      {stage === 'completed' && (
        <div className="bg-white rounded-lg shadow-lg p-8">
          <div className="text-center">
            <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6 animate-bounce">
              <CheckCircle className="text-green-600" size={56} />
            </div>
            <h3 className="text-2xl font-bold text-green-600 mb-2">
              eKYC Verification Successful!
            </h3>
            <p className="text-gray-600 mb-6">
              Your identity has been successfully verified using biometric eKYC
            </p>

            {/* ✅ Verification details */}
            <div className="bg-green-50 rounded-lg p-6 mb-6">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-gray-600">Verification Method</p>
                  <p className="font-bold text-gray-800">Biometric eKYC</p>
                </div>
                <div>
                  <p className="text-gray-600">Status</p>
                  <Badge variant="success">Verified</Badge>
                </div>
                <div>
                  <p className="text-gray-600">Verified By</p>
                  <p className="font-bold text-gray-800">UIDAI</p>
                </div>
                <div>
                  <p className="text-gray-600">Timestamp</p>
                  <p className="font-bold text-gray-800">
                    {new Date(verificationData.timestamp).toLocaleString()}
                  </p>
                </div>
              </div>
            </div>

            <StatusBox
              type="success"
              message="You can now proceed with your loan application or account opening."
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default BiometricKYC;
