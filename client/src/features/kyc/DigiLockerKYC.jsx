import React, { useContext, useState, useCallback, useMemo } from 'react';
import { BankingContext } from '../../context/Index'; // ✅ Added
import { Button, ProgressBar, StatusBox, Badge, Alert } from '../../components/common/Index'; // ✅ Updated
import { FileText, CheckCircle, Shield, Download, ExternalLink, AlertCircle } from 'lucide-react'; // ✅ Added

/**
 * DigilockerKYC Component
 * Fetch and verify documents from DigiLocker
 * 
 * @param {function} onComplete - Completion callback
 * @param {function} onCancel - Cancel callback
 * @param {function} onStageChange - Stage change callback
 * @param {object} customDocuments - Custom document data (optional)
 * @param {boolean} simulateDelay - Simulate processing delay
 * @param {function} onDocumentFetch - Document fetch callback
 */
const DigilockerKYC = ({ 
  onComplete, 
  onCancel,
  onStageChange = null, // ✅ Added
  customDocuments = null, // ✅ Added
  simulateDelay = true, // ✅ Added
  onDocumentFetch = null, // ✅ Added
}) => {
  // ✅ Get context
  const banking = useContext(BankingContext);

  // ✅ State management
  const [stage, setStage] = useState('connect');
  const [progress, setProgress] = useState(0);
  const [documents, setDocuments] = useState(null);
  const [errors, setErrors] = useState(null); // ✅ Added
  const [connectionStatus, setConnectionStatus] = useState('idle'); // ✅ Added

  // ✅ Process documents
  const processedDocuments = useMemo(() => {
    if (customDocuments) return customDocuments;
    
    return documents ? {
      ...documents,
      totalVerified: Object.values(documents).filter(d => d.verified && d.available).length,
      totalAvailable: Object.values(documents).filter(d => d.available).length,
    } : null;
  }, [documents, customDocuments]);

  // ✅ Get document icon color
  const getDocumentColor = useCallback((docStatus) => {
    if (docStatus.verified && docStatus.available) return 'green';
    if (docStatus.available) return 'yellow';
    return 'gray';
  }, []);

  // ✅ Get document badge variant
  const getDocumentVariant = useCallback((docStatus) => {
    if (docStatus.verified && docStatus.available) return 'success';
    if (docStatus.available) return 'warning';
    return 'default';
  }, []);

  // ✅ Handle connect to DigiLocker
  const connectToDigilocker = useCallback(async () => {
    setStage('fetching');
    setConnectionStatus('connecting');
    setErrors(null);

    // ✅ Call stage change callback
    if (onStageChange) {
      onStageChange('fetching');
    }

    if (banking?.updateKYCStage) {
      banking.updateKYCStage('fetching');
    }

    try {
      // ✅ Simulate DigiLocker connection and document fetch
      const steps = [
        { progress: 20, label: 'Authenticating...', delay: simulateDelay ? 1000 : 100 },
        { progress: 40, label: 'Connecting to DigiLocker...', delay: simulateDelay ? 1500 : 100 },
        { progress: 60, label: 'Fetching documents...', delay: simulateDelay ? 2000 : 100 },
        { progress: 80, label: 'Verifying documents...', delay: simulateDelay ? 1500 : 100 },
        { progress: 100, label: 'Finalizing...', delay: simulateDelay ? 1000 : 100 },
      ];

      for (const step of steps) {
        setProgress(step.progress);
        await new Promise(resolve => setTimeout(resolve, step.delay));
      }

      // ✅ Simulate fetched documents
      const fetchedDocuments = {
        pan: { 
          available: true, 
          verified: true, 
          issueDate: '2018-03-15',
          number: 'ABCDE1234F',
          status: 'Valid',
        },
        aadhaar: { 
          available: true, 
          verified: true, 
          issueDate: '2016-08-22',
          number: '****-****-1234',
          status: 'Valid',
        },
        drivingLicense: { 
          available: false, 
          verified: false,
          status: 'Not Available',
        },
        passport: { 
          available: false, 
          verified: false,
          status: 'Not Available',
        },
      };

      setDocuments(fetchedDocuments);
      setConnectionStatus('connected');

      // ✅ Call document fetch callback
      if (onDocumentFetch) {
        onDocumentFetch(fetchedDocuments);
      }

      if (banking?.addNotification) {
        banking.addNotification({
          type: 'success',
          message: 'Documents fetched successfully from DigiLocker!',
          duration: 2000,
        });
      }

      setStage('review');
      if (onStageChange) {
        onStageChange('review');
      }
    } catch (err) {
      setErrors('Failed to fetch documents from DigiLocker. Please try again.');
      setConnectionStatus('error');
      setStage('connect');

      if (banking?.addNotification) {
        banking.addNotification({
          type: 'error',
          message: 'Failed to connect to DigiLocker',
          duration: 3000,
        });
      }
    }
  }, [simulateDelay, onStageChange, onDocumentFetch, banking]);

  // ✅ Handle approve documents
  const handleApprove = useCallback(async () => {
    try {
      if (simulateDelay) {
        await new Promise(resolve => setTimeout(resolve, 1500));
      }

      setStage('completed');
      if (onStageChange) {
        onStageChange('completed');
      }

      if (banking?.updateKYCStage) {
        banking.updateKYCStage('completed');
      }

      // ✅ Call completion callback
      setTimeout(() => {
        const completionData = {
          method: 'DigiLocker KYC',
          verified: true,
          documentsVerified: processedDocuments?.totalVerified || 2,
          timestamp: new Date().toISOString(),
          documents: processedDocuments,
        };

        if (onComplete) {
          onComplete(completionData);
        }

        if (banking?.addNotification) {
          banking.addNotification({
            type: 'success',
            message: 'KYC verification completed successfully!',
            duration: 2000,
          });
        }
      }, 2000);
    } catch (err) {
      setErrors('Failed to complete KYC. Please try again.');
      if (banking?.addNotification) {
        banking.addNotification({
          type: 'error',
          message: 'Failed to complete KYC',
          duration: 3000,
        });
      }
    }
  }, [simulateDelay, processedDocuments, onStageChange, onComplete, banking]);

  // ✅ Handle refetch
  const handleRefetch = useCallback(async () => {
    setProgress(0);
    setDocuments(null);
    setErrors(null);
    setConnectionStatus('idle');
    setStage('connect');
  }, []);

  // ✅ Handle download document
  const handleDownloadDocument = useCallback((docName) => {
    if (banking?.addNotification) {
      banking.addNotification({
        type: 'success',
        message: `${docName} downloaded successfully!`,
        duration: 2000,
      });
    }
  }, [banking]);

  return (
    <div className="space-y-6">
      {/* Connect Stage */}
      {stage === 'connect' && (
        <>
          <div>
            <h3 className="text-2xl font-bold text-gray-800 mb-2 flex items-center gap-2">
              <FileText className="text-purple-600" size={28} />
              DigiLocker KYC Verification
            </h3>
            <p className="text-gray-600">
              Fetch your verified documents directly from DigiLocker
            </p>
          </div>

          <StatusBox
            type="info"
            title="Government of India Service"
            message="DigiLocker is a secure cloud-based platform for storing and sharing documents issued by the Government of India."
          />

          {/* ✅ Error alert */}
          {errors && (
            <Alert 
              type="error"
              message={errors}
              dismissible={true}
              onDismiss={() => setErrors(null)}
            />
          )}

          <div className="bg-white rounded-lg shadow-lg p-8">
            <div className="text-center mb-6">
              <div className="w-20 h-20 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <FileText className="text-purple-600" size={40} />
              </div>
              <h4 className="text-lg font-bold text-gray-800 mb-2">
                Connect to DigiLocker
              </h4>
              <p className="text-sm text-gray-600">
                You'll be redirected to DigiLocker to authenticate and authorize document access
              </p>
            </div>

            {/* ✅ Documents list */}
            <div className="bg-purple-50 rounded-lg p-6 mb-6">
              <h5 className="font-semibold text-purple-900 mb-3">
                Documents We'll Fetch:
              </h5>
              <div className="space-y-2 text-sm text-purple-800">
                <div className="flex items-center gap-2">
                  <CheckCircle size={16} className="text-purple-600" />
                  <span>PAN Card (Required)</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle size={16} className="text-purple-600" />
                  <span>Aadhaar Card (Required)</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle size={16} className="text-purple-600" />
                  <span>Driving License (Optional)</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle size={16} className="text-purple-600" />
                  <span>Passport (Optional)</span>
                </div>
              </div>
            </div>

            {/* ✅ Security info */}
            <div className="bg-green-50 rounded-lg p-4 border border-green-200 mb-6">
              <h5 className="font-semibold text-green-900 mb-2 flex items-center gap-2">
                <Shield size={18} />
                100% Secure
              </h5>
              <ul className="space-y-1 text-sm text-green-800">
                <li>✓ Your documents are fetched directly from government servers</li>
                <li>✓ All documents are digitally signed and verified</li>
                <li>✓ No manual uploads required</li>
                <li>✓ Instant verification</li>
              </ul>
            </div>

            <div className="flex gap-3 flex-wrap">
              <Button 
                variant="primary" 
                onClick={connectToDigilocker} 
                fullWidth
                disabled={connectionStatus === 'connecting'}
              >
                <span className="flex items-center justify-center gap-2">
                  <ExternalLink size={20} />
                  {connectionStatus === 'connecting' ? 'Connecting...' : 'Connect to DigiLocker'}
                </span>
              </Button>
              <Button variant="outline" onClick={onCancel}>
                Cancel
              </Button>
            </div>
          </div>
        </>
      )}

      {/* Fetching Stage */}
      {stage === 'fetching' && (
        <div className="bg-white rounded-lg shadow-lg p-8">
          <div className="text-center mb-6">
            <div className="w-20 h-20 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <FileText className="text-purple-600 animate-pulse" size={40} />
            </div>
            <h3 className="text-xl font-bold text-gray-800 mb-2">
              Fetching Documents from DigiLocker...
            </h3>
            <p className="text-gray-600">Please wait while we retrieve your documents</p>
          </div>

          <ProgressBar 
            progress={progress} 
            text={`Connecting to DigiLocker... ${progress}%`}
            color="purple"
            height="lg"
            showStatus={true}
          />

          {/* ✅ Fetch progress steps */}
          <div className="mt-6 space-y-3">
            <div className={`flex items-center justify-between p-3 rounded-lg transition-all ${progress >= 30 ? 'bg-purple-50' : 'bg-gray-50'}`}>
              <span className={`text-sm ${progress >= 30 ? 'text-purple-800 font-medium' : 'text-gray-600'}`}>
                Authenticating...
              </span>
              {progress >= 30 && <Badge variant="success" size="sm">Done</Badge>}
            </div>
            <div className={`flex items-center justify-between p-3 rounded-lg transition-all ${progress >= 60 ? 'bg-purple-50' : 'bg-gray-50'}`}>
              <span className={`text-sm ${progress >= 60 ? 'text-purple-800 font-medium' : 'text-gray-600'}`}>
                Fetching PAN & Aadhaar...
              </span>
              {progress >= 60 && <Badge variant="success" size="sm">Done</Badge>}
            </div>
            <div className={`flex items-center justify-between p-3 rounded-lg transition-all ${progress >= 90 ? 'bg-purple-50' : 'bg-gray-50'}`}>
              <span className={`text-sm ${progress >= 90 ? 'text-purple-800 font-medium' : 'text-gray-600'}`}>
                Verifying documents...
              </span>
              {progress >= 90 && <Badge variant="success" size="sm">Done</Badge>}
            </div>
          </div>
        </div>
      )}

      {/* Review Stage */}
      {stage === 'review' && processedDocuments && (
        <>
          <div>
            <h3 className="text-2xl font-bold text-gray-800 mb-2">
              Review Fetched Documents
            </h3>
            <p className="text-gray-600">
              Please review the documents fetched from your DigiLocker
            </p>
          </div>

          <StatusBox
            type="success"
            message={`✓ Documents successfully fetched from DigiLocker and verified! (${processedDocuments.totalVerified} documents verified)`}
          />

          <div className="bg-white rounded-lg shadow-lg p-6">
            <h4 className="font-semibold text-gray-800 mb-4">Available Documents</h4>
            
            <div className="space-y-3">
              {/* ✅ Dynamic document rendering */}
              {Object.entries(processedDocuments).map(([docKey, docStatus]) => {
                if (docKey === 'totalVerified' || docKey === 'totalAvailable') return null;

                const docName = docKey.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase());
                const color = getDocumentColor(docStatus);

                return (
                  <div 
                    key={docKey}
                    className={`flex items-center justify-between p-4 rounded-lg border ${
                      docStatus.verified && docStatus.available 
                        ? 'bg-green-50 border-green-200' 
                        : 'bg-gray-50 border-gray-200'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${
                        color === 'green' ? 'bg-green-100' :
                        color === 'yellow' ? 'bg-yellow-100' :
                        'bg-gray-100'
                      }`}>
                        <FileText 
                          className={`${
                            color === 'green' ? 'text-green-600' :
                            color === 'yellow' ? 'text-yellow-600' :
                            'text-gray-600'
                          }`}
                          size={24} 
                        />
                      </div>
                      <div>
                        <p className="font-semibold text-gray-800">{docName}</p>
                        <p className="text-sm text-gray-600">
                          {docStatus.available ? `Issued: ${docStatus.issueDate}` : 'Not available in DigiLocker'}
                        </p>
                      </div>
                    </div>

                    {/* ✅ Document actions */}
                    <div className="flex items-center gap-2">
                      {docStatus.verified && docStatus.available && (
                        <>
                          <Badge variant={getDocumentVariant(docStatus)}>
                            {docStatus.status || 'Verified'}
                          </Badge>
                          <button 
                            onClick={() => handleDownloadDocument(docName)}
                            className="p-2 hover:bg-green-100 rounded transition-colors"
                            title={`Download ${docName}`}
                          >
                            <Download size={18} className="text-green-600" />
                          </button>
                        </>
                      )}
                      {!docStatus.available && (
                        <Badge variant="default">Not Available</Badge>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* ✅ Note */}
            <div className="mt-6 bg-blue-50 rounded-lg p-4 border border-blue-200">
              <p className="text-sm text-blue-800">
                <strong>Note:</strong> All documents are digitally signed by the issuing authority 
                and have been verified successfully. You can proceed with your application.
              </p>
            </div>
          </div>

          <div className="flex gap-3 flex-wrap">
            <Button variant="primary" onClick={handleApprove} fullWidth>
              Confirm & Complete KYC
            </Button>
            <Button variant="outline" onClick={handleRefetch} fullWidth>
              Refetch Documents
            </Button>
          </div>
        </>
      )}

      {/* Completed Stage */}
      {stage === 'completed' && (
        <div className="bg-white rounded-lg shadow-lg p-8">
          <div className="text-center">
            <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6 animate-bounce">
              <CheckCircle className="text-green-600" size={56} />
            </div>
            <h3 className="text-2xl font-bold text-green-600 mb-2">
              DigiLocker KYC Successful!
            </h3>
            <p className="text-gray-600 mb-6">
              Your documents have been verified using DigiLocker
            </p>

            {/* ✅ Verification summary */}
            <div className="bg-green-50 rounded-lg p-6 mb-6">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-gray-600">Verification Method</p>
                  <p className="font-bold text-gray-800">DigiLocker KYC</p>
                </div>
                <div>
                  <p className="text-gray-600">Status</p>
                  <Badge variant="success">Verified</Badge>
                </div>
                <div>
                  <p className="text-gray-600">Documents Verified</p>
                  <p className="font-bold text-gray-800">
                    {processedDocuments?.totalVerified || 2} Documents
                  </p>
                </div>
                <div>
                  <p className="text-gray-600">Timestamp</p>
                  <p className="font-bold text-gray-800">{new Date().toLocaleString()}</p>
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

export default DigilockerKYC;
