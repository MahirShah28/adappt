import React from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import GlassCard from "../components/GlassCard";

export default function Intro() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-white via-rose-50 to-sky-50">
      <motion.div
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="relative z-10 max-w-5xl w-full px-6 py-20"
      >
        <div className="text-center mb-10">
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-slate-900">
            Reimagining Credit Access for a Billion Indians.
          </h1>
          <p className="mt-4 text-slate-600 max-w-2xl mx-auto">
            AI Middleman — bridging banks & credit-invisible users with
            intelligence, fairness, and speed.
          </p>
        </div>

        <div className="flex items-center justify-center gap-8">
          <motion.div whileHover={{ rotateY: 8 }} className="cursor-pointer">
            <GlassCard
              className="w-56 h-64 flex flex-col items-center justify-center"
              onClick={() => navigate("/bank")}
            >
              <h3 className="mt-6 font-semibold text-slate-900">🏦 Bank</h3>
              <p className="text-sm text-slate-500 mt-2">
                Partner to expand borrowers & lower NPAs
              </p>
            </GlassCard>
          </motion.div>

          <motion.div whileHover={{ rotateY: -8 }} className="cursor-pointer">
            <GlassCard
              className="w-56 h-64 flex flex-col items-center justify-center"
              onClick={() => navigate("/customer")}
            >
              <h3 className="mt-6 font-semibold text-slate-900">👤 Customer</h3>
              <p className="text-sm text-slate-500 mt-2">
                Build credit, access fair loans
              </p>
            </GlassCard>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
}
