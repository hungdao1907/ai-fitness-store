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
      image: "https://lh3.googleusercontent.com/aida-public/AB6AXuBOq91TJ3BmTt7yEyN2liR863bwjXrC1gWVcE6wR97yrhpAbzInR2Myf6p343bhvvSvvsin6dWMIQEDAeoTAU_jDxjUIyvbNEX9uga1YXp_VRg-KsZel2x8rafWDWylvkQCUPimhQ7DU5M5ZY2jYMk7NAm5Ga3nyZxSi501zqQSASOUViGYvdD8o36ePO6w3SbLY5s9i0evN20fik8OzLHb32jCCyMyPXjlhbbPivEaUbiMN8Omv_4ZIQ4k32PxEJ_B5TkWExy1887S",
      gridClass: "col-span-1 md:col-span-2 lg:col-span-2 row-span-2 min-h-[320px] md:min-h-full",
      path: "/men"
    },
    {
      title: t.categories.supplements,
      description: t.categories.supplementsDesc,
      image: "https://lh3.googleusercontent.com/aida-public/AB6AXuBpbjM1zvis8BE7sJnapZVPmw02WeW6IC6Sim-ba7iVcaol2FEVb6zIt46iLGVTL959qt1E9kNnORmsnhqROt9Ul7N0SSbh0qNGllj5eSsoqk5D-dp_HbordA-pFRhbTy_fC0bhUf0CPSewWFuGENMVjY6Ady0X-tLyf8x3jhV-4u5X2Q-2O9ZmCMgEXjThaHvkwGH9zTJAt4v4XIP2UI_osKgPhcgPuzdAbImY2I_ySOmDGFgIVnzO92_Wbrz5jRMWJmQWBAB6NVwY",
      gridClass: "col-span-1 h-[288px] lg:h-auto",
      path: "/supplements"
    },
    {
      title: t.categories.liftingAccessories,
      description: t.categories.accessoriesDesc,
      image: "https://lh3.googleusercontent.com/aida-public/AB6AXuCmNk7Okdd5ctfl3froAOoF2fM71F9EoWX-43RyPM7Gq2RYKhbtE79lwe_d-0SzMDSvdHknUjDG8DQckGdvwLNptFqNdU54k8qfETYPB7Sk8B_qzkOC9udgim7QBp1KhlOdN5nlgoWzLphGJOrBiZVgeHSpG3vJBdGG6iMMxPqN5rQrBCa8MmCFBj_BqRq0wa5WRIDIrHkzDQztlBDAzLH-pc0eu9LLd7oo12lP4cNGzYd0NijHaeP2i3QhghGwSx5hMzqNTGJz6U8-",
      gridClass: "col-span-1 h-[288px] lg:h-auto",
      path: "/best-sellers"
    },
    {
      title: t.categories.newArrivals,
      description: t.categories.newArrivalsDesc,
      image: "https://lh3.googleusercontent.com/aida-public/AB6AXuCiV8MPijVn5arX1fqEoiEm3dkIc_F6qjRT1eCEVn0AXJnnseW2IshxRFJ4MjHtuw6MvVhikxBUEg2v7IGhbI0RiX7UtRJj4xIs2clIVH-QfY5pt_ZZR41exfsN_USh8O-96DhL78o83h1oInfwlbnNEzuWW3wst4sfUmPPhCID1yf4lpRlYKB463A7k5t8ZcmY6WZz6-SCoTf56-GLRoivqc2gpEh0L-RLezlhTyyW90xA9vmdh7FKtMTpbWHXqCqj6Kp2lJ5VtVK_",
      gridClass: "col-span-1 md:col-span-2 lg:col-span-2 h-[288px] lg:h-auto",
      path: "/men"
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

