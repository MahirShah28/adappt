/**
 * vcipSimulator.js
 * Simulates Video KYC (V-CIP) verification process
 * Mimics RBI-compliant Video Call In Person verification
 */

class VCIPSimulator {
  constructor() {
    this.name = 'VCIP Simulator';
    this.officers = [
      { id: 'VKO-001', name: 'Rajesh Kumar', rating: 4.8 },
      { id: 'VKO-002', name: 'Priya Singh', rating: 4.9 },
      { id: 'VKO-003', name: 'Arun Sharma', rating: 4.7 },
    ];
  }

  /**
   * Initiate video call session
   */
  async initiateVideoCall(borrowerData) {
    console.log('📹 Initiating Video KYC Call...');

    const officer = this.officers[Math.floor(Math.random() * this.officers.length)];
    const sessionId = `VCIP_${Date.now()}_${Math.random().toString(36).substring(7)}`;

    await new Promise(resolve => setTimeout(resolve, 2000));

    return {
      sessionId,
      officer: officer.name,
      officerId: officer.id,
      status: 'connected',
      timestamp: new Date().toISOString(),
      streamKey: `stream_${sessionId}`,
    };
  }

  /**
   * Simulate document verification steps
   */
  async verifyDocuments(sessionId, documents) {
    console.log('🔍 Verifying documents...');

    const steps = [
      { step: 'PAN Verification', status: 'verifying' },
      { step: 'Aadhaar Verification', status: 'verifying' },
      { step: 'Face Matching', status: 'verifying' },
      { step: 'Address Verification', status: 'verifying' },
    ];

    const verificationResults = [];

    for (const step of steps) {
      await new Promise(resolve => setTimeout(resolve, 1500));

      verificationResults.push({
        ...step,
        status: 'verified',
        confidence: 90 + Math.random() * 10,
        timestamp: new Date().toISOString(),
      });
    }

    return {
      sessionId,
      allVerified: true,
      verifications: verificationResults,
      completedAt: new Date().toISOString(),
    };
  }

  /**
   * Simulate live interaction with officer
   */
  async conductInteraction(sessionId, interactionType) {
    console.log('💬 Conducting interaction...');

    const interactions = {
      face_match: {
        description: 'Face matching with documents',
        duration: 30,
        questions: [
          'Please look at the camera',
          'Please turn your head left',
          'Please turn your head right',
          'Please smile',
        ],
      },
      identity_check: {
        description: 'Identity verification questions',
        duration: 60,
        questions: [
          'What is your date of birth?',
          'What is your address on Aadhaar?',
          'Can you confirm your PAN details?',
        ],
      },
      document_review: {
        description: 'Document review and validation',
        duration: 45,
        questions: [
          'Can you show your PAN Card?',
          'Can you show your Aadhaar Card?',
          'Can you confirm the information?',
        ],
      },
    };

    const interaction = interactions[interactionType] || interactions.face_match;

    await new Promise(resolve => setTimeout(resolve, interaction.duration * 100));

    return {
      sessionId,
      interactionType,
      description: interaction.description,
      questionsAsked: interaction.questions.length,
      responsesReceived: interaction.questions.length,
      interactionStatus: 'completed',
      completedAt: new Date().toISOString(),
    };
  }

  /**
   * Complete VCIP flow
   */
  async completeVCIPFlow(borrowerData, documents) {
    try {
      console.log('🚀 Starting VCIP Flow...');

      // Step 1: Initiate call
      const call = await this.initiateVideoCall(borrowerData);

      // Step 2: Verify documents
      const docVerification = await this.verifyDocuments(call.sessionId, documents);

      // Step 3: Face matching
      const faceMatch = await this.conductInteraction(call.sessionId, 'face_match');

      // Step 4: Identity check
      const identityCheck = await this.conductInteraction(call.sessionId, 'identity_check');

      // Step 5: Document review
      const docReview = await this.conductInteraction(call.sessionId, 'document_review');

      return {
        success: true,
        sessionId: call.sessionId,
        officer: call.officer,
        kycVerificationId: `KYC_${Date.now()}`,
        verificationStatus: 'completed',
        documentVerification: docVerification,
        faceMatching: faceMatch,
        identityVerification: identityCheck,
        documentReview: docReview,
        overallStatus: 'KYC_VERIFIED',
        certificateNumber: `VCIP_CERT_${Date.now()}`,
        verifiedAt: new Date().toISOString(),
      };
    } catch (error) {
      console.error('VCIP Error:', error);
      return {
        success: false,
        error: error.message,
      };
    }
  }
}

export default VCIPSimulator;
