"use client";

import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { useAuthStore } from '@/store/authStore';
import { ArrowRight, Code2, Database, LayoutTemplate } from 'lucide-react';

export default function Home() {
  const { isAuthenticated, logout } = useAuthStore();
  
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1, 
      transition: { staggerChildren: 0.15, delayChildren: 0.1 }
    }
  };

  const itemVariants: any = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 80, damping: 20 } }
  };

  return (
    <div className="min-h-screen bg-[#050505] text-gray-200 font-sans overflow-hidden relative selection:bg-blue-500/30">
      
      {/* Premium Subtle Background Noise & Gradient */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        {/* Subtle grid pattern */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>
        {/* Soft radial glows */}
        <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] rounded-full bg-blue-900/10 blur-[150px] mix-blend-screen" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[60%] h-[60%] rounded-full bg-indigo-900/10 blur-[150px] mix-blend-screen" />
      </div>

      {/* Navbar */}
      <nav className="w-full bg-[#050505]/80 backdrop-blur-xl border-b border-white/5 fixed top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex-shrink-0 flex items-center">
              <span className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
                <div className="w-6 h-6 bg-blue-600 rounded flex items-center justify-center">
                  <Code2 className="w-4 h-4 text-white" />
                </div>
                InterviewPrep
              </span>
            </div>
            <div className="flex items-center gap-6">
              {isAuthenticated ? (
                <>
                  <Link href="/dashboard" className="text-gray-400 hover:text-white font-medium text-sm transition-colors">
                    Dashboard
                  </Link>
                  <Link href="/profile" className="text-gray-400 hover:text-white font-medium text-sm transition-colors">
                    Profile
                  </Link>
                  <button
                    onClick={logout}
                    className="text-gray-400 hover:text-white text-sm font-medium transition-colors"
                  >
                    Log out
                  </button>
                </>
              ) : (
                <>
                  <Link href="/login" className="text-gray-400 hover:text-white font-medium text-sm transition-colors">
                    Log in
                  </Link>
                  <Link
                    href="/signup"
                    className="bg-white text-black hover:bg-gray-200 px-4 py-2 rounded-md text-sm font-semibold transition-all"
                  >
                    Sign up
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </nav>

      <main className="pt-32 pb-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto relative z-10">
        
        {/* Editorial Hero Section */}
        <motion.div 
          className="flex flex-col lg:flex-row items-center gap-16"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {/* Hero Text */}
          <div className="lg:w-1/2 space-y-8 z-20 relative">
            <motion.div variants={itemVariants} className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-gray-300 text-xs font-semibold uppercase tracking-wider backdrop-blur-md">
              <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse"></span>
              Platform 2.0 Live
            </motion.div>
            
            <motion.h1 variants={itemVariants} className="text-5xl md:text-6xl lg:text-7xl font-extrabold tracking-tight leading-[1.1] text-white">
              The Engineering <br/>
              <span className="text-blue-500">Interview Sandbox.</span>
            </motion.h1>
            
            <motion.p variants={itemVariants} className="text-lg text-gray-400 max-w-lg leading-relaxed font-light">
              Don't just read problems. Experience a fully integrated workspace featuring a Dark Mode IDE, dynamic Whiteboard, and real-time AI assistance for DSA and System Design.
            </motion.p>

            <motion.div variants={itemVariants} className="flex flex-wrap items-center gap-4 pt-4">
              <Link
                href="/set"
                className="group px-6 py-3.5 bg-white text-black hover:bg-gray-100 rounded-lg font-semibold text-base transition-all flex items-center justify-center gap-2"
              >
                Start Practicing
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
              {!isAuthenticated && (
                <Link
                  href="/signup"
                  className="px-6 py-3.5 bg-white/5 border border-white/10 hover:bg-white/10 text-white rounded-lg font-semibold text-base transition-all flex items-center justify-center backdrop-blur-sm"
                >
                  Create Free Account
                </Link>
              )}
            </motion.div>
          </div>

          {/* Hero Image / Workspace Mockup */}
          <motion.div variants={itemVariants} className="lg:w-1/2 relative w-full aspect-square md:aspect-[4/3] lg:aspect-square">
            <div className="absolute inset-0 bg-gradient-to-tr from-blue-500/10 to-purple-500/10 rounded-2xl blur-2xl transform rotate-3" />
            <div className="relative h-full w-full rounded-2xl border border-white/10 shadow-[0_0_40px_rgba(0,0,0,0.8)] overflow-hidden bg-[#0a0a0a] ring-1 ring-white/5">
              <Image 
                src="/hero-mockup.png" 
                alt="Interview Workspace IDE Mockup" 
                fill 
                className="object-cover hover:scale-105 transition-transform duration-700 ease-out"
                priority
              />
            </div>
          </motion.div>
        </motion.div>

        {/* Bento Box Features Section */}
        <motion.div 
          className="mt-40"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
        >
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-white mb-4 tracking-tight">Everything you need to succeed</h2>
            <p className="text-gray-400 max-w-2xl mx-auto">Master the fundamental patterns and system architectures required to pass top-tier tech interviews.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Feature 1 */}
            <motion.div variants={itemVariants} className="group bg-gradient-to-b from-white/5 to-transparent p-[1px] rounded-2xl">
              <div className="bg-[#0a0a0a] h-full p-8 rounded-2xl border border-white/5 group-hover:border-white/10 transition-colors">
                <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-6 bg-blue-500/10 border border-blue-500/20 text-blue-400 group-hover:scale-110 transition-transform">
                  <Code2 className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-semibold text-white mb-3">Topic-wise DSA</h3>
                <p className="text-gray-400 text-sm leading-relaxed">
                  120+ curated questions broken down by category. Write your solution in our Monaco-powered IDE without ever leaving the app.
                </p>
              </div>
            </motion.div>

            {/* Feature 2 */}
            <motion.div variants={itemVariants} className="group bg-gradient-to-b from-white/5 to-transparent p-[1px] rounded-2xl">
              <div className="bg-[#0a0a0a] h-full p-8 rounded-2xl border border-white/5 group-hover:border-white/10 transition-colors">
                <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-6 bg-purple-500/10 border border-purple-500/20 text-purple-400 group-hover:scale-110 transition-transform">
                  <LayoutTemplate className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-semibold text-white mb-3">System Design Hub</h3>
                <p className="text-gray-400 text-sm leading-relaxed">
                  Tackle HLD & LLD case studies. Sketch out distributed architectures on the integrated Excalidraw whiteboard.
                </p>
              </div>
            </motion.div>

            {/* Feature 3 */}
            <motion.div variants={itemVariants} className="group bg-gradient-to-b from-white/5 to-transparent p-[1px] rounded-2xl">
              <div className="bg-[#0a0a0a] h-full p-8 rounded-2xl border border-white/5 group-hover:border-white/10 transition-colors">
                <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-6 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 group-hover:scale-110 transition-transform">
                  <Database className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-semibold text-white mb-3">Real Interview Data</h3>
                <p className="text-gray-400 text-sm leading-relaxed">
                  Filter questions by company tags (Walmart, Amazon, Google). See acceptance rates and focus on high-frequency problems.
                </p>
              </div>
            </motion.div>
          </div>
        </motion.div>

      </main>
    </div>
  );
}
