/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from "react";
import { ArrowUpRight } from "lucide-react";
import { motion } from "motion/react";
import { useLanguage } from "../context/LanguageContext";

interface FeaturedCategoriesProps {
  onNavigate: (path: string) => void;
}

export default function FeaturedCategories({ onNavigate }: FeaturedCategoriesProps) {
  const { t } = useLanguage();

  const categories = [
    {
      title: t.categories.apparel,
      description: t.categories.apparelDesc,
      image: "https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?auto=format&fit=crop&q=80&w=1000",
      gridClass: "col-span-1 md:col-span-2 lg:col-span-2 row-span-2 min-h-[320px] md:min-h-full",
      path: "/men"
    },
    {
      title: t.categories.supplements,
      description: t.categories.supplementsDesc,
      image: "https://images.unsplash.com/photo-1593095948071-474c5cc2989d?auto=format&fit=crop&q=80&w=1000",
      gridClass: "col-span-1 h-[288px] lg:h-auto",
      path: "/supplements"
    },
    {
      title: t.categories.liftingAccessories,
      description: t.categories.accessoriesDesc,
      image: "https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&q=80&w=1000",
      gridClass: "col-span-1 h-[288px] lg:h-auto",
      path: "/accessories"
    },
    {
      title: t.categories.newArrivals,
      description: t.categories.newArrivalsDesc,
      image: "https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?auto=format&fit=crop&q=80&w=1000",
      gridClass: "col-span-1 md:col-span-2 lg:col-span-2 h-[288px] lg:h-auto",
      path: "/new-arrivals"
    },
  ];

  const handleCategoryClick = (e: React.MouseEvent, path: string) => {
    e.preventDefault();
    if (path.startsWith("/")) {
      onNavigate(path);
    } else {
      const target = document.querySelector(path);
      if (target) {
        target.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    }
  };

  return (
    <section id="categories" className="py-20 md:py-24 px-6 md:px-16 theme-bg-secondary transition-colors">
      <div className="max-w-7xl mx-auto">
        <h2 className="font-montserrat text-2xl md:text-3xl font-extrabold theme-text-primary tracking-widest uppercase mb-2 transition-colors">
          {t.categories.title}
        </h2>
        <p className="font-mono text-xs text-[#0066ff] tracking-widest uppercase font-bold mb-12">
          {t.categories.subtitle}
        </p>

        {/* Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 lg:h-[600px]">
          {categories.map((cat, idx) => (
            <motion.a
              key={idx}
              href={cat.path}
              onClick={(e) => handleCategoryClick(e, cat.path)}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
              className={`relative theme-bg-primary overflow-hidden group border border-[#424656]/10 hover:theme-border transition-colors ${cat.gridClass}`}
            >
              {/* Image with zoom on hover */}
              <div
                className="absolute inset-0 bg-cover bg-center opacity-50 group-hover:opacity-75 group-hover:scale-103 transition-all duration-500"
                style={{ backgroundImage: `url('${cat.image}')` }}
                role="img"
                aria-label={cat.title}
              />

              {/* High contrast gradient vignette */}
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent opacity-80 group-hover:opacity-90 transition-opacity" />

              {/* Content absolute positioning */}
              <div className="absolute bottom-0 left-0 p-6 md:p-8 w-full flex flex-col justify-end">
                <h3 className="font-montserrat text-lg md:text-xl font-extrabold text-white tracking-widest uppercase mb-1">
                  {cat.title}
                </h3>
                <p className="text-zinc-400 font-sans text-xs mb-3 group-hover:text-white/90 transition-colors">
                  {cat.description}
                </p>
                <span className="text-[#0066ff] font-montserrat text-[11px] font-bold tracking-widest flex items-center gap-1.5 uppercase transition-colors group-hover:text-white">
                  {t.hero.cta}
                  <ArrowUpRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </span>
              </div>
            </motion.a>
          ))}
        </div>
      </div>
    </section>
  );
}

