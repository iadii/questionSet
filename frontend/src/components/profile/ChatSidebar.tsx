"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { Send, Bot, User, Loader2, Mic, MicOff, Volume2, VolumeX } from "lucide-react";

export interface ChatMessage {
  role: "ai" | "user";
  text: string;
}

interface ChatSidebarProps {
  messages: ChatMessage[];
  isThinking: boolean;
  onSendMessage: (msg: string) => void;
}

export default function ChatSidebar({ messages, isThinking, onSendMessage }: ChatSidebarProps) {
  const [input, setInput] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  // Voice State
  const [isListening, setIsListening] = useState(false);
  const [isTtsEnabled, setIsTtsEnabled] = useState(true);
  const recognitionRef = useRef<any>(null);
  const prevMessagesLengthRef = useRef(messages.length);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
    
    // Handle Text-to-Speech for new AI messages
    if (messages.length > prevMessagesLengthRef.current) {
      const lastMsg = messages[messages.length - 1];
      if (lastMsg.role === "ai" && isTtsEnabled && "speechSynthesis" in window) {
        // Cancel any ongoing speech
        window.speechSynthesis.cancel();
        const utterance = new SpeechSynthesisUtterance(lastMsg.text);
        // Optional: configure voice/rate here
        window.speechSynthesis.speak(utterance);
      }
      prevMessagesLengthRef.current = messages.length;
    }
  }, [messages, isThinking, isTtsEnabled]);
  
  // Initialize Speech Recognition
  useEffect(() => {
    if (typeof window !== "undefined") {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      if (SpeechRecognition) {
        recognitionRef.current = new SpeechRecognition();
        recognitionRef.current.continuous = true;
        recognitionRef.current.interimResults = true;
        
        recognitionRef.current.onresult = (event: any) => {
          let currentTranscript = "";
          for (let i = event.resultIndex; i < event.results.length; i++) {
            currentTranscript += event.results[i][0].transcript;
          }
          setInput(prev => {
            // Append or replace? For simplicity, we just replace the input with the transcript
            // or if we want continuous dictation, we'd need more complex state.
            // Let's just set the input to the latest transcript chunk if it's final, 
            // or we just replace the whole input field for this dictation session.
            return currentTranscript; 
          });
        };
        
        recognitionRef.current.onerror = (event: any) => {
          console.error("Speech recognition error", event.error);
          setIsListening(false);
        };
        
        recognitionRef.current.onend = () => {
          setIsListening(false);
        };
      }
    }
    
    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
      if ("speechSynthesis" in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);
  
  const toggleListening = () => {
    if (isListening) {
      recognitionRef.current?.stop();
      setIsListening(false);
    } else {
      if (recognitionRef.current) {
        setInput(""); // Clear input when starting to speak
        recognitionRef.current.start();
        setIsListening(true);
      } else {
        alert("Speech recognition is not supported in this browser.");
      }
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isThinking) return;
    onSendMessage(input);
    setInput("");
  };

  return (
    <div className="flex flex-col h-full bg-[#0a0a0a] border-l border-white/10">
      <div className="p-4 border-b border-white/10 bg-white/5 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-blue-500/20 border border-blue-500/30 flex items-center justify-center text-blue-400 shadow-[0_0_10px_rgba(59,130,246,0.2)]">
            <Bot className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-semibold text-white leading-tight">AI Interviewer</h3>
            <p className="text-xs text-gray-400">Powered by Gemini</p>
          </div>
        </div>
        
        <button 
          onClick={() => {
            setIsTtsEnabled(!isTtsEnabled);
            if (isTtsEnabled && "speechSynthesis" in window) {
              window.speechSynthesis.cancel();
            }
          }}
          className={`p-2 rounded-lg transition-colors border ${isTtsEnabled ? 'text-blue-400 bg-blue-500/10 border-blue-500/20' : 'text-gray-500 bg-white/5 border-white/10 hover:bg-white/10'}`}
          title={isTtsEnabled ? "Mute AI Voice" : "Enable AI Voice"}
        >
          {isTtsEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-[#0a0a0a]">
        {messages.length === 0 && (
          <div className="text-center text-gray-400 text-sm mt-10">
            Write some code on the left, then ask me for a hint or feedback!
          </div>
        )}
        
        {messages.map((msg, idx) => (
          <div
            key={idx}
            className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
          >
            <div
              className={`max-w-[85%] p-3 rounded-2xl text-sm leading-relaxed shadow-sm ${
                msg.role === "user"
                  ? "bg-blue-600 text-white rounded-br-none shadow-[0_0_15px_rgba(37,99,235,0.2)]"
                  : "bg-white/10 text-gray-200 rounded-bl-none border border-white/5"
              }`}
            >
              {msg.text}
            </div>
          </div>
        ))}

        {isThinking && (
          <div className="flex gap-3">
            <div className="max-w-[85%] p-4 rounded-2xl bg-white/10 border border-white/5 rounded-bl-none shadow-sm flex items-center gap-3">
              <Loader2 className="w-4 h-4 animate-spin text-blue-400" />
              <span className="text-gray-400 text-sm font-medium">Analyzing...</span>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <div className="p-4 bg-[#0a0a0a] border-t border-white/10">
        <form onSubmit={handleSubmit} className="relative flex items-center gap-2">
          <button
            type="button"
            onClick={toggleListening}
            className={`p-3 rounded-xl transition-colors flex-shrink-0 border ${
              isListening ? "bg-rose-500/20 text-rose-400 border-rose-500/30 animate-pulse shadow-[0_0_15px_rgba(244,63,94,0.3)]" : "bg-white/5 text-gray-400 border-white/10 hover:bg-white/10 hover:text-white"
            }`}
            title={isListening ? "Stop listening" : "Start speaking"}
          >
            {isListening ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
          </button>
          
          <div className="relative flex-1">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={isListening ? "Listening..." : "Ask for a hint..."}
              className="w-full pl-4 pr-12 py-3 bg-white/5 border border-white/10 focus:bg-white/10 focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/20 rounded-xl text-sm transition-all text-white placeholder-gray-500"
              disabled={isThinking}
            />
            <button
              type="submit"
              disabled={!input.trim() || isThinking}
              className="absolute right-2 top-2 p-1.5 bg-blue-600 text-white rounded-lg hover:bg-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-sm"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
