import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import GlassCard from "../components/GlassCard";
import MissionSection from "../components/MissionSection";
import Footer from "../components/Footer";
import Header from "../components/Header";

export default function Customer() {
  const navigate = useNavigate();
  const [selectedFeature, setSelectedFeature] = useState(0);
  const [expandedFaqs, setExpandedFaqs] = useState(null);

  // Feature data with detailed descriptions
  const features = [
    {
      title: "Credit Builder Plans",
      icon: "📈",
      description: "Build credit through micro-savings",
      details:
        "Start small with flexible savings plans. Every deposit builds your credit score without requiring a full loan application.",
      benefits: ["Flexible amounts", "Instant credit reporting", "0% interest"],
      color: "from-rose-500/20 to-pink-500/20",
    },
    {
      title: "Smart Insights",
      icon: "🧠",
      description: "AI-powered spending analysis",
      details:
        "Understand your financial patterns with AI-generated insights. Get personalized recommendations to improve credit eligibility.",
      benefits: ["Real-time analysis", "Personalized tips", "Spending trends"],
      color: "from-purple-500/20 to-violet-500/20",
    },
    {
      title: "Instant Access",
      icon: "⚡",
      description: "Get approved in minutes",
      details:
        "Our AI processes your application instantly. No lengthy paperwork, no waiting—access credit when you need it.",
      benefits: ["Instant decision", "Quick disbursal", "No documentation"],
      color: "from-amber-500/20 to-orange-500/20",
    },
    {
      title: "Financial Literacy Hub",
      icon: "📚",
      description: "Learn & grow financially",
      details:
        "Access curated content designed for credit-invisible users. Learn budgeting, savings, and smart financial habits.",
      benefits: ["Video tutorials", "Articles & guides", "Expert tips"],
      color: "from-sky-500/20 to-blue-500/20",
    },
  ];

  // FAQ data
  const faqs = [
    {
      question: "How does the AI scoring work?",
      answer:
        "Our AI analyzes alternative data like transaction patterns, utility payments, and savings behavior—not just traditional credit history—to provide a fair credit score.",
    },
    {
      question: "Is my data secure?",
      answer:
        "Yes. We use 256-bit encryption, comply with RBI guidelines, and never share your data without explicit consent.",
    },
    {
      question: "What are the eligibility requirements?",
      answer:
        "You need a valid ID, bank account, and phone number. We accept applications from anyone 18+ years old.",
    },
    {
      question: "Can I build credit with micro-savings?",
      answer:
        "Absolutely! Micro-savings plans from ₹500/month are reported to credit bureaus, helping you build a credit history from scratch.",
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
      transition: { type: "spring", stiffness: 100, damping: 15 },
    },
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className="min-h-screen bg-gradient-to-b from-white via-amber-50 to-slate-50"
    >
      <div className="max-w-6xl mx-auto px-6 pt-16 pb-24">
        {/* Back Button */}
        <motion.button
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="mb-8 inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium text-slate-600 hover:bg-slate-100 transition-colors"
          onClick={() => navigate("/")}
        >
          <span>←</span>
          <span>Back to Home</span>
        </motion.button>

        {/* Header Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Header />
        </motion.div>

        {/* Hero Content */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-16"
        >
          <div className="inline-block mb-4 px-3 py-1 rounded-full bg-gradient-to-r from-amber-100 to-orange-100 border border-amber-200">
            <span className="text-xs font-medium text-amber-800">
              For Underserved Users
            </span>
          </div>

          <h2 className="text-4xl md:text-5xl font-extrabold leading-tight text-slate-900 mb-4">
            Credit for Everyone.
            <br />
            <span className="bg-gradient-to-r from-amber-500 via-orange-500 to-rose-500 bg-clip-text text-transparent">
              Smart. Fair. Fast.
            </span>
          </h2>

          <p className="mt-6 text-lg text-slate-600 max-w-2xl leading-relaxed">
            Build credit through micro-savings and AI scoring that rewards{" "}
            <span className="font-semibold">real behavior</span> rather than
            traditional credit history.
          </p>

          {/* Trust Indicators */}
          <div className="mt-8 flex flex-wrap gap-6">
            <div className="flex items-center gap-3">
              <span className="text-2xl">✓</span>
              <span className="text-sm text-slate-600">
                <strong>500K+</strong> Users Approved
              </span>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-2xl">✓</span>
              <span className="text-sm text-slate-600">
                <strong>₹1000+</strong> Cr Disbursed
              </span>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-2xl">✓</span>
              <span className="text-sm text-slate-600">
                <strong>2 min</strong> Approval Time
              </span>
            </div>
          </div>
        </motion.div>

        {/* CTA Button */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="mb-16"
        >
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.98 }}
            className="px-8 py-3 rounded-lg bg-gradient-to-r from-amber-500 to-orange-500 text-white font-semibold shadow-lg hover:shadow-xl transition-shadow"
          >
            Start Your Journey
          </motion.button>
        </motion.div>

        {/* Features Section */}
        <div className="mb-20">
          <motion.h3
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="text-2xl font-bold text-slate-900 mb-8"
          >
            Why Choose Our Platform?
          </motion.h3>

          {/* Feature Cards Grid */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12"
          >
            {features.map((feature, idx) => (
              <motion.div
                key={feature.title}
                variants={itemVariants}
                whileHover={{ y: -4 }}
                onClick={() => setSelectedFeature(idx)}
                className="cursor-pointer"
              >
                <GlassCard className="h-full overflow-hidden relative group">
                  {/* Gradient Background */}
                  <div
                    className={`absolute inset-0 bg-gradient-to-br ${feature.color} opacity-0 group-hover:opacity-100 transition-opacity duration-300`}
                  />

                  <div className="relative z-10">
                    <div className="flex items-start justify-between mb-3">
                      <span className="text-4xl">{feature.icon}</span>
                      <motion.div
                        initial={{ opacity: 0 }}
                        whileHover={{ opacity: 1 }}
                        className="text-amber-600"
                      >
                        →
                      </motion.div>
                    </div>

                    <h4 className="text-lg font-bold text-slate-900 mb-2">
                      {feature.title}
                    </h4>
                    <p className="text-sm text-slate-600">
                      {feature.description}
                    </p>

                    {/* Benefits Preview */}
                    <div className="mt-4 flex flex-wrap gap-2">
                      {feature.benefits.slice(0, 2).map((benefit) => (
                        <span
                          key={benefit}
                          className="inline-block px-2 py-1 bg-slate-100 text-xs text-slate-700 rounded"
                        >
                          {benefit}
                        </span>
                      ))}
                    </div>
                  </div>
                </GlassCard>
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
              className="bg-gradient-to-r from-slate-50 to-amber-50 rounded-xl p-8 border border-slate-200"
            >
              <div className="flex items-start gap-6">
                <div className="text-6xl">{features[selectedFeature].icon}</div>
                <div className="flex-1">
                  <h3 className="text-2xl font-bold text-slate-900 mb-3">
                    {features[selectedFeature].title}
                  </h3>
                  <p className="text-slate-700 mb-6 leading-relaxed">
                    {features[selectedFeature].details}
                  </p>

                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {features[selectedFeature].benefits.map((benefit) => (
                      <div
                        key={benefit}
                        className="flex items-center gap-2 text-sm"
                      >
                        <span className="text-amber-600">✓</span>
                        <span className="text-slate-700">{benefit}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* How It Works Section */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="mb-20"
        >
          <h3 className="text-2xl font-bold text-slate-900 mb-8">
            How It Works
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {[
              { step: "1", label: "Sign Up", desc: "Quick & secure" },
              { step: "2", label: "KYC Verification", desc: "AI-powered check" },
              { step: "3", label: "Start Saving", desc: "Micro-savings plan" },
              { step: "4", label: "Get Approved", desc: "Instant decision" },
            ].map((item, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.15 }}
              >
                <GlassCard className="h-full">
                  <div className="text-center">
                    <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center text-white font-bold text-lg">
                      {item.step}
                    </div>
                    <h4 className="font-semibold text-slate-900 mb-1">
                      {item.label}
                    </h4>
                    <p className="text-xs text-slate-500">{item.desc}</p>
                  </div>
                </GlassCard>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* FAQ Section */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="mb-20"
        >
          <h3 className="text-2xl font-bold text-slate-900 mb-8">
            Frequently Asked Questions
          </h3>

          <div className="space-y-4">
            {faqs.map((faq, idx) => (
              <motion.div
                key={idx}
                initial={false}
                animate={{
                  backgroundColor:
                    expandedFaqs === idx ? "rgba(249, 240, 255, 0.5)" : "rgba(0, 0, 0, 0)",
                }}
                className="rounded-lg border border-slate-200 overflow-hidden"
              >
                <button
                  onClick={() =>
                    setExpandedFaqs(expandedFaqs === idx ? null : idx)
                  }
                  className="w-full px-6 py-4 flex items-center justify-between hover:bg-slate-50 transition-colors"
                >
                  <span className="font-semibold text-slate-900 text-left">
                    {faq.question}
                  </span>
                  <motion.span
                    animate={{ rotate: expandedFaqs === idx ? 180 : 0 }}
                    className="text-amber-600 text-xl"
                  >
                    ▼
                  </motion.span>
                </button>

                <AnimatePresence>
                  {expandedFaqs === idx && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ type: "spring", stiffness: 300, damping: 30 }}
                      className="border-t border-slate-200 bg-slate-50"
                    >
                      <p className="px-6 py-4 text-slate-600 leading-relaxed">
                        {faq.answer}
                      </p>
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
          className="text-center mb-16 bg-gradient-to-r from-amber-50 to-orange-50 rounded-xl p-12 border border-amber-200"
        >
          <h3 className="text-3xl font-bold text-slate-900 mb-3">
            Ready to Build Your Credit?
          </h3>
          <p className="text-slate-600 mb-6">
            Join 500K+ users who've already started their credit journey.
          </p>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.98 }}
            className="px-8 py-3 rounded-lg bg-gradient-to-r from-amber-500 to-orange-500 text-white font-semibold shadow-lg hover:shadow-xl transition-shadow"
          >
            Get Started Now
          </motion.button>
        </motion.div>
      </div>

      <MissionSection />
      <Footer />
    </motion.div>
  );
}
