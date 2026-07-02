/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { Send, CheckCircle2, Loader2, AlertTriangle } from "lucide-react";
import { useLanguage } from "../context/LanguageContext";

interface FooterProps {
  onNavigate: (path: string) => void;
  onShowToast: (message: string, isError?: boolean) => void;
}

export default function Footer({ onNavigate, onShowToast }: FooterProps) {
  const { t } = useLanguage();
  const [email, setEmail] = useState("");
  const [subscribing, setSubscribing] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    const cleanEmail = email.trim();
    if (!cleanEmail) return;

    // Simple robust email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(cleanEmail)) {
      onShowToast(t.newsletter.invalidEmail, true);
      return;
    }

    setSubscribing(true);

    // Simulate server-side calibration lag
    await new Promise((resolve) => setTimeout(resolve, 800));

    try {
      // Pull and save to localStorage
      const activeSubscribers = JSON.parse(localStorage.getItem("henry_fit_subscribers") || "[]");
      if (!activeSubscribers.includes(cleanEmail)) {
        activeSubscribers.push(cleanEmail);
        localStorage.setItem("henry_fit_subscribers", JSON.stringify(activeSubscribers));
      }

      setSuccess(true);
      setEmail("");
      onShowToast(t.newsletter.successToast, false);
    } catch (err) {
      console.error(err);
      onShowToast("System buffer overflow. Try subscribing again.", true);
    } finally {
      setSubscribing(false);
    }
  };

  const handleLinkClick = (e: React.MouseEvent, path: string) => {
    e.preventDefault();
    onNavigate(path);
  };

  return (
    <footer className="bg-[#0c0f0f] border-t border-[#424656]/20 w-full pt-16 md:pt-20">
      <div className="max-w-7xl mx-auto px-6 md:px-16 pb-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8">
        {/* Brand Column */}
        <div className="flex flex-col gap-4">
          <span className="font-anton text-2xl tracking-wide text-[#b3c5ff] uppercase select-none cursor-pointer" onClick={(e) => handleLinkClick(e, "/")}>
            HENRY FIT
          </span>
          <p className="font-sans text-xs md:text-sm text-[#c2c6d8] leading-relaxed max-w-xs">
            {t.footer.tagline}
          </p>
        </div>

        {/* Support Links */}
        <div className="flex flex-col gap-4">
          <h4 className="font-montserrat text-xs font-black tracking-widest text-white uppercase select-none">
            {t.footer.support}
          </h4>
          <ul className="flex flex-col gap-2.5">
            <li>
              <a
                href="/about"
                onClick={(e) => handleLinkClick(e, "/about")}
                className="font-sans text-xs md:text-sm text-[#c2c6d8] hover:text-[#b3c5ff] transition-colors"
              >
                {t.footer.aboutUs}
              </a>
            </li>
            <li>
              <a
                href="/shipping-policy"
                onClick={(e) => handleLinkClick(e, "/shipping-policy")}
                className="font-sans text-xs md:text-sm text-[#c2c6d8] hover:text-[#b3c5ff] transition-colors"
              >
                {t.footer.shippingPolicy}
              </a>
            </li>
            <li>
              <a
                href="/contact"
                onClick={(e) => handleLinkClick(e, "/contact")}
                className="font-sans text-xs md:text-sm text-[#c2c6d8] hover:text-[#b3c5ff] transition-colors"
              >
                {t.footer.contact}
              </a>
            </li>
          </ul>
        </div>

        {/* Legal Links */}
        <div className="flex flex-col gap-4">
          <h4 className="font-montserrat text-xs font-black tracking-widest text-white uppercase select-none">
            {t.footer.legal}
          </h4>
          <ul className="flex flex-col gap-2.5">
            <li>
              <a
                href="/privacy-policy"
                onClick={(e) => handleLinkClick(e, "/privacy-policy")}
                className="font-sans text-xs md:text-sm text-[#c2c6d8] hover:text-[#b3c5ff] transition-colors"
              >
                {t.footer.privacyPolicy}
              </a>
            </li>
            <li>
              <a
                href="/terms-of-service"
                onClick={(e) => handleLinkClick(e, "/terms-of-service")}
                className="font-sans text-xs md:text-sm text-[#c2c6d8] hover:text-[#b3c5ff] transition-colors"
              >
                {t.footer.termsOfService}
              </a>
            </li>
          </ul>
        </div>

        {/* Newsletter subscription */}
        <div className="flex flex-col gap-4">
          <h4 className="font-montserrat text-xs font-black tracking-widest text-white uppercase select-none">
            {t.newsletter.title}
          </h4>
          <p className="font-sans text-xs text-zinc-400">
            {t.newsletter.subtitle}
          </p>

          {success ? (
            <div className="bg-[#003827] border border-[#387e63]/30 p-4 flex items-start gap-3">
              <CheckCircle2 className="w-5 h-5 text-[#8ed5b6] shrink-0 mt-0.5" />
              <div>
                <p className="font-montserrat text-[10px] font-extrabold text-white tracking-widest uppercase">
                  REGISTRY SECURED
                </p>
                <p className="font-sans text-xs text-[#e0ffee] mt-1 pr-2">
                  {t.newsletter.successToast}
                </p>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubscribe} className="flex flex-col gap-2.5">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder={t.newsletter.emailPlaceholder}
                className="w-full bg-[#111111] border border-[#424656]/50 p-3.5 text-xs text-white focus:outline-none focus:border-[#0066ff] placeholder-[#c2c6d8]/40 font-montserrat tracking-widest rounded-none transition-colors"
                disabled={subscribing}
              />
              <button
                type="submit"
                disabled={subscribing}
                className="w-full bg-[#0066ff] hover:bg-white hover:text-black text-white font-montserrat text-xs font-bold tracking-widest py-3.5 uppercase rounded-none transition-all flex items-center justify-center gap-1.5 cursor-pointer disabled:bg-[#1e2020] disabled:text-zinc-500"
              >
                {subscribing ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    {t.newsletter.subscribing}
                  </>
                ) : (
                  <>
                    <Send className="w-3.5 h-3.5" />
                    {t.newsletter.subscribe}
                  </>
                )}
              </button>
            </form>
          )}
        </div>
      </div>

      {/* Bottom Copyright bar */}
      <div className="py-6 border-t border-[#424656]/15 theme-bg-primary">
        <div className="max-w-7xl mx-auto px-6 md:px-16 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="font-mono text-[10px] text-[#c2c6d8]/60 uppercase tracking-widest text-center md:text-left select-none">
            © {new Date().getFullYear()} HENRY FIT labs. {t.footer.rights}
          </p>
          <div className="flex gap-4 text-[10px] font-mono text-[#c2c6d8]/40 uppercase tracking-widest">
            <a href="/privacy-policy" onClick={(e) => handleLinkClick(e, "/privacy-policy")} className="hover:text-white transition-colors">
              POL_PRIVACY
            </a>
            <span className="select-none">•</span>
            <a href="/terms-of-service" onClick={(e) => handleLinkClick(e, "/terms-of-service")} className="hover:text-white transition-colors">
              SYS_TERMS
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
