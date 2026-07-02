/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { CheckCircle, Dumbbell, Truck } from "lucide-react";
import { motion } from "motion/react";
import { useLanguage } from "../context/LanguageContext";

export default function FeaturesSection() {
  const { t } = useLanguage();

  const features = [
    {
      icon: <CheckCircle className="w-8 h-8 text-[#0066ff] stroke-[2]" />,
      title: t.features.f1Title,
      desc: t.features.f1Desc,
    },
    {
      icon: <Dumbbell className="w-8 h-8 text-[#0066ff] stroke-[2]" />,
      title: t.features.f2Title,
      desc: t.features.f2Desc,
    },
    {
      icon: <Truck className="w-8 h-8 text-[#0066ff] stroke-[2]" />,
      title: t.features.f3Title,
      desc: t.features.f3Desc,
    },
  ];

  return (
    <section id="features" className="py-20 md:py-24 px-6 md:px-16 bg-[#121414] border-t border-[#424656]/15">
      <div className="max-w-7xl mx-auto">
        <div className="mb-12">
          <h2 className="font-montserrat text-2xl md:text-3xl font-extrabold text-white tracking-widest uppercase mb-2">
            {t.features.title}
          </h2>
          <p className="font-mono text-xs text-[#0066ff] tracking-widest uppercase font-bold">
            {t.features.subtitle}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
          {features.map((feat, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
              className="flex flex-col items-start p-6 md:p-8 bg-[#111111] border-l-4 border-[#0066ff] rounded-none hover:bg-[#1e2020] transition-colors duration-300"
            >
              {/* Icon container */}
              <div className="mb-6 p-2.5 theme-bg-primary/40 inline-flex items-center justify-center border border-[#424656]/10">
                {feat.icon}
              </div>

              {/* Title */}
              <h3 className="font-montserrat text-base md:text-lg font-extrabold text-white uppercase tracking-wider mb-3">
                {feat.title}
              </h3>

              {/* Description */}
              <p className="font-sans text-xs md:text-sm text-[#c2c6d8] leading-relaxed">
                {feat.desc}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

