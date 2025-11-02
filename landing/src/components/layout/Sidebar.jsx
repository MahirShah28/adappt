import React from 'react';
import { 
  LayoutDashboard, 
  UserPlus, 
  FileText, 
  Brain, 
  Shield, 
  Wallet, 
  Activity, 
  BarChart3,
  ChevronLeft,
  ChevronRight 
} from 'lucide-react';

const Sidebar = ({ currentPage, onPageChange, isOpen, onToggle }) => {
  const menuItems = [
    { name: 'Dashboard', icon: LayoutDashboard, page: 'Dashboard' },
    { name: 'Open Bank Account', icon: UserPlus, page: 'OpenAccount' },
    { name: 'Loan Application', icon: FileText, page: 'LoanApplication' },
    { name: 'Decision Engine', icon: Brain, page: 'DecisionEngine' },
    { name: 'KYC Verification', icon: Shield, page: 'KYCVerification' },
    { name: 'Financial Hub', icon: Wallet, page: 'FinancialHub' },
    { name: 'Monitoring', icon: Activity, page: 'Monitoring' },
    { name: 'Analytics', icon: BarChart3, page: 'Analytics' },
  ];

  return (
    <>
      {/* Sidebar */}
      <aside
        className={`${
          isOpen ? 'w-64' : 'w-0'
        } bg-white shadow-lg transition-all duration-300 ease-in-out overflow-hidden border-r border-gray-200 flex flex-col`}
      >
        {/* Sidebar Content */}
        <div className="flex-1 overflow-y-auto py-6">
          <nav className="px-4 space-y-1">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentPage === item.page;

              return (
                <button
                  key={item.page}
                  onClick={() => onPageChange(item.page)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                    isActive
                      ? 'bg-blue-50 text-blue-600 font-semibold shadow-sm'
                      : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
                  }`}
                >
                  <Icon size={20} className={isActive ? 'text-blue-600' : 'text-gray-500'} />
                  <span className="text-sm">{item.name}</span>
                </button>
              );
            })}
          </nav>
        </div>

        {/* Sidebar Footer */}
        <div className="p-4 border-t border-gray-200">
          <div className="bg-blue-50 rounded-lg p-4">
            <p className="text-xs font-semibold text-blue-900 mb-1">
              Need Help?
            </p>
            <p className="text-xs text-blue-700">
              Contact support for assistance
            </p>
          </div>
        </div>
      </aside>

      {/* Toggle Button */}
      <button
        onClick={onToggle}
        className="fixed left-0 top-1/2 -translate-y-1/2 z-50 bg-white shadow-lg rounded-r-lg p-2 hover:bg-gray-50 transition-colors border border-l-0 border-gray-200"
        style={{ left: isOpen ? '256px' : '0px', transition: 'left 300ms' }}
      >
        {isOpen ? (
          <ChevronLeft size={20} className="text-gray-600" />
        ) : (
          <ChevronRight size={20} className="text-gray-600" />
        )}
      </button>
    </>
  );
};

export default Sidebar;
