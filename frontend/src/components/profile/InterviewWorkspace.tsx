"use client";

import { useState } from "react";
import Editor from "@monaco-editor/react";
import { Play, Code2, PenTool } from "lucide-react";
import { apiFetch } from "@/lib/api";
import ChatSidebar, { ChatMessage } from "./ChatSidebar";
import Whiteboard from "./Whiteboard";

export default function InterviewWorkspace() {
  const [code, setCode] = useState('// Write your code here\n\nclass Solution {\n  public void solve() {\n    System.out.println("Hello, World!");\n  }\n}');
  const [language, setLanguage] = useState("java");
  const [output, setOutput] = useState("");
  const [isRunning, setIsRunning] = useState(false);
  
  // Workspace Mode State
  const [mode, setMode] = useState<"code" | "whiteboard">("code");
  
  // Chat State
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isThinking, setIsThinking] = useState(false);

  const handleRun = async () => {
    setIsRunning(true);
    setOutput("Executing...");
    try {
      const res = await apiFetch<any>("/execute", {
        method: "POST",
        body: JSON.stringify({
          questionId: null,
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

  const handleSendMessage = async (msg: string) => {
    const newMsg: ChatMessage = { role: "user", text: msg };
    setMessages((prev) => [...prev, newMsg]);
    setIsThinking(true);

    try {
      const res = await apiFetch<any>("/ai/chat", {
        method: "POST",
        body: JSON.stringify({
          code,
          language,
          message: msg
        })
      });
      
      const aiReply: ChatMessage = { role: "ai", text: res.reply || "Sorry, I couldn't process that." };
      setMessages((prev) => [...prev, aiReply]);
    } catch (e: any) {
      const errorReply: ChatMessage = { role: "ai", text: "Connection error. Please check if your Gemini API key is configured correctly in the backend!" };
      setMessages((prev) => [...prev, errorReply]);
    } finally {
      setIsThinking(false);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
      
      {/* Main Workspace Area (Takes 3/5 width on large screens) */}
      <div className="lg:col-span-3 bg-gray-900 rounded-2xl overflow-hidden shadow-xl border border-gray-800 flex flex-col h-[650px]">
        
        {/* Header Options */}
        <div className="flex items-center justify-between px-4 py-3 bg-gray-800 border-b border-gray-700">
          <div className="flex bg-gray-950 p-1 rounded-lg">
            <button 
              onClick={() => setMode("code")}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${mode === "code" ? "bg-gray-800 text-white shadow-sm" : "text-gray-400 hover:text-gray-200 hover:bg-gray-900"}`}
            >
              <Code2 className="w-4 h-4" /> Code
            </button>
            <button 
              onClick={() => setMode("whiteboard")}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${mode === "whiteboard" ? "bg-gray-800 text-white shadow-sm" : "text-gray-400 hover:text-gray-200 hover:bg-gray-900"}`}
            >
              <PenTool className="w-4 h-4" /> Whiteboard
            </button>
          </div>
          
          {mode === "code" && (
            <div className="flex items-center gap-3">
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
          )}
        </div>
        
        {/* Dynamic Content */}
        {mode === "code" ? (
          <>
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
            
            <div className="h-40 bg-gray-950 border-t border-gray-800 p-4 overflow-y-auto">
              <h4 className="text-gray-400 text-xs font-bold uppercase tracking-wider mb-2">Terminal Output</h4>
              <pre className="text-gray-300 text-sm font-mono whitespace-pre-wrap">{output}</pre>
            </div>
          </>
        ) : (
          <div className="flex-1 min-h-0 relative">
            <Whiteboard />
          </div>
        )}
      </div>

      {/* AI Chat Side (Takes 2/5 width) */}
      <div className="lg:col-span-2 bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-200 h-[650px]">
        <ChatSidebar 
          messages={messages} 
          isThinking={isThinking} 
          onSendMessage={handleSendMessage} 
        />
      </div>

    </div>
  );
}
