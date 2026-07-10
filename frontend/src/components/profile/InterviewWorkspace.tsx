"use client";

import { useState, useEffect } from "react";
import Editor from "@monaco-editor/react";
import { Play, Code2, PenTool, FileText, MessageSquare, Building2, Link as LinkIcon, ExternalLink } from "lucide-react";
import { apiFetch } from "@/lib/api";
import ChatSidebar, { ChatMessage } from "./ChatSidebar";
import Whiteboard from "./Whiteboard";
import { Question } from "@/types";
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import clsx from "clsx";

interface InterviewWorkspaceProps {
  question?: Question;
}

export default function InterviewWorkspace({ question }: InterviewWorkspaceProps) {
  const [code, setCode] = useState('// Write your code here\n\nclass Solution {\n  public void solve() {\n    System.out.println("Hello, World!");\n  }\n}');
  const [language, setLanguage] = useState("java");
  const [output, setOutput] = useState("");
  const [isRunning, setIsRunning] = useState(false);
  const [diagramElements, setDiagramElements] = useState<any[]>([]);
  
  // Right Panel State
  const defaultRightMode = (question?.category === "HLD" || question?.category === "LLD" || question?.category === "BEHAVIORAL" || question?.category === "CS_FUNDAMENTALS") ? "whiteboard" : "code";
  const [rightMode, setRightMode] = useState<"code" | "whiteboard">(defaultRightMode);
  
  // Left Panel State
  const [leftMode, setLeftMode] = useState<"description" | "chat">(question ? "description" : "chat");
  
  // Chat State
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isThinking, setIsThinking] = useState(false);

  useEffect(() => {
    if (question) {
      setRightMode(defaultRightMode);
      setLeftMode("description");
    }
  }, [question, defaultRightMode]);

  const handleRun = async () => {
    setIsRunning(true);
    setOutput("Executing...");
    try {
      const res = await apiFetch<any>("/execute", {
        method: "POST",
        body: JSON.stringify({
          questionId: question?.id || null,
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
          message: msg,
          questionId: question?.id
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

  const getDifficultyColor = (diff: string) => {
    switch (diff) {
      case "EASY": return "bg-emerald-500/20 text-emerald-300 border-emerald-500/30";
      case "MEDIUM": return "bg-amber-500/20 text-amber-300 border-amber-500/30";
      case "HARD": return "bg-rose-500/20 text-rose-300 border-rose-500/30";
      default: return "bg-gray-500/20 text-gray-300 border-gray-500/30";
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 h-full min-h-[700px]">
      
      {/* Left Panel: Description & Chat */}
      <div className="flex flex-col bg-[#0a0a0a] rounded-2xl overflow-hidden shadow-[0_0_20px_rgba(0,0,0,0.5)] border border-white/10 h-full max-h-[calc(100vh-120px)]">
        {/* Left Header Options */}
        <div className="flex items-center justify-between px-4 py-3 bg-[#0a0a0a] border-b border-white/10 shrink-0">
          <div className="flex bg-white/5 p-1 rounded-lg border border-white/10">
            {question && (
              <button 
                onClick={() => setLeftMode("description")}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${leftMode === "description" ? "bg-white/10 text-white shadow-sm" : "text-gray-400 hover:text-white hover:bg-white/5"}`}
              >
                <FileText className="w-4 h-4" /> Description
              </button>
            )}
            <button 
              onClick={() => setLeftMode("chat")}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${leftMode === "chat" ? "bg-white/10 text-white shadow-sm" : "text-gray-400 hover:text-white hover:bg-white/5"}`}
            >
              <MessageSquare className="w-4 h-4" /> AI Assistant
            </button>
          </div>
        </div>
        
        {/* Left Content */}
        <div className="flex-1 min-h-0 overflow-y-auto">
          {leftMode === "description" && question ? (
            <div className="p-6 prose prose-invert max-w-none">
              <div className="flex flex-wrap items-center gap-2 mb-6 border-b border-white/10 pb-4">
                <span className={clsx("px-2 py-0.5 rounded-md text-xs font-bold border tracking-wide", getDifficultyColor(question.difficulty))}>
                  {question.difficulty}
                </span>
                {question.companyTags && question.companyTags.map(tag => (
                  <span key={tag} className="flex items-center gap-1 text-[11px] font-medium text-gray-400 bg-white/5 px-2 py-0.5 rounded-md border border-white/10">
                    <Building2 className="w-3 h-3" /> {tag}
                  </span>
                ))}
                
                <div className="ml-auto flex gap-2">
                  {question.leetcodeUrl && (
                    <a href={question.leetcodeUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 text-xs text-blue-400 hover:text-blue-300">
                      <ExternalLink className="w-3 h-3" /> LeetCode
                    </a>
                  )}
                  {question.articleUrl && (
                    <a href={question.articleUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 text-xs text-blue-400 hover:text-blue-300">
                      <FileText className="w-3 h-3" /> Article
                    </a>
                  )}
                </div>
              </div>
              
              <div className="text-gray-300 leading-relaxed text-sm">
                <ReactMarkdown remarkPlugins={[remarkGfm]}>
                  {question.description || "No description provided."}
                </ReactMarkdown>
              </div>

              {question.hints && question.hints.length > 0 && (
                <div className="mt-8 space-y-2">
                  <h4 className="text-sm font-bold text-white mb-2 border-b border-white/10 pb-2">Hints</h4>
                  {question.hints.map((hint, idx) => (
                    <details key={idx} className="group bg-white/5 border border-white/10 rounded-lg p-3 text-sm text-gray-400">
                      <summary className="cursor-pointer font-medium text-gray-300 outline-none list-none flex items-center justify-between">
                        <span>Hint {idx + 1}</span>
                        <span className="text-blue-400 group-open:hidden text-xs">Show</span>
                        <span className="text-blue-400 hidden group-open:block text-xs">Hide</span>
                      </summary>
                      <div className="mt-2 pt-2 border-t border-white/10 text-gray-300">
                        {hint}
                      </div>
                    </details>
                  ))}
                </div>
              )}
            </div>
          ) : (
            <div className="h-full">
              <ChatSidebar 
                messages={messages} 
                isThinking={isThinking} 
                onSendMessage={handleSendMessage} 
              />
            </div>
          )}
        </div>
      </div>

      {/* Right Panel: Code & Whiteboard */}
      <div className="flex flex-col bg-[#0a0a0a] rounded-2xl overflow-hidden shadow-[0_0_20px_rgba(0,0,0,0.5)] border border-white/10 h-full max-h-[calc(100vh-120px)]">
        
        {/* Right Header Options */}
        <div className="flex items-center justify-between px-4 py-3 bg-[#0a0a0a] border-b border-white/10 shrink-0">
          <div className="flex bg-white/5 p-1 rounded-lg border border-white/10">
            <button 
              onClick={() => setRightMode("code")}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${rightMode === "code" ? "bg-white/10 text-white shadow-sm" : "text-gray-400 hover:text-white hover:bg-white/5"}`}
            >
              <Code2 className="w-4 h-4" /> Code
            </button>
            <button 
              onClick={() => setRightMode("whiteboard")}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${rightMode === "whiteboard" ? "bg-white/10 text-white shadow-sm" : "text-gray-400 hover:text-white hover:bg-white/5"}`}
            >
              <PenTool className="w-4 h-4" /> Whiteboard
            </button>
          </div>
          
          {rightMode === "code" && (
            <div className="flex items-center gap-3">
              <select 
                className="bg-black text-gray-300 text-sm rounded-lg px-3 py-1.5 outline-none border border-white/10 focus:border-blue-500"
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
                className="flex items-center gap-2 bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-400 px-4 py-1.5 rounded-lg text-sm font-bold transition-colors disabled:opacity-50 disabled:cursor-not-allowed border border-emerald-500/30"
              >
                <Play className="w-4 h-4" />
                {isRunning ? "Running..." : "Run"}
              </button>
            </div>
          )}
        </div>
        
        {/* Right Content */}
        {rightMode === "code" ? (
          <div className="flex flex-col flex-1 min-h-0">
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
            
            <div className="h-[250px] bg-[#0a0a0a] border-t border-white/10 p-4 overflow-y-auto shrink-0">
              <h4 className="text-gray-500 text-xs font-bold uppercase tracking-wider mb-2">Terminal Output</h4>
              <pre className="text-gray-300 text-sm font-mono whitespace-pre-wrap">{output}</pre>
            </div>
          </div>
        ) : (
          <div className="flex-1 min-h-0 relative bg-black">
            <Whiteboard onChange={(elements) => setDiagramElements(elements as any[])} />
          </div>
        )}
      </div>

    </div>
  );
}
