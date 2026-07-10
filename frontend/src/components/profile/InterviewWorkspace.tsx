"use client";

import { useState, useEffect } from "react";
import Editor from "@monaco-editor/react";
import { Play, Code2, PenTool, FileText, MessageSquare, Building2, Link as LinkIcon, ExternalLink, Lightbulb, History, CheckCircle2, Clock, Box, Beaker, Terminal, ChevronDown, ChevronUp } from "lucide-react";
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
  const [output, setOutput] = useState<any>(null); // changed to object to store structured output
  const [isRunning, setIsRunning] = useState(false);
  const [diagramElements, setDiagramElements] = useState<any[]>([]);
  
  // Right Panel State
  const defaultRightMode = (question?.category === "HLD" || question?.category === "LLD" || question?.category === "BEHAVIORAL" || question?.category === "CS_FUNDAMENTALS") ? "whiteboard" : "code";
  const [rightMode, setRightMode] = useState<"code" | "whiteboard">(defaultRightMode);
  const [consoleMode, setConsoleMode] = useState<"testcases" | "result">("testcases");
  
  // Left Panel State
  const [leftMode, setLeftMode] = useState<"description" | "solutions" | "submissions" | "chat">(question ? "description" : "chat");
  
  // Chat State
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isThinking, setIsThinking] = useState(false);

  useEffect(() => {
    if (question) {
      setRightMode(defaultRightMode);
      setLeftMode("description");
    }
  }, [question, defaultRightMode]);

  useEffect(() => {
    switch (language) {
      case "cpp":
        setCode('// Write your C++ code here\n\nclass Solution {\npublic:\n    void solve() {\n        \n    }\n};');
        break;
      case "python":
        setCode('# Write your Python code here\n\nclass Solution:\n    def solve(self):\n        pass');
        break;
      case "javascript":
        setCode('// Write your JavaScript code here\n\n/**\n * @return {void}\n */\nvar solve = function() {\n    \n};');
        break;
      case "java":
      default:
        setCode('// Write your Java code here\n\nclass Solution {\n    public void solve() {\n        \n    }\n}');
        break;
    }
  }, [language]);

  const handleRun = async () => {
    setIsRunning(true);
    setConsoleMode("result");
    setOutput({ status: "Executing...", raw: "" });
    try {
      const res = await apiFetch<any>("/execute", {
        method: "POST",
        body: JSON.stringify({
          questionId: question?.id || null,
          language,
          code
        }),
      });
      setOutput({
        status: res.status,
        runtimeMs: res.runtimeMs,
        memoryKb: res.memoryKb,
        raw: res.output
      });
    } catch (e: any) {
      setOutput({ status: "Error", raw: e.message });
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
      
      {/* Left Panel: Navigation & Content */}
      <div className="flex flex-col bg-[#0a0a0a] rounded-2xl overflow-hidden shadow-[0_0_20px_rgba(0,0,0,0.5)] border border-white/10 h-full max-h-[calc(100vh-120px)]">
        {/* Left Header Options */}
        <div className="flex items-center justify-between px-2 py-2 bg-[#0a0a0a] border-b border-white/10 shrink-0">
          <div className="flex space-x-1 overflow-x-auto hide-scrollbar w-full">
            {question && (
              <>
                <button 
                  onClick={() => setLeftMode("description")}
                  className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-medium transition-colors whitespace-nowrap ${leftMode === "description" ? "bg-white/10 text-white shadow-sm" : "text-gray-400 hover:text-white hover:bg-white/5"}`}
                >
                  <FileText className="w-4 h-4" /> Description
                </button>
                <button 
                  onClick={() => setLeftMode("solutions")}
                  className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-medium transition-colors whitespace-nowrap ${leftMode === "solutions" ? "bg-white/10 text-white shadow-sm" : "text-gray-400 hover:text-white hover:bg-white/5"}`}
                >
                  <Lightbulb className="w-4 h-4" /> Solutions
                </button>
                <button 
                  onClick={() => setLeftMode("submissions")}
                  className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-medium transition-colors whitespace-nowrap ${leftMode === "submissions" ? "bg-white/10 text-white shadow-sm" : "text-gray-400 hover:text-white hover:bg-white/5"}`}
                >
                  <History className="w-4 h-4" /> Submissions
                </button>
              </>
            )}
            <button 
              onClick={() => setLeftMode("chat")}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-medium transition-colors whitespace-nowrap ${leftMode === "chat" ? "bg-white/10 text-white shadow-sm" : "text-gray-400 hover:text-white hover:bg-white/5"}`}
            >
              <MessageSquare className="w-4 h-4" /> AI Assistant
            </button>
          </div>
        </div>
        
        {/* Left Content */}
        <div className="flex-1 min-h-0 overflow-y-auto">
          {leftMode === "description" && question && (
            <div className="p-6 prose prose-invert max-w-none">
              <h2 className="text-2xl font-bold text-white mb-4 mt-0">{question.title}</h2>
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
          )}

          {leftMode === "solutions" && (
            <div className="p-6">
              <h3 className="text-xl font-bold text-white mb-4">Editorial Solution</h3>
              <div className="bg-white/5 border border-white/10 rounded-xl p-5 mb-6">
                <h4 className="text-sm font-bold text-gray-300 mb-3 flex items-center gap-2"><Lightbulb className="w-4 h-4 text-yellow-500" /> Intuition</h4>
                <p className="text-gray-400 text-sm leading-relaxed mb-4">
                  The problem asks us to find the most optimal way to process the given inputs. 
                  A brute force approach would require nested loops, leading to a high time complexity. 
                  However, we can optimize this using a Hash Map to store previously seen elements, reducing the lookup time to O(1).
                </p>
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-[#050505] border border-white/10 rounded-lg p-4">
                    <div className="flex items-center gap-2 text-gray-400 text-xs font-semibold mb-1 uppercase tracking-wider">
                      <Clock className="w-4 h-4 text-blue-400" /> Time Complexity
                    </div>
                    <div className="text-xl font-mono text-white">O(N)</div>
                    <div className="text-xs text-gray-500 mt-1">Where N is the size of the input array.</div>
                  </div>
                  <div className="bg-[#050505] border border-white/10 rounded-lg p-4">
                    <div className="flex items-center gap-2 text-gray-400 text-xs font-semibold mb-1 uppercase tracking-wider">
                      <Box className="w-4 h-4 text-purple-400" /> Space Complexity
                    </div>
                    <div className="text-xl font-mono text-white">O(N)</div>
                    <div className="text-xs text-gray-500 mt-1">To store elements in the Hash Map.</div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {leftMode === "submissions" && (
            <div className="p-0">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-white/5 border-b border-white/10">
                    <th className="px-4 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wider">Status</th>
                    <th className="px-4 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wider">Language</th>
                    <th className="px-4 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wider">Runtime</th>
                    <th className="px-4 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wider">Memory</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/10">
                  <tr className="hover:bg-white/5 transition-colors cursor-pointer">
                    <td className="px-4 py-4 text-sm font-medium text-emerald-400 flex items-center gap-2"><CheckCircle2 className="w-4 h-4" /> Accepted</td>
                    <td className="px-4 py-4 text-sm text-gray-300"><span className="bg-white/10 px-2 py-0.5 rounded text-xs border border-white/10">java</span></td>
                    <td className="px-4 py-4 text-sm text-gray-300">2 ms</td>
                    <td className="px-4 py-4 text-sm text-gray-300">42.1 MB</td>
                  </tr>
                  <tr className="hover:bg-white/5 transition-colors cursor-pointer">
                    <td className="px-4 py-4 text-sm font-medium text-rose-400 flex items-center gap-2">Wrong Answer</td>
                    <td className="px-4 py-4 text-sm text-gray-300"><span className="bg-white/10 px-2 py-0.5 rounded text-xs border border-white/10">java</span></td>
                    <td className="px-4 py-4 text-sm text-gray-300">N/A</td>
                    <td className="px-4 py-4 text-sm text-gray-300">N/A</td>
                  </tr>
                </tbody>
              </table>
            </div>
          )}

          {leftMode === "chat" && (
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
          {question ? (
            <div className="flex bg-white/5 p-1 rounded-lg border border-white/10">
              <span className="flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-medium bg-white/10 text-white shadow-sm">
                {rightMode === "code" ? <><Code2 className="w-4 h-4" /> Code</> : <><PenTool className="w-4 h-4" /> Whiteboard</>}
              </span>
            </div>
          ) : (
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
          )}
          
          {rightMode === "code" && (
            <div className="flex items-center gap-3">
              <select 
                className="bg-black text-gray-300 text-sm rounded-lg px-3 py-1.5 outline-none border border-white/10 focus:border-blue-500"
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
              >
                <option value="cpp">C++</option>
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

              {question?.leetcodeUrl && (
                <a 
                  href={question.leetcodeUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 bg-blue-500/20 hover:bg-blue-500/30 text-blue-400 px-4 py-1.5 rounded-lg text-sm font-bold transition-colors border border-blue-500/30"
                  title="Solve on LeetCode"
                >
                  <ExternalLink className="w-4 h-4" />
                  LeetCode
                </a>
              )}
            </div>
          )}
        </div>
        
        {/* Right Content */}
        {rightMode === "code" ? (
          <div className="flex flex-col flex-1 min-h-0">
            {/* Editor */}
            <div className="flex-1 min-h-0 border-b border-white/10">
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
            
            {/* Bottom Console */}
            <div className="h-[250px] bg-[#050505] flex flex-col shrink-0">
              {/* Console Header */}
              <div className="flex items-center gap-1 bg-[#0a0a0a] px-2 py-1.5 border-b border-white/10">
                <button
                  onClick={() => setConsoleMode("testcases")}
                  className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-xs font-semibold transition-colors ${consoleMode === "testcases" ? "bg-white/10 text-white" : "text-gray-400 hover:bg-white/5 hover:text-white"}`}
                >
                  <Beaker className="w-3.5 h-3.5" /> Testcases
                </button>
                <button
                  onClick={() => setConsoleMode("result")}
                  className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-xs font-semibold transition-colors ${consoleMode === "result" ? "bg-white/10 text-white" : "text-gray-400 hover:bg-white/5 hover:text-white"}`}
                >
                  <Terminal className="w-3.5 h-3.5" /> Test Result
                </button>
              </div>

              {/* Console Body */}
              <div className="flex-1 overflow-y-auto p-4">
                {consoleMode === "testcases" && (
                  <div className="space-y-4">
                    <div className="flex gap-2">
                      <button className="bg-white/10 text-white px-3 py-1.5 rounded-md text-sm font-medium border border-white/20">Case 1</button>
                      <button className="bg-white/5 text-gray-400 hover:bg-white/10 px-3 py-1.5 rounded-md text-sm font-medium transition-colors">Case 2</button>
                      <button className="bg-white/5 text-gray-400 hover:bg-white/10 px-3 py-1.5 rounded-md text-sm font-medium transition-colors">Case 3</button>
                    </div>
                    <div className="space-y-3">
                      <div>
                        <div className="text-xs font-semibold text-gray-400 mb-1">Input</div>
                        <div className="bg-white/5 border border-white/10 p-2.5 rounded-lg text-sm text-gray-300 font-mono tracking-wider">
                          nums = [2,7,11,15]<br/>target = 9
                        </div>
                      </div>
                      <div>
                        <div className="text-xs font-semibold text-gray-400 mb-1">Expected Output</div>
                        <div className="bg-white/5 border border-white/10 p-2.5 rounded-lg text-sm text-gray-300 font-mono tracking-wider">
                          [0,1]
                        </div>
                      </div>
                    </div>
                  </div>
                )}
                {consoleMode === "result" && (
                  <div>
                    {!output ? (
                      <div className="text-gray-500 text-sm italic">Run code to see results...</div>
                    ) : (
                      <div className="space-y-4">
                        <div className="flex items-center gap-3">
                          {output.status === "Executing..." ? (
                            <span className="text-yellow-400 font-bold text-lg flex items-center gap-2">
                              <div className="w-4 h-4 border-2 border-yellow-400 border-t-transparent rounded-full animate-spin"></div>
                              Evaluating...
                            </span>
                          ) : (
                            <span className={clsx("font-bold text-xl", output.status === "Accepted" || output.status === "OK" ? "text-emerald-400" : (output.status === "Error" ? "text-rose-500" : "text-emerald-400"))}>
                              {output.status === "OK" ? "Accepted" : output.status}
                            </span>
                          )}
                        </div>
                        
                        {output.runtimeMs !== undefined && (
                          <div className="flex gap-4">
                            <div className="bg-white/5 border border-white/10 rounded-lg p-3 flex-1">
                              <div className="flex items-center gap-2 text-gray-400 text-xs font-semibold mb-1 uppercase">
                                <Clock className="w-4 h-4 text-blue-400" /> Runtime
                              </div>
                              <div className="text-lg font-mono text-white">{output.runtimeMs} <span className="text-sm text-gray-500">ms</span></div>
                            </div>
                            <div className="bg-white/5 border border-white/10 rounded-lg p-3 flex-1">
                              <div className="flex items-center gap-2 text-gray-400 text-xs font-semibold mb-1 uppercase">
                                <Box className="w-4 h-4 text-purple-400" /> Memory
                              </div>
                              <div className="text-lg font-mono text-white">{(output.memoryKb / 1024).toFixed(1)} <span className="text-sm text-gray-500">MB</span></div>
                            </div>
                          </div>
                        )}

                        {output.raw && (
                          <div>
                            <div className="text-xs font-semibold text-gray-400 mb-1">Raw Output</div>
                            <pre className="bg-[#000] border border-white/10 p-3 rounded-lg text-sm text-gray-300 font-mono whitespace-pre-wrap overflow-x-auto">
                              {output.raw}
                            </pre>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                )}
              </div>
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
