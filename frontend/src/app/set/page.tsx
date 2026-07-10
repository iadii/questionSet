import Link from "next/link";
import ProtectedRoute from "@/components/ProtectedRoute";
import FloatingNavbar from "@/components/FloatingNavbar";
import { Code2, Database, LayoutTemplate, BrainCircuit, Users, ArrowRight } from "lucide-react";

export default function SetHubPage() {
  const sets = [
    {
      title: "Data Structures & Algorithms",
      description: "Master DSA with 380+ curated problems commonly asked in technical rounds. Sort, filter, and practice specific patterns.",
      path: "/dsa",
      icon: <Code2 className="w-10 h-10 text-blue-400" />,
      color: "from-blue-500 to-indigo-500",
      bg: "bg-blue-500/10",
    },
    {
      title: "High-Level Design (HLD)",
      description: "Learn to design scalable, distributed systems. Draw your architectures on our whiteboard and get instant AI feedback.",
      path: "/hld",
      icon: <Database className="w-10 h-10 text-emerald-400" />,
      color: "from-emerald-500 to-teal-500",
      bg: "bg-emerald-500/10",
    },
    {
      title: "Low-Level Design (LLD)",
      description: "Practice object-oriented design and design patterns. Build robust schemas and class diagrams.",
      path: "/lld",
      icon: <LayoutTemplate className="w-10 h-10 text-purple-400" />,
      color: "from-purple-500 to-pink-500",
      bg: "bg-purple-500/10",
    },
    {
      title: "CS Fundamentals",
      description: "Nail the core concepts. Deep dive into OS, DBMS, Computer Networks, and OOP principles.",
      path: "/cs-fundamentals",
      icon: <BrainCircuit className="w-10 h-10 text-amber-400" />,
      color: "from-amber-500 to-orange-500",
      bg: "bg-amber-500/10",
    },
    {
      title: "Behavioral",
      description: "Master the STAR method. Answer leadership principles and situational interview questions with confidence.",
      path: "/behavioral",
      icon: <Users className="w-10 h-10 text-rose-400" />,
      color: "from-rose-500 to-red-500",
      bg: "bg-rose-500/10",
    }
  ];

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-[#050505] text-white relative overflow-hidden flex flex-col selection:bg-blue-500/30">
        
        <FloatingNavbar />

        {/* Dynamic Background */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none fixed z-0">
          <div className="absolute top-[20%] left-[20%] w-[30%] h-[30%] rounded-full bg-blue-900/20 blur-[150px] mix-blend-screen animate-pulse" />
          <div className="absolute bottom-[20%] right-[20%] w-[30%] h-[30%] rounded-full bg-purple-900/20 blur-[150px] mix-blend-screen" />
          <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center opacity-[0.02]" />
        </div>

        <main className="flex-1 flex flex-col justify-center max-w-full px-4 sm:px-6 lg:px-8 py-12 pt-32 relative z-10">
          <div className="max-w-6xl mx-auto w-full">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pb-12">
              {sets.map((set, idx) => (
                <Link 
                  key={idx} 
                  href={set.path}
                  className={`group relative flex flex-col p-8 rounded-3xl bg-[#0a0a0a] border border-white/10 transition-all duration-500 hover:scale-[1.02] hover:-translate-y-2 focus:outline-none ${idx === 0 ? "md:col-span-2 h-full min-h-[250px]" : "h-full min-h-[250px]"}`}
                >
                  {/* Glowing background gradient on hover */}
                  <div className={`absolute inset-0 bg-gradient-to-br ${set.color} opacity-0 group-hover:opacity-10 transition-opacity duration-500 rounded-3xl`} />
                  
                  {/* Top Icon section */}
                  <div className="flex justify-between items-start mb-6 z-10">
                    <div className={`p-5 rounded-2xl border border-white/10 backdrop-blur-xl transition-transform duration-500 group-hover:scale-110 group-hover:rotate-6 ${set.bg}`}>
                      {set.icon}
                    </div>
                    <div className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center opacity-0 -translate-x-4 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-500">
                      <ArrowRight className="w-5 h-5 text-white" />
                    </div>
                  </div>
                  
                  {/* Content section */}
                  <div className="mt-auto space-y-3 z-10 text-left">
                    <h3 className={`font-bold text-white tracking-tight leading-tight transition-colors duration-300 ${idx === 0 ? 'text-3xl md:text-4xl' : 'text-2xl'}`}>
                      {set.title}
                    </h3>
                    <p className={`text-gray-400 leading-relaxed font-light ${idx === 0 ? 'text-lg md:text-xl' : 'text-sm md:text-base'}`}>
                      {set.description}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </main>
      </div>

      {/* Internal style to hide scrollbar while keeping functionality */}
      <style dangerouslySetInnerHTML={{__html: `
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .hide-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}} />
    </ProtectedRoute>
  );
}
