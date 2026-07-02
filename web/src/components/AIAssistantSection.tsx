/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useRef, useEffect } from "react";
import { MessageSquare, Zap, Activity, Info, Loader2, RefreshCw } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { useLanguage } from "../context/LanguageContext";

interface AIAssistantSectionProps {
  onOpenQuickView: (productId: string) => void;
}

export default function AIAssistantSection({ onOpenQuickView }: AIAssistantSectionProps) {
  const { language, t } = useLanguage();
  const [isOpen, setIsOpen] = useState(true);
  const [discipline, setDiscipline] = useState("powerlifting");
  const [experience, setExperience] = useState("intermediate");
  const [customGoal, setCustomGoal] = useState("");
  const [loading, setLoading] = useState(false);
  const [adviceData, setAdviceData] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const resultsRef = useRef<HTMLDivElement>(null);

  // Focus scroll to recommendations when loaded
  useEffect(() => {
    if (adviceData && resultsRef.current) {
      resultsRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, [adviceData]);

  const handleQuery = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setAdviceData(null);
    setErrorMsg(null);

    try {
      const res = await fetch("/api/recommendations", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          discipline,
          experience,
          goal: "optimize performance output",
          customMessage: customGoal,
        }),
      });

      const data = await res.json();
      if (data.success) {
        setAdviceData(data.advice);
      } else {
        setErrorMsg("Failed to query recommendation systems.");
      }
    } catch (err) {
      console.error(err);
      setErrorMsg("Connection timeout. Please check your local network connection.");
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setAdviceData(null);
    setCustomGoal("");
    setDiscipline("powerlifting");
    setExperience("intermediate");
  };

  // Helper function to render markdown-like structures into elegant high-contrast HTML
  const formatAdvice = (advice: string) => {
    const lines = advice.split("\n");
    return lines.map((line, idx) => {
      const trimmed = line.trim();
      if (!trimmed) return <div key={idx} className="h-2" />;

      // Headers (e.g. ### HEADER or **HEADER**)
      if (trimmed.startsWith("###")) {
        return (
          <h4 key={idx} className="font-montserrat text-xs md:text-sm font-extrabold text-[#b3c5ff] tracking-widest uppercase mt-6 mb-2">
            {trimmed.replace("###", "").trim()}
          </h4>
        );
      }

      // Check if it's a bold title block
      if (trimmed.startsWith("**") && trimmed.includes("**:") || trimmed.startsWith("**") && trimmed.includes("**")) {
        // Render headers highlighted inside custom styles
        return (
          <p key={idx} className="font-sans text-xs md:text-sm text-white leading-relaxed mt-3">
            {trimmed.split("**").map((chunk, cidx) => {
              if (cidx % 2 === 1) {
                return (
                  <strong key={cidx} className="text-[#ffb0ce] font-extrabold">
                    {chunk}
                  </strong>
                );
              }
              return chunk;
            })}
          </p>
        );
      }

      // Bullet points
      if (trimmed.startsWith("-") || trimmed.startsWith("*")) {
        let cleanText = trimmed.substring(1).trim();
        // Check for inline highlight selectors like [Oversized Gym Tee] or product mentions
        return (
          <li key={idx} className="font-sans text-xs md:text-sm text-[#c2c6d8] leading-relaxed list-none pl-4 relative before:content-['•'] before:text-[#0066ff] before:absolute before:left-0 before:font-bold mt-1.5">
            {cleanText.split("**").map((part, pidx) => {
              if (pidx % 2 === 1) {
                return <strong key={pidx} className="text-white font-bold">{part}</strong>;
              }
              return part;
            })}
          </li>
        );
      }

      return (
        <p key={idx} className="font-sans text-xs md:text-sm text-[#c2c6d8] leading-relaxed mt-2">
          {trimmed}
        </p>
      );
    });
  };

  return (
    <section id="advice" className="py-20 md:py-24 px-6 md:px-16 bg-[#111111] border-y border-[#424656]/20">
      <div className="max-w-4xl mx-auto text-center flex flex-col items-center gap-6">
        {/* Support Specialist Icon */}
        <div className="w-16 h-16 flex items-center justify-center theme-bg-primary border border-[#424656]/25 select-none text-[#0066ff]">
          <Activity className="w-8 h-8 stroke-[1.5]" />
        </div>

        <h2 className="font-anton text-4xl md:text-6xl text-white uppercase tracking-wider leading-none">
          {language === "vi" ? "Cần Hỗ Trợ Lựa Chọn Thiết Bị Phù Hợp?" : "Need Help Choosing The Right Gear?"}
        </h2>

        <p className="font-sans text-sm md:text-base text-[#c2c6d8] leading-relaxed max-w-2xl font-light">
          {language === "vi" 
            ? "Kết nối với các chuyên gia hiệu năng để cấu hình bộ đồ dùng tối ưu chất lượng phù hợp với giáo án tập luyện của bạn." 
            : "Connect with our performance specialists to build a custom gear kit tailored to your exact training discipline and goals."}
        </p>

        {/* Form is open by default */}
      </div>

      {/* Expanded Interactive AI Console */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className="max-w-4xl mx-auto mt-12 theme-bg-primary border border-[#424656]/20 overflow-hidden"
          >
            <div className="p-6 md:p-10 border-b border-[#424656]/20 flex justify-between items-center bg-[#070909]">
              <div className="flex items-center gap-3">
                <MessageSquare className="w-5 h-5 text-[#0066ff]" />
                <h3 className="font-montserrat text-xs md:text-sm font-extrabold text-white tracking-widest uppercase">
                  {language === "vi" ? "KỸ THUẬT VIÊN TƯ VẤN CÔNG THÁI HỌC HENRY FIT" : "HENRY FIT PERFORMANCE CONSULTANT"}
                </h3>
              </div>
              <button
                onClick={handleReset}
                title="Reset consultant parameters"
                className="p-2 text-white/50 hover:text-white transition-colors"
              >
                <RefreshCw className="w-4 h-4" />
              </button>
            </div>

            <div className="p-6 md:p-10">
              <form onSubmit={handleQuery} className="flex flex-col gap-8">
                {/* Discipline row */}
                <div>
                  <label className="block font-montserrat text-[10px] font-bold text-white tracking-widest uppercase mb-3">
                    {language === "vi" ? "1. LỰA CHỌN MÔN THỂ THAO CHÍNH" : "1. CHOOSE ACTIVE DISCIPLINE"}
                  </label>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    {[
                      { id: "powerlifting", label: language === "vi" ? "Cử tạ / Powerlift" : "Powerlifting" },
                      { id: "bodybuilding", label: language === "vi" ? "Thể hình / Pump" : "Bodybuilding" },
                      { id: "hybrid", label: language === "vi" ? "Đa năng / Hybrid" : "Hybrid Athlete" },
                      { id: "cardio", label: language === "vi" ? "Thể lực & Cardio" : "Cardio & Fitness" },
                    ].map((item) => (
                      <button
                        type="button"
                        key={item.id}
                        onClick={() => setDiscipline(item.id)}
                        className={`py-3 px-4 font-montserrat text-[11px] font-bold tracking-wider uppercase text-center border transition-all ${
                          discipline === item.id
                            ? "bg-[#0066ff] text-white border-[#0066ff]"
                            : "bg-[#111111] text-[#e2e2e2] border-[#424656]/30 hover:border-white"
                        }`}
                      >
                        {item.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Experience row */}
                <div>
                  <label className="block font-montserrat text-[10px] font-bold text-white tracking-widest uppercase mb-3">
                    {language === "vi" ? "2. CẤP ĐỘ CƯỜNG ĐỘ HUẤN LUYỆN" : "2. TRAINING INTENSITY LEVEL"}
                  </label>
                  <div className="grid grid-cols-3 gap-3">
                    {[
                      { id: "novice", label: language === "vi" ? "Mới bắt đầu" : "Novice" },
                      { id: "intermediate", label: language === "vi" ? "Trung cấp" : "Intermediate" },
                      { id: "advanced", label: language === "vi" ? "Cực đại / Vận động viên" : "Advanced Elite" },
                    ].map((item) => (
                      <button
                        type="button"
                        key={item.id}
                        onClick={() => setExperience(item.id)}
                        className={`py-3 px-4 font-montserrat text-[11px] font-bold tracking-wider uppercase text-center border transition-all ${
                          experience === item.id
                            ? "bg-[#0066ff] text-white border-[#0066ff]"
                            : "bg-[#111111] text-[#e2e2e2] border-[#424656]/30 hover:border-white"
                        }`}
                      >
                        {item.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Custom goal message */}
                <div>
                  <label className="block font-montserrat text-[10px] font-bold text-white tracking-widest uppercase mb-3">
                    {language === "vi" ? "3. MỤC TIÊU HUẤN LUYỆN CHI TIẾT (TÙY CHỌN)" : "3. CUSTOM ATHLETIC OBJECTIVE (OPTIONAL)"}
                  </label>
                  <textarea
                    value={customGoal}
                    onChange={(e) => setCustomGoal(e.target.value)}
                    placeholder={
                      language === "vi" 
                        ? "Ví dụ: Tôi bị mỏi thắt lưng dưới khi gánh tạ. Đai lưng 10mm có cải thiện tốt không? Vòng bụng gồng 82cm đeo size nào phù hợp nhất?"
                        : "E.g., I have lower back stress during loading. Will the lifting belt help with squat stability? Which size matches 32-inch core?"
                    }
                    maxLength={250}
                    rows={3}
                    className="w-full bg-[#111111] border border-[#424656]/40 p-4 text-xs md:text-sm text-white focus:outline-none focus:border-[#0066ff] placeholder-white/20 uppercase font-sans tracking-wide"
                  />
                  <div className="text-right text-[10px] font-mono text-[#c2c6d8] mt-1 opacity-50">
                    {customGoal.length}/250 CHARS
                  </div>
                </div>

                {/* Submit row */}
                <div className="flex flex-col sm:flex-row gap-4 justify-between items-center pt-2">
                  <div className="flex items-center gap-2 text-[11px] font-mono text-[#c2c6d8]/60 uppercase text-center sm:text-left select-none">
                    <Info className="w-4 h-4 text-[#ffb0ce]" />
                    {language === "vi" ? "HỆ THỐNG KIỂM TRA ĐỒNG BỘ AN TOÀN" : "SECURE SERVER ENCRYPTED COMPILATION"}
                  </div>
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full sm:w-auto bg-white text-black hover:bg-[#b3c5ff] hover:text-[#001849] font-montserrat text-xs font-bold tracking-widest px-8 py-4 uppercase flex items-center justify-center gap-2 min-w-[200px]"
                  >
                    {loading ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        {language === "vi" ? "ĐANG LIÊN KẾT CHUYÊN GIA..." : "COMPILING KIT..."}
                      </>
                    ) : (
                      language === "vi" ? "XÁC THỰC PHÙ HỢP" : "DEPLOY SPECIALIST"
                    )}
                  </button>
                </div>
              </form>

              {/* Rendering Consultation Results */}
              <AnimatePresence>
                {(adviceData || errorMsg) && (
                  <motion.div
                    ref={resultsRef}
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 15 }}
                    className="mt-10 p-6 md:p-8 bg-[#111111] border border-[#0066ff]/20 relative"
                  >
                    {errorMsg ? (
                      <p className="text-xs md:text-sm text-[#ffb4ab] font-mono uppercase">
                        {errorMsg}
                      </p>
                    ) : (
                      adviceData && (
                        <div>
                          <div className="absolute top-4 right-4 bg-[#0066ff]/10 text-[#5194ff] font-mono text-[9px] font-bold px-2 py-0.5 border border-[#006ff]/20 uppercase">
                            {language === "vi" ? "ĐÃ CÓ KẾT QUẢ AI" : "AI CONSULT READY"}
                          </div>

                          <div className="prose prose-invert max-w-none text-left">
                            {formatAdvice(adviceData)}
                          </div>

                          {/* Quick shortcuts helper under response */}
                          <div className="mt-8 pt-6 border-t border-[#424656]/20">
                            <p className="font-montserrat text-[10px] text-white tracking-widest uppercase mb-4">
                              {language === "vi" ? "PHÍM TẮT SẢN PHẨM KHUYÊN DÙNG" : "DEPLOYED PRODUCT SHORTCUTS"}
                            </p>
                            <div className="flex flex-wrap gap-2">
                              <button
                                type="button"
                                onClick={() => onOpenQuickView("oversized-tee")}
                                className="theme-bg-primary hover:bg-[#1e2020] text-[#b3c5ff] font-mono text-[10px] font-bold border border-[#424656]/30 px-3 py-2 uppercase transition-all"
                              >
                                {language === "vi" ? "ÁO OVERSZIED GYM TEE" : "OVERSIZED TEE"}
                              </button>
                              <button
                                type="button"
                                onClick={() => onOpenQuickView("compression-shirt")}
                                className="theme-bg-primary hover:bg-[#1e2020] text-[#b3c5ff] font-mono text-[10px] font-bold border border-[#424656]/30 px-3 py-2 uppercase transition-all"
                              >
                                {language === "vi" ? "ÁO COMPRESSION BÓ CƠ" : "COMPRESSION SHIRT"}
                              </button>
                              <button
                                type="button"
                                onClick={() => onOpenQuickView("lifting-belt")}
                                className="theme-bg-primary hover:bg-[#1e2020] text-[#b3c5ff] font-mono text-[10px] font-bold border border-[#424656]/30 px-3 py-2 uppercase transition-all"
                              >
                                {language === "vi" ? "ĐAI LƯNG TẬP TẠ 10MM" : "LIFTING BELT"}
                              </button>
                            </div>
                          </div>
                        </div>
                      )
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
