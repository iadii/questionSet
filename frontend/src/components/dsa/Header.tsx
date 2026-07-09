import Link from "next/link";
import { ArrowLeft } from "lucide-react";

interface HeaderProps {
  totalQuestions: number;
  totalTopics: number;
}

export default function Header({ totalQuestions, totalTopics }: HeaderProps) {
  return (
    <div className="sticky top-0 z-20 bg-white/70 backdrop-blur-md border-b border-gray-100 shadow-[0_4px_30px_rgba(0,0,0,0.02)]">
      <div className="max-w-6xl mx-auto px-6 py-5 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-gray-900 bg-clip-text text-transparent bg-gradient-to-r from-gray-900 to-gray-500">
            Walmart 120
          </h1>
          <p className="text-sm font-medium text-gray-500 mt-1 flex items-center gap-2">
            <span className="bg-gray-100 text-gray-700 px-2.5 py-0.5 rounded-full border border-gray-200 shadow-sm">
              {totalQuestions} questions
            </span>
            <span className="text-gray-300">•</span>
            <span>{totalTopics} topics</span>
          </p>
        </div>
        <Link 
          href="/dashboard" 
          className="group flex items-center gap-2 text-sm font-semibold text-gray-600 hover:text-gray-900 transition-colors bg-white px-4 py-2 rounded-xl border border-gray-200 shadow-sm hover:shadow-md"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          Back to Dashboard
        </Link>
      </div>
    </div>
  );
}
