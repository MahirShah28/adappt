import React from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import GlassCard from "../components/GlassCard";

import MissionSection from "../components/MissionSection";
import Footer from "../components/Footer";
import Header from "../components/Header";

// ...existing imports

export default function Customer() {
  const navigate = useNavigate();
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className="min-h-screen bg-gradient-to-b from-white via-amber-50 to-slate-50"
    >
      <div className="max-w-6xl mx-auto px-6 pt-16 pb-24">
        <button
          className="mb-6 text-sm font-medium text-slate-600"
          onClick={() => navigate("/")}
        >
          ← Back
        </button>
        <Header />
        <h2 className="text-3xl font-extrabold leading-tight text-slate-900">
          Credit for Everyone. Smart. Fair. Fast.
        </h2>
        <p className="mt-4 text-slate-600">
          Build credit through micro-savings and AI scoring that rewards real
          behavior.
        </p>

        <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-4">
          {[
            "Credit Builder Plans",
            "Smart Insights",
            "Instant Access",
            "Financial Literacy Hub",
          ].map((f) => (
            <GlassCard key={f}>
              <h4 className="font-semibold">{f}</h4>
              <p className="mt-2 text-sm text-slate-500">
                Description for {f}.
              </p>
            </GlassCard>
          ))}
        </div>
      </div>

      <MissionSection />
      <Footer />
    </motion.div>
  );
}
