/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from "react";
import { motion } from "motion/react";
import { useLanguage } from "../context/LanguageContext";

interface HeroSectionProps {
  onOpenAdvice: () => void;
  onNavigate?: (path: string) => void;
}

export default function HeroSection({ onOpenAdvice, onNavigate }: HeroSectionProps) {
  const { t } = useLanguage();

  const handleCtaClick = (e: React.MouseEvent) => {
    e.preventDefault();
    const target = document.querySelector("#featured-categories") || document.querySelector("#best-sellers");
    if (target) {
      target.scrollIntoView({ behavior: "smooth", block: "start" });
    } else {
      if (onNavigate) onNavigate("/best-sellers");
    }
  };

  return (
    <section id="hero" className="relative w-full h-[819px] flex items-center theme-bg-secondary overflow-hidden">
      {/* Background Image Container with atmospheric vignettes */}
      <div className="absolute inset-0 z-0 w-full h-full">
        <div
          className="bg-cover bg-center w-full h-full transition-transform duration-1000 scale-102"
          style={{
            backgroundImage: `url('https://lh3.googleusercontent.com/aida-public/AB6AXuCld-HeUyUZixPnQB9niQpcz-OaFLfapoj_xU0w_am_QNwjR5qN72LSLm_m3OQEl85ZarTBI6Kn3iiNVp6Ptu7PlhFrnNiZFYFDa7pgL0lU6mBMvQEOIJBg5sITSgVemR-T01-sZDCqDWSDs_DWbFbVGqxjf641tX5IJgyRc3Fu6az33yEKbZ6qaopSWHBts9pLg8Idjs9bRaLmS0ly_sIFmerUMDVGoqcJMmNnpsZfps4KA25z8WhWj6jtwY-1vKFsxiS7DmjL_uWj')`,
          }}
          aria-label="Athletic performance backdrop featuring extreme compound barbell lift"
        />
        {/* Extreme dark athletic vignettes */}
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/45 to-black/80" />
        <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/10 to-transparent" />
      </div>

      {/* Main Container Content */}
      <div className="relative z-10 px-6 md:px-16 w-full max-w-7xl mx-auto flex flex-col justify-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="max-w-3xl"
        >
          {/* Headline Display using the custom Anton webfont */}
          <h1 className="font-anton text-5xl md:text-6xl lg:text-7xl leading-tight md:leading-[1.1] text-white tracking-wide uppercase select-none mb-6 max-w-2xl break-words">
            {t.hero.title}
          </h1>

          <p className="font-sans text-[#c2c6d8] text-base md:text-lg leading-relaxed max-w-2xl font-light mb-10">
            {t.hero.subtitle}
          </p>

          {/* Action buttons */}
          <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto h-fit">
            <a
              href="/best-sellers"
              onClick={handleCtaClick}
              className="bg-[#0066ff] hover:bg-[#0054d6] text-white font-montserrat text-xs font-bold tracking-widest px-8 py-4 uppercase text-center transition-all duration-300 h-13 flex items-center justify-center hover:scale-102 cursor-pointer"
            >
              {t.hero.cta}
            </a>
          </div>
        </motion.div>
      </div>

      {/* Running border details accentuating absolute rectilinearity */}
      <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-[#0066ff] via-transparent to-[#ffb0ce]/10 z-20" />
    </section>
  );
}

