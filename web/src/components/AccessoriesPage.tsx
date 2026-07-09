import React, { useState, useMemo } from "react";
import { Search, ChevronDown, Heart, Plus, Ban, SlidersHorizontal, ArrowRight, Eye, Pill, Mars, Venus, Shield, Backpack, Dumbbell } from "lucide-react";
import { Product, CartItem } from "../types";
import { useProducts } from "../context/ProductContext";
import { useLanguage } from "../context/LanguageContext";
import { useTheme } from "../context/ThemeContext";

interface AccessoriesPageProps {
  onOpenQuickView: (productId: string) => void;
  onAddToCart: (item: CartItem) => void;
  onNavigate?: (path: string) => void;
}

export default function AccessoriesPage({ onOpenQuickView, onAddToCart, onNavigate }: AccessoriesPageProps) {
  const { products: PRODUCTS } = useProducts();

  const { language, t } = useLanguage();
  const { isDark } = useTheme();

  // Search, Filter and Sort States
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedSubCategory, setSelectedSubCategory] = useState<string>("ALL");
  const [priceRange, setPriceRange] = useState<string>("ALL");
  const [sortBy, setSortBy] = useState<string>("FEATURED");

  // Favorites state
  const [favorites, setFavorites] = useState<Record<string, boolean>>({});

  // Dropdown UI visibility states
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);

  // Filter products belonging to accessories category (those starting with "acc-")
  const accProductsRaw = useMemo(() => {
    return PRODUCTS.filter((p) => {
      const cat = p.category?.toUpperCase() || "";
      const id = p.id?.toLowerCase() || "";
      return cat === "PHỤ KIỆN" || cat === "ACCESSORIES" || cat === "BELTS" || cat === "WRAPS" || cat === "BAGS" || cat === "BANDS" || cat === "STRAPS" || cat === "SLEEVES" || cat === "SHAKERS" || cat === "GLOVES" || id.includes("acc-");
    });
  }, [PRODUCTS]);

  // Map translations for product dynamic info
  const accProducts = useMemo(() => {
    return accProductsRaw.map((p) => {
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
  }, [accProductsRaw, t, language]);

  // Handle Favorites toggle
  const toggleFavorite = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setFavorites((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  // Add item to cart button click handler
  const handleQuickAdd = (product: Product, e: React.MouseEvent) => {
    e.stopPropagation();
    if (product.isSoldOut) return;
    onAddToCart({
      product,
      size: "One Size", // Default size label for accessories
      quantity: 1,
    });
  };

  // Live filter and sorting calculation
  const filteredAndSortedProducts = useMemo(() => {
    let result = [...accProducts];

    // Search query matching (matches name or category)
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase().trim();
      result = result.filter(
        (p) =>
          p.name.toLowerCase().includes(query) ||
          p.category?.toLowerCase().includes(query) ||
          p.description.toLowerCase().includes(query)
      );
    }

    // Category Filter
    if (selectedSubCategory !== "ALL") {
      result = result.filter((p) => {
        const cat = p.category?.toUpperCase() || "";
        const name = p.name?.toUpperCase() || "";
        const desc = p.description?.toUpperCase() || "";
        const sel = selectedSubCategory.toUpperCase();
        
        if (sel === "BELTS") {
          return cat === "BELTS" || name.includes("BELT") || name.includes("ĐAI") || desc.includes("BELT");
        }
        if (sel === "WRAPS") {
          return cat === "WRAPS" || name.includes("WRAP") || name.includes("QUẤN") || name.includes("BĂNG") || desc.includes("WRAP");
        }
        if (sel === "BAGS") {
          return cat === "BAGS" || name.includes("BAG") || name.includes("TÚI") || name.includes("BALO") || desc.includes("BAG");
        }
        if (sel === "BANDS") return cat === "BANDS" || name.includes("BAND") || name.includes("DÂY");
        if (sel === "STRAPS") return cat === "STRAPS" || name.includes("STRAP") || name.includes("KÉO");
        if (sel === "SLEEVES") return cat === "SLEEVES" || name.includes("SLEEVE") || name.includes("BẢO VỆ");
        if (sel === "SHAKERS") return cat === "SHAKERS" || name.includes("SHAKER") || name.includes("BÌNH");
        if (sel === "GLOVES") return cat === "GLOVES" || name.includes("GLOVE") || name.includes("GĂNG");

        return cat === sel;
      });
    }

    // Price Filter
    if (priceRange !== "ALL") {
      if (priceRange === "UNDER_40") {
        result = result.filter((p) => p.priceNum <= 40);
      } else if (priceRange === "OVER_40") {
        result = result.filter((p) => p.priceNum > 40);
      }
    }

    // Sorting
    if (sortBy === "PRICE_LOW_HIGH") {
      result.sort((a, b) => a.priceNum - b.priceNum);
    } else if (sortBy === "PRICE_HIGH_LOW") {
      result.sort((a, b) => b.priceNum - a.priceNum);
    } else if (sortBy === "NAME_A_Z") {
      result.sort((a, b) => a.name.localeCompare(b.name));
    } else if (sortBy === "NEWEST") {
      // Sort with newest accessories first (heavy wrist wraps, etc.)
      result.sort((a, b) => (b.id === "acc-heavy-wrist-wraps" ? 1 : -1));
    }

    return result;
  }, [accProducts, searchQuery, selectedSubCategory, priceRange, sortBy]);

  // Click on featured collections banner to filter category
  const selectCollectionCategory = (category: string) => {
    setSelectedSubCategory(category);
    const gridNode = document.getElementById("acc-products-grid");
    if (gridNode) {
      gridNode.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  const toggleDropdown = (dropdown: string) => {
    setActiveDropdown((prev) => (prev === dropdown ? null : dropdown));
  };

  return (
    <div className={`min-h-screen transition-colors ${isDark ? 'bg-black text-white' : 'bg-gray-50 text-gray-900'}`}>
      {/* 1. HERO HEADER */}
      <section className="relative h-[65vh] min-h-[500px] w-full flex items-center justify-center overflow-hidden">
        {/* Background Image Grayscale Overlay */}
        <div className="absolute inset-0 z-0">
          <img
            src="/heavy_deadlift.png"
            alt="Accessories Peak Performance Gym Gear"
            className="w-full h-full object-cover filter brightness-[0.4] contrast-[1.2] grayscale hover:scale-105 transition-transform duration-1000"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black/65" />
        </div>

        {/* Content Box */}
        <div className="relative z-10 max-w-4xl mx-auto px-6 text-center select-none flex flex-col items-center animate-fade-in">
          <span className="font-anton text-6xl md:text-8xl tracking-widest text-white leading-none opacity-90 uppercase">
            ACCESSORIES
          </span>
          <span className="font-anton text-2xl md:text-5xl tracking-widest text-[#0066ff] leading-none mb-6 mt-2 uppercase">
            {language === "vi" ? "MỌI CHI TIẾT ĐỀU QUAN TRỌNG" : "EVERY DETAIL MATTERS"}
          </span>
          <p className="font-montserrat text-xs md:text-sm text-zinc-400 max-w-xl mx-auto leading-relaxed tracking-widest mb-8 font-light">
            {language === "vi"
              ? "Trang thiết bị hỗ trợ tập luyện cao cấp được thiết kế tối ưu cho hiệu năng, sự bền bỉ vượt trội và các vận động viên chuyên nghiệp."
              : "Premium training accessories engineered for performance, durability, and serious athletes."}
          </p>

          <button
            onClick={() => selectCollectionCategory("ALL")}
            className="bg-[#0066ff] hover:bg-[#0055dd] text-white font-montserrat text-[10px] font-bold tracking-[0.25em] py-3.5 px-8 transition-all hover:scale-105 duration-300 shadow-xl shadow-blue-900/20 uppercase rounded-none"
          >
            {language === "vi" ? "MUA PHỤ KIỆN" : "SHOP ACCESSORIES"}
          </button>
        </div>
      </section>

      {/* 2. FEATURED CATEGORIES BENTO GRID */}
      <section className="max-w-7xl mx-auto px-6 md:px-16 py-16">
        {/* Bento Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Large Left Card: Lifting Belts */}
          <div
            onClick={() => selectCollectionCategory("BELTS")}
            className={`group relative cursor-pointer overflow-hidden border h-[380px] lg:h-[450px] lg:col-span-2 transition-all flex flex-col justify-end p-8 ${isDark ? 'bg-zinc-950 border-zinc-900/80' : 'bg-white border-gray-200 shadow-md'}`}
          >
            <div className="absolute inset-0 bg-black/20 z-10 group-hover:bg-black/0 transition-all duration-300" />
            <img
              src="/lifting_belt.png"
              alt="Lifting Belts"
              className="absolute inset-0 w-full h-full object-cover filter brightness-[0.7] contrast-[1.1] grayscale group-hover:scale-103 transition-transform duration-700"
            />
            
            {/* Blue Badge */}
            <div className="absolute top-6 left-6 z-20 bg-[#0066ff] text-white font-mono text-[9px] font-extrabold px-3 py-1 uppercase tracking-widest">
              PRO GRADE
            </div>

            <div className="relative z-20 max-w-md select-none">
              <h3 className={`font-anton text-3xl tracking-wider uppercase mb-1 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                {language === "vi" ? "ĐAI LƯNG TẬP TẠ" : "LIFTING BELTS"}
              </h3>
              <p className={`font-montserrat text-xs tracking-wider font-light mb-5 ${isDark ? 'text-zinc-400' : 'text-gray-600'}`}>
                {language === "vi" ? "Ổn định vùng cơ cốt lõi khi gánh tạ nặng." : "Core stability for heavy loads."}
              </p>
              <div className="flex items-center gap-2 text-white font-mono text-[10px] font-bold uppercase tracking-[0.2em] group-hover:text-[#0066ff] transition-colors">
                <span>{language === "vi" ? "MUA NGAY" : "SHOP NOW"}</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1.5 transition-transform" />
              </div>
            </div>
          </div>

          {/* Right Side Stacked Cards */}
          <div className="grid grid-cols-1 gap-6 lg:h-[450px]">
            {/* Card 2: Wrist Wraps */}
            <div
              onClick={() => selectCollectionCategory("WRAPS")}
              className={`group relative cursor-pointer overflow-hidden border h-[178px] lg:h-auto transition-all flex flex-col justify-end p-6 ${isDark ? 'bg-zinc-950 border-zinc-900/80' : 'bg-white border-gray-200 shadow-md'}`}
            >
              <div className="absolute inset-0 bg-black/30 z-10 group-hover:bg-black/10 transition-all duration-300" />
              <img
                src="https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&q=80&w=600"
                alt="Wrist Wraps"
                className="absolute inset-0 w-full h-full object-cover filter brightness-[0.7] contrast-[1.15] grayscale group-hover:scale-103 transition-transform duration-700"
              />
              <div className="relative z-20 select-none">
                <h3 className={`font-anton text-2xl tracking-wider uppercase mb-1 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                  {language === "vi" ? "BĂNG QUẤN CỔ TAY" : "WRIST WRAPS"}
                </h3>
                <div className={`flex items-center gap-2 font-mono text-[9px] font-bold uppercase tracking-[0.15em] transition-colors ${isDark ? 'text-zinc-400 group-hover:text-white' : 'text-gray-500 group-hover:text-gray-900'}`}>
                  <span>{language === "vi" ? "MUA PHÂN KHÚC" : "EXPLORE CATEGORY"}</span>
                  <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </div>

            {/* Card 3: Gym Bags */}
            <div
              onClick={() => selectCollectionCategory("BAGS")}
              className={`group relative cursor-pointer overflow-hidden border h-[178px] lg:h-auto transition-all flex flex-col justify-end p-6 ${isDark ? 'bg-zinc-950 border-zinc-900/80' : 'bg-white border-gray-200 shadow-md'}`}
            >
              <div className="absolute inset-0 bg-black/30 z-10 group-hover:bg-black/10 transition-all duration-300" />
              <img
                src="https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&q=80&w=600"
                alt="Gym Bags"
                className="absolute inset-0 w-full h-full object-cover filter brightness-[0.6] contrast-[1.2] grayscale group-hover:scale-103 transition-transform duration-700"
              />
              <div className="relative z-20 select-none">
                <h3 className={`font-anton text-2xl tracking-wider uppercase mb-1 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                  {language === "vi" ? "TÚI ĐỰNG ĐỒ TẬP" : "GYM BAGS"}
                </h3>
                <div className={`flex items-center gap-2 font-mono text-[9px] font-bold uppercase tracking-[0.15em] transition-colors ${isDark ? 'text-zinc-400 group-hover:text-white' : 'text-gray-500 group-hover:text-gray-900'}`}>
                  <span>{language === "vi" ? "MUA PHÂN KHÚC" : "EXPLORE CATEGORY"}</span>
                  <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. SEARCH & INTERACTIVE FILTER ROW */}
      <section id="acc-products-grid" className="max-w-7xl mx-auto px-6 md:px-16 pt-8 pb-12">
        <div className={`border-t border-b py-4 flex flex-col md:flex-row items-center justify-between gap-4 select-none ${isDark ? 'border-zinc-900' : 'border-gray-200'}`}>
          
          {/* Header count for visual realism */}
          <div className={`w-full md:w-auto text-left font-anton text-lg tracking-wider ${isDark ? 'text-zinc-200' : 'text-gray-900'}`}>
            {language === "vi" ? `TẤT CẢ PHỤ KIỆN (${filteredAndSortedProducts.length})` : `ALL ACCESSORIES (${filteredAndSortedProducts.length})`}
          </div>

          {/* Search Box */}
          <div className="relative w-full md:w-72">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={language === "vi" ? "TÌM KIẾM PHỤ KIỆN..." : "SEARCH ACCESSORIES..."}
              className={`w-full border px-4 py-2.5 pl-10 font-mono text-[11px] tracking-widest uppercase focus:outline-none focus:border-[#0066ff] transition-all font-bold rounded-none ${isDark ? 'bg-black hover:bg-zinc-950 focus:bg-zinc-950 border-zinc-900 text-[#ececec] placeholder:text-zinc-600' : 'bg-white hover:bg-gray-50 focus:bg-white border-gray-300 text-gray-900 placeholder:text-gray-400'}`}
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className={`absolute right-3 top-1/2 -translate-y-1/2 font-sans text-xs px-1 transition-colors ${isDark ? 'text-zinc-500 hover:text-white bg-zinc-900' : 'text-gray-400 hover:text-gray-900 bg-gray-100'}`}
              >
                Clear
              </button>
            )}
          </div>

          {/* Interactive Filters Grid dropdowns */}
          <div className="flex flex-wrap items-center gap-3 w-full md:w-auto md:justify-end">
            
            {/* Dropdown CATEGORY */}
            <div className="relative">
              <button
                onClick={() => toggleDropdown("category")}
                className={`flex items-center gap-2 border px-4 py-2.5 font-mono text-[10px] tracking-widest font-extrabold uppercase transition-colors rounded-none ${isDark ? 'bg-black hover:bg-zinc-900 border-zinc-900 text-white' : 'bg-white hover:bg-gray-50 border-gray-200 text-gray-700'}`}
              >
                <span>{language === "vi" ? "PHÂN LOẠI" : "CATEGORY"}: {selectedSubCategory}</span>
                <ChevronDown className={`w-3 h-3 text-zinc-400 transition-transform ${activeDropdown === "category" ? "rotate-180" : ""}`} />
              </button>

              {activeDropdown === "category" && (
                <div className={`absolute right-0 mt-1 z-30 w-48 border shadow-2xl uppercase font-mono text-[10px] ${isDark ? 'bg-zinc-950 border-zinc-900' : 'bg-white border-gray-200'}`}>
                  {["ALL", "BELTS", "WRAPS", "BANDS", "BAGS", "STRAPS", "SLEEVES", "SHAKERS", "GLOVES"].map((cat) => (
                    <button
                      key={cat}
                      onClick={() => {
                        setSelectedSubCategory(cat);
                        setActiveDropdown(null);
                      }}
                      className={`w-full text-left px-4 py-2.5 border-b last:border-0 transition-colors ${
                        isDark 
                          ? (selectedSubCategory === cat ? "text-[#0066ff] bg-zinc-900 border-zinc-900" : "text-zinc-400 hover:text-white border-zinc-900")
                          : (selectedSubCategory === cat ? "text-[#0066ff] bg-gray-50 border-gray-100" : "text-gray-600 hover:text-gray-900 hover:bg-gray-50 border-gray-100")
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Dropdown PRICE */}
            <div className="relative">
              <button
                onClick={() => toggleDropdown("price")}
                className={`flex items-center gap-2 border px-4 py-2.5 font-mono text-[10px] tracking-widest font-extrabold uppercase transition-colors rounded-none ${isDark ? 'bg-black hover:bg-zinc-900 border-zinc-900 text-white' : 'bg-white hover:bg-gray-50 border-gray-200 text-gray-700'}`}
              >
                <span>
                  {language === "vi" ? "MỨC GIÁ" : "PRICE"}:{" "}
                  {priceRange === "ALL"
                    ? "ALL"
                    : priceRange === "UNDER_40"
                    ? "<= $40"
                    : "> $40"}
                </span>
                <ChevronDown className={`w-3 h-3 text-zinc-400 transition-transform ${activeDropdown === "price" ? "rotate-180" : ""}`} />
              </button>

              {activeDropdown === "price" && (
                <div className={`absolute right-0 mt-1 z-30 w-48 border shadow-2xl uppercase font-mono text-[10px] ${isDark ? 'bg-zinc-950 border-zinc-900' : 'bg-white border-gray-200'}`}>
                  {[
                    { label: "ALL PRICES", value: "ALL" },
                    { label: "UNDER $40", value: "UNDER_40" },
                    { label: "ABOVE $40", value: "OVER_40" },
                  ].map((pr) => (
                    <button
                      key={pr.value}
                      onClick={() => {
                        setPriceRange(pr.value);
                        setActiveDropdown(null);
                      }}
                      className={`w-full text-left px-4 py-2.5 border-b last:border-0 transition-colors ${
                        isDark 
                          ? (priceRange === pr.value ? "text-[#0066ff] bg-zinc-900 border-zinc-900" : "text-zinc-400 hover:text-white border-zinc-900")
                          : (priceRange === pr.value ? "text-[#0066ff] bg-gray-50 border-gray-100" : "text-gray-600 hover:text-gray-900 hover:bg-gray-50 border-gray-100")
                      }`}
                    >
                      {pr.label}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Sort Dropdown */}
            <div className="relative">
              <button
                onClick={() => toggleDropdown("sort")}
                className={`flex items-center gap-2 border px-4 py-2.5 font-mono text-[10px] tracking-widest font-extrabold uppercase transition-colors rounded-none ${isDark ? 'bg-[#121415] hover:bg-zinc-900 border-zinc-900 text-zinc-300' : 'bg-white hover:bg-gray-50 border-gray-200 text-gray-700'}`}
              >
                <SlidersHorizontal className="w-3 h-3 text-[#0066ff]" />
                <span>{sortBy === "FEATURED" ? "SORT BY: FEATURED" : `SORT: ${sortBy.replace(/_/g, " ")}`}</span>
                <ChevronDown className={`w-3 h-3 text-zinc-400 transition-transform ${activeDropdown === "sort" ? "rotate-180" : ""}`} />
              </button>

              {activeDropdown === "sort" && (
                <div className={`absolute right-0 mt-1 z-30 w-52 border shadow-2xl uppercase font-mono text-[10px] ${isDark ? 'bg-zinc-950 border-zinc-900' : 'bg-white border-gray-200'}`}>
                  {[
                    { label: "FEATURED BOLD", value: "FEATURED" },
                    { label: "NEWEST BATCH", value: "NEWEST" },
                    { label: "PRICE: LOW TO HIGH", value: "PRICE_LOW_HIGH" },
                    { label: "PRICE: HIGH TO LOW", value: "PRICE_HIGH_LOW" },
                    { label: "ALPHABETICAL A-Z", value: "NAME_A_Z" },
                  ].map((item) => (
                    <button
                      key={item.value}
                      onClick={() => {
                        setSortBy(item.value);
                        setActiveDropdown(null);
                      }}
                      className={`w-full text-left px-4 py-2.5 border-b last:border-0 transition-colors ${
                        isDark 
                          ? (sortBy === item.value ? "text-[#0066ff] bg-zinc-900 border-zinc-900" : "text-zinc-400 hover:text-white border-zinc-900")
                          : (sortBy === item.value ? "text-[#0066ff] bg-gray-50 border-gray-100" : "text-gray-600 hover:text-gray-900 hover:bg-gray-50 border-gray-100")
                      }`}
                    >
                      {item.label}
                    </button>
                  ))}
                </div>
              )}
            </div>

          </div>
        </div>

        {/* Filter results counter */}
        {searchQuery || selectedSubCategory !== "ALL" || priceRange !== "ALL" || sortBy !== "FEATURED" ? (
          <div className={`mt-3 flex items-center justify-between font-mono text-[10px] tracking-widest px-4 py-2 border uppercase ${isDark ? 'bg-zinc-950 border-zinc-900 text-zinc-500' : 'bg-gray-50 border-gray-200 text-gray-500'}`}>
            <span>
              {language === "vi"
                ? `Tìm thấy ${filteredAndSortedProducts.length} phụ kiện rèn luyện`
                : `Located ${filteredAndSortedProducts.length} premium accessory assets`}
            </span>
            <button
              onClick={() => {
                setSearchQuery("");
                setSelectedSubCategory("ALL");
                setPriceRange("ALL");
                setSortBy("FEATURED");
              }}
              className="text-[#0066ff] hover:text-white font-extrabold hover:underline"
            >
              [ {language === "vi" ? "Xoá Bộ Lọc" : "Reset Filters"} ]
            </button>
          </div>
        ) : null}
      </section>

      {/* 4. PRODUCTS DISPLAY GRID */}
      <section className="max-w-7xl mx-auto px-6 md:px-16 pb-16">
        {filteredAndSortedProducts.length === 0 ? (
          <div className={`text-center py-24 border rounded-none ${isDark ? 'bg-[#0e1011] border-zinc-900' : 'bg-gray-50 border-gray-200'}`}>
            <Ban className={`w-12 h-12 mx-auto mb-4 ${isDark ? 'text-zinc-700' : 'text-gray-300'}`} />
            <p className={`font-mono text-[11px] tracking-widest uppercase font-bold ${isDark ? 'text-zinc-400' : 'text-gray-500'}`}>
              {language === "vi"
                ? "Không tìm thấy phụ kiện tập luyện nào phù hợp lựa chọn."
                : "No matching training accessories found in roster."}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 select-none animate-fade-in">
            {filteredAndSortedProducts.map((p) => {
              const isFav = favorites[p.id] || false;
              return (
                <div
                  key={p.id}
                  onClick={() => onOpenQuickView(p.id)}
                  className={`group relative cursor-pointer border transition-all duration-300 flex flex-col justify-between ${
                    isDark ? 'bg-black/40 hover:bg-black border-zinc-900 hover:border-[#0066ff]/40' : 'bg-white hover:shadow-xl border-gray-100 hover:border-[#0066ff]/30'
                  }`}
                  style={{ minHeight: "380px" }}
                >
                  {/* Top Image & badges zone */}
                  <div className={`relative w-full aspect-square overflow-hidden flex items-center justify-center ${isDark ? 'bg-[#101213]' : 'bg-gray-100'}`}>
                    
                    {/* Grayscale styled nutrition image with subtle hover contrast boost */}
                    <img
                      src={p.image}
                      alt={p.name}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover filter brightness-[0.75] contrast-[1.1] grayscale group-hover:grayscale-0 group-hover:scale-105 duration-500 transition-all"
                    />

                    {/* Sold out overlay tag */}
                    {p.isSoldOut && (
                      <div className={`absolute top-4 left-4 z-10 border font-mono text-[9px] font-bold px-2 py-0.5 tracking-widest uppercase ${isDark ? 'bg-zinc-900 border-zinc-800 text-zinc-400' : 'bg-white border-gray-200 text-gray-500'}`}>
                        {language === "vi" ? "HẾT HÀNG" : "SOLD OUT"}
                      </div>
                    )}

                    {/* Best Seller or New or Limited Edition Badge */}
                    {!p.isSoldOut && p.badge && (
                      <div className="absolute top-4 left-4 z-10 bg-[#0066ff] text-white font-mono text-[8px] font-extrabold px-2 py-0.5 tracking-widest uppercase">
                        {p.badge === "BEST SELLER" 
                          ? (language === "vi" ? "BÁN CHẠY" : "BEST SELLER") 
                          : p.badge === "NEW" 
                          ? (language === "vi" ? "HÀNG MỚI" : "NEW") 
                          : (language === "vi" ? "GIỚI HẠN" : "LIMITED EDITION")}
                      </div>
                    )}

                    {/* Favorite Heart Icon Button */}
                    <button
                      onClick={(e) => toggleFavorite(p.id, e)}
                      className={`absolute top-4 right-4 z-10 p-2 border transition-all duration-200 ${
                        isDark ? 'bg-[#0c0f0f]/80 hover:bg-black hover:text-[#ff3355] text-zinc-400 border-zinc-900' : 'bg-white/80 hover:bg-white text-gray-400 hover:text-[#ff3355] border-gray-200'
                      }`}
                    >
                      <Heart
                        className={`w-3.5 h-3.5 ${isFav ? "fill-[#ff3355] text-[#ff3355]" : ""}`}
                      />
                    </button>

                    {/* Quick view hover icon */}
                    <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-all duration-300">
                      <div className={`border p-3 flex items-center gap-2 hover:border-[#0066ff] ${isDark ? 'bg-[#0c0f0f] border-white/20' : 'bg-white border-gray-200'}`}>
                        <Eye className="w-4 h-4 text-[#0066ff]" />
                        <span className={`font-montserrat text-[10px] font-bold tracking-widest uppercase ${isDark ? 'text-white' : 'text-gray-900'}`}>
                          {language === "vi" ? "XEM NHANH" : "QUICK VIEW"}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Mid Title & Cost labels */}
                  <div className="p-4 flex flex-col justify-between flex-grow">
                    <div>
                      <span className="font-mono text-[9px] font-bold tracking-widest text-[#0066ff] uppercase block mb-1">
                        {p.category || "GEAR"}
                      </span>
                      <h3 className={`font-montserrat text-xs font-bold tracking-wider transition-colors uppercase leading-tight mb-2 ${isDark ? 'text-[#eaeaea] group-hover:text-white' : 'text-gray-800 group-hover:text-black'}`}>
                        {p.name}
                      </h3>
                    </div>

                    <div className="flex items-center justify-between mt-4">
                      <span className={`font-mono text-sm font-extrabold ${isDark ? 'text-[#ffffff]' : 'text-gray-900'}`}>
                        {p.price}
                      </span>

                      {/* Add to configuration trigger button */}
                      {p.isSoldOut ? (
                        <button
                          disabled
                          className={`border p-2 rounded-full cursor-not-allowed ${isDark ? 'bg-zinc-950 border-zinc-900 text-zinc-700' : 'bg-gray-100 border-gray-200 text-gray-400'}`}
                          title="Temporarily unavailable"
                        >
                          <Ban className="w-3.5 h-3.5" />
                        </button>
                      ) : (
                        <button
                          onClick={(e) => handleQuickAdd(p, e)}
                          className={`hover:bg-[#0066ff] hover:text-white border hover:border-[#0066ff] p-2 rounded-full transition-all duration-200 cursor-pointer shadow-md ${
                            isDark ? 'bg-black text-zinc-300 border-zinc-900 shadow-black/40' : 'bg-white text-gray-700 border-gray-200 shadow-gray-200/50'
                          }`}
                          title="Add to training configuration"
                        >
                          <Plus className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* 5. LOAD MORE PRODUCTS BUTTON */}
        <div className="mt-12 text-center">
          <button
            onClick={() => {
              alert(
                language === "vi"
                  ? "Bạn đã xem toàn bộ danh mục phụ kiện rèn luyện Henry Fit Elite."
                  : "All current active athletic laboratory products are loaded."
              );
            }}
            className={`border hover:border-[#0066ff] hover:bg-[#0066ff]/5 font-montserrat text-[10px] font-extrabold tracking-[0.25em] py-3.5 px-10 transition-all uppercase rounded-none ${
              isDark ? 'border-[#424656]/50 bg-black text-zinc-300 hover:text-white' : 'border-gray-300 bg-white text-gray-600 hover:text-gray-900'
            }`}
          >
            {language === "vi" ? "HIỂN THỊ THÊM SẢN PHẨM" : "LOAD MORE PRODUCTS"}
          </button>
        </div>
      </section>

      {/* 6. TECHNICAL ADVOCACY BANNER */}
      <section className={`relative overflow-hidden w-full border-t border-b py-20 ${isDark ? 'bg-[#121414] border-zinc-900' : 'bg-gray-100 border-gray-200'}`}>
        <div className="max-w-7xl mx-auto px-6 md:px-16 grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div className="select-none flex flex-col items-start text-left">
            <h2 className={`font-anton text-4xl sm:text-5xl tracking-widest leading-tight uppercase mb-6 ${isDark ? 'text-white' : 'text-gray-900'}`}>
              {language === "vi" ? "THIẾT KẾ BỞI VẬN ĐỘNG VIÊN." : "DESIGNED BY ATHLETES."}
            </h2>
            <p className={`font-montserrat text-xs sm:text-sm leading-relaxed tracking-wider mb-8 ${isDark ? 'text-zinc-400' : 'text-gray-600'}`}>
              {language === "vi"
                ? "Chúng tôi không sản xuất trang thiết bị dành cho những người tập luyện hời hợt. Từng mũi khâu, khóa kim loại và dây đai đều được hiệu chỉnh tối ưu cho khả năng chịu lực cực hạn. Đã kiểm nghiệm trong các môi trường khắc nghiệt nhất bởi các elite powerlifter và vận động viên thể chất ưu tú nhất."
                : "We don't build gear for the casual gym-goer. Every stitch, buckle, and strap is engineered for maximum load and durability. Tested in the harshest environments by elite powerlifters and strength athletes."}
            </p>

            <button
              onClick={() => {
                alert(
                  language === "vi"
                    ? "Phòng Thử Nghiệm Henry Fit: Chi tiết quy trình gia cố sợi nylon lực kéo cao đã được tải."
                    : "Henry Fit Lab: High-tensile nylon reinforce fabrication protocol loaded."
                );
              }}
              className="bg-[#0066ff] hover:bg-[#0055dd] text-white font-montserrat text-xs font-bold tracking-[0.25em] py-4 px-8 border border-transparent transition-all hover:scale-105 uppercase rounded-none"
            >
              {language === "vi" ? "KHÁM PHÁ QUY TRÌNH CHẾ TẠO" : "DISCOVER OUR PROCESS"}
            </button>
          </div>

          <div className={`relative h-[300px] md:h-[400px] w-full overflow-hidden border ${isDark ? 'border-zinc-900' : 'border-gray-200'}`}>
            <img
              src="https://images.unsplash.com/photo-1517838277536-f5f99be501cd?q=80&w=1000&auto=format&fit=crop"
              alt="Elite performance powerlifter lifting heavy load barbell"
              className="w-full h-full object-cover filter brightness-[0.4] contrast-[1.1] grayscale hover:scale-103 transition-transform duration-700"
            />
            <div className={`absolute inset-0 bg-gradient-to-t ${isDark ? 'from-black via-transparent' : 'from-white via-transparent'} to-transparent pointer-events-none`} />
          </div>
        </div>
      </section>

      {/* 7. EXPLORE MORE LINKS SECTIONS */}
      <section className={`py-20 px-6 md:px-16 select-none ${isDark ? 'bg-black' : 'bg-white border-b border-gray-200'}`}>
        <div className="max-w-7xl mx-auto text-center">
          <h2 className={`font-anton text-2xl tracking-widest uppercase mb-12 ${isDark ? 'text-white' : 'text-gray-900'}`}>
            {language === "vi" ? "KHÁM PHÁ THÊM" : "EXPLORE MORE"}
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Link 1: Men's Apparel */}
            <div
              onClick={() => onNavigate?.("/men")}
              className={`group relative cursor-pointer overflow-hidden border h-[150px] transition-all flex flex-col items-center justify-center p-6 hover:border-[#0066ff]/40 ${isDark ? 'bg-zinc-950 border-zinc-900/80' : 'bg-gray-50 border-gray-200'}`}
            >
              <Mars className={`w-6 h-6 mb-3 group-hover:text-[#0066ff] transition-colors ${isDark ? 'text-zinc-500' : 'text-gray-400'}`} />
              <h3 className={`font-anton text-lg tracking-wider uppercase mb-1 ${isDark ? 'text-white group-hover:text-white/90' : 'text-gray-900 group-hover:text-[#0066ff]'}`}>
                {language === "vi" ? "TRANG PHỤC NAM" : "MEN'S APPAREL"}
              </h3>
            </div>

            {/* Link 2: Women's Apparel */}
            <div
              onClick={() => onNavigate?.("/women")}
              className={`group relative cursor-pointer overflow-hidden border h-[150px] transition-all flex flex-col items-center justify-center p-6 hover:border-[#0066ff]/40 ${isDark ? 'bg-zinc-950 border-zinc-900/80' : 'bg-gray-50 border-gray-200'}`}
            >
              <Venus className={`w-6 h-6 mb-3 group-hover:text-[#0066ff] transition-colors ${isDark ? 'text-zinc-500' : 'text-gray-400'}`} />
              <h3 className={`font-anton text-lg tracking-wider uppercase mb-1 ${isDark ? 'text-white group-hover:text-white/90' : 'text-gray-900 group-hover:text-[#0066ff]'}`}>
                {language === "vi" ? "TRANG PHỤC NỮ" : "WOMEN'S APPAREL"}
              </h3>
            </div>

            {/* Link 3: Supplements */}
            <div
              onClick={() => onNavigate?.("/supplements")}
              className={`group relative cursor-pointer overflow-hidden border h-[150px] transition-all flex flex-col items-center justify-center p-6 hover:border-[#0066ff]/40 ${isDark ? 'bg-zinc-950 border-zinc-900/80' : 'bg-gray-50 border-gray-200'}`}
            >
              <Pill className={`w-6 h-6 mb-3 group-hover:text-[#0066ff] transition-colors ${isDark ? 'text-zinc-500' : 'text-gray-400'}`} />
              <h3 className={`font-anton text-lg tracking-wider uppercase mb-1 ${isDark ? 'text-white group-hover:text-white/90' : 'text-gray-900 group-hover:text-[#0066ff]'}`}>
                {language === "vi" ? "THỰC PHẨM BỔ SUNG" : "SUPPLEMENTS"}
              </h3>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
