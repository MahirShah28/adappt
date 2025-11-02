import React, { useContext, useState } from 'react';
import { Building2, Bell, User, Settings, LogOut, Menu, X } from 'lucide-react'; // ✅ Added
import { BankingContext } from '../../context/Index'; // ✅ Added

/**
 * Header Component
 * Main application header with title, notifications, and user actions
 * 
 * @param {string} title - Header title
 * @param {string} subtitle - Header subtitle
 * @param {function} onToggleSidebar - Sidebar toggle callback
 * @param {string} theme - Current theme ('light' or 'dark')
 * @param {function} onThemeToggle - Theme toggle callback
 * @param {boolean} showSidebar - Is sidebar visible
 * @param {number} notificationCount - Number of unread notifications
 * @param {function} onNotificationClick - Notification click handler
 * @param {function} onSettingsClick - Settings click handler
 * @param {function} onLogout - Logout handler
 * @param {string} userName - Current user name
 * @param {string} userRole - Current user role
 */
const Header = ({ 
  title,
  subtitle,
  onToggleSidebar = null, // ✅ Added
  theme = 'light', // ✅ Added
  onThemeToggle = null, // ✅ Added
  showSidebar = true, // ✅ Added
  notificationCount = 0, // ✅ Added
  onNotificationClick = null, // ✅ Added
  onSettingsClick = null, // ✅ Added
  onLogout = null, // ✅ Added
  userName = 'Admin', // ✅ Added
  userRole = 'Administrator', // ✅ Added
}) => {
  // ✅ Get context
  const banking = useContext(BankingContext);

  // ✅ State for dropdowns
  const [showUserMenu, setShowUserMenu] = useState(false); // ✅ Added
  const [showNotificationMenu, setShowNotificationMenu] = useState(false); // ✅ Added

  // ✅ Get notifications from context
  const notifications = banking?.notifications || []; // ✅ Added
  const unreadCount = notificationCount || notifications.filter(n => !n.read).length; // ✅ Added

  // ✅ Handle notification click
  const handleNotificationClick = () => {
    setShowNotificationMenu(!showNotificationMenu);
    if (onNotificationClick) {
      onNotificationClick();
    }
  };

  // ✅ Handle settings click
  const handleSettingsClick = () => {
    if (onSettingsClick) {
      onSettingsClick();
    }
  };

  // ✅ Handle logout
  const handleLogout = () => {
    if (onLogout) {
      onLogout();
    } else if (banking?.logout) {
      banking.logout(); // ✅ Use context logout
    }
    setShowUserMenu(false);
  };

  // ✅ Handle sidebar toggle
  const handleToggleSidebar = () => {
    if (onToggleSidebar) {
      onToggleSidebar();
    }
  };

  return (
    <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-40">
      <div className="px-6 py-4">
        <div className="flex items-center justify-between">
          {/* ✅ Left side - Sidebar toggle + Title */}
          <div className="flex items-center gap-4 flex-1">
            {/* ✅ Mobile menu toggle */}
            {onToggleSidebar && (
              <button
                onClick={handleToggleSidebar}
                className="lg:hidden p-2 hover:bg-gray-100 rounded-lg transition-colors"
                aria-label={showSidebar ? 'Close sidebar' : 'Open sidebar'}
              >
                {showSidebar ? (
                  <X size={20} className="text-gray-600" />
                ) : (
                  <Menu size={20} className="text-gray-600" />
                )}
              </button>
            )}

            {/* Title */}
            <div className="flex items-center gap-3">
              <Building2 className="text-blue-600 flex-shrink-0" size={32} />
              <div>
                <h1 className="text-2xl font-bold text-gray-800">
                  {title || '🏦 AI-Driven Digital Banking Platform'}
                </h1>
                {subtitle && (
                  <p className="text-sm text-gray-600 mt-0.5">{subtitle}</p>
                )}
              </div>
            </div>
          </div>

          {/* ✅ Right side - Actions */}
          <div className="flex items-center gap-4">
            {/* ✅ Theme Toggle Button */}
            {onThemeToggle && (
              <button
                onClick={onThemeToggle}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
                title={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
              >
                {theme === 'light' ? (
                  <svg className="w-5 h-5 text-gray-600" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
                  </svg>
                ) : (
                  <svg className="w-5 h-5 text-yellow-500" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.121-10.607a1 1 0 010 1.414l-.707.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.464 5.05l-.707-.707a1 1 0 00-1.414 1.414l.707.707zm5.657-9.193a1 1 0 00-1.414 0l-.707.707A1 1 0 005.05 6.464l.707-.707a1 1 0 001.414-1.414l-.707-.707zM5 11a1 1 0 100-2H4a1 1 0 100 2h1z" clipRule="evenodd" />
                  </svg>
                )}
              </button>
            )}

            {/* ✅ Notifications Dropdown */}
            <div className="relative">
              <button
                onClick={handleNotificationClick}
                className="relative p-2 hover:bg-gray-100 rounded-lg transition-colors"
                aria-label={`Notifications (${unreadCount} unread)`}
              >
                <Bell size={20} className="text-gray-600" />
                {unreadCount > 0 && (
                  <span className="absolute top-1 right-1 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center text-white text-xs font-bold">
                    {unreadCount > 9 ? '9+' : unreadCount}
                  </span>
                )}
              </button>

              {/* ✅ Notification Dropdown Menu */}
              {showNotificationMenu && notifications.length > 0 && (
                <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-xl border border-gray-200 z-50">
                  <div className="p-4 border-b border-gray-200">
                    <h3 className="font-semibold text-gray-800 text-sm">Notifications</h3>
                  </div>
                  <div className="max-h-96 overflow-y-auto">
                    {notifications.slice(0, 5).map((notif, idx) => (
                      <div
                        key={idx}
                        className="px-4 py-3 border-b border-gray-100 hover:bg-gray-50 cursor-pointer text-sm"
                      >
                        <p className="font-medium text-gray-800">{notif.title || 'Notification'}</p>
                        <p className="text-gray-600 text-xs mt-1">{notif.message}</p>
                        <p className="text-gray-400 text-xs mt-2">{notif.timestamp}</p>
                      </div>
                    ))}
                  </div>
                  {notifications.length > 5 && (
                    <div className="p-2 text-center border-t border-gray-200">
                      <a href="#" className="text-blue-600 text-xs font-medium hover:underline">
                        View All Notifications
                      </a>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* ✅ Settings */}
            <button
              onClick={handleSettingsClick}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              aria-label="Settings"
              title="Settings"
            >
              <Settings size={20} className="text-gray-600" />
            </button>

            {/* ✅ User Profile Dropdown */}
            <div className="relative">
              <button
                onClick={() => setShowUserMenu(!showUserMenu)}
                className="flex items-center gap-2 p-2 hover:bg-gray-100 rounded-lg transition-colors"
                aria-label={`User menu for ${userName}`}
              >
                <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center flex-shrink-0">
                  <User size={18} className="text-white" />
                </div>
                <span className="text-sm font-medium text-gray-700 hidden sm:inline">{userName}</span>
              </button>

              {/* ✅ User Dropdown Menu */}
              {showUserMenu && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-xl border border-gray-200 z-50">
                  <div className="p-4 border-b border-gray-200">
                    <p className="font-semibold text-gray-800 text-sm">{userName}</p>
                    <p className="text-gray-500 text-xs">{userRole}</p>
                  </div>
                  <div className="py-2">
                    <button
                      className="w-full text-left px-4 py-2 hover:bg-gray-100 text-sm text-gray-700 flex items-center gap-2"
                      onClick={() => {
                        setShowUserMenu(false);
                        if (banking?.navigateTo) banking.navigateTo('/profile');
                      }}
                    >
                      <User size={16} />
                      Profile
                    </button>
                    <button
                      className="w-full text-left px-4 py-2 hover:bg-gray-100 text-sm text-gray-700 flex items-center gap-2"
                      onClick={handleSettingsClick}
                    >
                      <Settings size={16} />
                      Settings
                    </button>
                  </div>
                  <div className="border-t border-gray-200 p-2">
                    <button
                      onClick={handleLogout}
                      className="w-full text-left px-4 py-2 hover:bg-red-50 text-sm text-red-600 flex items-center gap-2 font-medium"
                    >
                      <LogOut size={16} />
                      Logout
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
