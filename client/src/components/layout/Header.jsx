import React, { useContext, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bell, User, Settings, LogOut, Menu, X, TrendingUp } from 'lucide-react';
import { BankingContext } from '../../context/Index';

/**
 * CredBridge Logo Component
 */
const CredBridgeLogo = ({ isSmall = false }) => {
  const size = isSmall ? 28 : 36;

  return (
    <motion.div
      className={`flex items-center justify-center relative ${isSmall ? 'w-7 h-7' : 'w-9 h-9'}`}
      whileHover={{ scale: 1.1 }}
      transition={{ type: 'spring', stiffness: 300 }}
    >
      <motion.div
        className="absolute inset-0 bg-gradient-to-br from-blue-400 to-cyan-500 rounded-lg"
        animate={{ rotate: 360 }}
        transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
        style={{ opacity: 0.1 }}
      />

      <svg
        width={size}
        height={size}
        viewBox="0 0 40 40"
        fill="none"
        className="relative z-10"
      >
        <motion.rect
          x="6"
          y="14"
          width="3"
          height="14"
          fill="url(#gradient1)"
          initial={{ scaleY: 0 }}
          animate={{ scaleY: 1 }}
          transition={{ delay: 0.2, duration: 0.6 }}
        />

        <motion.rect
          x="31"
          y="14"
          width="3"
          height="14"
          fill="url(#gradient1)"
          initial={{ scaleY: 0 }}
          animate={{ scaleY: 1 }}
          transition={{ delay: 0.4, duration: 0.6 }}
        />

        <motion.path
          d="M 9 14 Q 20 8 31 14"
          stroke="url(#gradient2)"
          strokeWidth="2"
          fill="none"
          strokeLinecap="round"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ delay: 0.6, duration: 0.8 }}
        />

        <motion.line
          x1="9"
          y1="14"
          x2="14"
          y2="20"
          stroke="url(#gradient2)"
          strokeWidth="1.5"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2 }}
        />
        <motion.line
          x1="31"
          y1="14"
          x2="26"
          y2="20"
          stroke="url(#gradient2)"
          strokeWidth="1.5"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.4 }}
        />

        <defs>
          <linearGradient id="gradient1" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#3b82f6" />
            <stop offset="100%" stopColor="#06b6d4" />
          </linearGradient>
          <linearGradient id="gradient2" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#3b82f6" />
            <stop offset="100%" stopColor="#06b6d4" />
          </linearGradient>
        </defs>
      </svg>
    </motion.div>
  );
};

/**
 * Header Component - CredBridge
 * Main application header with professional branding, notifications, and user actions
 */
const Header = ({ 
  title,
  subtitle,
  onToggleSidebar = null,
  theme = 'light',
  onThemeToggle = null,
  showSidebar = true,
  notificationCount = 0,
  onNotificationClick = null,
  onSettingsClick = null,
  onLogout = null,
  userName = 'Admin',
  userRole = 'Administrator',
}) => {
  const banking = useContext(BankingContext);

  // State for dropdowns
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showNotificationMenu, setShowNotificationMenu] = useState(false);

  // Get notifications from context
  const notifications = banking?.notifications || [];
  const unreadCount = notificationCount || notifications.filter(n => !n.read).length;

  // Handle notification click
  const handleNotificationClick = () => {
    setShowNotificationMenu(!showNotificationMenu);
    if (onNotificationClick) {
      onNotificationClick();
    }
  };

  // Handle settings click
  const handleSettingsClick = () => {
    if (onSettingsClick) {
      onSettingsClick();
    }
  };

  // Handle logout
  const handleLogout = () => {
    if (onLogout) {
      onLogout();
    } else if (banking?.logout) {
      banking.logout();
    }
    setShowUserMenu(false);
  };

  // Handle sidebar toggle
  const handleToggleSidebar = () => {
    if (onToggleSidebar) {
      onToggleSidebar();
    }
  };

  return (
    <header className="bg-white border-b-2 border-blue-200 sticky top-0 z-40 shadow-sm">
      <div className="px-6 py-4">
        <div className="flex items-center justify-between gap-6">
          {/* Left side - Sidebar toggle + Logo + Title */}
          <div className="flex items-center gap-4 flex-1 min-w-0">
            {/* Mobile menu toggle */}
            {onToggleSidebar && (
              <motion.button
                onClick={handleToggleSidebar}
                className="lg:hidden p-2 hover:bg-gray-100 rounded-lg transition-colors"
                aria-label={showSidebar ? 'Close sidebar' : 'Open sidebar'}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {showSidebar ? (
                  <X size={20} className="text-gray-700" />
                ) : (
                  <Menu size={20} className="text-gray-700" />
                )}
              </motion.button>
            )}

            {/* CredBridge Logo + Title */}
            <div className="flex items-center gap-3 min-w-0">
              <CredBridgeLogo isSmall={false} />
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <h1 className="text-2xl font-black text-gray-900 tracking-tight whitespace-nowrap">
                    CredBridge
                  </h1>
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
                    className="text-cyan-500"
                  >
                    <TrendingUp size={20} />
                  </motion.div>
                </div>
                {subtitle && (
                  <p className="text-xs text-gray-700 mt-0.5 font-bold uppercase tracking-wide">
                    {subtitle}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Right side - Actions */}
          <div className="flex items-center gap-1">
            {/* Theme Toggle Button */}
            {onThemeToggle && (
              <motion.button
                onClick={onThemeToggle}
                className="p-2.5 hover:bg-gray-100 rounded-lg transition-colors"
                aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
                title={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {theme === 'light' ? (
                  <svg className="w-5 h-5 text-gray-700" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
                  </svg>
                ) : (
                  <svg className="w-5 h-5 text-yellow-500" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.121-10.607a1 1 0 010 1.414l-.707.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.464 5.05l-.707-.707a1 1 0 00-1.414 1.414l.707.707zm5.657-9.193a1 1 0 00-1.414 0l-.707.707A1 1 0 005.05 6.464l.707-.707a1 1 0 001.414-1.414l-.707-.707zM5 11a1 1 0 100-2H4a1 1 0 100 2h1z" clipRule="evenodd" />
                  </svg>
                )}
              </motion.button>
            )}

            {/* Notifications Dropdown */}
            <div className="relative">
              <motion.button
                onClick={handleNotificationClick}
                className="relative p-2.5 hover:bg-gray-100 rounded-lg transition-colors"
                aria-label={`Notifications (${unreadCount} unread)`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Bell size={20} className="text-gray-700" />
                <AnimatePresence>
                  {unreadCount > 0 && (
                    <motion.span
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      exit={{ scale: 0 }}
                      className="absolute top-1 right-1 w-5 h-5 bg-gradient-to-r from-red-500 to-red-600 rounded-full flex items-center justify-center text-white text-xs font-black tracking-tight"
                    >
                      {unreadCount > 9 ? '9+' : unreadCount}
                    </motion.span>
                  )}
                </AnimatePresence>
              </motion.button>

              {/* Notification Dropdown Menu */}
              <AnimatePresence>
                {showNotificationMenu && notifications.length > 0 && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="absolute right-0 mt-2 w-96 bg-white rounded-lg shadow-xl border-2 border-blue-200 z-50"
                  >
                    <div className="p-4 border-b-2 border-blue-200 bg-blue-50">
                      <h3 className="font-black text-gray-900 text-sm uppercase tracking-wide">
                        Notifications
                      </h3>
                    </div>
                    <div className="max-h-96 overflow-y-auto">
                      {notifications.slice(0, 5).map((notif, idx) => (
                        <motion.div
                          key={idx}
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: idx * 0.05 }}
                          className="px-4 py-3 border-b border-blue-100 hover:bg-blue-50 cursor-pointer text-sm transition-colors"
                        >
                          <p className="font-bold text-gray-900 tracking-tight">
                            {notif.title || 'Notification'}
                          </p>
                          <p className="text-gray-700 text-xs mt-1 font-medium">
                            {notif.message}
                          </p>
                          <p className="text-gray-500 text-xs mt-2 font-semibold">
                            {notif.timestamp}
                          </p>
                        </motion.div>
                      ))}
                    </div>
                    {notifications.length > 5 && (
                      <div className="p-3 text-center border-t-2 border-blue-200 bg-blue-50">
                        <a
                          href="#"
                          className="text-blue-600 text-xs font-black hover:text-blue-700 transition-colors uppercase tracking-wide"
                        >
                          View All Notifications
                        </a>
                      </div>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Settings */}
            <motion.button
              onClick={handleSettingsClick}
              className="p-2.5 hover:bg-gray-100 rounded-lg transition-colors"
              aria-label="Settings"
              title="Settings"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Settings size={20} className="text-gray-700" />
            </motion.button>

            {/* User Profile Dropdown */}
            <div className="relative">
              <motion.button
                onClick={() => setShowUserMenu(!showUserMenu)}
                className="flex items-center gap-2 p-2 hover:bg-gray-100 rounded-lg transition-colors ml-2"
                aria-label={`User menu for ${userName}`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <motion.div
                  className="w-9 h-9 bg-gradient-to-br from-blue-500 to-cyan-400 rounded-lg flex items-center justify-center flex-shrink-0 shadow-sm"
                  whileHover={{ rotate: 10 }}
                  transition={{ type: 'spring', stiffness: 300 }}
                >
                  <User size={18} className="text-white font-bold" />
                </motion.div>
                <div className="hidden sm:block">
                  <p className="text-sm font-bold text-gray-900 tracking-tight">
                    {userName}
                  </p>
                  <p className="text-xs text-gray-600 font-semibold uppercase tracking-wide">
                    {userRole}
                  </p>
                </div>
              </motion.button>

              {/* User Dropdown Menu */}
              <AnimatePresence>
                {showUserMenu && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-xl border-2 border-blue-200 z-50"
                  >
                    <div className="p-4 border-b-2 border-blue-200 bg-blue-50">
                      <p className="font-bold text-gray-900 text-sm tracking-tight">
                        {userName}
                      </p>
                      <p className="text-gray-600 text-xs font-bold uppercase tracking-wider mt-1">
                        {userRole}
                      </p>
                    </div>
                    <div className="py-2">
                      <motion.button
                        className="w-full text-left px-4 py-3 hover:bg-blue-50 text-sm text-gray-900 flex items-center gap-3 font-bold transition-colors tracking-tight"
                        onClick={() => {
                          setShowUserMenu(false);
                          if (banking?.navigateTo) banking.navigateTo('/profile');
                        }}
                        whileHover={{ x: 4 }}
                      >
                        <User size={16} className="text-blue-600" />
                        Profile
                      </motion.button>
                      <motion.button
                        className="w-full text-left px-4 py-3 hover:bg-blue-50 text-sm text-gray-900 flex items-center gap-3 font-bold transition-colors tracking-tight"
                        onClick={handleSettingsClick}
                        whileHover={{ x: 4 }}
                      >
                        <Settings size={16} className="text-blue-600" />
                        Settings
                      </motion.button>
                    </div>
                    <div className="border-t-2 border-blue-200 p-2 bg-red-50">
                      <motion.button
                        onClick={handleLogout}
                        className="w-full text-left px-4 py-3 hover:bg-red-100 text-sm text-red-700 flex items-center gap-3 font-black transition-colors rounded-lg tracking-tight uppercase"
                        whileHover={{ x: 4 }}
                      >
                        <LogOut size={16} />
                        Logout
                      </motion.button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
