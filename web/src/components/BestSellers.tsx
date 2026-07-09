/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { motion } from "motion/react";
import { Eye, ShieldCheck, Zap, Award } from "lucide-react";
import { Product } from "../types";
import { useProducts } from "../context/ProductContext";
import { useLanguage } from "../context/LanguageContext";
import { useTheme } from "../context/ThemeContext";

interface BestSellersProps {
  onOpenQuickView: (productId: string) => void;
}

export default function BestSellers({ onOpenQuickView }: BestSellersProps) {
  const { products: PRODUCTS } = useProducts();
  const { language, t } = useLanguage();
  const { isDark } = useTheme();

  // Map and localize products list
  const localizedProducts = PRODUCTS.map((prod) => {
    const trans = t.products[prod.id as keyof typeof t.products];
    return {
      ...prod,
      name: trans?.name || prod.name,
      description: trans?.description || prod.description,
    };
  });

  const sortAndLimit = (items: any[]) => {
    return [...items]
      .sort((a, b) => {
        if (a.status === "Low Stock" && b.status !== "Low Stock") return -1;
        if (a.status !== "Low Stock" && b.status === "Low Stock") return 1;
        return 0;
      })
      .slice(0, 3);
  };

  // Category specific filterings matching smooth scroll targets
  const menApparel = sortAndLimit(localizedProducts.filter((p) => {
    const c = p.category?.toUpperCase() || "";
    return c === "NAM" || c === "MEN";
  }));
  
  const womenApparel = sortAndLimit(localizedProducts.filter((p) => {
    const c = p.category?.toUpperCase() || "";
    return c === "NỮ" || c === "WOMEN";
  }));
  
  const liftingAccessories = sortAndLimit(localizedProducts.filter((p) => {
    const c = p.category?.toUpperCase() || "";
    return c === "PHỤ KIỆN" || c === "ACCESSORIES";
  }));

  const supplements = sortAndLimit(localizedProducts.filter((p) => {
    const c = p.category?.toUpperCase() || "";
    return c === "THỰC PHẨM CHỨC NĂNG" || c === "SUPPLEMENTS";
  }));

  const bestSellersList = sortAndLimit(localizedProducts);
  const newArrivalsList = sortAndLimit([...localizedProducts].reverse());

  const renderProductCard = (prod: any, idx: number) => (
    <motion.div
      key={prod.id}
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.5, delay: idx * 0.1 }}
      className={`group flex flex-col border transition-all duration-300 h-full ${
        isDark ? 'bg-[#0c0d0f] border-[#424656]/15 hover:border-[#0066ff]' : 'bg-white border-gray-200 hover:border-[#0066ff] shadow-sm'
      }`}
    >
      {/* Image Container with zoom */}
      <div className={`relative w-full h-80 overflow-hidden p-6 flex items-center justify-center border-b select-none ${
        isDark ? 'bg-black border-[#424656]/15' : 'bg-gray-100 border-gray-100'
      }`}>
        <img
          src={prod.image}
          alt={prod.name}
          className="max-h-full max-w-full object-contain group-hover:scale-103 transition-transform duration-500"
          loading="lazy"
        />

        {/* Localized badge overlay */}
        {prod.badge && (
          <div className="absolute top-4 left-4 bg-[#0066ff] text-white font-montserrat text-[10px] font-black tracking-widest px-3 py-1.5 uppercase rounded-none select-none">
            {prod.badge === "BEST SELLER" && language === "vi" ? "BÁN CHẠY" : prod.badge}
          </div>
        )}

        <div className={`absolute inset-0 bg-gradient-to-t ${isDark ? 'from-black/20' : 'from-black/5'} via-transparent to-transparent opacity-60 pointer-events-none`} />
      </div>

      {/* Product Details info */}
      <div className="p-6 md:p-8 flex-1 flex flex-col justify-between">
        <div className="mb-6">
          <h3 className={`font-montserrat text-base md:text-lg font-extrabold uppercase tracking-wider mb-2 group-hover:text-[#0066ff] transition-colors line-clamp-1 ${isDark ? 'text-white hover:text-[#b3c5ff]' : 'text-gray-900'}`}>
            {prod.name}
          </h3>
          <p className={`font-mono text-sm font-extrabold tracking-widest mb-3 ${isDark ? 'text-[#c2c6d8]' : 'text-gray-900'}`}>
            {prod.price}
          </p>
          <p className={`font-sans text-xs line-clamp-2 ${isDark ? 'text-zinc-400' : 'text-gray-500'}`}>
            {prod.description}
          </p>
        </div>

        <button
          onClick={() => onOpenQuickView(prod.id)}
          className={`w-full font-montserrat text-xs font-bold tracking-widest py-3.5 uppercase transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer border-2 ${
            isDark ? 'bg-transparent text-white border-white/20 hover:bg-white hover:text-black' : 'bg-transparent text-gray-900 border-gray-300 hover:bg-gray-900 hover:text-white'
          }`}
        >
          <Eye className="w-4 h-4" />
          {t.bestSellers.quickView}
        </button>
      </div>
    </motion.div>
  );

  return (
    <section className={`divide-y transition-colors ${isDark ? 'bg-black divide-[#424656]/15' : 'bg-gray-50 divide-gray-200'}`}>
      
      {/* 1. BEST SELLERS SECTION */}
      <div id="best-sellers" className="py-20 md:py-24 px-6 md:px-16 max-w-7xl mx-auto scroll-mt-20">
        <div className={`flex justify-between items-end mb-12 border-b pb-5 ${isDark ? 'border-[#424656]/20' : 'border-gray-200'}`}>
          <div>
            <h2 className={`font-montserrat text-2xl md:text-3xl font-extrabold tracking-widest uppercase mb-1 ${isDark ? 'text-white' : 'text-gray-900'}`}>
              {t.bestSellers.title}
            </h2>
            <p className="font-mono text-[10px] text-[#0066ff] tracking-widest uppercase font-bold">
              {t.bestSellers.subtitle}
            </p>
          </div>
          <a
            href="#best-sellers"
            className="text-[#0066ff] hover:text-white font-montserrat text-xs font-bold tracking-widest hover:underline uppercase transition-colors"
          >
            {t.bestSellers.viewAll}
          </a>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {bestSellersList.map((prod, idx) => renderProductCard(prod, idx))}
        </div>
      </div>

      {/* 2. MEN APP STYLE DEPT SECTION */}
      <div id="men" className="py-20 md:py-24 px-6 md:px-16 max-w-7xl mx-auto scroll-mt-20">
        <div className={`mb-12 border-b pb-5 ${isDark ? 'border-[#424656]/20' : 'border-gray-200'}`}>
          <h2 className={`font-montserrat text-2xl md:text-3xl font-extrabold tracking-widest uppercase mb-1 ${isDark ? 'text-white' : 'text-gray-900'}`}>
            {language === "vi" ? "ĐỒ TẬP NAM" : "MEN'S APPAREL"}
          </h2>
          <p className="font-mono text-[10px] text-[#0066ff] tracking-widest uppercase font-bold">
            {language === "vi" ? "Thiết kế bó cơ & phom rộng tối tân" : "EXTREME COMPRESSION & OVERSIZED DESIGN CODES"}
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {menApparel.map((prod, idx) => renderProductCard(prod, idx))}
        </div>
      </div>

      {/* 3. WOMEN APP STYLE DEPT SECTION */}
      <div id="women" className="py-20 md:py-24 px-6 md:px-16 max-w-7xl mx-auto scroll-mt-20">
        <div className={`mb-12 border-b pb-5 ${isDark ? 'border-[#424656]/20' : 'border-gray-200'}`}>
          <h2 className={`font-montserrat text-2xl md:text-3xl font-extrabold tracking-widest uppercase mb-1 ${isDark ? 'text-white' : 'text-gray-900'}`}>
            {language === "vi" ? "ĐỒ TẬP NỮ" : "WOMEN'S APPAREL"}
          </h2>
          <p className="font-mono text-[10px] text-[#0066ff] tracking-widest uppercase font-bold">
            {language === "vi" ? "Sợi co giãn thoải mái hiệu năng cao" : "ATHLETICS SYNERGY HIGH RESILIENCE SYNTHETICS"}
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {womenApparel.map((prod, idx) => renderProductCard(prod, idx))}
        </div>
      </div>

      {/* 4. ACCESSORIES DEPT SECTION */}
      <div id="accessories" className="py-20 md:py-24 px-6 md:px-16 max-w-7xl mx-auto scroll-mt-20">
        <div className={`mb-12 border-b pb-5 ${isDark ? 'border-[#424656]/20' : 'border-gray-200'}`}>
          <h2 className={`font-montserrat text-2xl md:text-3xl font-extrabold tracking-widest uppercase mb-1 ${isDark ? 'text-white' : 'text-gray-900'}`}>
            {language === "vi" ? "PHỤ KIỆN LỰC" : "LIFTING ACCESSORIES"}
          </h2>
          <p className="font-mono text-[10px] text-[#0066ff] tracking-widest uppercase font-bold">
            {language === "vi" ? "Đai đỡ thắt lưng da bò thật 10mm" : "10MM LEATHER INTRA-ABDOMINAL SPINE SUPPORT"}
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {liftingAccessories.map((prod, idx) => renderProductCard(prod, idx))}
        </div>
      </div>

      {/* 5. SUPPLEMENTS DEPT SECTION */}
      <div id="supplements" className="py-20 md:py-24 px-6 md:px-16 max-w-7xl mx-auto scroll-mt-20">
        <div className={`mb-12 border-b pb-5 ${isDark ? 'border-[#424656]/20' : 'border-gray-200'}`}>
          <h2 className={`font-montserrat text-2xl md:text-3xl font-extrabold tracking-widest uppercase mb-1 ${isDark ? 'text-white' : 'text-gray-900'}`}>
            {language === "vi" ? "THỰC PHẨM BỔ SUNG" : "SUPPLEMENTS"}
          </h2>
          <p className="font-mono text-[10px] text-[#0066ff] tracking-widest uppercase font-bold">
            {language === "vi" ? "Đỉnh cao tinh khiết tối ưu phục hồi" : "PURIFIED BIO-AVOIDANCE RECOVERY SYSTEM"}
          </p>
        </div>

        {supplements.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
            {supplements.map((prod, idx) => renderProductCard(prod, idx))}
          </div>
        ) : (
          <div className={`p-10 md:p-16 text-center border flex flex-col items-center max-w-3xl mx-auto ${
            isDark ? 'bg-[#0c0d0f] border-[#424656]/20' : 'bg-white border-gray-200 shadow-sm'
          }`}>
            <Award className="w-12 h-12 text-[#0066ff] mb-4" />
            <h3 className={`font-montserrat text-sm font-black tracking-widest uppercase mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>
              {language === "vi" ? "ĐANG THỬ NGHIỆM CHẤT LƯỢNG LÂM SÀNG" : "CLINICAL REGISTRY PENDING CALIBRATION"}
            </h3>
            <p className={`font-sans text-xs md:text-sm leading-relaxed mb-6 ${isDark ? 'text-[#c2c6d8]' : 'text-gray-500'}`}>
              {language === "vi"
                ? "Công thức protein tinh khiết và phục hồi tế bào đang được thử nghiệm khép kín để đảm bảo tiêu chuẩn cao nhất. Tư vấn trực ban AI hoặc Chuyên gia để đăng ký sớm."
                : "Our pharmaceutical-grade microfiltration and recovery compounds are undergoing regulatory lab checks. Use our AI specialist to reserve slots in preview batches."}
            </p>
            <a
              href="#advice"
              className="bg-[#0066ff] text-white hover:bg-white hover:text-black transition-all px-8 py-3.5 font-montserrat text-xs font-bold tracking-widest uppercase"
            >
              {language === "vi" ? "TƯ VẤN THIẾT BIÊN AI" : "CONSULT SYSTEM AGENT"}
            </a>
          </div>
        )}
      </div>

      {/* 6. NEW ARRIVALS DEPT SECTION */}
      <div id="new-arrivals" className="py-20 md:py-24 px-6 md:px-16 max-w-7xl mx-auto scroll-mt-20">
        <div className={`mb-12 border-b pb-5 ${isDark ? 'border-[#424656]/20' : 'border-gray-200'}`}>
          <h2 className={`font-montserrat text-2xl md:text-3xl font-extrabold tracking-widest uppercase mb-1 ${isDark ? 'text-white' : 'text-gray-900'}`}>
            {language === "vi" ? "HÀNG MỚI VÀ ĐỘC QUYỀN" : "NEW ARRIVALS"}
          </h2>
          <p className="font-mono text-[10px] text-[#0066ff] tracking-widest uppercase font-bold">
            {language === "vi" ? "Bản phát hành đặc biệt thế hệ mới" : "NEXT GENERATION CALIBRATED WEAVE BATCHES"}
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {newArrivalsList.map((prod, idx) => renderProductCard(prod, idx))}
        </div>
      </div>

    </section>
  );
}
