import React from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { useNavigate } from "react-router-dom";
import GlassCard from "../components/GlassCard";

export default function Intro() {
  const navigate = useNavigate();

  // Floating animation for decorative elements
  const floatingVariants = {
    initial: { y: 0 },
    animate: {
      y: [-10, 10, -10],
      transition: {
        duration: 6,
        repeat: Infinity,
        ease: "easeInOut",
      },
    },
  };

  // Stagger children animation
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

  const cardVariants = {
    hidden: { opacity: 0, y: 30, scale: 0.95 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 15,
      },
    },
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center bg-gradient-to-br from-white via-rose-50 to-sky-50 overflow-hidden">
      {/* Animated Background Elements */}
      <motion.div
        variants={floatingVariants}
        initial="initial"
        animate="animate"
        className="absolute top-20 left-10 w-32 h-32 bg-gradient-to-br from-rose-200/30 to-transparent rounded-full blur-3xl"
      />
      <motion.div
        variants={floatingVariants}
        initial="initial"
        animate="animate"
        style={{ animationDelay: "2s" }}
        className="absolute bottom-20 right-10 w-40 h-40 bg-gradient-to-br from-sky-200/30 to-transparent rounded-full blur-3xl"
      />
      <motion.div
        variants={floatingVariants}
        initial="initial"
        animate="animate"
        style={{ animationDelay: "4s" }}
        className="absolute top-1/2 right-1/4 w-24 h-24 bg-gradient-to-br from-purple-200/20 to-transparent rounded-full blur-2xl"
      />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        className="relative z-10 max-w-5xl w-full px-6 py-20"
      >
        {/* Header Section with Enhanced Typography */}
        <div className="text-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="inline-block mb-4 px-4 py-2 rounded-full bg-gradient-to-r from-rose-100 to-sky-100 border border-rose-200/50"
          >
            <span className="text-sm font-medium text-slate-700">
              🚀 Powered by AI Intelligence
            </span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.3 }}
            className="text-5xl md:text-6xl font-extrabold tracking-tight text-slate-900 leading-tight"
          >
            Reimagining Credit Access
            <br />
            <span className="bg-gradient-to-r from-rose-500 via-purple-500 to-sky-500 bg-clip-text text-transparent">
              for a Billion Indians
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.7, delay: 0.5 }}
            className="mt-6 text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed"
          >
            AI Middleman bridges banks & credit-invisible users with{" "}
            <span className="font-semibold text-slate-800">intelligence</span>,{" "}
            <span className="font-semibold text-slate-800">fairness</span>, and{" "}
            <span className="font-semibold text-slate-800">speed</span>.
          </motion.p>

          {/* Social Proof / Trust Indicators */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.7, delay: 0.7 }}
            className="mt-8 flex items-center justify-center gap-8 text-sm text-slate-500"
          >
            <div className="flex items-center gap-2">
              <span className="text-2xl">✓</span>
              <span>RBI Compliant</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-2xl">✓</span>
              <span>256-bit Encryption</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-2xl">✓</span>
              <span>Instant Approval</span>
            </div>
          </motion.div>
        </div>

        {/* Interactive Cards */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="flex flex-col md:flex-row items-center justify-center gap-8"
        >
          {/* Bank Card */}
          <motion.div
            variants={cardVariants}
            whileHover={{
              scale: 1.05,
              rotateY: 5,
              transition: { type: "spring", stiffness: 300, damping: 20 },
            }}
            whileTap={{ scale: 0.98 }}
            className="cursor-pointer group"
          >
            <GlassCard
              className="w-72 h-80 flex flex-col items-center justify-center relative overflow-hidden transition-all duration-300"
              onClick={() => navigate("/bank")}
            >
              {/* Gradient Overlay on Hover */}
              <div className="absolute inset-0 bg-gradient-to-br from-rose-500/0 to-purple-500/0 group-hover:from-rose-500/10 group-hover:to-purple-500/10 transition-all duration-500" />

              {/* Icon */}
              <div className="text-6xl mb-4 transform group-hover:scale-110 transition-transform duration-300">
                🏦
              </div>

              {/* Content */}
              <h3 className="text-2xl font-bold text-slate-900 mb-3">
                For Banks
              </h3>
              <p className="text-sm text-slate-600 text-center px-6 leading-relaxed">
                Partner to expand your borrower base & reduce NPAs with
                AI-powered risk assessment
              </p>

              {/* CTA Arrow */}
              <motion.div
                initial={{ x: -10, opacity: 0 }}
                whileHover={{ x: 0, opacity: 1 }}
                className="mt-6 flex items-center gap-2 text-sm font-medium text-rose-600"
              >
                <span>Explore Platform</span>
                <span className="transform group-hover:translate-x-1 transition-transform">
                  →
                </span>
              </motion.div>
            </GlassCard>
          </motion.div>

          {/* Customer Card */}
          <motion.div
            variants={cardVariants}
            whileHover={{
              scale: 1.05,
              rotateY: -5,
              transition: { type: "spring", stiffness: 300, damping: 20 },
            }}
            whileTap={{ scale: 0.98 }}
            className="cursor-pointer group"
          >
            <GlassCard
              className="w-72 h-80 flex flex-col items-center justify-center relative overflow-hidden transition-all duration-300"
              onClick={() => navigate("/customer")}
            >
              {/* Gradient Overlay on Hover */}
              <div className="absolute inset-0 bg-gradient-to-br from-sky-500/0 to-cyan-500/0 group-hover:from-sky-500/10 group-hover:to-cyan-500/10 transition-all duration-500" />

              {/* Icon */}
              <div className="text-6xl mb-4 transform group-hover:scale-110 transition-transform duration-300">
                👤
              </div>

              {/* Content */}
              <h3 className="text-2xl font-bold text-slate-900 mb-3">
                For Customers
              </h3>
              <p className="text-sm text-slate-600 text-center px-6 leading-relaxed">
                Build your credit profile & access fair loans with transparent
                terms and instant decisions
              </p>

              {/* CTA Arrow */}
              <motion.div
                initial={{ x: -10, opacity: 0 }}
                whileHover={{ x: 0, opacity: 1 }}
                className="mt-6 flex items-center gap-2 text-sm font-medium text-sky-600"
              >
                <span>Get Started</span>
                <span className="transform group-hover:translate-x-1 transition-transform">
                  →
                </span>
              </motion.div>
            </GlassCard>
          </motion.div>
        </motion.div>

        {/* Bottom CTA or Info */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 1 }}
          className="mt-16 text-center"
        >
          <p className="text-sm text-slate-500">
            Trusted by leading financial institutions across India
          </p>
        </motion.div>
      </motion.div>
    </div>
  );
}
