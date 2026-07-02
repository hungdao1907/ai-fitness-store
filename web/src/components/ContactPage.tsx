/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { motion } from "motion/react";
import { Send, Loader2, Info, CheckCircle2, ArrowLeft } from "lucide-react";
import { useLanguage } from "../context/LanguageContext";

interface ContactPageProps {
  onNavigate: (path: string) => void;
  onShowToast: (message: string, isError?: boolean) => void;
}

export default function ContactPage({ onNavigate, onShowToast }: ContactPageProps) {
  const { language, t } = useLanguage();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Reset success
    setSuccess(false);

    // Validation
    if (!name.trim()) {
      onShowToast(t.contactForm.errName, true);
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email.trim() || !emailRegex.test(email)) {
      onShowToast(t.contactForm.errEmail, true);
      return;
    }

    if (!message.trim()) {
      onShowToast(t.contactForm.errMessage, true);
      return;
    }

    setLoading(true);

    // Simulated network calibration delay
    await new Promise((resolve) => setTimeout(resolve, 1200));

    try {
      // Save contact inquiry locally
      const inquiries = JSON.parse(localStorage.getItem("henry_fit_inquiries") || "[]");
      inquiries.push({
        id: Math.random().toString(36).substr(2, 9),
        name: name.trim(),
        email: email.trim(),
        message: message.trim(),
        timestamp: new Date().toISOString(),
      });
      localStorage.setItem("henry_fit_inquiries", JSON.stringify(inquiries));

      setSuccess(true);
      setName("");
      setEmail("");
      setMessage("");
      onShowToast(t.contactForm.success, false);
    } catch (err) {
      console.error(err);
      onShowToast("Database buffering error. Please try again.", true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-[#0a0a0a] min-h-screen text-white pt-12 pb-24 px-6 md:px-16">
      <div className="max-w-3xl mx-auto">
        {/* Back Link */}
        <button
          onClick={() => onNavigate("/")}
          className="flex items-center gap-2 text-[#0066ff] hover:text-white transition-colors text-xs font-mono tracking-widest uppercase mb-12 cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          {language === "vi" ? "QUAY LẠI TRANG CHỦ" : "BACK TO PORT"}
        </button>

        {/* Headline */}
        <div className="mb-12 border-b border-[#424656]/20 pb-6">
          <h1 className="font-anton text-4xl md:text-6xl tracking-wide uppercase text-white mb-3">
            {t.contactForm.title}
          </h1>
          <p className="font-sans text-sm text-[#c2c6d8] leading-relaxed max-w-2xl font-light">
            {t.contactForm.subtitle}
          </p>
        </div>

        {success ? (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-[#003827] border border-[#387e63]/30 p-8 flex flex-col items-center text-center max-w-xl mx-auto"
          >
            <CheckCircle2 className="w-12 h-12 text-[#8ed5b6] mb-4" />
            <h3 className="font-montserrat text-sm font-extrabold text-white tracking-widest uppercase mb-3">
              INQUIRY SIGNED (SUCCESS)
            </h3>
            <p className="font-sans text-xs md:text-sm text-[#e0ffee] leading-relaxed mb-6">
              {t.contactForm.success}
            </p>
            <button
              onClick={() => setSuccess(false)}
              className="bg-white text-black hover:bg-[#b3c5ff] hover:text-[#001849] font-montserrat text-xs font-black tracking-widest px-8 py-3.5 uppercase transition-all"
            >
              {language === "vi" ? "GỬI THÊM THƯ MỚI" : "TRANSMIT NEW INQUIRY"}
            </button>
          </motion.div>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col gap-6 bg-[#111111] p-6 md:p-10 border border-[#424656]/15">
            {/* Name input */}
            <div>
              <label className="block font-montserrat text-[10px] font-bold text-white tracking-widest uppercase mb-3">
                {t.contactForm.name} *
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder={t.contactForm.namePlaceholder}
                className="w-full bg-black border border-[#424656]/45 p-4 text-xs md:text-sm text-white focus:outline-none focus:border-[#0066ff] placeholder-white/20 uppercase font-sans tracking-wide transition-colors"
                disabled={loading}
              />
            </div>

            {/* Email input */}
            <div>
              <label className="block font-montserrat text-[10px] font-bold text-white tracking-widest uppercase mb-3">
                {t.contactForm.email} *
              </label>
              <input
                type="text"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder={t.contactForm.emailPlaceholder}
                className="w-full bg-black border border-[#424656]/45 p-4 text-xs md:text-sm text-white focus:outline-none focus:border-[#0066ff] placeholder-white/20 uppercase font-sans tracking-wide transition-colors"
                disabled={loading}
              />
            </div>

            {/* Message input */}
            <div>
              <label className="block font-montserrat text-[10px] font-bold text-white tracking-widest uppercase mb-3">
                {t.contactForm.message} *
              </label>
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder={t.contactForm.messagePlaceholder}
                rows={5}
                className="w-full bg-black border border-[#424656]/45 p-4 text-xs md:text-sm text-white focus:outline-none focus:border-[#0066ff] placeholder-white/20 uppercase font-sans tracking-wide transition-colors"
                disabled={loading}
              />
            </div>

            {/* Safe indicators and submit trigger */}
            <div className="flex flex-col sm:flex-row gap-4 justify-between items-center pt-2">
              <div className="flex items-center gap-2 text-[10px] font-mono text-[#c2c6d8]/60 uppercase select-none">
                <Info className="w-4 h-4 text-[#0066ff]" />
                AES-256 SECURED LAB FEEDBACK MECHANISM
              </div>
              <button
                type="submit"
                disabled={loading}
                className="w-full sm:w-auto bg-[#0066ff] hover:bg-white hover:text-black text-white font-montserrat text-xs font-bold tracking-widest px-8 py-4 uppercase flex items-center justify-center gap-2 cursor-pointer disabled:bg-[#1e2020] disabled:text-zinc-500"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    {t.contactForm.submitting}
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    {t.contactForm.submit}
                  </>
                )}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
