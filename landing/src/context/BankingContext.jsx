import React, { createContext, useState, useCallback, useEffect } from 'react';

/**
 * BankingContext
 * Global state management for the entire banking application
 * Manages user profile, loan applications, KYC data, and decisions
 */
export const BankingContext = createContext();

export const BankingProvider = ({ children }) => {
  // ==================== USER STATE ====================
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userLoading, setUserLoading] = useState(false);

  // ==================== ACCOUNT STATE ====================
  const [bankAccount, setBankAccount] = useState(null);
  const [accountCreationProgress, setAccountCreationProgress] = useState(0);

  // ==================== LOAN APPLICATION STATE ====================
  const [currentLoanApplication, setCurrentLoanApplication] = useState(null);
  const [loanApplications, setLoanApplications] = useState([]);
  const [activeLoanId, setActiveLoanId] = useState(null);

  // ==================== KYC STATE ====================
  const [kycStatus, setKycStatus] = useState({
    isVerified: false,
    method: null,
    completedAt: null,
  });
  const [kycDocuments, setKycDocuments] = useState({});

  // ==================== CREDIT DECISION STATE ====================
  const [creditDecision, setCreditDecision] = useState(null);
  const [decisionLoading, setDecisionLoading] = useState(false);

  // ==================== FINANCIAL DATA STATE ====================
  const [financialData, setFinancialData] = useState({
    monthlyIncome: 0,
    monthlyExpenses: 0,
    savings: 0,
    existingLoans: [],
    existingEmi: 0,
  });

  // ==================== ALTERNATIVE DATA STATE ====================
  const [alternativeData, setAlternativeData] = useState({
    digitalScore: 50,
    psychometricScore: 50,
    trustScore: 50,
    aaData: null,
  });

  // ==================== MONITORING STATE ====================
  const [activeLoans, setActiveLoans] = useState([]);
  const [paymentSchedule, setPaymentSchedule] = useState(null);
  const [riskAlerts, setRiskAlerts] = useState([]);

  // ==================== SAVINGS & GOALS STATE ====================
  const [savingsGoals, setSavingsGoals] = useState([]);
  const [spendingData, setSpendingData] = useState({
    categories: [],
    monthlyTotal: 0,
  });

  // ==================== ANALYTICS STATE ====================
  const [analyticsMetrics, setAnalyticsMetrics] = useState({
    totalBorrowers: 0,
    totalDisbursed: 0,
    approvalRate: 0,
    defaultRate: 0,
  });

  // ==================== UI STATE ====================
  const [theme, setTheme] = useState('light');
  const [notifications, setNotifications] = useState([]);
  const [sidebarOpen, setSidebarOpen] = useState(true);

  // ==================== ERROR STATE ====================
  const [errorMessage, setErrorMessage] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);

  // ==================== USER AUTHENTICATION ====================
  const loginUser = useCallback((userData) => {
    setUser(userData);
    setIsAuthenticated(true);
    localStorage.setItem('user', JSON.stringify(userData));
  }, []);

  const logoutUser = useCallback(() => {
    setUser(null);
    setIsAuthenticated(false);
    setBankAccount(null);
    setCurrentLoanApplication(null);
    setLoanApplications([]);
    setKycStatus({ isVerified: false, method: null, completedAt: null });
    setCreditDecision(null);
    localStorage.removeItem('user');
  }, []);

  const updateUserProfile = useCallback((updates) => {
    setUser(prev => ({
      ...prev,
      ...updates,
    }));
    if (user) {
      localStorage.setItem('user', JSON.stringify({ ...user, ...updates }));
    }
  }, [user]);

  // ==================== ACCOUNT MANAGEMENT ====================
  const createBankAccount = useCallback((accountDetails) => {
    setBankAccount({
      accountNumber: accountDetails.accountNumber,
      ifscCode: accountDetails.ifscCode,
      bankName: accountDetails.bankName,
      customerId: accountDetails.customerId,
      createdAt: new Date().toISOString(),
      status: 'active',
    });
    localStorage.setItem('bankAccount', JSON.stringify(accountDetails));
  }, []);

  const updateAccountCreationProgress = useCallback((progress) => {
    setAccountCreationProgress(progress);
  }, []);

  // ==================== LOAN APPLICATION MANAGEMENT ====================
  const initiateLoanApplication = useCallback((loanData) => {
    const applicationId = `LA_${Date.now()}`;
    const newApplication = {
      id: applicationId,
      status: 'initiated',
      createdAt: new Date().toISOString(),
      ...loanData,
    };
    setCurrentLoanApplication(newApplication);
    setLoanApplications(prev => [newApplication, ...prev]);
    return applicationId;
  }, []);

  const updateLoanApplication = useCallback((updates) => {
    setCurrentLoanApplication(prev => ({
      ...prev,
      ...updates,
      updatedAt: new Date().toISOString(),
    }));
  }, []);

  const completeLoanApplication = useCallback((loanData) => {
    const updatedApplication = {
      ...currentLoanApplication,
      ...loanData,
      status: 'submitted',
      submittedAt: new Date().toISOString(),
    };
    setCurrentLoanApplication(updatedApplication);
    setLoanApplications(prev =>
      prev.map(app => (app.id === updatedApplication.id ? updatedApplication : app))
    );
  }, [currentLoanApplication]);

  const getLoanApplicationById = useCallback((id) => {
    return loanApplications.find(app => app.id === id);
  }, [loanApplications]);

  // ==================== KYC MANAGEMENT ====================
  const updateKYCStatus = useCallback((method, isVerified = true) => {
    setKycStatus({
      isVerified,
      method,
      completedAt: isVerified ? new Date().toISOString() : null,
    });
    localStorage.setItem('kycStatus', JSON.stringify({ isVerified, method }));
  }, []);

  const saveKYCDocuments = useCallback((documents) => {
    setKycDocuments(prev => ({
      ...prev,
      ...documents,
    }));
  }, []);

  // ==================== CREDIT DECISION MANAGEMENT ====================
  const setCreditDecisionResult = useCallback((decision) => {
    setCreditDecision({
      ...decision,
      decidedAt: new Date().toISOString(),
    });
    
    // Update current loan application with decision
    if (currentLoanApplication) {
      updateLoanApplication({
        decision,
        status: 'decision_made',
      });
    }
  }, [currentLoanApplication, updateLoanApplication]);

  const setDecisionProcessing = useCallback((isProcessing) => {
    setDecisionLoading(isProcessing);
  }, []);

  // ==================== FINANCIAL DATA MANAGEMENT ====================
  const updateFinancialData = useCallback((data) => {
    setFinancialData(prev => ({
      ...prev,
      ...data,
    }));
  }, []);

  const updateAlternativeData = useCallback((data) => {
    setAlternativeData(prev => ({
      ...prev,
      ...data,
    }));
  }, []);

  // ==================== LOAN MONITORING ====================
  const fetchActiveLoans = useCallback(() => {
    // Simulate fetching active loans
    const mockLoans = [
      {
        id: 'L001',
        loanId: 'L001',
        amount: 50000,
        emi: 4500,
        nextDueDate: '2025-11-15',
        status: 'active',
        paidEMIs: 6,
        totalEMIs: 12,
      },
      {
        id: 'L002',
        loanId: 'L002',
        amount: 75000,
        emi: 6800,
        nextDueDate: '2025-11-10',
        status: 'active',
        paidEMIs: 8,
        totalEMIs: 12,
      },
    ];
    setActiveLoans(mockLoans);
  }, []);

  const updatePaymentSchedule = useCallback((schedule) => {
    setPaymentSchedule(schedule);
  }, []);

  const addRiskAlert = useCallback((alert) => {
    setRiskAlerts(prev => [alert, ...prev]);
  }, []);

  const dismissRiskAlert = useCallback((alertId) => {
    setRiskAlerts(prev => prev.filter(alert => alert.id !== alertId));
  }, []);

  // ==================== SAVINGS & GOALS MANAGEMENT ====================
  const addSavingsGoal = useCallback((goal) => {
    const newGoal = {
      id: `SG_${Date.now()}`,
      createdAt: new Date().toISOString(),
      ...goal,
    };
    setSavingsGoals(prev => [...prev, newGoal]);
  }, []);

  const updateSavingsGoal = useCallback((goalId, updates) => {
    setSavingsGoals(prev =>
      prev.map(goal => (goal.id === goalId ? { ...goal, ...updates } : goal))
    );
  }, []);

  const deleteSavingsGoal = useCallback((goalId) => {
    setSavingsGoals(prev => prev.filter(goal => goal.id !== goalId));
  }, []);

  const updateSpendingData = useCallback((data) => {
    setSpendingData(data);
  }, []);

  // ==================== ANALYTICS ====================
  const updateAnalyticsMetrics = useCallback((metrics) => {
    setAnalyticsMetrics(prev => ({
      ...prev,
      ...metrics,
    }));
  }, []);

  // ==================== NOTIFICATIONS ====================
  const addNotification = useCallback((notification) => {
    const id = `notif_${Date.now()}`;
    const newNotification = {
      id,
      timestamp: new Date().toISOString(),
      ...notification,
    };
    setNotifications(prev => [newNotification, ...prev]);

    // Auto-remove after 5 seconds
    setTimeout(() => {
      removeNotification(id);
    }, 5000);

    return id;
  }, []);

  const removeNotification = useCallback((notificationId) => {
    setNotifications(prev => prev.filter(n => n.id !== notificationId));
  }, []);

  // ==================== MESSAGES ====================
  const setError = useCallback((message) => {
    setErrorMessage(message);
    setTimeout(() => setErrorMessage(null), 5000);
  }, []);

  const setSuccess = useCallback((message) => {
    setSuccessMessage(message);
    setTimeout(() => setSuccessMessage(null), 5000);
  }, []);

  // ==================== THEME ====================
  const toggleTheme = useCallback(() => {
    setTheme(prev => (prev === 'light' ? 'dark' : 'light'));
    localStorage.setItem('theme', theme === 'light' ? 'dark' : 'light');
  }, [theme]);

  // ==================== SIDEBAR ====================
  const toggleSidebar = useCallback(() => {
    setSidebarOpen(prev => !prev);
  }, []);

  // ==================== PERSISTENCE ====================
  useEffect(() => {
    // Load saved data on mount
    const savedUser = localStorage.getItem('user');
    const savedTheme = localStorage.getItem('theme');
    const savedAccount = localStorage.getItem('bankAccount');

    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser));
        setIsAuthenticated(true);
      } catch (error) {
        console.error('Error loading user:', error);
      }
    }

    if (savedTheme) {
      setTheme(savedTheme);
    }

    if (savedAccount) {
      try {
        setBankAccount(JSON.parse(savedAccount));
      } catch (error) {
        console.error('Error loading bank account:', error);
      }
    }
  }, []);

  // ==================== CONTEXT VALUE ====================
  const value = {
    // User
    user,
    isAuthenticated,
    userLoading,
    loginUser,
    logoutUser,
    updateUserProfile,

    // Account
    bankAccount,
    accountCreationProgress,
    createBankAccount,
    updateAccountCreationProgress,

    // Loan Application
    currentLoanApplication,
    loanApplications,
    activeLoanId,
    initiateLoanApplication,
    updateLoanApplication,
    completeLoanApplication,
    getLoanApplicationById,
    setActiveLoanId,

    // KYC
    kycStatus,
    kycDocuments,
    updateKYCStatus,
    saveKYCDocuments,

    // Credit Decision
    creditDecision,
    decisionLoading,
    setCreditDecisionResult,
    setDecisionProcessing,

    // Financial Data
    financialData,
    updateFinancialData,

    // Alternative Data
    alternativeData,
    updateAlternativeData,

    // Monitoring
    activeLoans,
    paymentSchedule,
    riskAlerts,
    fetchActiveLoans,
    updatePaymentSchedule,
    addRiskAlert,
    dismissRiskAlert,

    // Savings & Goals
    savingsGoals,
    spendingData,
    addSavingsGoal,
    updateSavingsGoal,
    deleteSavingsGoal,
    updateSpendingData,

    // Analytics
    analyticsMetrics,
    updateAnalyticsMetrics,

    // Notifications
    notifications,
    addNotification,
    removeNotification,

    // Messages
    errorMessage,
    successMessage,
    setError,
    setSuccess,

    // Theme & UI
    theme,
    toggleTheme,
    sidebarOpen,
    toggleSidebar,
  };

  return (
    <BankingContext.Provider value={value}>
      {children}
    </BankingContext.Provider>
  );
};

export default BankingContext;
