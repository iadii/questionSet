"use client";
import { useState } from "react";
import Editor from "@monaco-editor/react";
import { Play } from "lucide-react";
import { apiFetch } from "@/lib/api";

export default function CodePlayground() {
  const [code, setCode] = useState('// Write your code here\n\nclass Solution {\n  public void solve() {\n    System.out.println("Hello, World!");\n  }\n}');
  const [language, setLanguage] = useState("java");
  const [output, setOutput] = useState("");
  const [isRunning, setIsRunning] = useState(false);

  const handleRun = async () => {
    setIsRunning(true);
    setOutput("Executing...");
    try {
      const res = await apiFetch<any>("/execute", {
        method: "POST",
        body: JSON.stringify({
          questionId: null, // Let backend assign random question for generic execution
          language,
          code
        }),
      });
      setOutput(`Status: ${res.status}\nRuntime: ${res.runtimeMs}ms\nMemory: ${res.memoryKb}KB\n\nOutput:\n${res.output}`);
    } catch (e: any) {
      setOutput(`Error: ${e.message}`);
    } finally {
      setIsRunning(false);
    }
  };

  return (
    <div className="bg-gray-900 rounded-2xl overflow-hidden shadow-xl border border-gray-800 flex flex-col h-[600px]">
      <div className="flex items-center justify-between px-4 py-3 bg-gray-800 border-b border-gray-700">
        <select 
          className="bg-gray-700 text-gray-200 text-sm rounded-lg px-3 py-1.5 outline-none border border-gray-600 focus:border-blue-500"
          value={language}
          onChange={(e) => setLanguage(e.target.value)}
        >
          <option value="java">Java</option>
          <option value="python">Python</option>
          <option value="javascript">JavaScript</option>
        </select>
        
        <button 
          onClick={handleRun}
          disabled={isRunning}
          className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white px-4 py-1.5 rounded-lg text-sm font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Play className="w-4 h-4" />
          {isRunning ? "Running..." : "Run Code"}
        </button>
      </div>
      
      <div className="flex-1 min-h-0">
        <Editor
          height="100%"
          language={language}
          theme="vs-dark"
          value={code}
          onChange={(val) => setCode(val || "")}
          options={{
            minimap: { enabled: false },
            fontSize: 14,
            padding: { top: 16 }
          }}
        />
      </div>
      
      <div className="h-48 bg-gray-950 border-t border-gray-800 p-4 overflow-y-auto">
        <h4 className="text-gray-400 text-xs font-bold uppercase tracking-wider mb-2">Terminal Output</h4>
        <pre className="text-gray-300 text-sm font-mono whitespace-pre-wrap">{output}</pre>
      </div>
    </div>
  );
}
