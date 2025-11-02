import React, { useState, useEffect, useCallback } from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, ChevronRight, Brain, TrendingUp, Users, Network, Check, Star, ArrowRight, CreditCard, Building2, Shield, Zap, Lock } from 'lucide-react';

// ============ CUSTOM HOOKS ============
const useScrollAnimation = () => {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return isScrolled;
};

const useMobileMenu = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggle = useCallback(() => {
    setIsOpen(prev => !prev);
  }, []);

  const close = useCallback(() => {
    setIsOpen(false);
  }, []);

  return { isOpen, toggle, close };
};

const useAnimatedCounter = (endValue, duration = 2000) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    const steps = 60;
    const increment = endValue / steps;
    let current = 0;

    const interval = setInterval(() => {
      current += increment;
      if (current >= endValue) {
        setCount(endValue);
        clearInterval(interval);
      } else {
        setCount(Math.floor(current));
      }
    }, duration / steps);

    return () => clearInterval(interval);
  }, [endValue, duration]);

  return count;
};

// ============ REUSABLE COMPONENTS ============

const CredBridgeLogo = ({ isSmall = false }) => {
  const size = isSmall ? 32 : 40;

  return (
    <motion.div
      className={`flex items-center justify-center relative ${isSmall ? 'w-8 h-8' : 'w-10 h-10'}`}
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

const TrustBadge = ({ icon: Icon, label, description }) => {
  return (
    <motion.div
      className="flex flex-col items-center text-center"
      whileHover={{ scale: 1.05 }}
    >
      <motion.div
        className="w-12 h-12 bg-gradient-to-br from-blue-400/20 to-cyan-500/20 rounded-full flex items-center justify-center mb-3"
        whileHover={{ rotate: 360, backgroundColor: 'rgba(59, 130, 246, 0.1)' }}
        transition={{ duration: 0.6 }}
      >
        <Icon className="text-blue-600" size={24} />
      </motion.div>
      <h4 className="font-semibold text-sm text-gray-900 tracking-tight">
        {label}
      </h4>
      <p className="text-xs text-gray-600 mt-1 font-medium">
        {description}
      </p>
    </motion.div>
  );
};

const Badge = ({ children, variant = 'primary' }) => {
  const variants = {
    primary: 'bg-blue-100 border-blue-200 text-blue-700',
    success: 'bg-cyan-100 border-cyan-200 text-cyan-700',
  };

  return (
    <motion.div
      className={`inline-block px-4 py-2 rounded-full border font-medium ${variants[variant]}`}
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: 0.2 }}
    >
      <span className="text-xs tracking-wide uppercase">{children}</span>
    </motion.div>
  );
};

const StatCounter = ({ value, label, delay = 0 }) => {
  const count = useAnimatedCounter(parseInt(value), 2000);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay }}
    >
      <div className="text-4xl font-bold text-gray-900 mb-2 tracking-tight">
        {count}
        {label.includes('₹') ? '₹' : label.includes('%') ? '%' : ''}
      </div>
      <div className="text-sm text-gray-600 font-medium tracking-wide">
        {label}
      </div>
    </motion.div>
  );
};

const FeatureCard = ({ icon, title, description, delay = 0 }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay }}
      className="group"
    >
      <motion.div
        className="bg-gradient-to-br from-blue-50 to-cyan-50 p-8 rounded-xl border border-blue-200 hover:border-blue-400 transition-all h-full relative overflow-hidden"
        whileHover={{ y: -8 }}
      >
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-blue-500/5 to-cyan-400/5 opacity-0 group-hover:opacity-100"
          transition={{ duration: 0.3 }}
        />

        <motion.div
          className="text-blue-600 mb-6 relative z-10"
          whileHover={{ scale: 1.2, rotate: 10 }}
          transition={{ type: 'spring', stiffness: 300 }}
        >
          {icon}
        </motion.div>

        <h3 className="text-lg font-semibold text-gray-900 mb-3 relative z-10 tracking-tight">
          {title}
        </h3>
        <p className="text-sm text-gray-700 leading-relaxed relative z-10 font-medium">
          {description}
        </p>
      </motion.div>
    </motion.div>
  );
};

const CTAButton = ({ variant = 'primary', children, ...props }) => {
  const variants = {
    primary: 'bg-gradient-to-r from-blue-500 to-cyan-400 text-white hover:shadow-lg font-semibold',
    secondary: 'bg-white text-gray-900 border-2 border-gray-300 hover:border-blue-400 font-semibold',
    ghost: 'bg-transparent text-white border-2 border-white hover:bg-white hover:text-blue-600 font-semibold',
  };

  return (
    <motion.button
      className={`px-8 py-4 rounded-lg text-sm transition-all tracking-wide uppercase ${variants[variant]}`}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.98 }}
      {...props}
    >
      {children}
    </motion.button>
  );
};

const ProductCard = ({ title, description, icon, benefits, delay = 0 }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay }}
      className="bg-white rounded-xl overflow-hidden border border-blue-100 shadow-lg hover:shadow-2xl transition-shadow"
      whileHover={{ y: -10 }}
    >
      <motion.div
        className="h-64 bg-gradient-to-br from-blue-500 to-cyan-400 flex items-center justify-center"
        whileHover={{ scale: 1.05 }}
      >
        {icon}
      </motion.div>

      <div className="p-10">
        <h3 className="text-2xl font-bold text-gray-900 mb-4 tracking-tight">
          {title}
        </h3>
        <p className="text-gray-700 mb-8 leading-relaxed font-medium">
          {description}
        </p>

        <ul className="space-y-4 mb-8">
          {benefits.map((benefit, idx) => (
            <motion.li
              key={idx}
              className="flex items-start"
              initial={{ opacity: 0, x: -10 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: delay + idx * 0.1 }}
            >
              <Check className="text-cyan-500 mr-3 flex-shrink-0 mt-0.5 font-bold" size={18} />
              <span className="text-sm text-gray-700 font-medium">{benefit}</span>
            </motion.li>
          ))}
        </ul>

        <motion.button
          className="text-sm text-blue-600 hover:text-blue-700 transition-colors flex items-center font-semibold uppercase tracking-wide"
          whileHover={{ x: 5 }}
        >
          Learn More <ArrowRight className="ml-2" size={16} />
        </motion.button>
      </div>
    </motion.div>
  );
};

const TestimonialCard = ({ name, role, text, delay = 0 }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay }}
      className="bg-gradient-to-br from-blue-50 to-cyan-50 p-8 rounded-xl border border-blue-100 group relative overflow-hidden"
      whileHover={{ y: -5 }}
    >
      <div className="flex mb-6 relative z-10">
        {[...Array(5)].map((_, i) => (
          <motion.div
            key={i}
            initial={{ scale: 0 }}
            whileInView={{ scale: 1 }}
            transition={{ delay: delay + i * 0.05 }}
          >
            <Star className="text-blue-500 fill-current" size={16} />
          </motion.div>
        ))}
      </div>

      <p className="text-gray-700 mb-8 leading-relaxed font-medium text-sm relative z-10">
        "{text}"
      </p>

      <div className="relative z-10">
        <div className="font-bold text-gray-900 text-sm tracking-tight">{name}</div>
        <div className="text-xs text-gray-600 mt-1 font-medium tracking-wide uppercase">{role}</div>
      </div>
    </motion.div>
  );
};

// ============ NAVBAR ============
const Navbar = () => {
  const { isOpen, toggle, close } = useMobileMenu();
  const isScrolled = useScrollAnimation();
  const navigate = useNavigate();

  const navLinks = [
    { label: 'Home', href: '/' },
    { label: 'Features', href: '/#features' },
    { label: 'Products', href: '/#products' },
  ];

  return (
    <motion.nav
      className={`fixed w-full z-50 border-b transition-all duration-300 ${
        isScrolled
          ? 'bg-white/90 border-blue-200 shadow-lg'
          : 'bg-white/50 border-transparent'
      }`}
      style={{ backdropFilter: 'blur(10px)' }}
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          <motion.div
            className="flex items-center space-x-3 cursor-pointer"
            onClick={() => navigate('/')}
            whileHover={{ scale: 1.05 }}
          >
            <CredBridgeLogo isSmall />
            <span className="text-lg font-bold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent tracking-tight">
              CredBridge
            </span>
          </motion.div>

          <div className="hidden md:flex items-center space-x-1">
            {navLinks.map((link, idx) => (
              <motion.a
                key={idx}
                href={link.href}
                className="text-sm text-gray-700 hover:text-blue-600 px-4 py-2 rounded-md transition-colors relative font-semibold tracking-wide"
                whileHover={{ color: '#2563eb' }}
              >
                {link.label}
                <motion.div
                  className="absolute bottom-0 left-0 h-0.5 bg-gradient-to-r from-blue-500 to-cyan-400"
                  initial={{ width: 0 }}
                  whileHover={{ width: '100%' }}
                  transition={{ duration: 0.3 }}
                />
              </motion.a>
            ))}
          </div>

          <div className="hidden md:flex items-center space-x-4">
            <button className="text-sm text-gray-700 hover:text-blue-600 transition-colors font-semibold tracking-wide">
              Login
            </button>
            <CTAButton variant="primary">Sign Up</CTAButton>
          </div>

          <motion.button
            className="md:hidden text-gray-900"
            onClick={toggle}
            whileTap={{ scale: 0.95 }}
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </motion.button>
        </div>
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-white border-t border-blue-200"
          >
            <div className="px-6 py-6 space-y-3">
              {navLinks.map((link, idx) => (
                <motion.a
                  key={idx}
                  href={link.href}
                  className="block text-sm text-gray-700 hover:text-blue-600 py-2 font-semibold tracking-wide"
                  initial={{ x: -20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: idx * 0.1 }}
                  onClick={close}
                >
                  {link.label}
                </motion.a>
              ))}
              <CTAButton variant="primary" className="w-full">
                Sign Up
              </CTAButton>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
};

// ============ INTRO PAGE (HOME) ============
const Intro = () => {
  const navigate = useNavigate();

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className="min-h-screen bg-gradient-to-br from-white via-cyan-50 to-blue-50 pt-20 pb-20"
    >
      <div className="max-w-6xl mx-auto px-6">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <h1 className="text-6xl md:text-7xl font-black tracking-tighter text-slate-900 mb-6 leading-tight">
            Reimagining Credit Access
            <br />
            <span className="bg-gradient-to-r from-blue-600 via-cyan-500 to-blue-600 bg-clip-text text-transparent">
              for a Billion Indians.
            </span>
          </h1>
          <p className="text-xl text-slate-700 max-w-3xl mx-auto mb-8 leading-relaxed font-medium">
            CredBridge — the AI Middleman bridging banks & credit-invisible users with intelligence, fairness, and speed.
          </p>
        </motion.div>

        <motion.div
          className="flex items-center justify-center gap-8 flex-col md:flex-row mb-16"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.5 }}
        >
          <motion.div
            whileHover={{ rotateY: 8, y: -10 }}
            className="cursor-pointer"
          >
            <motion.div
              className="w-80 bg-white rounded-2xl border-2 border-blue-200 shadow-xl p-10 flex flex-col items-center justify-center hover:shadow-2xl transition-all"
              onClick={() => navigate('/bank')}
            >
              <div className="text-6xl mb-6">🏦</div>
              <h3 className="text-2xl font-bold text-slate-900 text-center mb-4 tracking-tight">For Banks</h3>
              <p className="text-sm text-slate-700 text-center font-medium">
                Partner to expand borrowers & lower NPAs with AI-powered risk assessment
              </p>
            </motion.div>
          </motion.div>

          <motion.div
            whileHover={{ rotateY: -8, y: -10 }}
            className="cursor-pointer"
          >
            <motion.div
              className="w-80 bg-white rounded-2xl border-2 border-cyan-200 shadow-xl p-10 flex flex-col items-center justify-center hover:shadow-2xl transition-all"
              onClick={() => navigate('/customer')}
            >
              <div className="text-6xl mb-6">👤</div>
              <h3 className="text-2xl font-bold text-slate-900 text-center mb-4 tracking-tight">For Customers</h3>
              <p className="text-sm text-slate-700 text-center font-medium">
                Build credit, access fair loans & unlock financial opportunities
              </p>
            </motion.div>
          </motion.div>
        </motion.div>

        <motion.div
          className="grid grid-cols-3 gap-6 text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7 }}
        >
          <div>
            <div className="text-4xl font-bold text-blue-600 mb-2 tracking-tight">50K+</div>
            <p className="text-sm text-slate-700 font-medium tracking-wide">Users Connected</p>
          </div>
          <div>
            <div className="text-4xl font-bold text-cyan-600 mb-2 tracking-tight">₹500Cr+</div>
            <p className="text-sm text-slate-700 font-medium tracking-wide">Capital Deployed</p>
          </div>
          <div>
            <div className="text-4xl font-bold text-blue-600 mb-2 tracking-tight">98%</div>
            <p className="text-sm text-slate-700 font-medium tracking-wide">Satisfaction Rate</p>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
};

// ============ BANK PAGE ============
const Bank = () => {
  const navigate = useNavigate();

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className="min-h-screen bg-gradient-to-b from-white via-blue-50 to-slate-50 pt-20"
    >
      <div className="max-w-6xl mx-auto px-6 pb-24">
        <motion.button
          className="mb-8 inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold text-slate-700 hover:bg-slate-100 transition-colors tracking-wide uppercase"
          whileHover={{ x: -5 }}
          onClick={() => navigate('/')}
        >
          <span>←</span>
          <span>Back to Home</span>
        </motion.button>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-16"
        >
          <div className="inline-block mb-4 px-3 py-1 rounded-full bg-gradient-to-r from-blue-100 to-cyan-100 border border-blue-200">
            <span className="text-xs font-bold text-blue-800 tracking-widest uppercase">For Financial Institutions</span>
          </div>

          <h2 className="text-6xl md:text-7xl font-black leading-tight text-slate-900 mb-4 tracking-tighter">
            Expand Your Reach.
            <br />
            <span className="bg-gradient-to-r from-blue-500 via-cyan-500 to-blue-600 bg-clip-text text-transparent">
              Reduce NPAs. Scale Fast.
            </span>
          </h2>

          <p className="mt-6 text-lg text-slate-700 max-w-2xl leading-relaxed font-medium">
            Connect to CredBridge and unlock access to underserved borrowers with AI-powered risk assessment and instant onboarding.
          </p>

          <motion.button
            className="mt-8 px-8 py-3 rounded-lg bg-gradient-to-r from-blue-500 to-cyan-400 text-white font-bold shadow-lg hover:shadow-xl transition-shadow uppercase tracking-wide text-sm"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.98 }}
          >
            Schedule Demo
          </motion.button>
        </motion.div>

        {/* Features for Banks */}
        <motion.div
          className="mb-16"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
        >
          <h3 className="text-4xl font-bold text-slate-900 mb-8 tracking-tight">Bank Solutions</h3>

          <div className="grid md:grid-cols-2 gap-8">
            {[
              {
                title: 'AI Underwriting Engine',
                description: 'Instant credit decisions using alternative data analysis',
                benefits: ['2-minute approvals', 'Alternative data scoring', 'Risk reduction'],
              },
              {
                title: 'Digital Onboarding',
                description: 'Seamless, paperless customer acquisition',
                benefits: ['Zero documentation', 'KYC automation', '99% success rate'],
              },
              {
                title: 'Portfolio Analytics',
                description: 'Real-time monitoring and risk management',
                benefits: ['Live dashboards', 'Early warning systems', 'NPA prediction'],
              },
              {
                title: 'Multi-Lender Network',
                description: 'Access to loan distribution partners',
                benefits: ['Portfolio diversification', 'Risk sharing', 'Scale rapidly'],
              },
            ].map((item, idx) => (
              <motion.div
                key={idx}
                className="bg-white rounded-lg border border-blue-200 p-8 hover:shadow-lg transition-shadow"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
              >
                <h4 className="text-xl font-bold text-slate-900 mb-3 tracking-tight">{item.title}</h4>
                <p className="text-slate-700 mb-4 font-medium">{item.description}</p>
                <ul className="space-y-2">
                  {item.benefits.map((benefit, bidx) => (
                    <li key={bidx} className="flex items-center gap-2 text-sm text-slate-700 font-medium">
                      <Check size={16} className="text-cyan-600" />
                      {benefit}
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Stats */}
        <motion.div
          className="grid grid-cols-3 gap-6 text-center bg-gradient-to-r from-blue-50 to-cyan-50 rounded-xl p-10 border border-blue-200"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
        >
          <div>
            <div className="text-4xl font-bold text-blue-600 mb-2 tracking-tight">150+</div>
            <p className="text-sm text-slate-700 font-bold tracking-wide">Partner Banks</p>
          </div>
          <div>
            <div className="text-4xl font-bold text-cyan-600 mb-2 tracking-tight">₹2000Cr+</div>
            <p className="text-sm text-slate-700 font-bold tracking-wide">Loans Facilitated</p>
          </div>
          <div>
            <div className="text-4xl font-bold text-blue-600 mb-2 tracking-tight">12%</div>
            <p className="text-sm text-slate-700 font-bold tracking-wide">NPA Reduction</p>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
};

// ============ CUSTOMER PAGE ============
const Customer = () => {
  const navigate = useNavigate();
  const [selectedFeature, setSelectedFeature] = useState(0);
  const [expandedFaqs, setExpandedFaqs] = useState(null);

  const features = [
    {
      title: 'Credit Builder Plans',
      icon: '📈',
      description: 'Build credit through micro-savings',
      details: 'Start small with flexible savings plans. Every deposit builds your credit score without requiring a full loan application.',
      benefits: ['Flexible amounts', 'Instant credit reporting', '0% interest'],
      color: 'from-blue-500/20 to-cyan-500/20',
    },
    {
      title: 'Smart Insights',
      icon: '🧠',
      description: 'AI-powered spending analysis',
      details: 'Understand your financial patterns with AI-generated insights. Get personalized recommendations to improve credit eligibility.',
      benefits: ['Real-time analysis', 'Personalized tips', 'Spending trends'],
      color: 'from-cyan-500/20 to-blue-500/20',
    },
    {
      title: 'Instant Access',
      icon: '⚡',
      description: 'Get approved in minutes',
      details: 'Our AI processes your application instantly. No lengthy paperwork, no waiting—access credit when you need it.',
      benefits: ['Instant decision', 'Quick disbursal', 'No documentation'],
      color: 'from-blue-500/20 to-cyan-500/20',
    },
    {
      title: 'Financial Literacy Hub',
      icon: '📚',
      description: 'Learn & grow financially',
      details: 'Access curated content designed for credit-invisible users. Learn budgeting, savings, and smart financial habits.',
      benefits: ['Video tutorials', 'Articles & guides', 'Expert tips'],
      color: 'from-cyan-500/20 to-blue-500/20',
    },
  ];

  const faqs = [
    {
      question: 'How does the AI scoring work?',
      answer: 'Our AI analyzes alternative data like transaction patterns, utility payments, and savings behavior—not just traditional credit history.',
    },
    {
      question: 'Is my data secure?',
      answer: 'Yes. We use 256-bit encryption, comply with RBI guidelines, and never share your data without explicit consent.',
    },
    {
      question: 'What are the eligibility requirements?',
      answer: 'You need a valid ID, bank account, and phone number. We accept applications from anyone 18+ years old.',
    },
    {
      question: 'Can I build credit with micro-savings?',
      answer: 'Absolutely! Micro-savings plans from ₹500/month are reported to credit bureaus, helping you build a credit history from scratch.',
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className="min-h-screen bg-gradient-to-b from-white via-blue-50 to-slate-50 pt-20 pb-24"
    >
      <div className="max-w-6xl mx-auto px-6">
        <motion.button
          className="mb-8 inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold text-slate-700 hover:bg-slate-100 transition-colors tracking-wide uppercase"
          whileHover={{ x: -5 }}
          onClick={() => navigate('/')}
        >
          <span>←</span>
          <span>Back to Home</span>
        </motion.button>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-16"
        >
          <div className="inline-block mb-4 px-3 py-1 rounded-full bg-gradient-to-r from-blue-100 to-cyan-100 border border-blue-200">
            <span className="text-xs font-bold text-blue-800 tracking-widest uppercase">For Credit-Invisible Users</span>
          </div>

          <h2 className="text-6xl md:text-7xl font-black leading-tight text-slate-900 mb-4 tracking-tighter">
            Credit for Everyone.
            <br />
            <span className="bg-gradient-to-r from-blue-500 via-cyan-500 to-blue-600 bg-clip-text text-transparent">
              Smart. Fair. Fast.
            </span>
          </h2>

          <p className="mt-6 text-lg text-slate-700 max-w-2xl leading-relaxed font-medium">
            Build credit through micro-savings and AI scoring that rewards real behavior rather than traditional credit history.
          </p>

          <motion.button
            className="mt-8 px-8 py-3 rounded-lg bg-gradient-to-r from-blue-500 to-cyan-400 text-white font-bold shadow-lg hover:shadow-xl transition-shadow uppercase tracking-wide text-sm"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.98 }}
          >
            Start Your Journey
          </motion.button>

          {/* Trust Indicators */}
          <div className="mt-8 flex flex-wrap gap-6">
            <div className="flex items-center gap-3">
              <span className="text-2xl">✓</span>
              <span className="text-sm text-slate-700 font-bold"><strong>500K+</strong> Users Approved</span>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-2xl">✓</span>
              <span className="text-sm text-slate-700 font-bold"><strong>₹1000+</strong> Cr Disbursed</span>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-2xl">✓</span>
              <span className="text-sm text-slate-700 font-bold"><strong>2 min</strong> Approval Time</span>
            </div>
          </div>
        </motion.div>

        {/* Features Section */}
        <motion.div className="mb-20">
          <h3 className="text-4xl font-bold text-slate-900 mb-8 tracking-tight">Why Choose CredBridge?</h3>

          <motion.div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
            {features.map((feature, idx) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.15 }}
                onClick={() => setSelectedFeature(idx)}
                className="cursor-pointer group"
              >
                <motion.div className="bg-white p-8 rounded-xl border border-blue-200 hover:border-blue-400 transition-all h-full relative overflow-hidden group-hover:shadow-lg">
                  <div className="flex items-start justify-between mb-3">
                    <span className="text-4xl">{feature.icon}</span>
                    <motion.div className="text-cyan-600">→</motion.div>
                  </div>

                  <h4 className="text-lg font-bold text-slate-900 mb-2 tracking-tight">{feature.title}</h4>
                  <p className="text-sm text-slate-700 font-medium">{feature.description}</p>

                  <div className="mt-4 flex flex-wrap gap-2">
                    {feature.benefits.slice(0, 2).map((benefit) => (
                      <span key={benefit} className="inline-block px-2 py-1 bg-blue-100 text-xs text-blue-700 rounded font-bold">
                        {benefit}
                      </span>
                    ))}
                  </div>
                </motion.div>
              </motion.div>
            ))}
          </motion.div>

          {/* Detailed Feature View */}
          <AnimatePresence mode="wait">
            <motion.div
              key={selectedFeature}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="bg-gradient-to-r from-blue-50 to-cyan-50 rounded-xl p-8 border border-blue-200"
            >
              <div className="flex items-start gap-6">
                <div className="text-6xl">{features[selectedFeature].icon}</div>
                <div className="flex-1">
                  <h3 className="text-2xl font-bold text-slate-900 mb-3 tracking-tight">{features[selectedFeature].title}</h3>
                  <p className="text-slate-800 mb-6 leading-relaxed font-medium">{features[selectedFeature].details}</p>

                  <div className="grid grid-cols-3 gap-4">
                    {features[selectedFeature].benefits.map((benefit) => (
                      <div key={benefit} className="flex items-center gap-2 text-sm">
                        <span className="text-blue-600 font-bold">✓</span>
                        <span className="text-slate-800 font-medium">{benefit}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </motion.div>

        {/* How It Works */}
        <motion.div className="mb-20">
          <h3 className="text-4xl font-bold text-slate-900 mb-8 tracking-tight">How It Works</h3>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {[
              { step: '1', label: 'Sign Up', desc: 'Quick & secure' },
              { step: '2', label: 'KYC Verification', desc: 'AI-powered check' },
              { step: '3', label: 'Start Saving', desc: 'Micro-savings plan' },
              { step: '4', label: 'Get Approved', desc: 'Instant decision' },
            ].map((item, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.15 }}
                className="bg-white rounded-lg p-6 border border-blue-200 text-center"
              >
                <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-gradient-to-br from-blue-500 to-cyan-400 flex items-center justify-center text-white font-bold text-lg">
                  {item.step}
                </div>
                <h4 className="font-bold text-slate-900 mb-1 tracking-tight">{item.label}</h4>
                <p className="text-xs text-slate-600 font-medium">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* FAQ Section */}
        <motion.div className="mb-20">
          <h3 className="text-4xl font-bold text-slate-900 mb-8 tracking-tight">Frequently Asked Questions</h3>

          <div className="space-y-4">
            {faqs.map((faq, idx) => (
              <motion.div
                key={idx}
                className="rounded-lg border border-blue-200 overflow-hidden"
              >
                <button
                  onClick={() => setExpandedFaqs(expandedFaqs === idx ? null : idx)}
                  className="w-full px-6 py-4 flex items-center justify-between hover:bg-blue-50 transition-colors"
                >
                  <span className="font-bold text-slate-900 text-left tracking-tight">{faq.question}</span>
                  <motion.span
                    animate={{ rotate: expandedFaqs === idx ? 180 : 0 }}
                    className="text-cyan-600 text-xl"
                  >
                    ▼
                  </motion.span>
                </button>

                <AnimatePresence>
                  {expandedFaqs === idx && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="border-t border-blue-200 bg-blue-50"
                    >
                      <p className="px-6 py-4 text-slate-800 leading-relaxed font-medium">{faq.answer}</p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center bg-gradient-to-r from-blue-50 to-cyan-50 rounded-xl p-12 border border-blue-200"
        >
          <h3 className="text-4xl font-bold text-slate-900 mb-3 tracking-tight">Ready to Build Your Credit?</h3>
          <p className="text-slate-800 mb-6 font-medium">Join 500K+ users who've already started their credit journey.</p>
          <motion.button
            className="px-8 py-3 rounded-lg bg-gradient-to-r from-blue-500 to-cyan-400 text-white font-bold shadow-lg hover:shadow-xl transition-shadow uppercase tracking-wide text-sm"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.98 }}
          >
            Get Started Now
          </motion.button>
        </motion.div>
      </div>
    </motion.div>
  );
};

// ============ LANDING PAGE (ENHANCED) ============
const Hero = () => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.2, delayChildren: 0.3 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { type: 'spring', stiffness: 100, damping: 15 },
    },
  };

  return (
    <section id="home" className="pt-32 pb-20 bg-gradient-to-br from-cyan-50 via-blue-50 to-white overflow-hidden relative">
      <motion.div
        className="absolute top-20 left-10 w-80 h-80 bg-blue-200/20 rounded-full blur-3xl"
        animate={{ y: [0, 40, 0], x: [0, 40, 0] }}
        transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
      />
      <motion.div
        className="absolute bottom-10 right-10 w-96 h-96 bg-cyan-200/20 rounded-full blur-3xl"
        animate={{ y: [0, -40, 0], x: [0, -40, 0] }}
        transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut', delay: 2 }}
      />

      <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <motion.div
            className="space-y-8"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            <motion.div className="space-y-6" variants={itemVariants}>
              <Badge variant="primary">🌉 Bridging Credit Gaps</Badge>

              <h1 className="text-6xl lg:text-7xl font-black text-gray-900 leading-tight tracking-tighter">
                <motion.span
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="block"
                >
                  The Bridge Between
                </motion.span>
                <motion.span
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                  className="block bg-gradient-to-r from-blue-500 via-cyan-400 to-blue-600 bg-clip-text text-transparent"
                >
                  You & Opportunity
                </motion.span>
              </h1>

              <motion.p
                className="text-xl text-gray-700 leading-relaxed font-semibold max-w-xl"
                variants={itemVariants}
              >
                CredBridge connects credit-invisible users with fair lending opportunities through AI-powered assessment and transparent terms.
              </motion.p>
            </motion.div>

            <motion.div
              className="flex flex-wrap gap-4"
              variants={itemVariants}
            >
              <div className="flex items-center gap-2">
                <Shield size={18} className="text-blue-600" />
                <span className="text-sm text-gray-800 font-bold tracking-wide">CERT-1234 Compliant</span>
              </div>
              <div className="flex items-center gap-2">
                <Lock size={18} className="text-blue-600" />
                <span className="text-sm text-gray-800 font-bold tracking-wide">Bank-Level Security</span>
              </div>
              <div className="flex items-center gap-2">
                <Zap size={18} className="text-blue-600" />
                <span className="text-sm text-gray-800 font-bold tracking-wide">2-Min Approval</span>
              </div>
            </motion.div>

            <motion.div
              className="flex flex-col sm:flex-row gap-4"
              variants={itemVariants}
            >
              <CTAButton variant="primary" className="flex items-center justify-center">
                Start Bridging
                <ChevronRight className="ml-2" size={18} />
              </CTAButton>
              <CTAButton variant="secondary">View Demo</CTAButton>
            </motion.div>

            <motion.div
              className="grid grid-cols-3 gap-8 pt-8 border-t-2 border-blue-200"
              variants={itemVariants}
            >
              <StatCounter value="50000" label="Bridges Built" />
              <StatCounter value="500" label="₹500Cr+ Deployed" delay={0.1} />
              <StatCounter value="98" label="98% Satisfaction" delay={0.2} />
            </motion.div>
          </motion.div>

          <motion.div
            className="relative"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.5, duration: 0.6 }}
          >
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-cyan-400/20 rounded-2xl blur-2xl"
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ duration: 4, repeat: Infinity }}
            />

            <motion.div
              className="relative bg-gradient-to-br from-blue-50 to-cyan-50 rounded-2xl p-8 space-y-6 border border-blue-200 backdrop-blur-sm shadow-2xl"
              whileHover={{ y: -10 }}
            >
              <motion.div
                className="flex items-center justify-between pb-6 border-b-2 border-blue-200"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.8 }}
              >
                <span className="text-sm text-gray-900 font-bold flex items-center gap-2 tracking-tight">
                  <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                  Credit Bridge Status
                </span>
                <motion.span
                  className="text-xs text-blue-700 font-bold uppercase tracking-widest"
                  animate={{ opacity: [0.5, 1, 0.5] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  BUILDING
                </motion.span>
              </motion.div>

              <div className="space-y-4">
                {[
                  { label: 'Credit Potential', value: '92%', color: 'text-blue-600' },
                  { label: 'Eligibility', value: 'Approved', color: 'text-cyan-600' },
                  { label: 'Loan Amount', value: '₹50,000', color: 'text-gray-900' },
                ].map((item, idx) => (
                  <motion.div
                    key={idx}
                    className="flex items-center justify-between py-4 border-b-2 border-blue-200"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.9 + idx * 0.1 }}
                  >
                    <span className="text-sm text-gray-700 font-bold">{item.label}</span>
                    <span className={`text-sm font-bold ${item.color} tracking-tight`}>{item.value}</span>
                  </motion.div>
                ))}

                <motion.div
                  className="flex items-center justify-between py-4"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 1.2 }}
                >
                  <span className="text-sm text-gray-700 font-bold">Bridge Status</span>
                  <motion.div
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ duration: 0.6, repeat: Infinity }}
                  >
                    <Check className="text-cyan-500" size={20} />
                  </motion.div>
                </motion.div>
              </div>

              <CTAButton variant="primary" className="w-full">
                View Your Bridge
              </CTAButton>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

const TrustSection = () => {
  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
        >
          <h2 className="text-4xl font-black text-gray-900 mb-4 tracking-tighter">Trusted & Secure</h2>
          <p className="text-gray-800 font-semibold">Enterprise-grade security with customer-first design</p>
        </motion.div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          <TrustBadge icon={Shield} label="RBI Certified" description="Full regulatory compliance" />
          <TrustBadge icon={Lock} label="256-bit Encryption" description="Bank-level security" />
          <TrustBadge icon={Check} label="Zero Fraud" description="Advanced AI monitoring" />
          <TrustBadge icon={Zap} label="Instant Decisions" description="2-minute approvals" />
        </div>
      </div>
    </section>
  );
};

const Features = () => {
  const features = [
    {
      icon: <Brain size={28} />,
      title: 'Smart AI Assessment',
      description: 'Alternative data analysis that understands your true creditworthiness.',
    },
    {
      icon: <TrendingUp size={28} />,
      title: 'Credit Growth Path',
      description: 'Structured programs to build and improve your credit score systematically.',
    },
    {
      icon: <Users size={28} />,
      title: 'Inclusive Access',
      description: 'Specialized lending for rural entrepreneurs, women, and underserved communities.',
    },
    {
      icon: <Network size={28} />,
      title: 'Digital & Physical',
      description: 'Seamless integration between online and offline banking touchpoints.',
    },
  ];

  return (
    <section id="features" className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <motion.div
          className="max-w-2xl mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <h2 className="text-4xl font-black text-gray-900 mb-4 tracking-tighter">
            Why Choose <span className="text-blue-600">CredBridge</span>
          </h2>
          <p className="text-lg text-gray-800 font-semibold">
            Purpose-built for financial inclusion with cutting-edge technology.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, idx) => (
            <FeatureCard
              key={idx}
              icon={feature.icon}
              title={feature.title}
              description={feature.description}
              delay={idx * 0.15}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

const Products = () => {
  const products = [
    {
      title: 'Credit Builder Loan',
      description: 'Start with micro-loans from ₹5,000 to build your credit profile and access larger opportunities.',
      icon: <CreditCard className="text-white" size={64} strokeWidth={1.5} />,
      benefits: ['No credit history required', 'Instant micro-loans', 'Credit bureau reporting'],
    },
    {
      title: 'CredBridge Portal',
      description: 'For financial institutions: Connect multiple lending partners and expand your reach instantly.',
      icon: <Building2 className="text-white" size={64} strokeWidth={1.5} />,
      benefits: ['Multi-lender network', 'Real-time analytics', 'Compliance automation'],
    },
  ];

  return (
    <section id="products" className="py-24 bg-gradient-to-br from-cyan-50 via-blue-50 to-white">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <motion.div
          className="max-w-2xl mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <h2 className="text-4xl font-black text-gray-900 mb-4 tracking-tighter">
            Our <span className="text-blue-600">Solutions</span>
          </h2>
          <p className="text-lg text-gray-800 font-semibold">Tailored for borrowers and lenders alike.</p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-12">
          {products.map((product, idx) => (
            <ProductCard
              key={idx}
              title={product.title}
              description={product.description}
              icon={product.icon}
              benefits={product.benefits}
              delay={idx * 0.2}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

const Testimonials = () => {
  const testimonials = [
    {
      name: 'Priya Sharma',
      role: 'Small Business Owner',
      text: 'CredBridge gave me access to credit I never thought possible. In 3 months, my score improved and I expanded my business.',
    },
    {
      name: 'Rajesh Kumar',
      role: 'Rural Entrepreneur',
      text: 'The bridge between my dreams and reality. Fair terms, transparent process, and real support.',
    },
    {
      name: 'Anita Desai',
      role: "Women's Cooperative Head",
      text: '200+ women have accessed credit through CredBridge. It\'s transforming our community.',
    },
  ];

  const partners = ['HDFC Bank', 'ICICI Bank', 'Axis Bank', 'SBI', 'Kotak Mahindra', 'YES Bank'];

  return (
    <section className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <motion.div
          className="max-w-2xl mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <h2 className="text-4xl font-black text-gray-900 mb-4 tracking-tighter">
            Success <span className="text-blue-600">Stories</span>
          </h2>
          <p className="text-lg text-gray-800 font-semibold">Hear from those who've built their financial future with CredBridge.</p>
        </motion.div>

        <motion.div
          className="grid md:grid-cols-3 gap-8 mb-20"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
        >
          {testimonials.map((testimonial, idx) => (
            <TestimonialCard
              key={idx}
              name={testimonial.name}
              role={testimonial.role}
              text={testimonial.text}
              delay={idx * 0.15}
            />
          ))}
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
        >
          <h3 className="text-center text-sm text-gray-700 mb-8 uppercase tracking-widest font-black">Trusted Partners</h3>
          <div className="flex flex-wrap justify-center items-center gap-8">
            {partners.map((partner, idx) => (
              <motion.div
                key={idx}
                className="text-gray-500 font-bold text-sm tracking-wide"
                initial={{ opacity: 0, scale: 0.5 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                whileHover={{ scale: 1.1, color: '#2563eb' }}
              >
                {partner}
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
};

const CTA = () => {
  return (
    <section className="py-24 bg-gradient-to-r from-blue-500 to-cyan-400 relative overflow-hidden">
      <motion.div
        className="absolute inset-0 opacity-10"
        animate={{
          backgroundPosition: ['0% 0%', '100% 100%'],
        }}
        transition={{ duration: 10, repeat: Infinity, repeatType: 'reverse' }}
      />

      <div className="max-w-4xl mx-auto px-6 lg:px-8 text-center relative z-10">
        <motion.h2
          className="text-5xl lg:text-6xl font-black text-white mb-6 tracking-tighter"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          Build Your Bridge Today
        </motion.h2>

        <motion.p
          className="text-lg text-blue-50 mb-12 font-bold"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
        >
          Join thousands bridging the gap to financial opportunity.
        </motion.p>

        <motion.div
          className="flex flex-col sm:flex-row gap-4 justify-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4 }}
        >
          <CTAButton variant="primary" className="bg-white text-blue-600 hover:bg-blue-50">
            Start Your Bridge
          </CTAButton>
          <CTAButton variant="ghost">Learn More</CTAButton>
        </motion.div>
      </div>
    </section>
  );
};

const Footer = () => {
  const footerSections = [
    {
      title: 'Product',
      links: ['Features', 'Pricing', 'Security', 'API'],
    },
    {
      title: 'Company',
      links: ['About', 'Careers', 'Blog', 'Contact'],
    },
    {
      title: 'Legal',
      links: ['Privacy', 'Terms', 'Compliance'],
    },
  ];

  return (
    <footer className="bg-white border-t-2 border-blue-200 py-16">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-12 mb-16">
          <motion.div
            className="col-span-2"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
          >
            <div className="flex items-center space-x-3 mb-6">
              <CredBridgeLogo />
              <span className="text-lg font-black bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent tracking-tight">
                CredBridge
              </span>
            </div>
            <p className="text-sm text-gray-800 leading-relaxed font-semibold max-w-sm">
              Bridging credit gaps and creating opportunities for underserved communities through innovative AI-powered lending.
            </p>
          </motion.div>

          {footerSections.map((section, sidx) => (
            <motion.div
              key={sidx}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: sidx * 0.1 }}
            >
              <h4 className="text-sm font-black text-gray-900 mb-4 tracking-tight">{section.title}</h4>
              <ul className="space-y-3">
                {section.links.map((link, lidx) => (
                  <li key={lidx}>
                    <motion.a
                      href="#"
                      className="text-sm text-gray-700 hover:text-blue-600 transition-colors font-bold"
                      whileHover={{ x: 4 }}
                    >
                      {link}
                    </motion.a>
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>

        <motion.div
          className="pt-8 border-t-2 border-blue-200 flex flex-col md:flex-row justify-between items-center gap-4"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
        >
          <p className="text-xs text-gray-700 font-bold">© 2025 CredBridge. All rights reserved. Building bridges to financial opportunity.</p>
          <div className="flex gap-6">
            {['Twitter', 'LinkedIn', 'Instagram'].map((social, idx) => (
              <motion.a
                key={idx}
                href="#"
                className="text-gray-700 hover:text-blue-600 transition-colors font-bold"
                whileHover={{ scale: 1.2 }}
              >
                <span className="text-xs uppercase tracking-wide">{social}</span>
              </motion.a>
            ))}
          </div>
        </motion.div>
      </div>
    </footer>
  );
};

// ============ MAIN APP WITH ROUTING ============
const App = () => {
  return (
    <Router>
      <div className="min-h-screen antialiased bg-white" style={{ fontFamily: "'Inter', 'Helvetica Neue', sans-serif" }}>
        <Navbar />
        <AnimatePresence mode="wait">
          <Routes>
            <Route path="/" element={
              <>
                <Intro />
                <Hero />
                <TrustSection />
                <Features />
                <Products />
                <Testimonials />
                <CTA />
                <Footer />
              </>
            } />
            <Route path="/bank" element={<Bank />} />
            <Route path="/customer" element={<Customer />} />
          </Routes>
        </AnimatePresence>
      </div>
    </Router>
  );
};

export default App;
