import Link from "next/link";
import ProtectedRoute from "@/components/ProtectedRoute";
import { Code2, Database, LayoutTemplate, BrainCircuit, Users } from "lucide-react";

export default function SetHubPage() {
  const sets = [
    {
      title: "Data Structures & Algorithms",
      description: "Master DSA with 120+ curated problems commonly asked in technical rounds.",
      path: "/dsa",
      icon: <Code2 className="w-8 h-8 text-blue-400" />,
      color: "from-blue-500/20 to-indigo-500/20",
      border: "hover:border-blue-500/50"
    },
    {
      title: "High-Level Design (HLD)",
      description: "Learn to design scalable, distributed systems for system design rounds.",
      path: "/hld",
      icon: <Database className="w-8 h-8 text-emerald-400" />,
      color: "from-emerald-500/20 to-teal-500/20",
      border: "hover:border-emerald-500/50"
    },
    {
      title: "Low-Level Design (LLD)",
      description: "Practice object-oriented design and design patterns.",
      path: "/lld",
      icon: <LayoutTemplate className="w-8 h-8 text-purple-400" />,
      color: "from-purple-500/20 to-pink-500/20",
      border: "hover:border-purple-500/50"
    },
    {
      title: "CS Fundamentals",
      description: "OS, DBMS, Computer Networks, and other core CS concepts.",
      path: "/cs-fundamentals",
      icon: <BrainCircuit className="w-8 h-8 text-amber-400" />,
      color: "from-amber-500/20 to-orange-500/20",
      border: "hover:border-amber-500/50"
    },
    {
      title: "Behavioral",
      description: "Leadership principles and situational interview questions.",
      path: "/behavioral",
      icon: <Users className="w-8 h-8 text-rose-400" />,
      color: "from-rose-500/20 to-red-500/20",
      border: "hover:border-rose-500/50"
    }
  ];

  return (
    <ProtectedRoute>
      <div className="text-white relative overflow-hidden pb-24">
        
        {/* Navbar */}
        <nav className="border-b border-white/10 bg-[#050505]/80 backdrop-blur-xl sticky top-0 z-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
            <Link href="/" className="text-xl font-bold text-white tracking-tight">InterviewPrep</Link>
            <div className="flex gap-6">
              <Link href="/dashboard" className="text-gray-400 hover:text-white transition-colors">Dashboard</Link>
              <Link href="/set" className="text-blue-400 font-medium">Sets</Link>
              <Link href="/problems" className="text-gray-400 hover:text-white transition-colors">Problems</Link>
              <Link href="/profile" className="text-gray-400 hover:text-white transition-colors">Profile</Link>
            </div>
          </div>
        </nav>

        {/* Background Mesh Gradient */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none fixed z-0">
          <div className="absolute top-[20%] left-[10%] w-[60%] h-[60%] rounded-full bg-blue-900/10 blur-[120px] mix-blend-screen" />
          <div className="absolute bottom-[20%] right-[10%] w-[50%] h-[50%] rounded-full bg-purple-900/10 blur-[120px] mix-blend-screen" />
        </div>

        <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16 relative z-10">
          <div className="text-center mb-16">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">Question Sets</h1>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto">
              Select a category below to start practicing curated questions designed to help you ace your technical interviews.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {sets.map((set, idx) => (
              <Link 
                key={idx} 
                href={set.path}
                className={`group relative flex flex-col p-8 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-xl transition-all duration-300 hover:-translate-y-1 ${set.border}`}
              >
                <div className={`absolute inset-0 rounded-2xl bg-gradient-to-br ${set.color} opacity-0 group-hover:opacity-10 transition-opacity duration-300`} />
                
                <div className="mb-6 p-4 bg-white/5 rounded-xl border border-white/10 w-fit">
                  {set.icon}
                </div>
                
                <h3 className="text-2xl font-bold text-white mb-3 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-white group-hover:to-gray-400 transition-all">
                  {set.title}
                </h3>
                
                <p className="text-gray-400 leading-relaxed mt-auto">
                  {set.description}
                </p>
              </Link>
            ))}
          </div>
        </main>
      </div>
    </ProtectedRoute>
  );
}
