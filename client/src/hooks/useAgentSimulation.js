import { useState, useCallback, useRef } from 'react';
import DataCollectionAgent from '../agents/DataCollectionAgent';
import FeatureEngineeringAgent from '../agents/FeatureEngineeringAgent';
import CreditScoringAgent from '../agents/CreditScoringAgent';
import RiskAssessmentAgent from '../agents/RiskAssessmentAgent';
import DecisionEngineAgent from '../agents/DecisionEngineAgent';
import ComplianceAgent from '../agents/ComplianceAgent';
import RBIKYCAgent from '../agents/RBIKYCAgent';
import MLModelAgent from '../agents/MLModelAgent';

/**
 * Custom hook for multi-agent loan decision simulation
 * Orchestrates all agents through the credit decision pipeline
 */
function useAgentSimulation() {
  const [isProcessing, setIsProcessing] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [agents, setAgents] = useState([
    { name: 'Data Collection Agent', description: 'Collecting borrower data...', status: 'pending' },
    { name: 'Feature Engineering Agent', description: 'Engineering ML features...', status: 'pending' },
    { name: 'Credit Scoring Agent', description: 'Calculating credit score...', status: 'pending' },
    { name: 'Risk Assessment Agent', description: 'Assessing risk levels...', status: 'pending' },
    { name: 'Decision Engine Agent', description: 'Making lending decision...', status: 'pending' },
    { name: 'Compliance Agent', description: 'Checking RBI compliance...', status: 'pending' },
  ]);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  // Agent instances
  const agentsRef = useRef({
    dataCollection: new DataCollectionAgent(),
    featureEngineering: new FeatureEngineeringAgent(),
    creditScoring: new CreditScoringAgent(),
    riskAssessment: new RiskAssessmentAgent(),
    decisionEngine: new DecisionEngineAgent(),
    compliance: new ComplianceAgent(),
    rbiKyc: new RBIKYCAgent(),
    mlModel: new MLModelAgent(),
  });

  /**
   * Update agent status
   */
  const updateAgentStatus = useCallback((index, status) => {
    setAgents(prev => {
      const updated = [...prev];
      updated[index].status = status;
      return updated;
    });
  }, []);

  /**
   * Run the complete agent simulation pipeline
   */
  const runAgentSimulation = useCallback(async (formData) => {
    try {
      setIsProcessing(true);
      setError(null);
      setResult(null);
      setCurrentStep(0);

      const agents = agentsRef.current;
      const pipelineResult = {
        steps: {},
        decision: null,
      };

      // Step 1: Data Collection Agent
      console.log('🔹 Step 1: Data Collection Agent');
      setCurrentStep(0);
      updateAgentStatus(0, 'processing');
      await new Promise(resolve => setTimeout(resolve, 1000));

      const aggregatedData = agents.dataCollection.aggregateData(
        formData,
        formData.aaData || null
      );
      const validation = agents.dataCollection.validateData(aggregatedData.personal);

      if (!validation.isValid) {
        setError(`Validation failed: ${validation.errors.join(', ')}`);
        setIsProcessing(false);
        return;
      }

      pipelineResult.steps.dataCollection = aggregatedData;
      updateAgentStatus(0, 'complete');
      await new Promise(resolve => setTimeout(resolve, 500));

      // Step 2: Feature Engineering Agent
      console.log('🔹 Step 2: Feature Engineering Agent');
      setCurrentStep(1);
      updateAgentStatus(1, 'processing');
      await new Promise(resolve => setTimeout(resolve, 1500));

      const engineeredFeatures = agents.featureEngineering.engineerFeatures(aggregatedData);
      pipelineResult.steps.featureEngineering = engineeredFeatures;
      updateAgentStatus(1, 'complete');
      await new Promise(resolve => setTimeout(resolve, 500));

      // Step 3: Credit Scoring Agent
      console.log('🔹 Step 3: Credit Scoring Agent');
      setCurrentStep(2);
      updateAgentStatus(2, 'processing');
      await new Promise(resolve => setTimeout(resolve, 1500));

      const creditScore = agents.creditScoring.calculateCreditScore(engineeredFeatures);
      const scoringReport = agents.creditScoring.generateScoringReport(engineeredFeatures);
      pipelineResult.steps.creditScoring = {
        score: creditScore,
        report: scoringReport,
      };
      updateAgentStatus(2, 'complete');
      await new Promise(resolve => setTimeout(resolve, 500));

      // Step 4: Risk Assessment Agent
      console.log('🔹 Step 4: Risk Assessment Agent');
      setCurrentStep(3);
      updateAgentStatus(3, 'processing');
      await new Promise(resolve => setTimeout(resolve, 1500));

      const riskReport = agents.riskAssessment.generateRiskReport(
        creditScore,
        engineeredFeatures,
        aggregatedData.personal.occupation,
        engineeredFeatures.loanAmount
      );
      pipelineResult.steps.riskAssessment = riskReport;
      updateAgentStatus(3, 'complete');
      await new Promise(resolve => setTimeout(resolve, 500));

      // Step 5: Decision Engine Agent
      console.log('🔹 Step 5: Decision Engine Agent');
      setCurrentStep(4);
      updateAgentStatus(4, 'processing');
      await new Promise(resolve => setTimeout(resolve, 1500));

      // Default lending policies
      const policies = {
        minCreditScore: 400,
        maxDTI: 60,
        maxPD: 5.0,
        minRepaymentCapacity: 10,
      };

      const decision = agents.decisionEngine.makeDecision(
        creditScore,
        riskReport,
        engineeredFeatures,
        policies
      );

      const decisionDocument = agents.decisionEngine.generateDecisionDocument(
        decision,
        creditScore,
        riskReport,
        engineeredFeatures,
        {
          amount: engineeredFeatures.loanAmount,
          tenure: engineeredFeatures.loanTenure,
        }
      );

      pipelineResult.steps.decisionEngine = decisionDocument;
      pipelineResult.decision = decision;
      updateAgentStatus(4, 'complete');
      await new Promise(resolve => setTimeout(resolve, 500));

      // Step 6: Compliance Agent
      console.log('🔹 Step 6: Compliance Agent');
      setCurrentStep(5);
      updateAgentStatus(5, 'processing');
      await new Promise(resolve => setTimeout(resolve, 1500));

      const complianceReport = agents.compliance.generateComplianceReport(
        engineeredFeatures,
        decision,
        {
          amount: engineeredFeatures.loanAmount,
          tenure: engineeredFeatures.loanTenure,
        }
      );
      pipelineResult.steps.compliance = complianceReport;
      updateAgentStatus(5, 'complete');

      // Set final result
      setResult(pipelineResult);
      console.log('✅ Pipeline Complete:', pipelineResult);
    } catch (err) {
      console.error('Agent simulation error:', err);
      setError(err.message);
      updateAgentStatus(currentStep, 'error');
    } finally {
      setIsProcessing(false);
    }
  }, [currentStep, updateAgentStatus]);

  /**
   * Reset simulation
   */
  const resetSimulation = useCallback(() => {
    setIsProcessing(false);
    setCurrentStep(0);
    setAgents(prev => prev.map(agent => ({ ...agent, status: 'pending' })));
    setResult(null);
    setError(null);
  }, []);

  return {
    isProcessing,
    currentStep,
    agents,
    result,
    error,
    runAgentSimulation,
    resetSimulation,
  };
}

export default useAgentSimulation;
