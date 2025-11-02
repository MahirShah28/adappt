import React, { useState } from 'react';
import { Header, Sidebar } from './components/layout/Index';
import {
  Dashboard,
  OpenAccount,
  LoanApplication,
  DecisionEngine,
  KYCVerification,
  FinancialHub,
  Monitoring,
  Analytics,
} from './pages/Index';

function App() {
  const [currentPage, setCurrentPage] = useState('Dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const renderPage = () => {
    switch (currentPage) {
      case 'Dashboard': return <Dashboard />;
      case 'OpenAccount': return <OpenAccount />;
      case 'LoanApplication': return <LoanApplication />;
      case 'DecisionEngine': return <DecisionEngine />;
      case 'KYCVerification': return <KYCVerification />;
      case 'FinancialHub': return <FinancialHub />;
      case 'Monitoring': return <Monitoring />;
      case 'Analytics': return <Analytics />;
      default: return <Dashboard />;
    }
  };

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar
        currentPage={currentPage}
        onPageChange={setCurrentPage}
        isOpen={sidebarOpen}
        onToggle={() => setSidebarOpen(!sidebarOpen)}
      />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />
        <main className="flex-1 overflow-auto p-8">
          {renderPage()}
        </main>
      </div>
    </div>
  );
}

export default App;
