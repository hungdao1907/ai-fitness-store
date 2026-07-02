/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useRef, useEffect } from "react";
import { Send, ArrowLeft, MessageSquare, ShieldCheck, Zap, User, Loader2, RefreshCw } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { useLanguage } from "../context/LanguageContext";

const chatbotLogoSvg = "/chatbot_logo.svg";

interface Message {
  role: "user" | "assistant";
  content: string;
}

interface ChatbotPageProps {
  onBack: () => void;
}

export default function ChatbotPage({ onBack }: ChatbotPageProps) {
  const { language, t } = useLanguage();

  const getWelcomeText = () => {
    if (language === "vi") {
      return `Xin chào! Tôi là **Trực ban Cố vấn Henry Fit AI**, chuyên viên điều hướng thiết bị và hiệu chỉnh tối tân của bạn. 

Các thông số thuật toán của tôi được thiết kế để đề xuất dải phom size áo thun, áo nén compression bọc cơ hoặc đai bảo vệ thắt lưng chuẩn cơ học nhất đối với số đo rèn luyện của bạn.

Hãy cho tôi biết: Chiều cao, cân nặng, vòng ngực hoặc mức tập tạ hiện tại của bạn để chúng ta hiệu chỉnh ngay cấu hình tối ưu nhất nhé!`;
    }
    return `Hello! I am **Henry Fit AI Specialist**, your elite performance gear advisor. 

My parameters are calibrated to recommend the exact kit setups, specifications, and sizes that match your high-intensity athletic grinds.

Tell me: what is your primary training discipline or what gear are you interested in adjusting (Lifting Belt, Compression Shirt, or Oversized Gym Tee)?`;
  };

  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content: getWelcomeText(),
    },
  ]);

  const [inputValue, setInputValue] = useState("");
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Sync welcome message if language shifts on initial state
  useEffect(() => {
    if (messages.length === 1) {
      setMessages([
        {
          role: "assistant",
          content: getWelcomeText(),
        },
      ]);
    }
  }, [language]);

  // Auto scroll
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  const handleSend = async (textToSend?: string) => {
    const query = (textToSend || inputValue).trim();
    if (!query || loading) return;

    if (!textToSend) {
      setInputValue("");
    }

    const nextMessages: Message[] = [...messages, { role: "user", content: query }];
    setMessages(nextMessages);
    setLoading(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ messages: nextMessages, language }),
      });

      const data = await res.json();
      if (data.success) {
        setMessages((prev) => [...prev, { role: "assistant", content: data.reply }]);
      } else {
        setMessages((prev) => [
          ...prev,
          {
            role: "assistant",
            content:
              language === "vi"
                ? "⚠️ Hệ thống đang ngoại tuyến. Vui lòng xác thực khóa API Gemini trong góc thiết lập."
                : "⚠️ System offline. Please check network link and verify your API keys.",
          },
        ]);
      }
    } catch (err) {
      console.error(err);
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content:
            language === "vi"
              ? "⚠️ Kết nối thất bại. Độ trễ quá cao. Hãy đảm bảo máy chủ Node.js đang hoạt động."
              : "⚠️ Connection failure. High latency detected. Ensure server is online and active.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const resetSession = () => {
    setMessages([
      {
        role: "assistant",
        content:
          language === "vi"
            ? "Đã thiết lập lại tín hiệu kết nối. Sẵn sàng nhận thông số mới thực địa."
            : "Session Reset. Ready to recalibrate metrics. Let's build your peak performance setup.",
      },
    ]);
  };

  const suggestionPills =
    language === "vi"
      ? [
          { label: "Cấu hình Powerlifting", prompt: "Giải thích cấu hình tập powerlifting tối ưu và lợi ích của đai tạ dày 10mm" },
          { label: "Áo nén bọc sát cơ", prompt: "Ưu điểm lưu thông tuần hoàn và phom dáng của dòng Compression Shirt" },
          { label: "Chất đai lưng 10mm", prompt: "Nêu chất cấu tạo thép gài và da bò thật trên đai Henry Fit" },
          { label: "Tính size áo thun gym", prompt: "Cách chọn size áo thun Oversized Gym Tee rộng rãi thoải mái khi Squat" },
        ]
      : [
          { label: "Powerlifting setup", prompt: "Explain the ideal powerlifting setup and physical gear benefits" },
          { label: "Optimal bodybuilding kit", prompt: "What is the optimal bodybuilding kit for intense volume pump training?" },
          { label: "10mm Belt benefits", prompt: "Tell me about the biomechanical benefits of the 10mm Lifting Belt" },
          { label: "Sizing matrix details", prompt: "What are the sizing measurements for the Compression Shirt?" },
        ];

  // Simple clean message parser
  const renderMessageContent = (content: string) => {
    const lines = content.split("\n");
    return lines.map((line, idx) => {
      const trimmed = line.trim();
      if (!trimmed) return <div key={idx} className="h-3.5" />;

      // Header H3
      if (trimmed.startsWith("###")) {
        return (
          <h3
            key={idx}
            className="font-montserrat text-xs md:text-sm font-extrabold text-[#b3c5ff] tracking-widest uppercase mt-5 mb-2.5 border-b border-[#0066ff]/20 pb-1"
          >
            {trimmed.replace("###", "").trim()}
          </h3>
        );
      }

      // Markdown Tables
      if (trimmed.startsWith("|") && idx < lines.length && lines[idx + 1]?.includes("-")) {
        return null;
      }
      if (trimmed.startsWith("|") && trimmed.includes("---")) {
        return null;
      }

      if (trimmed.startsWith("|")) {
        const cols = trimmed.split("|").filter((c) => c.trim() !== "");
        return (
          <div
            key={idx}
            className="grid grid-cols-2 sm:grid-cols-3 bg-black/40 border border-[#424656]/20 p-2 text-center text-[10px] md:text-[11px] font-mono text-[#c2c6d8] my-0.5"
          >
            {cols.map((col, cidx) => (
              <span key={cidx} className={cidx === 0 ? "font-bold text-white text-left" : "text-center"}>
                {col.trim()}
              </span>
            ))}
          </div>
        );
      }

      // Bullet Lists
      if (trimmed.startsWith("-") || trimmed.startsWith("*")) {
        const cleanText = trimmed.substring(1).trim();
        return (
          <li
            key={idx}
            className="font-sans text-xs md:text-[13px] text-[#c2c6d8] leading-relaxed list-none pl-4 relative before:content-['•'] before:text-[#0066ff] before:absolute before:left-0 before:font-bold mt-1.5"
          >
            {cleanText.split("**").map((part, pidx) => {
              if (pidx % 2 === 1) {
                return (
                  <strong key={pidx} className="text-white font-bold">
                    {part}
                  </strong>
                );
              }
              return part;
            })}
          </li>
        );
      }

      // Default
      return (
        <p key={idx} className="font-sans text-xs md:text-[13px] text-[#c2c6d8] leading-relaxed mt-2 select-text">
          {trimmed.split("**").map((part, pidx) => {
            if (pidx % 2 === 1) {
              return (
                <strong key={pidx} className="text-white font-bold">
                  {part}
                </strong>
              );
            }
            return part;
          })}
        </p>
      );
    });
  };

  return (
    <div id="chatbot-page" className="min-h-screen bg-[#0c0f0f] text-white flex flex-col relative overflow-hidden">
      {/* Background Grid Accent */}
      <div className="absolute inset-0 bg-[radial-gradient(#121a24_1px,transparent_1px)] [background-size:16px_16px] opacity-25 pointer-events-none" />

      {/* Header Panel */}
      <header className="sticky top-0 z-40 w-full bg-[#121414] border-b border-[#424656]/20 py-4 px-6 md:px-12 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button
            onClick={onBack}
            className="p-2 -ml-2 text-white/70 hover:text-white hover:bg-[#1e2020] transition-all cursor-pointer flex items-center justify-center rounded-none border border-transparent hover:border-[#424656]/30"
            title={language === "vi" ? "Trở về Trang chủ" : "Return to home"}
          >
            <ArrowLeft className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full border border-[#0066ff]/50 overflow-hidden flex items-center justify-center p-0.5 bg-black">
              <img src={chatbotLogoSvg} alt="AI Specialist Icon" className="w-full h-full object-cover rounded-full" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-anton text-base md:text-lg tracking-wider text-white uppercase select-none">
                  {language === "vi" ? "CỐ VẤN AI HENRY FIT" : "HENRY FIT AI SPECIALIST"}
                </span>
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.7)]" />
              </div>
              <p className="font-mono text-[9px] text-[#0066ff] tracking-widest uppercase font-bold">
                {language === "vi" ? "HỆ THỐNG TRỰC BAN THỂ THAO" : "PERFORMANCE LAB MATRIX"}
              </p>
            </div>
          </div>
        </div>

        <div className="hidden sm:flex items-center gap-3 bg-[#1e2020]/50 border border-[#424656]/20 px-4 py-1.5 rounded-none">
          <ShieldCheck className="w-4 h-4 text-emerald-500" />
          <span className="font-mono text-[10px] text-zinc-400 tracking-wider">
            {language === "vi" ? "ĐƯỜNG TRUYỀN MÃ HÓA AN TOÀN" : "STABLE SECURE AGENT LINK"}
          </span>
        </div>
      </header>

      {/* Main Conversation Split Area */}
      <main className="flex-1 max-w-5xl w-full mx-auto flex flex-col md:flex-row h-[calc(100vh-80px)] overflow-hidden">
        {/* Left Segment Card info */}
        <div className="hidden md:flex flex-col w-72 bg-[#121414] border-r border-[#424656]/20 p-6 shrink-0 justify-between">
          <div className="space-y-6">
            <div className="border-b border-[#424656]/20 pb-4">
              <h4 className="font-montserrat text-xs font-black tracking-widest text-[#b3c5ff] uppercase mb-1">
                {language === "vi" ? "TRẠNG THÁI TRỰC BAN" : "SYSTEM AGENT STATUS"}
              </h4>
              <p className="text-xs text-zinc-400 font-light leading-relaxed">
                {language === "vi"
                  ? "Cơ sở cố vấn được tích hợp sâu kiến thức giải phẫu cơ, áp lực cột sống thể hình cao cấp và vật lý sợi vải thắt."
                  : "Connect directly with our athletic model trained in powerlifting, bodybuilding, sizing systems, and compound physics."}
              </p>
            </div>

            <div className="space-y-4">
              <span className="font-mono text-[9px] text-[#0066ff] tracking-widest uppercase font-bold block">
                {language === "vi" ? "THÔNG SỐ MATRIX" : "CORE SYSTEM METRICS"}
              </span>
              <div className="grid grid-cols-2 gap-2 font-mono text-[10px] text-zinc-400">
                <div className="bg-[#1e2020] p-2.5 border border-[#424656]/15">
                  <p className="opacity-60 uppercase text-[9px]">{language === "vi" ? "MÔ HÌNH" : "ENGINE"}</p>
                  <p className="text-white font-bold uppercase mt-0.5">GEMINI 2.5</p>
                </div>
                <div className="bg-[#1e2020] p-2.5 border border-[#424656]/15">
                  <p className="opacity-60 uppercase text-[9px]">{language === "vi" ? "PHẢN HỒI" : "RESPONSE"}</p>
                  <p className="text-white font-bold uppercase mt-0.5">&lt; 150MS</p>
                </div>
                <div className="bg-[#1e2020] p-2.5 border border-[#424656]/15">
                  <p className="opacity-60 uppercase text-[9px]">{language === "vi" ? "CHUẨN LỰC" : "ACCURACY"}</p>
                  <p className="text-emerald-500 font-bold uppercase mt-0.5">99.8% LAB</p>
                </div>
                <div className="bg-[#1e2020] p-2.5 border border-[#424656]/15">
                  <p className="opacity-60 uppercase text-[9px]">{language === "vi" ? "TIÊU CHUẨN" : "CONTEXT"}</p>
                  <p className="text-[#ffb0ce] font-bold uppercase mt-0.5">FIT LOGS</p>
                </div>
              </div>
            </div>

            <div className="p-4 bg-[#0c0f0f] border border-[#0066ff]/20 relative overflow-hidden group">
              <Zap className="w-5 h-5 text-[#0066ff] mb-2" />
              <h5 className="font-montserrat text-xs font-bold text-white uppercase tracking-wider mb-1">
                {language === "vi" ? "TƯƠNG TÁC SỐ ĐO" : "ATHLETE FEEDBACK"}
              </h5>
              <p className="text-[11px] text-zinc-400 font-light leading-relaxed">
                {language === "vi"
                  ? "Hãy nhắn chiều cao hoặc cân nặng. Tôi sẽ chỉ ra chính xác kích thước đai tạ dán dập nổi khớp cơ bụng thắt phẳng của bạn."
                  : "Type details like your chest measurement or heavy barbell record weights. Our AI will automatically output precise sizing or lumbar support tips."}
              </p>
            </div>
          </div>

          <button
            onClick={resetSession}
            className="flex items-center justify-center gap-2 border border-[#424656]/50 hover:border-white text-zinc-400 hover:text-white font-mono text-[10px] tracking-wider py-3 uppercase transition-all cursor-pointer"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            {language === "vi" ? "THIẾT LẬP LẠI HỘI THOẠI" : "RECALIBRATE SESSION"}
          </button>
        </div>

        {/* Right Segment Dialogue Core */}
        <div className="flex-1 flex flex-col h-full bg-[#0c0f0f] border-r border-[#424656]/20 relative">
          {/* Conversation list box */}
          <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-6">
            <AnimatePresence initial={false}>
              {messages.map((message, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.35, ease: "easeOut" }}
                  className={`flex gap-4 ${message.role === "user" ? "justify-end" : "justify-start"}`}
                >
                  {message.role === "assistant" && (
                    <div className="w-9 h-9 rounded-full bg-black border border-[#0066ff]/30 shrink-0 flex items-center justify-center p-0.5 self-start">
                      <img src={chatbotLogoSvg} alt="AI Specialist" className="w-full h-full object-cover rounded-full" />
                    </div>
                  )}

                  <div
                    className={`max-w-[85%] sm:max-w-[75%] p-4 border rounded-none ${
                      message.role === "user"
                        ? "bg-[#1e2020] border-[#424656]/30 text-white select-text"
                        : "bg-[#121414] border-[#0066ff]/25 text-zinc-100 select-text relative"
                    }`}
                  >
                    {message.role === "assistant" && (
                      <span className="absolute -top-1.5 -left-1.5 w-3 h-0.5 bg-[#0066ff]" />
                    )}
                    {message.role === "assistant" ? (
                      <div>{renderMessageContent(message.content)}</div>
                    ) : (
                      <p className="font-sans text-xs md:text-[13px] leading-relaxed whitespace-pre-wrap select-text selection:bg-[#0066ff]/30">
                        {message.content}
                      </p>
                    )}
                  </div>

                  {message.role === "user" && (
                    <div className="w-9 h-9 rounded-full bg-[#1e2020] border border-[#424656]/40 shrink-0 flex items-center justify-center self-start text-[#b3c5ff]">
                      <User className="w-4 h-4" />
                    </div>
                  )}
                </motion.div>
              ))}
            </AnimatePresence>

            {loading && (
              <div className="flex gap-4 justify-start">
                <div className="w-9 h-9 rounded-full bg-black border border-[#0066ff]/30 shrink-0 flex items-center justify-center p-0.5 self-start animate-spin">
                  <Loader2 className="w-4 h-4 text-[#0066ff]" />
                </div>
                <div className="bg-[#121414] border border-[#0066ff]/25 p-4 rounded-none max-w-[75%]">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-[#0066ff] animate-bounce [animation-delay:-0.3s]" />
                    <span className="w-2 h-2 rounded-full bg-[#0066ff] animate-bounce [animation-delay:-0.15s]" />
                    <span className="w-2 h-2 rounded-full bg-[#0066ff] animate-bounce" />
                    <p className="font-mono text-[9px] text-[#0066ff] uppercase tracking-widest pl-1">
                      {language === "vi" ? "ĐANG PHÂN TÍCH SỐ LIỆU..." : "ANALYZING PARAMETERS..."}
                    </p>
                  </div>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Prompt Suggestion pills list */}
          <div className="px-4 py-2 border-t border-[#424656]/15 bg-[#0a0c0c] flex items-center gap-2 overflow-x-auto whitespace-nowrap scrollbar-none">
            {suggestionPills.map((pill, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => handleSend(pill.prompt)}
                className="bg-[#1e2020]/40 text-[#b3c5ff] hover:text-white border border-[#424656]/20 hover:border-[#0066ff]/45 px-3 py-1.5 font-mono text-[10px] uppercase tracking-wider transition-all select-none cursor-pointer"
              >
                {pill.label}
              </button>
            ))}
          </div>

          {/* Input text send block */}
          <div className="p-4 bg-[#121414] border-t border-[#424656]/20">
            <div className="relative flex items-center">
              <textarea
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder={
                  language === "vi"
                    ? "Hỏi cố vấn về đai tập tạ thắt chặt, thun compression ôm cơ lực, áo phom rộng..."
                    : "Ask our AI Specialist about belt sizing, high tension fabric, weight stats..."
                }
                rows={1}
                className="w-full bg-[#0c0f0f] border border-[#424656]/30 focus:border-[#0066ff] focus:outline-none py-3.5 pl-4 pr-14 text-xs md:text-sm text-white placeholder-zinc-500 rounded-none resize-none font-sans min-h-[48px]"
              />
              <button
                onClick={() => handleSend()}
                disabled={loading || !inputValue.trim()}
                className="absolute right-3.5 p-2 bg-[#0066ff] disabled:bg-[#1e2020] disabled:text-zinc-600 hover:bg-[#0054d6] text-white transition-colors duration-200 flex items-center justify-center rounded-none cursor-pointer"
                title="Send message link"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
            <div className="flex justify-between items-center mt-2.5 px-0.5">
              <span className="font-mono text-[9px] text-zinc-500 uppercase tracking-tight">
                {language === "vi"
                  ? "CỔNG THÔNG TIN MÃ HÓA AES PHÒNG KIỂM NGHIỆM • PHÁT HÀNH TRỰC TIẾP"
                  : "PROMPT LOCK SECURELY LOADED • GEMINI INTRA-LAB CALIBRATOR"}
              </span>
              <span className="font-mono text-[9px] text-zinc-500 uppercase">
                {inputValue.length} chars
              </span>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
