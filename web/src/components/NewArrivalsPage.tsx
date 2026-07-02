import React, { useState, useMemo } from "react";
import { SlidersHorizontal, Plus, ShoppingCart, Zap, Eye, ChevronDown, Check, X } from "lucide-react";
import { Product, CartItem } from "../types";
import { useProducts } from "../context/ProductContext";
import { useLanguage } from "../context/LanguageContext";
import { motion, AnimatePresence } from "motion/react";

interface NewArrivalsPageProps {
  onOpenQuickView: (productId: string) => void;
  onAddToCart: (item: CartItem) => void;
}

export default function NewArrivalsPage({ onOpenQuickView, onAddToCart }: NewArrivalsPageProps) {
  const { products: PRODUCTS } = useProducts();

  const { language, t } = useLanguage();

  // Filter & Sort States
  const [selectedCategory, setSelectedCategory] = useState<string>("ALL");
  const [sortBy, setSortBy] = useState<string>("NEWEST");
  const [isSortDropdownOpen, setIsSortDropdownOpen] = useState(false);

  // Load More States
  const [hasLoadedMore, setHasLoadedMore] = useState(false);
  const [isLoadingMore, setIsLoadingMore] = useState(false);

  // Technical Specs Modal State
  const [isSpecsModalOpen, setIsSpecsModalOpen] = useState(false);

  // Selected Size for Quick Adding
  const [selectedSizes, setSelectedSizes] = useState<Record<string, string>>({});

  // Get primary 5 new products
  const newProductsRaw = useMemo(() => {
    return PRODUCTS.filter((p) => p.id.startsWith("new-"));
  }, [PRODUCTS]);

  // Map translations for product dynamic info
  const newProducts = useMemo(() => {
    return newProductsRaw.map((p) => {
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
  }, [newProductsRaw, t]);

  // Additional products to show on "Load More"
  const additionalProducts = useMemo(() => {
    const ids = ["women-velocity-bra", "men-apex-shorts", "acc-heavy-wrist-wraps"];
    return PRODUCTS.filter((p) => ids.includes(p.id)).map((p) => {
      const trans = t.products[p.id as keyof typeof t.products];
      if (trans) {
        return {
          ...p,
          name: trans.name,
          description: trans.description,
          details: trans.details,
          specs: trans.specs,
          badge: "POPULAR RELEASE"
        };
      }
      return { ...p, badge: "POPULAR RELEASE" };
    });
  }, [t]);

  // Combined active products depending on load more
  const allAvailableProducts = useMemo(() => {
    if (hasLoadedMore) {
      return [...newProducts, ...additionalProducts];
    }
    return newProducts;
  }, [newProducts, additionalProducts, hasLoadedMore]);

  // Filter & Sort Calculations
  const filteredAndSortedProducts = useMemo(() => {
    let result = [...allAvailableProducts];

    // Filter by Category
    if (selectedCategory !== "ALL") {
      result = result.filter(
        (p) => p.category?.toUpperCase() === selectedCategory.toUpperCase()
      );
    }

    // Sort Products
    if (sortBy === "PRICE_HIGH_LOW") {
      result.sort((a, b) => b.priceNum - a.priceNum);
    } else if (sortBy === "PRICE_LOW_HIGH") {
      result.sort((a, b) => a.priceNum - b.priceNum);
    }
    // "NEWEST" retains natural layout index

    return result;
  }, [allAvailableProducts, selectedCategory, sortBy]);

  // Quick Add Item
  const handleQuickAdd = (product: Product, e: React.MouseEvent) => {
    e.stopPropagation();
    const size = selectedSizes[product.id] || "M";
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

  // Handle Load More
  const handleLoadMore = () => {
    if (hasLoadedMore) return;
    setIsLoadingMore(true);
    setTimeout(() => {
      setIsLoadingMore(false);
      setHasLoadedMore(true);
    }, 1000);
  };

  // Check if standard asymmetric grid layout can be shown
  // We show it only if selectedCategory is "ALL" and sortBy is "NEWEST" and not loaded more yet
  const showAsymmetricLayout = selectedCategory === "ALL" && sortBy === "NEWEST" && !hasLoadedMore;

  // Individual products for the asymmetric grid
  const aeroKnit = useMemo(() => newProducts.find((p) => p.id === "new-aero-knit-tee"), [newProducts]);
  const velocity = useMemo(() => newProducts.find((p) => p.id === "new-velocity-pro-x"), [newProducts]);
  const hydration = useMemo(() => newProducts.find((p) => p.id === "new-hydration-vessel"), [newProducts]);
  const eliteWraps = useMemo(() => newProducts.find((p) => p.id === "new-elite-wraps"), [newProducts]);
  const tacticalPack = useMemo(() => newProducts.find((p) => p.id === "new-tactical-pack"), [newProducts]);

  return (
    <div className="bg-black text-white min-h-screen">
      {/* Header / Hero Section */}
      <div className="relative h-[450px] md:h-[550px] flex items-center justify-center overflow-hidden border-b border-[#424656]/20">
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1541534741688-6078c6bfb5c5?q=80&w=1600&auto=format&fit=crop"
            alt="New Arrivals Hero Background"
            className="w-full h-full object-cover object-center opacity-40 scale-105 filter grayscale contrast-125 hover:scale-100 transition-transform duration-10000"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />
        </div>

        <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
          <motion.p
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="font-mono text-xs tracking-[0.4em] text-[#0066ff] uppercase font-bold mb-3"
          >
            {language === "vi" ? "SẢN PHẨM MỚI" : "NEW ARRIVALS"}
          </motion.p>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1 }}
            className="font-anton text-4xl sm:text-6xl md:text-7xl tracking-tight uppercase leading-none mb-6 text-white"
          >
            {language === "vi" ? "THIẾT BỊ HIỆU NĂNG THẾ HỆ MỚI" : "THE LATEST IN PERFORMANCE"}
          </motion.h1>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.3 }}
            className="w-16 h-1 bg-[#0066ff] mx-auto mb-6"
          />
        </div>
      </div>

      {/* Main Content Area */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12 py-12">
        
        {/* Filter and Sort Sub-Navbar Controls */}
        <div className="flex flex-col md:flex-row gap-6 justify-between items-start md:items-center border-b border-white/10 pb-8 mb-12">
          
          {/* Left: Category Filters */}
          <div className="flex flex-wrap gap-2 sm:gap-3">
            {[
              { label: language === "vi" ? "TẤT CẢ" : "ALL GEAR", value: "ALL" },
              { label: language === "vi" ? "TRANG PHỤC" : "APPAREL", value: "APPAREL" },
              { label: language === "vi" ? "GIÀY DÉP" : "FOOTWEAR", value: "FOOTWEAR" },
              { label: language === "vi" ? "PHỤ KIỆN" : "EQUIPMENT", value: "EQUIPMENT" },
            ].map((cat) => {
              const isActive = selectedCategory === cat.value;
              return (
                <button
                  key={cat.value}
                  onClick={() => setSelectedCategory(cat.value)}
                  className={`px-5 py-2.5 font-mono text-[10px] tracking-widest uppercase transition-all duration-300 border ${
                    isActive
                      ? "bg-white text-black border-white font-bold"
                      : "bg-transparent text-white/60 border-white/15 hover:text-white hover:border-white/40"
                  }`}
                >
                  {cat.label}
                </button>
              );
            })}
          </div>

          {/* Right: Sort and Custom Config Panel */}
          <div className="flex items-center gap-3 w-full md:w-auto justify-between sm:justify-end">
            <div className="relative">
              <button
                onClick={() => setIsSortDropdownOpen(!isSortDropdownOpen)}
                className="flex items-center gap-3 bg-black border border-white/15 hover:border-white/40 px-5 py-2.5 text-white font-mono text-[10px] tracking-widest uppercase"
              >
                <span>
                  {language === "vi" ? "SẮP XẾP: " : "SORT BY: "}
                  {sortBy === "NEWEST" && (language === "vi" ? "MỚI NHẤT" : "NEWEST")}
                  {sortBy === "PRICE_HIGH_LOW" && (language === "vi" ? "GIÁ: CAO XUỐNG THẤP" : "PRICE: HIGH TO LOW")}
                  {sortBy === "PRICE_LOW_HIGH" && (language === "vi" ? "GIÁ: THẤP LÊN CAO" : "PRICE: LOW TO HIGH")}
                </span>
                <ChevronDown size={14} className={`transition-transform duration-300 ${isSortDropdownOpen ? "rotate-180" : ""}`} />
              </button>

              <AnimatePresence>
                {isSortDropdownOpen && (
                  <>
                    {/* Backdrop to close */}
                    <div className="fixed inset-0 z-10" onClick={() => setIsSortDropdownOpen(false)} />
                    
                    <motion.div
                      initial={{ opacity: 0, y: 5 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 5 }}
                      className="absolute right-0 mt-1.5 w-60 bg-[#121414] border border-white/20 shadow-2xl z-20 font-mono text-[10px] tracking-widest uppercase"
                    >
                      {[
                        { label: language === "vi" ? "MỚI NHẤT" : "NEWEST", value: "NEWEST" },
                        { label: language === "vi" ? "GIÁ: CAO XUỐNG THẤP" : "PRICE: HIGH TO LOW", value: "PRICE_HIGH_LOW" },
                        { label: language === "vi" ? "GIÁ: THẤP LÊN CAO" : "PRICE: LOW TO HIGH", value: "PRICE_LOW_HIGH" },
                      ].map((item) => (
                        <button
                          key={item.value}
                          onClick={() => {
                            setSortBy(item.value);
                            setIsSortDropdownOpen(false);
                          }}
                          className={`w-full text-left px-5 py-3 hover:bg-[#0066ff]/10 hover:text-white transition-colors flex items-center justify-between ${
                            sortBy === item.value ? "text-[#0066ff] font-bold" : "text-white/70"
                          }`}
                        >
                          <span>{item.label}</span>
                          {sortBy === item.value && <Check size={12} />}
                        </button>
                      ))}
                    </motion.div>
                  </>
                )}
              </AnimatePresence>
            </div>

            <button
              onClick={() => setSelectedCategory("ALL")}
              className="p-2.5 border border-white/15 text-white/60 hover:text-white hover:border-white/40 bg-black transition-colors"
              title={language === "vi" ? "Đặt lại bộ lọc" : "Reset Filters"}
            >
              <SlidersHorizontal size={14} />
            </button>
          </div>

        </div>

        {/* Dynamic Products Shelf Display */}
        {showAsymmetricLayout ? (
          /* Premium Asymmetric Bento Grid matching user's design EXACTLY */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-8 items-stretch mb-16">
            
            {/* Column 1: Huge Aero-Knit Compression Tee */}
            {aeroKnit && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className="group relative bg-[#0d0e10] border border-white/10 overflow-hidden flex flex-col justify-between h-[650px] md:h-auto min-h-[600px] lg:col-span-1"
              >
                {/* Image Background */}
                <div className="absolute inset-0 z-0 overflow-hidden">
                  <img
                    src={aeroKnit.image}
                    alt={aeroKnit.name}
                    className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700 opacity-60 group-hover:opacity-80 filter contrast-[1.1]"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-transparent" />
                </div>

                {/* Top Badge Overlay */}
                <div className="relative z-10 p-6 flex justify-between items-start">
                  <span className="bg-[#b3c5ff] text-black font-mono font-black text-[9px] tracking-widest px-3 py-1.5 uppercase shadow-md">
                    {language === "vi" ? "MỚI RA MẮT" : "JUST DROPPED"}
                  </span>
                  
                  {/* Quick View Button */}
                  <button
                    onClick={() => onOpenQuickView(aeroKnit.id)}
                    className="p-2.5 bg-black/75 hover:bg-[#0066ff] text-white/80 hover:text-white backdrop-blur-md rounded-full transition-all opacity-0 group-hover:opacity-100 transform translate-y-2 group-hover:translate-y-0"
                  >
                    <Eye size={14} />
                  </button>
                </div>

                {/* Bottom Details Overlay */}
                <div className="relative z-10 p-8 pt-24 bg-gradient-to-t from-black via-black/80 to-transparent">
                  <p className="font-mono text-[9px] text-[#0066ff] tracking-widest uppercase mb-1">{aeroKnit.category}</p>
                  <h3 className="font-anton text-2xl sm:text-3xl tracking-wide uppercase text-white group-hover:text-[#0066ff] transition-colors mb-2">
                    {aeroKnit.name}
                  </h3>
                  <p className="font-montserrat text-xs text-white/70 max-w-sm mb-6 leading-relaxed">
                    {aeroKnit.description}
                  </p>

                  <div className="flex items-center justify-between border-t border-white/10 pt-5">
                    <div>
                      <span className="font-mono text-lg font-bold text-white tracking-wider">{aeroKnit.price}</span>
                    </div>

                    <button
                      onClick={(e) => handleQuickAdd(aeroKnit, e)}
                      className="bg-white hover:bg-[#0066ff] hover:text-white text-black p-3 rounded-none flex items-center justify-center transition-all shadow-lg cursor-pointer"
                    >
                      <Plus size={16} />
                    </button>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Column 2: Velocity Pro X (Top) & Elite Wraps (Bottom) */}
            <div className="flex flex-col gap-8 justify-between">
              
              {/* Velocity Pro X */}
              {velocity && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: 0.1 }}
                  className="group relative bg-[#0d0e10] border border-white/10 overflow-hidden flex flex-col justify-between h-[286px] sm:h-[310px]"
                >
                  {/* Image Background */}
                  <div className="absolute inset-0 z-0 overflow-hidden">
                    <img
                      src={velocity.image}
                      alt={velocity.name}
                      className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700 opacity-60 group-hover:opacity-80 filter contrast-[1.1]"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent" />
                  </div>

                  {/* Badge */}
                  <div className="relative z-10 p-5 flex justify-between items-start">
                    <span className="bg-[#b3c5ff] text-black font-mono font-black text-[8px] tracking-widest px-2.5 py-1 uppercase">
                      {language === "vi" ? "MỚI RA MẮT" : "JUST DROPPED"}
                    </span>
                    <button
                      onClick={() => onOpenQuickView(velocity.id)}
                      className="p-2 bg-black/75 hover:bg-[#0066ff] text-white/80 hover:text-white backdrop-blur-md rounded-full transition-all opacity-0 group-hover:opacity-100"
                    >
                      <Eye size={12} />
                    </button>
                  </div>

                  {/* Bottom details */}
                  <div className="relative z-10 p-6 pt-12 bg-gradient-to-t from-black via-black/80 to-transparent">
                    <p className="font-mono text-[8px] text-[#0066ff] tracking-widest uppercase mb-0.5">{velocity.category}</p>
                    <h3 className="font-anton text-lg tracking-wide uppercase text-white group-hover:text-[#0066ff] transition-colors mb-1">
                      {velocity.name}
                    </h3>
                    <div className="flex items-center justify-between mt-3">
                      <span className="font-mono text-sm font-bold text-white tracking-wider">{velocity.price}</span>
                      <button
                        onClick={(e) => handleQuickAdd(velocity, e)}
                        className="bg-white hover:bg-[#0066ff] hover:text-white text-black p-2 flex items-center justify-center transition-all cursor-pointer"
                      >
                        <Plus size={14} />
                      </button>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Elite Wraps */}
              {eliteWraps && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: 0.2 }}
                  className="group relative bg-[#0d0e10] border border-white/10 overflow-hidden flex flex-col justify-between h-[286px] sm:h-[310px]"
                >
                  {/* Image Background */}
                  <div className="absolute inset-0 z-0 overflow-hidden">
                    <img
                      src={eliteWraps.image}
                      alt={eliteWraps.name}
                      className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700 opacity-60 group-hover:opacity-80 filter contrast-[1.1]"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent" />
                  </div>

                  {/* Badge (None or normal) */}
                  <div className="relative z-10 p-5 flex justify-end">
                    <button
                      onClick={() => onOpenQuickView(eliteWraps.id)}
                      className="p-2 bg-black/75 hover:bg-[#0066ff] text-white/80 hover:text-white backdrop-blur-md rounded-full transition-all opacity-0 group-hover:opacity-100"
                    >
                      <Eye size={12} />
                    </button>
                  </div>

                  {/* Bottom details */}
                  <div className="relative z-10 p-6 pt-12 bg-gradient-to-t from-black via-black/80 to-transparent">
                    <p className="font-mono text-[8px] text-[#0066ff] tracking-widest uppercase mb-0.5">{eliteWraps.category}</p>
                    <h3 className="font-anton text-lg tracking-wide uppercase text-white group-hover:text-[#0066ff] transition-colors mb-1">
                      {eliteWraps.name}
                    </h3>
                    <div className="flex items-center justify-between mt-3">
                      <span className="font-mono text-sm font-bold text-white tracking-wider">{eliteWraps.price}</span>
                      <button
                        onClick={(e) => handleQuickAdd(eliteWraps, e)}
                        className="bg-white hover:bg-[#0066ff] hover:text-white text-black p-2 flex items-center justify-center transition-all cursor-pointer"
                      >
                        <Plus size={14} />
                      </button>
                    </div>
                  </div>
                </motion.div>
              )}

            </div>

            {/* Column 3: Hydration Vessel (Top) & Tactical Pack (Bottom) */}
            <div className="flex flex-col gap-8 justify-between">
              
              {/* Hydration Vessel */}
              {hydration && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: 0.15 }}
                  className="group relative bg-[#0d0e10] border border-white/10 overflow-hidden flex flex-col justify-between h-[286px] sm:h-[310px]"
                >
                  {/* Image Background */}
                  <div className="absolute inset-0 z-0 overflow-hidden">
                    <img
                      src={hydration.image}
                      alt={hydration.name}
                      className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700 opacity-60 group-hover:opacity-80 filter contrast-[1.1]"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent" />
                  </div>

                  {/* Badge */}
                  <div className="relative z-10 p-5 flex justify-end">
                    <button
                      onClick={() => onOpenQuickView(hydration.id)}
                      className="p-2 bg-black/75 hover:bg-[#0066ff] text-white/80 hover:text-white backdrop-blur-md rounded-full transition-all opacity-0 group-hover:opacity-100"
                    >
                      <Eye size={12} />
                    </button>
                  </div>

                  {/* Bottom details */}
                  <div className="relative z-10 p-6 pt-12 bg-gradient-to-t from-black via-black/80 to-transparent">
                    <p className="font-mono text-[8px] text-[#0066ff] tracking-widest uppercase mb-0.5">{hydration.category}</p>
                    <h3 className="font-anton text-lg tracking-wide uppercase text-white group-hover:text-[#0066ff] transition-colors mb-1">
                      {hydration.name}
                    </h3>
                    <div className="flex items-center justify-between mt-3">
                      <span className="font-mono text-sm font-bold text-white tracking-wider">{hydration.price}</span>
                      <button
                        onClick={(e) => handleQuickAdd(hydration, e)}
                        className="bg-white hover:bg-[#0066ff] hover:text-white text-black p-2 flex items-center justify-center transition-all cursor-pointer"
                      >
                        <Plus size={14} />
                      </button>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Tactical Pack */}
              {tacticalPack && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: 0.25 }}
                  className="group relative bg-[#0d0e10] border border-white/10 overflow-hidden flex flex-col justify-between h-[286px] sm:h-[310px]"
                >
                  {/* Image Background */}
                  <div className="absolute inset-0 z-0 overflow-hidden">
                    <img
                      src={tacticalPack.image}
                      alt={tacticalPack.name}
                      className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700 opacity-60 group-hover:opacity-80 filter contrast-[1.1]"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent" />
                  </div>

                  {/* Badge */}
                  <div className="relative z-10 p-5 flex justify-between items-start">
                    <span className="bg-[#594cb0] text-white font-mono font-black text-[8px] tracking-widest px-2.5 py-1 uppercase shadow-md">
                      {language === "vi" ? "ĐÃ VỀ THÊM" : "RESTOCKED"}
                    </span>
                    <button
                      onClick={() => onOpenQuickView(tacticalPack.id)}
                      className="p-2 bg-black/75 hover:bg-[#0066ff] text-white/80 hover:text-white backdrop-blur-md rounded-full transition-all opacity-0 group-hover:opacity-100"
                    >
                      <Eye size={12} />
                    </button>
                  </div>

                  {/* Bottom details */}
                  <div className="relative z-10 p-6 pt-12 bg-gradient-to-t from-black via-black/80 to-transparent">
                    <p className="font-mono text-[8px] text-[#0066ff] tracking-widest uppercase mb-0.5">{tacticalPack.category}</p>
                    <h3 className="font-anton text-lg tracking-wide uppercase text-white group-hover:text-[#0066ff] transition-colors mb-1">
                      {tacticalPack.name}
                    </h3>
                    <div className="flex items-center justify-between mt-3">
                      <span className="font-mono text-sm font-bold text-white tracking-wider">{tacticalPack.price}</span>
                      <button
                        onClick={(e) => handleQuickAdd(tacticalPack, e)}
                        className="bg-white hover:bg-[#0066ff] hover:text-white text-black p-2 flex items-center justify-center transition-all cursor-pointer"
                      >
                        <Plus size={14} />
                      </button>
                    </div>
                  </div>
                </motion.div>
              )}

            </div>

          </div>
        ) : (
          /* Standard Flex grid for sorted, filtered, or expanded collections */
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 items-stretch mb-16">
            <AnimatePresence mode="popLayout">
              {filteredAndSortedProducts.map((product, index) => {
                const isClothing = ["APPAREL", "SHORTS", "TANKS", "BRAS"].includes(product.category?.toUpperCase() || "");
                const currentSize = selectedSizes[product.id] || "M";
                return (
                  <motion.div
                    key={product.id}
                    layout
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.4, delay: index * 0.05 }}
                    className="group relative bg-[#0d0e10] border border-white/10 overflow-hidden flex flex-col justify-between h-[420px] shadow-xl hover:shadow-2xl hover:border-white/20 transition-all duration-300"
                  >
                    {/* Image Area */}
                    <div className="absolute inset-0 z-0 overflow-hidden">
                      <img
                        src={product.image}
                        alt={product.name}
                        className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700 opacity-55 group-hover:opacity-75 filter contrast-[1.05]"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />
                    </div>

                    {/* Top action flags */}
                    <div className="relative z-10 p-5 flex justify-between items-start">
                      {product.badge ? (
                        <span className={`font-mono font-black text-[8px] tracking-widest px-2.5 py-1 uppercase shadow ${
                          product.badge === "RESTOCKED" ? "bg-[#594cb0] text-white" : "bg-[#b3c5ff] text-black"
                        }`}>
                          {product.badge}
                        </span>
                      ) : (
                        <div />
                      )}

                      <button
                        onClick={() => onOpenQuickView(product.id)}
                        className="p-2.5 bg-black/80 hover:bg-[#0066ff] text-white/80 hover:text-white backdrop-blur-md rounded-full transition-all opacity-0 group-hover:opacity-100 transform translate-y-1 group-hover:translate-y-0"
                      >
                        <Eye size={12} />
                      </button>
                    </div>

                    {/* Content Details Block */}
                    <div className="relative z-10 p-6 pt-24 bg-gradient-to-t from-black via-black/90 to-transparent mt-auto">
                      <p className="font-mono text-[8px] text-[#0066ff] tracking-widest uppercase mb-1">{product.category}</p>
                      <h3 className="font-anton text-xl tracking-wide uppercase text-white group-hover:text-[#0066ff] transition-colors mb-2">
                        {product.name}
                      </h3>
                      <p className="font-montserrat text-[11px] text-white/60 mb-5 line-clamp-2">
                        {product.description}
                      </p>

                      {/* Clothing Size Custom Interceptor inline */}
                      {isClothing && (
                        <div className="flex gap-1.5 mb-4 items-center">
                          <span className="font-mono text-[8px] text-white/45 tracking-widest uppercase mr-1">
                            {language === "vi" ? "SIZE:" : "SIZE:"}
                          </span>
                          {["S", "M", "L", "XL"].map((s) => (
                            <button
                              key={s}
                              onClick={(e) => handleSizeSelect(product.id, s, e)}
                              className={`w-5 h-5 font-mono text-[8px] font-bold border transition-colors flex items-center justify-center ${
                                currentSize === s
                                  ? "bg-white text-black border-white"
                                  : "bg-transparent text-white/60 border-white/20 hover:border-white/50"
                              }`}
                            >
                              {s}
                            </button>
                          ))}
                        </div>
                      )}

                      <div className="flex items-center justify-between border-t border-white/10 pt-4 mt-2">
                        <span className="font-mono text-base font-bold text-white tracking-wider">{product.price}</span>
                        <button
                          onClick={(e) => handleQuickAdd(product, e)}
                          className="bg-white hover:bg-[#0066ff] hover:text-white text-black px-4 py-2 text-[10px] font-mono tracking-wider font-black uppercase flex items-center gap-2 transition-all cursor-pointer"
                        >
                          <ShoppingCart size={10} />
                          <span>{language === "vi" ? "MUA NGAY" : "ADD TO CART"}</span>
                        </button>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>
        )}

        {/* Empty Search Results */}
        {filteredAndSortedProducts.length === 0 && (
          <div className="text-center py-24 border border-dashed border-white/10 bg-[#0d0e10]/30">
            <p className="font-mono text-xs tracking-widest text-white/45 uppercase mb-2">
              {language === "vi" ? "KHÔNG TÌM THẤY SẢN PHẨM PHÙ HỢP" : "NO PRODUCTS MATCHED"}
            </p>
            <p className="font-montserrat text-xs text-white/30">
              {language === "vi" ? "Hãy thử thay đổi danh mục lọc hoặc sắp xếp." : "Try changing filter tags or sort options."}
            </p>
          </div>
        )}

        {/* Center Button: Load More Gear */}
        {selectedCategory === "ALL" && !hasLoadedMore && (
          <div className="flex justify-center mt-4 mb-20">
            <button
              onClick={handleLoadMore}
              disabled={isLoadingMore}
              className="px-12 py-4 border border-white/20 hover:border-white/60 bg-transparent text-white font-mono text-[11px] tracking-[0.25em] uppercase transition-all duration-300 disabled:opacity-50 hover:bg-white/5 min-w-[280px]"
            >
              {isLoadingMore ? (
                <div className="flex items-center justify-center gap-2">
                  <span className="w-2.5 h-2.5 border-2 border-t-transparent border-white rounded-full animate-spin" />
                  <span>{language === "vi" ? "ĐANG TẢI THIẾT BỊ..." : "LOADING GEAR..."}</span>
                </div>
              ) : (
                language === "vi" ? "XEM THÊM THIẾT BỊ" : "LOAD MORE GEAR"
              )}
            </button>
          </div>
        )}

      </div>

      {/* Aero-space textile Spec showcase Block (Styled beautifully as specified) */}
      <div className="bg-[#0b0c0e] border-t border-b border-white/10 py-24 relative overflow-hidden">
        {/* Subtle grid background pattern */}
        <div className="absolute inset-0 opacity-[0.03] bg-[linear-gradient(to_right,#808080_1px,transparent_1px),linear-gradient(to_bottom,#808080_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none" />
        
        <div className="max-w-4xl mx-auto px-6 text-center relative z-10">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-full border border-white/20 mb-6 bg-black">
            <Zap className="text-[#0066ff] fill-[#0066ff]/20" size={20} />
          </div>
          
          <h2 className="font-anton text-2xl sm:text-4xl tracking-wider uppercase mb-4 text-white">
            {language === "vi" ? "THIẾT KẾ CHO SỰ KIÊN ĐỊNH CHUYÊN NGHIỆP" : "ENGINEERED FOR THE UNCOMPROMISING"}
          </h2>
          
          <p className="font-montserrat text-xs sm:text-sm text-white/60 leading-relaxed max-w-2xl mx-auto mb-10">
            {language === "vi"
              ? "Bộ sưu tập mới nhất của chúng tôi sử dụng công nghệ dệt may cấp hàng không vũ trụ để mang lại độ bền chưa từng có và khả năng kiểm soát thân nhiệt ổn định trong suốt quá trình tập luyện ở cường độ khắc nghiệt nhất."
              : "Our latest collection utilizes aerospace-grade textiles to deliver unprecedented durability and thermal regulation during extreme physical output."}
          </p>

          <button
            onClick={() => setIsSpecsModalOpen(true)}
            className="px-10 py-3.5 bg-[#0066ff] hover:bg-[#0055d4] text-white font-mono text-[10px] tracking-[0.2em] font-black uppercase transition-all shadow-xl"
          >
            {language === "vi" ? "XEM CHI TIẾT KỸ THUẬT" : "READ THE SPECS"}
          </button>
        </div>
      </div>

      {/* Specs Sheet Modal */}
      <AnimatePresence>
        {isSpecsModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsSpecsModalOpen(false)}
              className="absolute inset-0 bg-black/90 backdrop-blur-md"
            />

            {/* Modal Body */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              className="relative bg-[#0d0e10] border border-white/15 w-full max-w-2xl p-6 sm:p-10 text-left z-10 shadow-2xl overflow-y-auto max-h-[85vh]"
            >
              <button
                onClick={() => setIsSpecsModalOpen(false)}
                className="absolute top-5 right-5 text-white/50 hover:text-white transition-colors"
              >
                <X size={18} />
              </button>

              <div className="border-b border-white/10 pb-5 mb-6">
                <span className="font-mono text-[9px] text-[#0066ff] tracking-widest uppercase font-bold">
                  {language === "vi" ? "PHIẾU THÔNG SỐ CÔNG NGHỆ" : "TECHNICAL SPECIFICATION SHEET"}
                </span>
                <h3 className="font-anton text-2xl sm:text-3xl tracking-wide uppercase text-white mt-1">
                  {language === "vi" ? "VẬT LIỆU CAO CẤP HÀNG KHÔNG VŨ TRỤ" : "AEROSPACE-GRADE TEXTILES"}
                </h3>
              </div>

              <div className="space-y-6 font-montserrat text-xs text-white/70">
                <div>
                  <h4 className="font-mono text-[10px] text-white font-bold tracking-widest uppercase mb-2 text-[#0066ff]">
                    01. THERMAL CONTROL (AERO-KNIT)
                  </h4>
                  <p className="leading-relaxed">
                    {language === "vi"
                      ? "Màng lưới Aero-Knit sử dụng sợi rỗng có khả năng giữ nhiệt siêu nhẹ cùng các lỗ thoát hơi cực nhỏ phân bổ công học. Cho phép tản hơi nước nhanh hơn 40% so với sợi bông chải và tăng tốc độ làm mát vùng cơ chính khi hoạt động thể chất cao."
                      : "The Aero-Knit grid mesh leverages micro-porous polymer structures with hollow core fibres. Provides a 42% thermal insulation enhancement over standard premium ring-spun blends while expediting high-sweat moisture dissipation."}
                  </p>
                </div>

                <div>
                  <h4 className="font-mono text-[10px] text-white font-bold tracking-widest uppercase mb-2 text-[#0066ff]">
                    02. PROPULSION PLATE (VELOCITY PRO MIDSOLE)
                  </h4>
                  <p className="leading-relaxed">
                    {language === "vi"
                      ? "Tích hợp lõi carbon dệt định hình cong 3D bên trong lớp bọt nén nitơ cao áp. Tăng lực phản hồi năng lượng lên 14% và ổn định trục khớp cổ chân, bàn chân tối đa khi chuyển hướng di chuyển tốc độ nhanh."
                      : "Engineered with a full-length 3D curved carbon-fiber propulsion sheet encased in micro-cellular nitrogen-injected foam. Amplifies kinetic energy returns by 14% and establishes complete structural lockdown."}
                  </p>
                </div>

                <div>
                  <h4 className="font-mono text-[10px] text-white font-bold tracking-widest uppercase mb-2 text-[#0066ff]">
                    03. DENSITY & ABRASION (TACTICAL FABRICS)
                  </h4>
                  <p className="leading-relaxed">
                    {language === "vi"
                      ? "Vải thun Tactel dệt thô mật độ siêu cao chống rách xước tuyệt đối chống lại ma sát khi tiếp xúc trực tiếp đòn tạ (knurling) hoặc cát sỏi địa hình. Gia cố chỉ dệt Kevlar tại các điểm nối và góc chịu lực lực xoắn lớn."
                      : "Deploying high-density 1000D ballistic weave reinforced with ultra-high-molecular-weight polyethylene. Absolute tear and friction resistance engineered to withstand sharp metal bar knurling, abrasion, and intense friction loads."}
                  </p>
                </div>
              </div>

              <div className="border-t border-white/10 pt-6 mt-8 flex justify-end">
                <button
                  onClick={() => setIsSpecsModalOpen(false)}
                  className="px-6 py-2.5 bg-white text-black font-mono text-[10px] tracking-widest font-black uppercase hover:bg-white/90 transition-colors"
                >
                  {language === "vi" ? "ĐÓNG LẠI" : "CLOSE SHEET"}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
