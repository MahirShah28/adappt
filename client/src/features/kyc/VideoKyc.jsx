import React from 'react';
import { Card, Badge, Button } from '../../components/common/Index';
import { Video, Fingerprint, FileText, Database, Shield, Clock } from 'lucide-react';

const KYCMethodSelector = ({ onSelectMethod }) => {
  const kycMethods = [
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
    },
  ];

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

      {/* Info Banner */}
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

      {/* Methods Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {kycMethods.map((method) => {
          const Icon = method.icon;
          
          return (
            <Card
              key={method.id}
              className="relative hover:shadow-xl transition-all duration-300 border-2 hover:border-blue-400"
            >
              {method.recommended && (
                <div className="absolute -top-3 right-4">
                  <Badge variant="success">✨ Recommended</Badge>
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

                {/* Action Button */}
                <Button
                  variant={method.recommended ? 'primary' : 'outline'}
                  size="md"
                  onClick={() => onSelectMethod(method.id)}
                  fullWidth
                >
                  Start {method.name}
                </Button>
              </div>
            </Card>
          );
        })}
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
    </div>
  );
};

export default KYCMethodSelector;
