import React, { useState, useRef, useEffect } from "react";
import { Send, X, MessageSquare, User, Loader2 } from "lucide-react";
import { motion } from "motion/react";
import { useLanguage } from "../context/LanguageContext";

interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
  payload?: any;
}

interface ChatbotModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialMessage?: string | null;
  onInitialMessageSent?: () => void;
}

export default function ChatbotModal({ isOpen, onClose, initialMessage, onInitialMessageSent }: ChatbotModalProps) {
  const { language } = useLanguage();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Initialize with the welcome message
  useEffect(() => {
    const welcomeMsg = language === "vi" 
      ? "Xin chào! Tôi là Henry Fit AI. Tôi có thể giúp gì cho bạn hôm nay?"
      : "Hello! I’m Henry Fit AI. How can I help you today?";
    
    setMessages([
      {
        id: "welcome",
        role: "assistant",
        content: welcomeMsg,
        timestamp: new Date(),
      }
    ]);
  }, [language]);

  // Scroll to bottom whenever messages change
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, isTyping]);

  // Focus input when modal opens
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => {
        inputRef.current?.focus();
      }, 300);
    }
  }, [isOpen]);

  // Handle initial message prop
  useEffect(() => {
    if (initialMessage && !isTyping) {
      setInputValue(initialMessage);
      setTimeout(() => {
        handleSend(initialMessage);
        if (onInitialMessageSent) onInitialMessageSent();
      }, 300);
    }
  }, [initialMessage]);

  const handleSend = async (overrideMsg?: string) => {
    const query = (typeof overrideMsg === 'string' ? overrideMsg : inputValue).trim();
    if (!query || isTyping) return;

    // Clear input
    setInputValue("");

    // Add User message
    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      role: "user",
      content: query,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMsg]);
    setIsTyping(true);

    // Send to backend which forwards to n8n
    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: [...messages, userMsg],
          language,
        }),
      });
      const data = await response.json();
      
      // Extract response from common n8n output fields
      let botResponse = "";
      
      if (Object.keys(data).length === 0) {
        botResponse = language === "vi" 
          ? "Đã gửi request tới n8n thành công (nhưng n8n trả về phản hồi rỗng)." 
          : "Request sent to n8n successfully (but n8n returned an empty response).";
      } else {
        botResponse = data.reply || data.output || data.response || data.message || data.text || JSON.stringify(data, null, 2);
      }
      
      const botMsg: ChatMessage = {
        id: `bot-${Date.now()}`,
        role: "assistant",
        content: botResponse,
        timestamp: new Date(),
        payload: data,
      };

      setMessages((prev) => [...prev, botMsg]);
    } catch (error) {
      console.error("Chat error:", error);
      const errorMsg: ChatMessage = {
        id: `bot-${Date.now()}`,
        role: "assistant",
        content: language === "vi" ? "Lỗi kết nối máy chủ." : "Server connection error.",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <motion.div
      id="chatbot-modal"
      initial={{ opacity: 0, y: 30, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 20, scale: 0.95 }}
      transition={{ type: "spring", damping: 25, stiffness: 350 }}
      className="fixed bottom-24 right-4 md:right-6 w-[calc(100vw-32px)] sm:w-96 h-[500px] z-50 bg-[#0c0d10] border border-[#0066ff]/20 shadow-[0_15px_50px_rgba(0,102,255,0.15)] flex flex-col overflow-hidden rounded-none"
    >
      {/* HEADER */}
      <div className="bg-black px-5 py-4 border-b border-[#424656]/20 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-6 h-6 rounded-full bg-[#0066ff] flex items-center justify-center">
            <MessageSquare size={12} className="text-white" />
          </div>
          <div>
            <h3 className="font-montserrat text-xs font-black uppercase tracking-wider text-white">
              Henry Fit AI Assistant
            </h3>
            <p className="font-mono text-[8px] text-zinc-500 tracking-wider">
              {language === "vi" ? "PHẢN HỒI THỬ NGHIỆM" : "OFFLINE DEMO MODE"}
            </p>
          </div>
        </div>
        
        <button
          onClick={onClose}
          className="p-1.5 text-zinc-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer rounded-none"
          aria-label="Close Chat"
        >
          <X size={16} />
        </button>
      </div>

      {/* MESSAGES AREA */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gradient-to-b from-[#0a0b0d] to-[#070809] scrollbar-thin scrollbar-thumb-zinc-800">
        {messages.map((msg) => {
          const isBot = msg.role === "assistant";
          return (
            <div
              key={msg.id}
              className={`flex gap-2.5 ${isBot ? "justify-start" : "justify-end"}`}
            >
              {isBot && (
                <div className="w-6 h-6 rounded-full bg-zinc-900 border border-white/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <MessageSquare size={10} className="text-[#0066ff]" />
                </div>
              )}

              <div
                className={`max-w-[85%] p-3 text-xs leading-relaxed font-sans ${
                  isBot
                    ? "bg-[#12141a] text-zinc-300 border border-white/5 rounded-none"
                    : "bg-[#0066ff] text-white rounded-none"
                }`}
              >
                {msg.content}
                
                {/* Rich UI Rendering from n8n payload */}
                {isBot && msg.payload && (
                  <div className="mt-3 flex flex-col gap-3">
                    {msg.payload.display === 'gallery' && msg.payload.products && (
                      <div className="grid grid-cols-2 gap-2">
                        {msg.payload.products.slice(0, 4).map((p: any) => (
                          <div key={p.id} className="bg-black border border-white/10 p-2 flex flex-col gap-1">
                            {msg.payload.ui?.showImage && (
                              <div className="w-full h-24 bg-zinc-900 mb-1 overflow-hidden">
                                <img src={p.image_url} alt={p.name} className="w-full h-full object-cover" />
                              </div>
                            )}
                            <div className="font-bold text-[10px] text-white line-clamp-2">{p.name}</div>
                            {msg.payload.ui?.showPrice && <div className="text-[#0066ff] text-[10px]">${p.price}</div>}
                            {msg.payload.ui?.showStock && (
                              <div className="text-zinc-500 text-[9px]">{p.in_stock ? 'In Stock' : 'Out of Stock'}</div>
                            )}
                          </div>
                        ))}
                      </div>
                    )}

                    {msg.payload.display === 'single_product' && msg.payload.product && (
                      <div className="bg-black border border-white/10 p-3 flex gap-3 items-center">
                        {msg.payload.ui?.showImage && (
                          <div className="w-16 h-16 bg-zinc-900 shrink-0">
                            <img src={msg.payload.product.image_url} alt={msg.payload.product.name} className="w-full h-full object-cover" />
                          </div>
                        )}
                        <div className="flex flex-col">
                          <div className="font-bold text-xs text-white">{msg.payload.product.name}</div>
                          {msg.payload.ui?.showPrice && <div className="text-[#0066ff] text-[10px] mt-1">${msg.payload.product.price}</div>}
                        </div>
                      </div>
                    )}

                    {msg.payload.suggestions && msg.payload.suggestions.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 mt-1">
                        {msg.payload.suggestions.map((s: string, i: number) => (
                          <button 
                            key={i} 
                            onClick={() => setInputValue(s)}
                            className="text-[9px] border border-[#0066ff]/40 px-2 py-1 text-[#0066ff] hover:bg-[#0066ff]/20 transition-colors text-left"
                          >
                            {s}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                <div className={`text-[8px] font-mono mt-1.5 text-right ${isBot ? "text-zinc-500" : "text-white/60"}`}>
                  {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </div>
              </div>

              {!isBot && (
                <div className="w-6 h-6 rounded-full bg-zinc-900 border border-[#0066ff]/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <User size={10} className="text-white" />
                </div>
              )}
            </div>
          );
        })}

        {isTyping && (
          <div className="flex gap-2.5 justify-start">
            <div className="w-6 h-6 rounded-full bg-zinc-900 border border-white/10 flex items-center justify-center flex-shrink-0 mt-0.5">
              <Loader2 size={10} className="text-[#0066ff] animate-spin" />
            </div>
            <div className="bg-[#12141a] text-zinc-400 border border-white/5 p-3 rounded-none flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 bg-[#0066ff] rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
              <span className="w-1.5 h-1.5 bg-[#0066ff] rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
              <span className="w-1.5 h-1.5 bg-[#0066ff] rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* INPUT PANEL */}
      <div className="p-3 bg-black border-t border-[#424656]/20 flex gap-2">
        <input
          ref={inputRef}
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={language === "vi" ? "Nhập câu hỏi tại đây..." : "Type your message here..."}
          disabled={isTyping}
          className="flex-1 bg-[#0c0d10] border border-white/10 px-3 py-2.5 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-[#0066ff] transition-colors rounded-none"
        />
        <button
          onClick={() => handleSend()}
          disabled={!inputValue.trim() || isTyping}
          className={`px-3.5 bg-[#0066ff] text-white hover:bg-white hover:text-black transition-all flex items-center justify-center rounded-none cursor-pointer border border-transparent ${
            (!inputValue.trim() || isTyping) ? "opacity-50 cursor-not-allowed" : ""
          }`}
        >
          <Send size={12} />
        </button>
      </div>
    </motion.div>
  );
}
