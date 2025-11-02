import React, { useContext, useState, useMemo, useCallback } from 'react';
import { BankingContext } from '../../context/Index'; // ✅ Added
import { Card, Badge, Button, Alert } from '../../components/common/Index'; // ✅ Updated
import { Video, Fingerprint, FileText, Database, Shield, Clock, Info } from 'lucide-react'; // ✅ Added

/**
 * KYCMethodSelector Component
 * Display KYC verification method options and handle selection
 * 
 * @param {function} onSelectMethod - Method selection callback
 * @param {array} customMethods - Custom KYC methods (optional)
 * @param {string} userType - User type for method recommendations
 * @param {function} onMethodInfo - Method info click callback
 * @param {boolean} loading - Is data loading
 * @param {array} availableMethods - Restrict to available methods
 */
const KYCMethodSelector = ({ 
  onSelectMethod,
  customMethods = null, // ✅ Added
  userType = 'individual', // ✅ Added
  onMethodInfo = null, // ✅ Added
  loading = false, // ✅ Added
  availableMethods = null, // ✅ Added
}) => {
  // ✅ Get context
  const banking = useContext(BankingContext);

  // ✅ State management
  const [selectedMethod, setSelectedMethod] = useState(null); // ✅ Added
  const [expandedMethod, setExpandedMethod] = useState(null); // ✅ Added

  // ✅ Default KYC methods
  const defaultKYCMethods = [
    {
      id: 'video',
      name: 'Video KYC (V-CIP)',
      icon: Video,
      description: 'Live video call with KYC officer for identity verification',
      time: '5-10 minutes',
      compliance: 'RBI Compliant',
      features: [
        'Live video verification',
        'Real-time document check',
        'Instant approval',
        'No physical visit required'
      ],
      iconBg: 'bg-blue-100',
      iconColor: 'text-blue-600',
      recommended: true,
      successRate: '99.8%',
      requirements: ['Internet connection', 'Webcam', 'Valid document'],
      limitations: ['Requires real-time availability'],
      bestFor: ['Working professionals', 'Busy individuals'],
    },
    {
      id: 'biometric',
      name: 'Biometric eKYC',
      icon: Fingerprint,
      description: 'Aadhaar-based biometric verification using fingerprint or iris scan',
      time: '2-3 minutes',
      compliance: 'UIDAI Approved',
      features: [
        'Aadhaar authentication',
        'Biometric verification',
        'Fastest method',
        'Paperless process'
      ],
      iconBg: 'bg-green-100',
      iconColor: 'text-green-600',
      recommended: false,
      successRate: '98.5%',
      requirements: ['Aadhaar number', 'Linked mobile number', 'Aadhaar-linked biometrics'],
      limitations: ['Requires Aadhaar enrollment'],
      bestFor: ['Aadhaar holders', 'Quick verification needed'],
    },
    {
      id: 'digilocker',
      name: 'DigiLocker KYC',
      icon: FileText,
      description: 'Fetch verified documents directly from DigiLocker',
      time: '3-5 minutes',
      compliance: 'Govt. of India',
      features: [
        'Digital document access',
        'Government verified',
        'No document upload',
        'Secure & encrypted'
      ],
      iconBg: 'bg-purple-100',
      iconColor: 'text-purple-600',
      recommended: false,
      successRate: '99.2%',
      requirements: ['DigiLocker account', 'Government-issued documents'],
      limitations: ['Requires DigiLocker enrollment'],
      bestFor: ['Digital document owners', 'Tech-savvy users'],
    },
    {
      id: 'ckyc',
      name: 'CKYC Registry',
      icon: Database,
      description: 'Use existing KYC from Central KYC Records Registry',
      time: '1-2 minutes',
      compliance: 'RBI Compliant',
      features: [
        'Use existing KYC',
        'Fastest if registered',
        'No re-verification',
        'Centralized records'
      ],
      iconBg: 'bg-orange-100',
      iconColor: 'text-orange-600',
      recommended: false,
      successRate: '100%',
      requirements: ['Previous KYC registration', 'PAN number'],
      limitations: ['Only for existing KYC holders'],
      bestFor: ['Repeat customers', 'Previous KYC holders'],
    },
  ];

  // ✅ Get KYC methods
  const kycMethods = useMemo(() => {
    let methods = customMethods || defaultKYCMethods;

    // ✅ Filter by available methods if specified
    if (availableMethods && availableMethods.length > 0) {
      methods = methods.filter(m => availableMethods.includes(m.id));
    }

    // ✅ Update recommendations based on user type
    if (userType === 'salaried') {
      methods = methods.map(m => ({
        ...m,
        recommended: m.id === 'video' ? true : false,
      }));
    } else if (userType === 'aadhaar-enabled') {
      methods = methods.map(m => ({
        ...m,
        recommended: m.id === 'biometric' ? true : false,
      }));
    }

    return methods;
  }, [customMethods, userType, availableMethods]);

  // ✅ Handle method selection
  const handleSelectMethod = useCallback((methodId) => {
    setSelectedMethod(methodId);

    if (banking?.addNotification) {
      banking.addNotification({
        type: 'info',
        message: `Starting KYC process...`,
        duration: 2000,
      });
    }

    // ✅ Call callback with method details
    const selectedMethodData = kycMethods.find(m => m.id === methodId);
    
    if (onSelectMethod) {
      onSelectMethod(methodId, selectedMethodData);
    }

    if (banking?.selectKYCMethod) {
      banking.selectKYCMethod(methodId, selectedMethodData);
    }
  }, [kycMethods, onSelectMethod, banking]);

  // ✅ Handle method info
  const handleMethodInfo = useCallback((method) => {
    if (onMethodInfo) {
      onMethodInfo(method);
    } else if (banking?.showMethodInfo) {
      banking.showMethodInfo(method);
    }
  }, [onMethodInfo, banking]);

  // ✅ Get recommended method
  const recommendedMethod = useMemo(() => {
    return kycMethods.find(m => m.recommended);
  }, [kycMethods]);

  // ✅ Calculate best option for user
  const calculateMethodScore = useCallback((method) => {
    let score = 0;
    if (method.recommended) score += 40;
    if (method.id === 'video') score += 20;
    if (method.successRate && parseFloat(method.successRate) > 99) score += 10;
    return score;
  }, []);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center">
        <h3 className="text-2xl font-bold text-gray-800 mb-2">
          Choose Your KYC Verification Method
        </h3>
        <p className="text-gray-600">
          Select the most convenient method to verify your identity
        </p>
      </div>

      {/* ✅ Info Banner */}
      <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded-lg">
        <div className="flex items-start gap-3">
          <Shield className="text-blue-600 flex-shrink-0 mt-0.5" size={20} />
          <div>
            <p className="text-sm text-blue-800 font-medium mb-1">
              Why KYC is Required?
            </p>
            <p className="text-sm text-blue-700">
              As per RBI and SEBI guidelines, KYC verification is mandatory for opening 
              bank accounts and availing financial services. All methods are secure and 
              compliant with regulatory standards.
            </p>
          </div>
        </div>
      </div>

      {/* ✅ Recommended method highlight */}
      {recommendedMethod && (
        <Alert
          type="info"
          message={`💡 We recommend "${recommendedMethod.name}" for you - it's fast, secure, and widely accepted.`}
          dismissible={true}
        />
      )}

      {/* Methods Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {loading ? (
          // ✅ Loading state
          Array(4).fill(0).map((_, idx) => (
            <div key={idx} className="bg-gray-100 rounded-lg h-64 animate-pulse" />
          ))
        ) : (
          kycMethods.map((method) => {
            const Icon = method.icon;
            const isExpanded = expandedMethod === method.id;
            const methodScore = calculateMethodScore(method);
            
            return (
              <Card
                key={method.id}
                className={`relative hover:shadow-xl transition-all duration-300 border-2 cursor-pointer ${
                  isExpanded ? 'border-blue-400 ring-2 ring-blue-200' : 'hover:border-blue-400'
                } ${selectedMethod === method.id ? 'ring-2 ring-green-400' : ''}`}
                onClick={() => setExpandedMethod(isExpanded ? null : method.id)}
              >
                {/* ✅ Recommended badge */}
                {method.recommended && (
                  <div className="absolute -top-3 right-4">
                    <Badge variant="success">✨ Recommended</Badge>
                  </div>
                )}

                {/* ✅ Success rate badge */}
                {method.successRate && (
                  <div className="absolute top-4 right-4">
                    <Badge variant="info" size="sm">
                      {method.successRate} success rate
                    </Badge>
                  </div>
                )}

                <div className="space-y-4">
                  {/* Icon & Title */}
                  <div className="flex items-start gap-4">
                    <div className={`w-14 h-14 ${method.iconBg} rounded-lg flex items-center justify-center flex-shrink-0`}>
                      <Icon className={method.iconColor} size={28} />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-bold text-gray-800 text-lg mb-1">
                        {method.name}
                      </h4>
                      <p className="text-sm text-gray-600">
                        {method.description}
                      </p>
                    </div>
                  </div>

                  {/* Badges */}
                  <div className="flex gap-2 flex-wrap">
                    <Badge variant="info" size="sm">
                      <Clock size={12} className="inline mr-1" />
                      {method.time}
                    </Badge>
                    <Badge variant="success" size="sm">
                      <Shield size={12} className="inline mr-1" />
                      {method.compliance}
                    </Badge>
                  </div>

                  {/* Features */}
                  <div className="space-y-2">
                    {method.features.map((feature, idx) => (
                      <div key={idx} className="flex items-center gap-2 text-sm text-gray-700">
                        <span className="text-green-600 font-bold">✓</span>
                        <span>{feature}</span>
                      </div>
                    ))}
                  </div>

                  {/* ✅ Expanded details */}
                  {isExpanded && (
                    <div className="border-t pt-4 space-y-3">
                      {/* Requirements */}
                      {method.requirements && (
                        <div>
                          <p className="text-xs font-semibold text-gray-700 mb-2">Requirements:</p>
                          <ul className="text-xs text-gray-600 space-y-1">
                            {method.requirements.map((req, idx) => (
                              <li key={idx}>• {req}</li>
                            ))}
                          </ul>
                        </div>
                      )}

                      {/* Limitations */}
                      {method.limitations && method.limitations.length > 0 && (
                        <div>
                          <p className="text-xs font-semibold text-gray-700 mb-2">Limitations:</p>
                          <ul className="text-xs text-yellow-600 space-y-1">
                            {method.limitations.map((limit, idx) => (
                              <li key={idx}>⚠️ {limit}</li>
                            ))}
                          </ul>
                        </div>
                      )}

                      {/* Best for */}
                      {method.bestFor && (
                        <div>
                          <p className="text-xs font-semibold text-gray-700 mb-2">Best for:</p>
                          <div className="flex flex-wrap gap-1">
                            {method.bestFor.map((category, idx) => (
                              <Badge key={idx} variant="info" size="sm">
                                {category}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                  {/* ✅ Action Buttons */}
                  <div className="flex gap-2 pt-2">
                    <Button
                      variant={method.recommended ? 'primary' : 'outline'}
                      size="md"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleSelectMethod(method.id);
                      }}
                      fullWidth
                    >
                      Start {method.name}
                    </Button>
                    <Button
                      variant="ghost"
                      size="md"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleMethodInfo(method);
                      }}
                      title="Learn more"
                    >
                      <Info size={16} />
                    </Button>
                  </div>
                </div>
              </Card>
            );
          })
        )}
      </div>

      {/* Help Section */}
      <div className="bg-gray-50 rounded-lg p-6 border border-gray-200">
        <h4 className="font-semibold text-gray-800 mb-3">Need Help Choosing?</h4>
        <div className="space-y-2 text-sm text-gray-700">
          <p>
            <strong>Choose Video KYC</strong> if you want the most convenient and widely 
            accepted method with instant approval.
          </p>
          <p>
            <strong>Choose Biometric eKYC</strong> if you have your Aadhaar linked to your 
            mobile and want the fastest verification.
          </p>
          <p>
            <strong>Choose DigiLocker</strong> if you have your documents already stored 
            in DigiLocker.
          </p>
          <p>
            <strong>Choose CKYC</strong> if you've completed KYC with another financial 
            institution recently.
          </p>
        </div>
      </div>

      {/* ✅ Comparison table */}
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <h4 className="font-semibold text-gray-800 p-4 border-b">Quick Comparison</h4>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="px-4 py-2 text-left text-gray-700">Method</th>
                <th className="px-4 py-2 text-left text-gray-700">Time</th>
                <th className="px-4 py-2 text-left text-gray-700">Success Rate</th>
              </tr>
            </thead>
            <tbody>
              {kycMethods.map((method, idx) => (
                <tr key={method.id} className={idx % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                  <td className="px-4 py-2 text-gray-800 font-medium">{method.name}</td>
                  <td className="px-4 py-2 text-gray-600">{method.time}</td>
                  <td className="px-4 py-2">
                    <Badge variant={method.successRate && parseFloat(method.successRate) > 99 ? 'success' : 'warning'} size="sm">
                      {method.successRate}
                    </Badge>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default KYCMethodSelector;
