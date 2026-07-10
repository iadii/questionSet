"use client";

import Link from 'next/link';
import { motion } from 'framer-motion';
import { useAuthStore } from '@/store/authStore';
import { ArrowRight } from 'lucide-react';

export default function Home() {
  const { isAuthenticated, logout } = useAuthStore();
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1, 
      transition: { staggerChildren: 0.2, delayChildren: 0.1 }
    }
  };

  const itemVariants: any = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 100, damping: 15 } }
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white font-sans overflow-hidden relative">
      
      {/* Background Mesh Gradient */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-[30%] -left-[10%] w-[70%] h-[70%] rounded-full bg-blue-900/20 blur-[120px] mix-blend-screen" />
        <div className="absolute top-[20%] -right-[20%] w-[60%] h-[60%] rounded-full bg-indigo-900/20 blur-[120px] mix-blend-screen" />
        <div className="absolute -bottom-[30%] left-[20%] w-[80%] h-[80%] rounded-full bg-purple-900/20 blur-[120px] mix-blend-screen" />
      </div>

      {/* Navbar */}
      <nav className="w-full bg-white/5 backdrop-blur-xl border-b border-white/10 fixed top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex-shrink-0 flex items-center">
              <span className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-indigo-400 tracking-tight">
                InterviewPrep
              </span>
            </div>
            <div className="flex items-center gap-4">
              {isAuthenticated ? (
                <>
                  <Link href="/dashboard" className="text-gray-300 hover:text-white font-medium text-sm transition-colors">
                    Dashboard
                  </Link>
                  <Link href="/profile" className="text-gray-300 hover:text-white font-medium text-sm transition-colors">
                    Profile
                  </Link>
                  <button
                    onClick={logout}
                    className="bg-white/10 text-white hover:bg-white/20 px-4 py-2 rounded-lg text-sm font-semibold transition-all shadow-sm"
                  >
                    Log out
                  </button>
                </>
              ) : (
                <>
                  <Link href="/login" className="text-gray-300 hover:text-white font-medium text-sm transition-colors">
                    Log in
                  </Link>
                  <Link
                    href="/signup"
                    className="bg-white text-black hover:bg-gray-100 px-4 py-2 rounded-lg text-sm font-semibold transition-all shadow-sm"
                  >
                    Sign up
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="pt-32 pb-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto relative z-10">
        <motion.div 
          className="text-center space-y-8"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <motion.div variants={itemVariants} className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 text-blue-300 text-sm font-medium mb-4 shadow-[0_0_15px_rgba(59,130,246,0.15)]">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
            </span>
            Platform is live
          </motion.div>
          
          <motion.h1 variants={itemVariants} className="text-5xl md:text-7xl font-extrabold tracking-tight max-w-4xl mx-auto leading-[1.1] text-white">
            Master your <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-indigo-400 to-purple-400">software engineering</span> interviews.
          </motion.h1>
          
          <motion.p variants={itemVariants} className="text-lg md:text-xl text-gray-400 max-w-2xl mx-auto leading-relaxed">
            A complete platform featuring a curated 120+ question DSA sheet, real interview questions from top tech companies, and system design case studies.
          </motion.p>

          <motion.div variants={itemVariants} className="flex flex-col sm:flex-row justify-center gap-4 pt-4">
            <Link
              href="/set"
              className="group px-8 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white rounded-xl font-semibold text-lg transition-all shadow-[0_0_20px_rgba(79,70,229,0.3)] flex items-center justify-center gap-2"
            >
              Start Practicing
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link
              href="/signup"
              className="px-8 py-4 bg-white/5 border border-white/10 hover:bg-white/10 text-white rounded-xl font-semibold text-lg transition-all flex items-center justify-center backdrop-blur-sm"
            >
              Create Free Account
            </Link>
          </motion.div>
        </motion.div>

        {/* Feature Cards */}
        <motion.div 
          className="mt-32 grid grid-cols-1 md:grid-cols-3 gap-8"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
        >
          <motion.div variants={itemVariants} whileHover={{ y: -5 }} className="bg-white/5 backdrop-blur-xl p-8 rounded-2xl border border-white/10 hover:border-white/20 transition-all shadow-2xl">
            <div className="w-12 h-12 bg-blue-500/20 rounded-xl flex items-center justify-center mb-6 border border-blue-500/30 shadow-[0_0_15px_rgba(59,130,246,0.2)]">
              <span className="text-2xl">📊</span>
            </div>
            <h3 className="text-xl font-bold text-white mb-3">Topic-wise DSA Sheet</h3>
            <p className="text-gray-400 leading-relaxed">
              120+ highly curated questions categorized by Arrays, DP, Graphs, and more. Features progressive hints to help you learn without cheating.
            </p>
          </motion.div>

          <motion.div variants={itemVariants} whileHover={{ y: -5 }} className="bg-white/5 backdrop-blur-xl p-8 rounded-2xl border border-white/10 hover:border-white/20 transition-all shadow-2xl">
            <div className="w-12 h-12 bg-indigo-500/20 rounded-xl flex items-center justify-center mb-6 border border-indigo-500/30 shadow-[0_0_15px_rgba(99,102,241,0.2)]">
              <span className="text-2xl">🏢</span>
            </div>
            <h3 className="text-xl font-bold text-white mb-3">Previously Asked</h3>
            <p className="text-gray-400 leading-relaxed">
              Real questions asked in recent interviews (2024-2025) including CS fundamentals (OS, DBMS, OOP) and System Design.
            </p>
          </motion.div>

          <motion.div variants={itemVariants} whileHover={{ y: -5 }} className="bg-white/5 backdrop-blur-xl p-8 rounded-2xl border border-white/10 hover:border-white/20 transition-all shadow-2xl">
            <div className="w-12 h-12 bg-purple-500/20 rounded-xl flex items-center justify-center mb-6 border border-purple-500/30 shadow-[0_0_15px_rgba(168,85,247,0.2)]">
              <span className="text-2xl">🏗️</span>
            </div>
            <h3 className="text-xl font-bold text-white mb-3">System Design</h3>
            <p className="text-gray-400 leading-relaxed">
              Comprehensive High-Level (HLD) and Low-Level Design (LLD) problems to prepare you for senior engineering rounds.
            </p>
          </motion.div>
        </motion.div>
      </main>
    </div>
  );
}
