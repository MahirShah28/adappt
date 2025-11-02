import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, ChevronRight, Brain, TrendingUp, Users, Network, Check, Star, ArrowRight, CreditCard, Building2 } from 'lucide-react';

// ============ ANIMATED NAVBAR ============
const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { label: 'Home', href: '#home' },
    { label: 'Features', href: '#features' },
    { label: 'Products', href: '#products' },
    { label: 'About', href: '#about' },
    { label: 'Contact', href: '#contact' },
  ];

  return (
    <motion.nav
      className={`fixed w-full z-50 border-b transition-all duration-300 ${
        isScrolled
          ? 'bg-white/90 border-gray-200 shadow-lg'
          : 'bg-white/50 border-transparent'
      }`}
      style={{ backdropFilter: 'blur(10px)' }}
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Logo */}
          <motion.div
            className="flex items-center space-x-3"
            whileHover={{ scale: 1.05 }}
          >
            <motion.div
              className="w-9 h-9 bg-gradient-to-br from-blue-500 to-cyan-400 rounded-md flex items-center justify-center"
              whileHover={{ rotate: 10 }}
              transition={{ type: 'spring', stiffness: 300 }}
            >
              <span className="text-white font-semibold text-sm">FP</span>
            </motion.div>
            <span className="text-xl font-light text-gray-900 tracking-tight">FinPlatform</span>
          </motion.div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-1">
            {navLinks.map((link, idx) => (
              <motion.a
                key={idx}
                href={link.href}
                className="text-sm text-gray-600 hover:text-blue-600 px-4 py-2 rounded-md transition-colors relative"
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

          {/* Desktop Auth Buttons */}
          <div className="hidden md:flex items-center space-x-4">
            <button className="text-sm text-gray-600 hover:text-blue-600 transition-colors">
              Login
            </button>
            <motion.button
              className="bg-gradient-to-r from-blue-500 to-cyan-400 text-white px-6 py-2.5 rounded-md text-sm hover:shadow-lg transition-shadow"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.98 }}
            >
              Sign Up
            </motion.button>
          </div>

          {/* Mobile Menu Button */}
          <motion.button
            className="md:hidden text-gray-900"
            onClick={() => setIsOpen(!isOpen)}
            whileTap={{ scale: 0.95 }}
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </motion.button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-white border-t border-gray-100"
          >
            <div className="px-6 py-6 space-y-3">
              {navLinks.map((link, idx) => (
                <motion.a
                  key={idx}
                  href={link.href}
                  className="block text-sm text-gray-600 hover:text-blue-600 py-2"
                  initial={{ x: -20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: idx * 0.1 }}
                  onClick={() => setIsOpen(false)}
                >
                  {link.label}
                </motion.a>
              ))}
              <motion.button className="w-full bg-gradient-to-r from-blue-500 to-cyan-400 text-white px-6 py-2.5 rounded-md text-sm">
                Sign Up
              </motion.button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
};

// ============ ANIMATED COUNTER ============
const AnimatedCounter = ({ value, label }) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    const target = parseInt(value);
    const duration = 2000;
    const steps = 60;
    const increment = target / steps;
    let current = 0;

    const interval = setInterval(() => {
      current += increment;
      if (current >= target) {
        setCount(target);
        clearInterval(interval);
      } else {
        setCount(Math.floor(current));
      }
    }, duration / steps);

    return () => clearInterval(interval);
  }, [value]);

  return (
    <div>
      <motion.div
        className="text-3xl font-light text-gray-900 mb-1"
        initial={{ opacity: 0, scale: 0.5 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
      >
        {count}
        {label.includes('₹') ? '₹' : label.includes('%') ? '%' : ''}
      </motion.div>
      <div className="text-sm text-gray-500">{label}</div>
    </div>
  );
};

// ============ HERO SECTION ============
const Hero = () => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.3,
      },
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
      {/* Animated Background Elements */}
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
          {/* Left Content */}
          <motion.div
            className="space-y-8"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            <motion.div className="space-y-6" variants={itemVariants}>
              <motion.div
                className="inline-block"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
              >
                <div className="px-4 py-2 rounded-full bg-blue-100 border border-blue-200">
                  <span className="text-xs font-semibold text-blue-700">✨ Trusted by 50K+ Users</span>
                </div>
              </motion.div>

              <h1 className="text-5xl lg:text-6xl font-light text-gray-900 leading-tight tracking-tight">
                <motion.span
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="block"
                >
                  Empowering
                </motion.span>
                <motion.span
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                  className="block bg-gradient-to-r from-blue-500 via-cyan-400 to-blue-600 bg-clip-text text-transparent"
                >
                  Financial Inclusion
                </motion.span>
              </h1>

              <motion.p
                className="text-xl text-gray-600 leading-relaxed font-light max-w-xl"
                variants={itemVariants}
              >
                AI-powered lending solutions designed to democratize access to financial services for underserved communities.
              </motion.p>
            </motion.div>

            {/* CTA Buttons */}
            <motion.div
              className="flex flex-col sm:flex-row gap-4"
              variants={itemVariants}
            >
              <motion.button
                className="group bg-gradient-to-r from-blue-500 to-cyan-400 text-white px-8 py-4 rounded-lg text-sm hover:shadow-xl transition-all flex items-center justify-center font-medium"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.98 }}
              >
                Get Started
                <ChevronRight className="ml-2 group-hover:translate-x-1 transition-transform" size={18} />
              </motion.button>
              <motion.button
                className="bg-white text-gray-900 px-8 py-4 rounded-lg border-2 border-gray-200 text-sm hover:border-blue-400 transition-all font-medium"
                whileHover={{ scale: 1.05, borderColor: '#3b82f6' }}
                whileTap={{ scale: 0.98 }}
              >
                Learn More
              </motion.button>
            </motion.div>

            {/* Stats */}
            <motion.div
              className="grid grid-cols-3 gap-8 pt-8 border-t border-gray-200"
              variants={itemVariants}
            >
              <AnimatedCounter value={50000} label="Loans Disbursed" />
              <AnimatedCounter value={500} label="₹500Cr+" />
              <AnimatedCounter value={95} label="95% Approval" />
            </motion.div>
          </motion.div>

          {/* Right - Interactive Card */}
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
                className="flex items-center justify-between pb-6 border-b border-blue-100"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.8 }}
              >
                <span className="text-sm text-gray-900 font-semibold">Credit Analysis</span>
                <motion.div
                  className="flex items-center space-x-2"
                  animate={{ opacity: [0.5, 1, 0.5] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  <div className="w-2 h-2 bg-cyan-400 rounded-full"></div>
                  <span className="text-xs text-gray-600">Live</span>
                </motion.div>
              </motion.div>

              <div className="space-y-4">
                {[
                  { label: 'Credit Score', value: '750', color: 'text-gray-900' },
                  { label: 'Risk Assessment', value: 'Low Risk', color: 'text-cyan-600' },
                  { label: 'Decision Time', value: '2.3 sec', color: 'text-gray-900' },
                ].map((item, idx) => (
                  <motion.div
                    key={idx}
                    className="flex items-center justify-between py-4 border-b border-blue-100"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.9 + idx * 0.1 }}
                  >
                    <span className="text-sm text-gray-600">{item.label}</span>
                    <span className={`text-sm font-semibold ${item.color}`}>{item.value}</span>
                  </motion.div>
                ))}

                <motion.div
                  className="flex items-center justify-between py-4"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 1.2 }}
                >
                  <span className="text-sm text-gray-600">Approval Status</span>
                  <motion.div
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ duration: 0.6, repeat: Infinity }}
                  >
                    <Check className="text-cyan-500" size={20} />
                  </motion.div>
                </motion.div>
              </div>

              <motion.button
                className="w-full bg-gradient-to-r from-blue-500 to-cyan-400 text-white py-3 rounded-lg text-sm hover:shadow-lg transition-all font-medium"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                View Full Report
              </motion.button>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

// ============ FEATURES SECTION ============
const Features = () => {
  const features = [
    {
      icon: <Brain size={28} />,
      title: 'AI Underwriting',
      description: 'Advanced machine learning algorithms analyze alternative data for instant credit decisions.',
    },
    {
      icon: <TrendingUp size={28} />,
      title: 'Credit Builder Loans',
      description: 'Structured programs designed to establish and improve credit scores systematically.',
    },
    {
      icon: <Users size={28} />,
      title: 'Targeted Programs',
      description: 'Specialized lending for rural entrepreneurs and women-led businesses.',
    },
    {
      icon: <Network size={28} />,
      title: 'Phygital Network',
      description: 'Seamless integration of physical touchpoints with digital platforms.',
    },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.2,
      },
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
    <section id="features" className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <motion.div
          className="max-w-2xl mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <h2 className="text-4xl font-light text-gray-900 mb-4 tracking-tight">
            Built for <span className="font-semibold text-blue-600">Financial Inclusion</span>
          </h2>
          <p className="text-lg text-gray-600 font-light">
            Cutting-edge technology designed to create opportunities for everyone.
          </p>
        </motion.div>

        <motion.div
          className="grid md:grid-cols-2 lg:grid-cols-4 gap-8"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          {features.map((feature, idx) => (
            <motion.div
              key={idx}
              className="group"
              variants={itemVariants}
              whileHover={{ y: -8 }}
            >
              <div className="bg-gradient-to-br from-blue-50 to-cyan-50 p-8 rounded-xl border border-blue-100 hover:border-blue-400 transition-all h-full relative overflow-hidden">
                {/* Animated background on hover */}
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-blue-500/5 to-cyan-400/5 opacity-0 group-hover:opacity-100"
                  transition={{ duration: 0.3 }}
                />

                <motion.div
                  className="text-blue-600 mb-6 relative z-10"
                  whileHover={{ scale: 1.2, rotate: 10 }}
                  transition={{ type: 'spring', stiffness: 300 }}
                >
                  {feature.icon}
                </motion.div>

                <h3 className="text-lg font-semibold text-gray-900 mb-3 relative z-10">{feature.title}</h3>
                <p className="text-sm text-gray-600 leading-relaxed font-light relative z-10">{feature.description}</p>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

// ============ PRODUCTS SECTION ============
const Products = () => {
  return (
    <section id="products" className="py-24 bg-gradient-to-br from-cyan-50 via-blue-50 to-white">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <motion.div
          className="max-w-2xl mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <h2 className="text-4xl font-light text-gray-900 mb-4 tracking-tight">
            Our <span className="font-semibold text-blue-600">Products</span>
          </h2>
          <p className="text-lg text-gray-600 font-light">
            Comprehensive solutions for lenders and borrowers.
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-12">
          {[
            {
              title: 'Credit Builder Loan',
              desc: 'Help individuals with limited credit history establish a strong financial foundation through structured repayment programs.',
              icon: <CreditCard className="text-white" size={64} strokeWidth={1.5} />,
              benefits: ['No existing credit score required', 'Flexible repayment terms', 'Report to all major credit bureaus'],
            },
            {
              title: 'Aggregator Portal',
              desc: 'Connect multiple lending partners through our intelligent aggregator platform. Streamline operations and expand reach instantly.',
              icon: <Building2 className="text-white" size={64} strokeWidth={1.5} />,
              benefits: ['Multi-lender integration', 'Real-time analytics dashboard', 'Automated compliance checks'],
            },
          ].map((product, idx) => (
            <motion.div
              key={idx}
              className="bg-white rounded-xl overflow-hidden border border-blue-100 shadow-lg hover:shadow-2xl transition-shadow"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.2 }}
              whileHover={{ y: -10 }}
            >
              <motion.div
                className="h-64 bg-gradient-to-br from-blue-500 to-cyan-400 flex items-center justify-center"
                whileHover={{ scale: 1.05 }}
              >
                {product.icon}
              </motion.div>

              <div className="p-10">
                <h3 className="text-2xl font-light text-gray-900 mb-4">{product.title}</h3>
                <p className="text-gray-600 mb-8 leading-relaxed font-light">{product.desc}</p>

                <ul className="space-y-4 mb-8">
                  {product.benefits.map((benefit, bidx) => (
                    <motion.li
                      key={bidx}
                      className="flex items-start"
                      initial={{ opacity: 0, x: -10 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: idx * 0.2 + bidx * 0.1 }}
                    >
                      <Check className="text-cyan-500 mr-3 flex-shrink-0 mt-0.5" size={18} />
                      <span className="text-sm text-gray-600">{benefit}</span>
                    </motion.li>
                  ))}
                </ul>

                <motion.button
                  className="text-sm text-blue-600 hover:text-blue-700 transition-colors flex items-center font-medium"
                  whileHover={{ x: 5 }}
                >
                  Learn More <ArrowRight className="ml-2" size={16} />
                </motion.button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

// ============ TESTIMONIALS SECTION ============
const Testimonials = () => {
  const testimonials = [
    {
      name: 'Priya Sharma',
      role: 'Small Business Owner',
      text: 'The Credit Builder Loan helped me establish my credit score from scratch. Within 6 months, I secured funding for expanding my business.',
    },
    {
      name: 'Rajesh Kumar',
      role: 'Rural Entrepreneur',
      text: 'Their phygital approach made it easy for me to access financial services despite being in a remote area.',
    },
    {
      name: 'Anita Desai',
      role: "Women's Cooperative Head",
      text: 'We\'ve helped over 200 women access credit and start their own businesses through this platform.',
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
          <h2 className="text-4xl font-light text-gray-900 mb-4 tracking-tight">
            Trusted by <span className="font-semibold text-blue-600">Thousands</span>
          </h2>
          <p className="text-lg text-gray-600 font-light">
            Real stories from people building their financial future.
          </p>
        </motion.div>

        <motion.div
          className="grid md:grid-cols-3 gap-8 mb-20"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
        >
          {testimonials.map((testimonial, idx) => (
            <motion.div
              key={idx}
              className="bg-gradient-to-br from-blue-50 to-cyan-50 p-8 rounded-xl border border-blue-100 relative overflow-hidden group"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.15 }}
              whileHover={{ y: -5 }}
            >
              {/* Animated border on hover */}
              <motion.div
                className="absolute inset-0 border-2 border-transparent bg-clip-padding"
                style={{
                  borderImage: 'linear-gradient(45deg, #3b82f6, #06b6d4) 1',
                }}
                initial={{ opacity: 0 }}
                whileHover={{ opacity: 0.5 }}
              />

              <div className="flex mb-6 relative z-10">
                {[...Array(5)].map((_, i) => (
                  <motion.div
                    key={i}
                    initial={{ scale: 0 }}
                    whileInView={{ scale: 1 }}
                    transition={{ delay: idx * 0.15 + i * 0.05 }}
                  >
                    <Star className="text-blue-500 fill-current" size={16} />
                  </motion.div>
                ))}
              </div>

              <p className="text-gray-600 mb-8 leading-relaxed font-light text-sm relative z-10">
                "{testimonial.text}"
              </p>

              <div className="relative z-10">
                <div className="font-semibold text-gray-900 text-sm">{testimonial.name}</div>
                <div className="text-xs text-gray-500 mt-1">{testimonial.role}</div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Partners Section */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
        >
          <h3 className="text-center text-sm text-gray-500 mb-8 uppercase tracking-wider font-semibold">
            Our Partners
          </h3>
          <div className="flex flex-wrap justify-center items-center gap-8">
            {partners.map((partner, idx) => (
              <motion.div
                key={idx}
                className="text-gray-400 font-light text-sm"
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

// ============ CTA SECTION ============
const CTA = () => {
  return (
    <section className="py-24 bg-gradient-to-r from-blue-500 to-cyan-400 relative overflow-hidden">
      {/* Animated background elements */}
      <motion.div
        className="absolute inset-0 opacity-20"
        animate={{
          backgroundPosition: ['0% 0%', '100% 100%'],
        }}
        transition={{ duration: 10, repeat: Infinity, repeatType: 'reverse' }}
      />

      <div className="max-w-4xl mx-auto px-6 lg:px-8 text-center relative z-10">
        <motion.h2
          className="text-4xl lg:text-5xl font-light text-white mb-6 tracking-tight"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          Ready to Transform
          <br />
          <span className="font-semibold">Financial Inclusion?</span>
        </motion.h2>

        <motion.p
          className="text-lg text-blue-50 mb-12 font-light"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
        >
          Join thousands building a more inclusive financial ecosystem.
        </motion.p>

        <motion.div
          className="flex flex-col sm:flex-row gap-4 justify-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4 }}
        >
          <motion.button
            className="bg-white text-blue-600 px-8 py-4 rounded-lg text-sm hover:shadow-lg transition-all font-medium"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.98 }}
          >
            Request a Demo
          </motion.button>
          <motion.button
            className="bg-transparent text-white border-2 border-white px-8 py-4 rounded-lg text-sm hover:bg-white hover:text-blue-600 transition-all font-medium"
            whileHover={{ scale: 1.05, backgroundColor: 'white' }}
            whileTap={{ scale: 0.98 }}
          >
            Start Today
          </motion.button>
        </motion.div>
      </div>
    </section>
  );
};

// ============ FOOTER ============
const Footer = () => {
  const footerSections = [
    {
      title: 'Product',
      links: ['Features', 'Products', 'Pricing', 'API'],
    },
    {
      title: 'Company',
      links: ['About', 'Careers', 'Blog', 'Contact'],
    },
    {
      title: 'Legal',
      links: ['Privacy', 'Terms', 'Security'],
    },
  ];

  return (
    <footer className="bg-white border-t border-gray-100 py-16">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-12 mb-16">
          <motion.div
            className="col-span-2"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
          >
            <div className="flex items-center space-x-3 mb-6">
              <div className="w-9 h-9 bg-gradient-to-br from-blue-500 to-cyan-400 rounded-md flex items-center justify-center">
                <span className="text-white font-semibold text-sm">FP</span>
              </div>
              <span className="text-xl font-light text-gray-900 tracking-tight">FinPlatform</span>
            </div>
            <p className="text-sm text-gray-600 leading-relaxed font-light max-w-sm">
              Empowering financial inclusion through innovative AI-powered lending solutions.
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
              <h4 className="text-sm font-semibold text-gray-900 mb-4">{section.title}</h4>
              <ul className="space-y-3">
                {section.links.map((link, lidx) => (
                  <li key={lidx}>
                    <motion.a
                      href="#"
                      className="text-sm text-gray-600 hover:text-blue-600 transition-colors"
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
          className="pt-8 border-t border-gray-100 flex flex-col md:flex-row justify-between items-center gap-4"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
        >
          <p className="text-xs text-gray-500">© 2025 FinPlatform. All rights reserved.</p>
          <div className="flex gap-6">
            {[1, 2, 3].map((_, idx) => (
              <motion.a
                key={idx}
                href="#"
                className="text-gray-400 hover:text-blue-600 transition-colors"
                whileHover={{ scale: 1.2, rotate: 10 }}
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <circle cx="12" cy="12" r="10" />
                </svg>
              </motion.a>
            ))}
          </div>
        </motion.div>
      </div>
    </footer>
  );
};

// ============ MAIN APP ============
const App = () => {
  return (
    <div className="min-h-screen antialiased bg-white">
      <Navbar />
      <Hero />
      <Features />
      <Products />
      <Testimonials />
      <CTA />
      <Footer />
    </div>
  );
};

export default App;
