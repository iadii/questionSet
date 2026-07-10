"use client";

import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { Zap } from "lucide-react";

import { useAuthStore } from "@/store/authStore";

export default function FloatingNavbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const pathname = usePathname();
  const { isAuthenticated, logout } = useAuthStore();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const authLinks = [
    { name: "Dashboard", href: "/dashboard" },
    { name: "Sets", href: "/set" },
    { name: "Problems", href: "/problems" },
    { name: "Profile", href: "/profile" },
  ];

  return (
    <div className={`fixed left-1/2 -translate-x-1/2 z-50 w-full transition-all duration-500 ease-in-out ${isScrolled ? 'top-6 max-w-3xl px-4' : 'top-0 max-w-7xl px-4 md:px-8'}`}>
      <nav className={`mx-auto transition-all duration-500 ease-in-out overflow-hidden flex items-center justify-between ${
        isScrolled 
          ? 'rounded-2xl border border-white/10 bg-[#0a0a0a]/80 backdrop-blur-xl shadow-2xl h-16 px-6' 
          : 'rounded-none border border-transparent bg-transparent h-24 px-2'
      }`}>
        <Link href="/" className="group flex items-center justify-center p-2 rounded-xl hover:bg-white/5 transition-colors gap-2">
          <Zap className={`transition-all duration-500 ${isScrolled ? 'w-6 h-6 text-blue-400' : 'w-8 h-8 text-white group-hover:text-blue-400'}`} />
          {!isScrolled && <span className="text-xl font-bold text-white tracking-tight hidden sm:block">InterviewPrep</span>}
        </Link>
        
        <div className="flex gap-4 sm:gap-6 items-center">
          {isAuthenticated ? (
            <>
              {authLinks.map((link) => {
                const isActive = pathname.startsWith(link.href);
                return (
                  <div key={link.name} className="relative hidden sm:block">
                    <Link 
                      href={link.href} 
                      className={`text-sm transition-colors relative z-10 ${isActive ? 'font-semibold text-blue-400' : 'font-medium text-gray-400 hover:text-white'}`}
                    >
                      {link.name}
                    </Link>
                    {isActive && (
                      <div className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-blue-400" />
                    )}
                  </div>
                );
              })}
              <button onClick={logout} className="text-sm font-medium text-gray-400 hover:text-white transition-colors">
                Log out
              </button>
            </>
          ) : (
            <>
              <Link href="/login" className="text-sm font-medium text-gray-400 hover:text-white transition-colors">
                Log in
              </Link>
              <Link href="/signup" className="text-sm font-semibold bg-white text-black px-4 py-1.5 rounded-full hover:bg-gray-200 transition-colors">
                Sign up
              </Link>
            </>
          )}
        </div>
      </nav>
    </div>
  );
}
