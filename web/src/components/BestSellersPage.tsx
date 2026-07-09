import React, { useState, useMemo } from "react";
import { SlidersHorizontal, Plus, ShoppingCart, Eye, ChevronDown, Check, Star, ShieldCheck, HelpCircle, ChevronUp } from "lucide-react";
import { Product, CartItem } from "../types";
import { useProducts } from "../context/ProductContext";
import { useLanguage } from "../context/LanguageContext";
import { useTheme } from "../context/ThemeContext";
import { motion, AnimatePresence } from "motion/react";

interface BestSellersPageProps {
  onOpenQuickView: (productId: string) => void;
  onAddToCart: (item: CartItem) => void;
  onNavigate?: (path: string) => void;
}

export default function BestSellersPage({ onOpenQuickView, onAddToCart, onNavigate }: BestSellersPageProps) {
  const { products: PRODUCTS } = useProducts();

  const { language, t } = useLanguage();
  const { isDark } = useTheme();

  // Filter & Sort States
  const [selectedCategory, setSelectedCategory] = useState<string>("ALL");
  const [sortBy, setSortBy] = useState<string>("PERFORMANCE");
  const [isSortDropdownOpen, setIsSortDropdownOpen] = useState(false);
  const [selectedSizes, setSelectedSizes] = useState<Record<string, string>>({});
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null);

  // Load specific best seller products
  const bestSellersRaw = useMemo(() => {
    return PRODUCTS.filter((p) => p.id.startsWith("best-"));
  }, [PRODUCTS]);

  // Map translations for product details
  const products = useMemo(() => {
    return bestSellersRaw.map((p) => {
      const trans = t.products[p.id as keyof typeof t.products];
      if (trans) {
        return {
          ...p,
          name: trans.name,
          description: trans.description,
          details: trans.details,
          specs: trans.specs,
        };
      }
      return p;
    });
  }, [bestSellersRaw, t, language]);

  // Combined filters and sorting logic
  const filteredAndSortedProducts = useMemo(() => {
    let result = [...products];

    // Filter by Category
    if (selectedCategory !== "ALL") {
      result = result.filter((p) => {
        const cat = p.category?.toUpperCase();
        if (selectedCategory === "APPAREL") {
          return cat === "APPAREL" || cat === "FOOTWEAR";
        }
        return cat === selectedCategory;
      });
    }

    // Sort Products
    if (sortBy === "PRICE_HIGH_LOW") {
      result.sort((a, b) => b.priceNum - a.priceNum);
    } else if (sortBy === "PRICE_LOW_HIGH") {
      result.sort((a, b) => a.priceNum - b.priceNum);
    } else {
      // PERFORMANCE SORTING: Default or custom order (Apex first, kettlebell second, trainers third, isolate fourth)
      const order = ["best-apex-tee", "best-titan-kettlebell", "best-velocity-trainers", "best-elite-isolate"];
      result.sort((a, b) => order.indexOf(a.id) - order.indexOf(b.id));
    }

    return result;
  }, [products, selectedCategory, sortBy]);

  // Handle Quick Add to configuration
  const handleQuickAdd = (product: Product, e: React.MouseEvent) => {
    e.stopPropagation();
    const isClothing = ["APPAREL", "FOOTWEAR"].includes(product.category?.toUpperCase() || "");
    const size = selectedSizes[product.id] || (isClothing ? "M" : "Standard");
    onAddToCart({
      product,
      size,
      quantity: 1,
    });
  };

  const handleSizeSelect = (productId: string, size: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedSizes((prev) => ({
      ...prev,
      [productId]: size,
    }));
  };

  const toggleFaq = (index: number) => {
    setExpandedFaq(expandedFaq === index ? null : index);
  };

  // Athlete Intelligence Customer Testimonials
  const reviews = [
    {
      name: language === "vi" ? "HLV Marcus V." : "Coach Marcus V.",
      role: language === "vi" ? "Huấn Luyện Viên Sức Mạnh Cao Cấp" : "Elite Strength Coach",
      text: language === "vi" 
        ? "Áo bó cơ Apex Pro nén cơ cực tốt và thoáng khí tuyệt vời. Vùng cơ vai và lưng được hỗ trợ hoàn hảo khi tập deadlift nặng."
        : "The Apex Pro compression tee is incredibly breathable. Stays perfectly dry and keeps my shoulder girdles stabilized during heavy deadlift sessions.",
      rating: 5,
    },
    {
      name: language === "vi" ? "TS. Sarah K." : "Dr. Sarah K.",
      role: language === "vi" ? "Chuyên Gia Cơ Sinh Học Thể Thao" : "Biomechanical Specialist",
      text: language === "vi"
        ? "Độ cân chỉnh tạ ấm Titan đạt mức hoàn hảo gần như tuyệt đối (+/- 1%). Phần đế mài phẳng vững chãi xuất sắc trên mặt sàn bê tông."
        : "Absolute precision in the Titan kettlebell weight calibration. Flat base is solid on concrete floors for high-velocity flows.",
      rating: 5,
    },
    {
      name: language === "vi" ? "Liam D." : "Liam D.",
      role: language === "vi" ? "Vận Động Viên Hybrid" : "Hybrid Athlete",
      text: language === "vi"
        ? "Giày Velocity Trainers giúp tôi bứt tốc nhanh hơn đáng kể. Đế giữa chứa bọt khí Nitơ phản hồi lực cực kỳ nhạy bén."
        : "Velocity Trainers cut seconds off my shuttle runs. Rebound force from the nitrogen-infused foam is highly noticeable under high load.",
      rating: 5,
    }
  ];

  // Intel / FAQs Accordions
  const faqs = [
    {
      q: language === "vi" ? "Tại sao những sản phẩm này liên tục cháy hàng?" : "Why are these items always sold out?",
      a: language === "vi"
        ? "Chúng tôi sản xuất theo từng lô hàng kỹ thuật giới hạn để đảm bảo đáp ứng các tiêu chuẩn khắt khe về sợi dệt hàng không và dung sai kim loại chuẩn xác. Hãy đăng ký email để nhận thông báo sớm nhất."
        : "We manufacture in limited tactical batches to ensure aerospace-grade textiles and metal tolerances are met. Sign up for notifications to catch drops.",
    },
    {
      q: language === "vi" ? "Henry Fit có chương trình tài trợ vận động viên không?" : "Do you offer athlete sponsorships?",
      a: language === "vi"
        ? "Có, chúng tôi đánh giá các vận động viên cử tạ chuyên nghiệp và huấn luyện viên hybrid hai lần mỗi năm. Hãy gửi nhật ký tập luyện và các chỉ số thể chất của bạn cho phòng Lab nghiên cứu của chúng tôi."
        : "Yes, we evaluate competitive lifters and hybrid trainers twice annually. Submit your training journals and telemetry to the registry.",
    },
    {
      q: language === "vi" ? "Chính sách bảo hành đối với các sản phẩm tạ cứng là gì?" : "What is the warranty on hard goods?",
      a: language === "vi"
        ? "Tạ ấm Titan và các thiết bị phần cứng bằng thép đúc nguyên khối được bảo hành trọn đời đối với các lỗi nứt vỡ kết cấu do luyện tập. Trang phục được bảo hành 12 tháng dưới tần suất sử dụng cường độ cao."
        : "Titan kettlebells and steel hardware are covered by a lifetime indestructible structural warranty. Apparel is covered for 12 months under active use.",
    }
  ];

  return (
    <div className={`min-h-screen transition-colors ${isDark ? 'bg-black text-white' : 'bg-gray-50 text-gray-900'}`}>
      
      {/* 1. HERO HEADER SECTION */}
      <div className="relative h-[450px] md:h-[550px] flex items-center justify-center overflow-hidden border-b border-[#424656]/20">
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1517838277536-f5f99be501cd?q=80&w=1600&auto=format&fit=crop"
            alt="Best Sellers Hero Background"
            className="w-full h-full object-cover object-center opacity-40 scale-105 filter grayscale contrast-125 hover:scale-100 transition-transform duration-10000"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/45 to-transparent" />
        </div>

        <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
          <motion.p
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="font-mono text-xs tracking-[0.4em] text-[#0066ff] uppercase font-bold mb-3"
          >
            {language === "vi" ? "SẢN PHẨM ƯU TÚ" : "ATHLETE FAVORITES"}
          </motion.p>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1 }}
            className={`font-anton text-5xl sm:text-7xl md:text-8xl tracking-tight uppercase leading-none mb-6 ${isDark ? 'text-white' : 'text-gray-50'}`}
          >
            {language === "vi" ? "BEST SELLERS" : "BEST SELLERS"}
          </motion.h1>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.3 }}
            className="w-16 h-1 bg-[#0066ff] mx-auto mb-6"
          />
        </div>
      </div>

      {/* 2. FILTER & SORT NAVIGATION CONTROLS */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12 py-12">
        <div className={`flex flex-col md:flex-row gap-6 justify-between items-start md:items-center border-b pb-8 mb-12 ${isDark ? 'border-white/10' : 'border-gray-200'}`}>
          
          {/* Left: Filter categories */}
          <div className="flex flex-wrap gap-2 sm:gap-3">
            {[
              { label: language === "vi" ? "TẤT CẢ THIẾT BỊ" : "ALL GEAR", value: "ALL" },
              { label: language === "vi" ? "TRANG PHỤC" : "APPAREL", value: "APPAREL" },
              { label: language === "vi" ? "PHẦN CỨNG LỰC" : "EQUIPMENT", value: "EQUIPMENT" },
              { label: language === "vi" ? "DINH DƯỠNG" : "NUTRITION", value: "NUTRITION" },
            ].map((cat) => {
              const isActive = selectedCategory === cat.value;
              return (
                <button
                  key={cat.value}
                  onClick={() => setSelectedCategory(cat.value)}
                  className={`px-5 py-2.5 font-mono text-[10px] tracking-widest uppercase transition-all duration-300 border rounded-none ${
                    isDark
                      ? (isActive ? "bg-white text-black border-white font-bold" : "bg-transparent text-white/60 border-white/15 hover:text-white hover:border-white/40")
                      : (isActive ? "bg-gray-900 text-white border-gray-900 font-bold" : "bg-transparent text-gray-500 border-gray-300 hover:text-gray-900 hover:border-gray-500")
                  }`}
                >
                  {cat.label}
                </button>
              );
            })}
          </div>

          {/* Right: Sort and control */}
          <div className="flex items-center gap-3 w-full md:w-auto justify-between sm:justify-end">
            <div className="relative">
              <button
                onClick={() => setIsSortDropdownOpen(!isSortDropdownOpen)}
                className={`flex items-center gap-3 border px-5 py-2.5 font-mono text-[10px] tracking-widest uppercase rounded-none transition-colors ${
                  isDark ? 'bg-black border-white/15 hover:border-white/40 text-white' : 'bg-white border-gray-300 hover:border-gray-500 text-gray-900'
                }`}
              >
                <span>
                  {language === "vi" ? "SẮP XẾP: " : "SORT BY: "}
                  {sortBy === "PERFORMANCE" && (language === "vi" ? "HIỆU NĂNG" : "PERFORMANCE")}
                  {sortBy === "PRICE_HIGH_LOW" && (language === "vi" ? "GIÁ: CAO XUỐNG THẤP" : "PRICE: HIGH TO LOW")}
                  {sortBy === "PRICE_LOW_HIGH" && (language === "vi" ? "GIÁ: THẤP LÊN CAO" : "PRICE: LOW TO HIGH")}
                </span>
                <ChevronDown size={14} className={`transition-transform duration-300 ${isSortDropdownOpen ? "rotate-180" : ""}`} />
              </button>

              <AnimatePresence>
                {isSortDropdownOpen && (
                  <>
                    <div className="fixed inset-0 z-10" onClick={() => setIsSortDropdownOpen(false)} />
                      <motion.div
                        initial={{ opacity: 0, y: 5 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 5 }}
                        className={`absolute right-0 mt-1.5 w-64 border shadow-2xl z-20 font-mono text-[10px] tracking-widest uppercase rounded-none ${
                          isDark ? 'bg-[#121414] border-white/20' : 'bg-white border-gray-200'
                        }`}
                      >
                      {[
                        { label: language === "vi" ? "HIỆU NĂNG" : "PERFORMANCE", value: "PERFORMANCE" },
                        { label: language === "vi" ? "GIÁ: CAO XUỐNG THẤP" : "PRICE: HIGH TO LOW", value: "PRICE_HIGH_LOW" },
                        { label: language === "vi" ? "GIÁ: THẤP LÊN CAO" : "PRICE: LOW TO HIGH", value: "PRICE_LOW_HIGH" },
                      ].map((item) => <button
                            key={item.value}
                            onClick={() => {
                              setSortBy(item.value);
                              setIsSortDropdownOpen(false);
                            }}
                            className={`w-full text-left px-5 py-3 transition-colors flex items-center justify-between rounded-none ${
                              isDark
                                ? (sortBy === item.value ? "text-[#0066ff] font-bold hover:bg-[#0066ff]/10 hover:text-white" : "text-white/70 hover:bg-[#0066ff]/10 hover:text-white")
                                : (sortBy === item.value ? "text-[#0066ff] font-bold bg-gray-50" : "text-gray-600 hover:bg-gray-50 hover:text-gray-900")
                            }`}
                          >
                            <span>{item.label}</span>
                          {sortBy === item.value && <Check size={12} />}
                        </button>
                      )}
                    </motion.div>
                  </>
                )}
              </AnimatePresence>
            </div>

            <button
              onClick={() => setSelectedCategory("ALL")}
              className={`p-2.5 border transition-colors rounded-none ${
                isDark ? 'border-white/15 text-white/60 hover:text-white hover:border-white/40 bg-black' : 'border-gray-300 text-gray-500 hover:text-gray-900 hover:border-gray-500 bg-white'
              }`}
              title={language === "vi" ? "Mặc định bộ lọc" : "Reset Filters"}
            >
              <SlidersHorizontal size={14} />
            </button>
          </div>

        </div>

        {/* 3. CORE PRODUCT GRID */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 items-stretch mb-24">
          <AnimatePresence mode="popLayout">
            {filteredAndSortedProducts.map((product, index) => {
              const isClothing = ["APPAREL", "FOOTWEAR"].includes(product.category?.toUpperCase() || "");
              const currentSize = selectedSizes[product.id] || (product.category === "FOOTWEAR" ? "9.5" : "M");
              const hasBadge = !!product.badge;
              
              return (
                <motion.div
                  key={product.id}
                  layout
                  initial={{ opacity: 0, scale: 0.97 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.97 }}
                  transition={{ duration: 0.4, delay: index * 0.05 }}
                  className={`group relative border overflow-hidden flex flex-col justify-between h-[520px] shadow-none hover:border-[#0066ff] transition-all duration-300 rounded-none ${
                    isDark ? 'bg-[#0c0d0f] border-white/10' : 'bg-white border-gray-200'
                  }`}
                >
                  {/* Image wrapper with high tech zoom */}
                  <div className={`relative w-full h-64 overflow-hidden p-6 flex items-center justify-center border-b select-none ${isDark ? 'bg-black border-white/10' : 'bg-gray-100 border-gray-100'}`}>
                    <img
                      src={product.image}
                      alt={product.name}
                      className="max-h-full max-w-full object-contain group-hover:scale-105 transition-transform duration-500 opacity-80 group-hover:opacity-100"
                      loading="lazy"
                    />

                    {/* Top overlay badge matching mockup */}
                    <div className="absolute top-4 left-4 flex flex-col gap-2">
                      {hasBadge && (
                        <span className={`font-mono font-black text-[9px] tracking-widest px-3 py-1.5 uppercase rounded-none select-none ${
                          product.badge === "LOW STOCK" 
                            ? "bg-red-600 text-white" 
                            : "bg-[#0066ff] text-white"
                        }`}>
                          {product.badge === "BEST SELLER" && language === "vi" 
                            ? "#1 ĐÁNH GIÁ" 
                            : product.badge}
                        </span>
                      )}
                    </div>

                    <button
                      onClick={() => onOpenQuickView(product.id)}
                      className="absolute top-4 right-4 p-2.5 bg-black/80 hover:bg-[#0066ff] text-white backdrop-blur-md transition-all opacity-0 group-hover:opacity-100 transform translate-y-1 group-hover:translate-y-0 rounded-none cursor-pointer"
                    >
                      <Eye size={12} />
                    </button>
                  </div>

                  {/* Product details */}
                  <div className={`p-6 flex-1 flex flex-col justify-between ${isDark ? 'text-white' : 'text-gray-900'}`}>
                    <div>
                      <span className="font-mono text-[9px] text-[#0066ff] tracking-widest uppercase font-bold mb-1 block">
                        {product.category}
                      </span>
                      <h3 className={`font-montserrat text-sm md:text-base font-extrabold uppercase tracking-wider mb-2 group-hover:text-[#0066ff] transition-colors line-clamp-1 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                        {product.name}
                      </h3>
                      <p className={`font-mono text-sm font-extrabold tracking-widest mb-3 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                        {product.price}
                      </p>
                      <p className={`font-sans text-xs line-clamp-3 leading-relaxed mb-4 ${isDark ? 'text-zinc-400' : 'text-gray-500'}`}>
                        {product.description}
                      </p>

                      {/* Size selecting interface */}
                      {isClothing && (
                        <div className="flex gap-1.5 mb-4 items-center">
                          <span className={`font-mono text-[8px] tracking-widest uppercase mr-1 ${isDark ? 'text-white/45' : 'text-gray-400'}`}>
                            SIZE:
                          </span>
                          {(product.category === "FOOTWEAR" 
                            ? ["8", "9", "10", "11"] 
                            : ["S", "M", "L", "XL"]
                          ).map((s) => (
                            <button
                              key={s}
                              onClick={(e) => handleSizeSelect(product.id, s, e)}
                              className={`w-5 h-5 font-mono text-[8px] font-bold border transition-colors flex items-center justify-center rounded-none ${
                                isDark
                                  ? (currentSize === s ? "bg-white text-black border-white" : "bg-transparent text-white/60 border-white/10 hover:border-white/40")
                                  : (currentSize === s ? "bg-gray-900 text-white border-gray-900" : "bg-transparent text-gray-500 border-gray-300 hover:border-gray-500")
                              }`}
                            >
                              {s}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>

                    <button
                      onClick={(e) => handleQuickAdd(product, e)}
                      className="w-full bg-[#0066ff] text-white hover:bg-white hover:text-black font-montserrat text-[10px] font-black tracking-widest py-3.5 uppercase transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer rounded-none border border-transparent"
                    >
                      <ShoppingCart className="w-3.5 h-3.5" />
                      {language === "vi" ? "THÊM VÀO KHO ĐỒ" : "ADD TO ARSENAL"}
                    </button>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>

        {filteredAndSortedProducts.length === 0 && (
          <div className={`text-center py-20 border border-dashed mb-24 ${isDark ? 'border-white/10' : 'border-gray-300 bg-gray-50'}`}>
            <p className={`font-mono text-xs tracking-widest uppercase mb-2 ${isDark ? 'text-zinc-500' : 'text-gray-400'}`}>
              {language === "vi" ? "KHÔNG CÓ THIẾT BỊ NÀO KHỚP BỘ LỌC" : "NO GEAR FOUND"}
            </p>
            <p className={`font-sans text-xs ${isDark ? 'text-zinc-600' : 'text-gray-500'}`}>
              {language === "vi" ? "Vui lòng chọn bộ lọc khác" : "Please adjust category or sorting filters"}
            </p>
          </div>
        )}

      </div>

      {/* 4. SPLIT BANNER: UNCOMPROMISING PERFORMANCE */}
      <section className={`border-t border-b grid grid-cols-1 md:grid-cols-2 min-h-[400px] ${isDark ? 'bg-black border-white/10' : 'bg-white border-gray-200'}`}>
        
        {/* Left Side: Dark graphic background */}
        <div className={`relative overflow-hidden flex items-center justify-center h-[280px] md:h-auto border-b md:border-b-0 md:border-r ${isDark ? 'border-white/10' : 'border-gray-200'}`}>
          <img
            src="https://images.unsplash.com/photo-1541534741688-6078c6bfb5c5?q=80&w=1200&auto=format&fit=crop"
            alt="Running athlete under heavy training load"
            className="absolute inset-0 w-full h-full object-cover opacity-50 filter grayscale contrast-125"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black via-black/40 to-transparent" />
          
          <div className="relative z-10 text-center md:text-left px-8 md:px-16 w-full">
            <span className="font-mono text-xs tracking-[0.4em] text-[#0066ff] font-bold block mb-2">
              HENRY FIT LABS
            </span>
            <div className="w-12 h-1 bg-[#0066ff] hidden md:block" />
          </div>
        </div>

        {/* Right Side: Bold text presentation block */}
        <div className={`p-8 sm:p-16 flex flex-col justify-center ${isDark ? 'bg-[#0b0c0e] text-white' : 'bg-gray-50 text-gray-900'}`}>
          <h2 className="font-anton text-3xl sm:text-4xl lg:text-5xl tracking-wider uppercase mb-6 leading-tight">
            {language === "vi" ? "HIỆU NĂNG KHÔNG THỎA HIỆP." : "UNCOMPROMISING PERFORMANCE."}
          </h2>
          <p className={`font-sans text-sm leading-relaxed max-w-lg mb-8 ${isDark ? 'text-zinc-400' : 'text-gray-600'}`}>
            {language === "vi"
              ? "Các dòng sản phẩm bán chạy nhất của chúng tôi không chỉ dừng lại ở sự ưa chuộng; chúng được thử nghiệm và đo đạc trực tiếp trong các môi trường tập luyện khắc nghiệt nhất để vượt qua kỳ vọng của những vận động viên khó tính."
              : "Our best sellers aren't just popular; they are tested in high-stakes training environments to exceed athletic expectations."}
          </p>

          <div>
            <button
              onClick={() => onNavigate?.("/supplements")}
              className="px-10 py-4 bg-[#0066ff] hover:bg-[#0055d4] text-white font-mono text-[10px] tracking-[0.2em] font-black uppercase transition-all shadow-none rounded-none"
            >
              {language === "vi" ? "MUA BỘ SƯU TẬP" : "SHOP THE COLLECTION"}
            </button>
          </div>
        </div>

      </section>

      {/* 5. ATHLETE INTELLIGENCE: REVIEWS SECTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12 py-24">
        <div className="text-center mb-16">
          <span className="font-mono text-[10px] text-[#0066ff] tracking-[0.3em] uppercase font-bold block mb-2">
            {language === "vi" ? "Ý KIẾN CHUYÊN GIA" : "ATHLETE INTELLIGENCE"}
          </span>
          <h2 className={`font-anton text-3xl sm:text-5xl tracking-wider uppercase mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>
            {language === "vi" ? "ĐƯỢC KIỂM CHỨNG TRÊN SÂN ĐẤU" : "TRUSTED BY THE ELITE"}
          </h2>
          <div className="w-12 h-1 bg-[#0066ff] mx-auto" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {reviews.map((rev, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
              className={`border p-8 flex flex-col justify-between h-full rounded-none ${
                isDark ? 'bg-[#0b0c0e] border-white/10' : 'bg-white border-gray-200'
              }`}
            >
              <div>
                <div className="flex gap-1 mb-6 text-[#0066ff]">
                  {[...Array(rev.rating)].map((_, i) => (
                    <Star key={i} size={14} className="fill-current" />
                  ))}
                </div>
                <p className={`font-sans text-xs sm:text-sm italic leading-relaxed mb-8 ${isDark ? 'text-zinc-300' : 'text-gray-600'}`}>
                  "{rev.text}"
                </p>
              </div>

              <div className={`border-t pt-5 mt-auto ${isDark ? 'border-white/10' : 'border-gray-100'}`}>
                <p className={`font-montserrat text-xs font-black tracking-widest uppercase mb-1 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                  {rev.name}
                </p>
                <p className="font-mono text-[9px] text-[#0066ff] tracking-wider uppercase font-bold">
                  {rev.role}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* 6. FAQ ACCORDION SECTION */}
      <section className={`border-t py-24 ${isDark ? 'bg-[#070809] border-white/10' : 'bg-gray-100 border-gray-200'}`}>
        <div className="max-w-4xl mx-auto px-6">
          <div className="text-center mb-16">
            <span className="font-mono text-[10px] text-[#0066ff] tracking-[0.3em] uppercase font-bold block mb-2">
              INTEL / FAQ
            </span>
            <h2 className={`font-anton text-2xl sm:text-4xl tracking-wider uppercase mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>
              {language === "vi" ? "CÂU HỎI KỸ THUẬT" : "FREQUENTLY ASKED QUESTIONS"}
            </h2>
            <div className="w-12 h-1 bg-[#0066ff] mx-auto" />
          </div>

          <div className="space-y-4">
            {faqs.map((faq, index) => {
              const isOpen = expandedFaq === index;
              return (
                <div
                  key={index}
                  className={`border overflow-hidden transition-all duration-300 rounded-none ${
                    isDark ? 'bg-black border-white/10' : 'bg-white border-gray-200'
                  }`}
                >
                  <button
                    onClick={() => toggleFaq(index)}
                    className={`w-full flex justify-between items-center p-6 text-left transition-colors focus:outline-none rounded-none ${
                      isDark ? 'hover:bg-white/5' : 'hover:bg-gray-50'
                    }`}
                  >
                    <span className={`font-montserrat text-xs sm:text-sm font-black tracking-widest uppercase flex items-center gap-3 pr-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                      <HelpCircle size={14} className="text-[#0066ff] flex-shrink-0" />
                      {faq.q}
                    </span>
                    {isOpen ? (
                      <ChevronUp size={14} className="text-[#0066ff] flex-shrink-0" />
                    ) : (
                      <ChevronDown size={14} className="text-zinc-500 flex-shrink-0" />
                    )}
                  </button>

                  <AnimatePresence initial={false}>
                    {isOpen && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3 }}
                      >
                        <div className={`p-6 pt-0 border-t font-sans text-xs sm:text-sm leading-relaxed ${
                          isDark ? 'border-white/5 text-zinc-400' : 'border-gray-100 text-gray-600'
                        }`}>
                          {faq.a}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>
        </div>
      </section>

    </div>
  );
}
