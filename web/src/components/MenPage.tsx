import React, { useState, useMemo } from "react";
import { Search, ChevronDown, Heart, Plus, Ban, SlidersHorizontal, ArrowRight, Zap, Eye } from "lucide-react";
import { Product, CartItem } from "../types";
import { useProducts } from "../context/ProductContext";
import { useLanguage } from "../context/LanguageContext";
import { useTheme } from "../context/ThemeContext";

interface MenPageProps {
  onOpenQuickView: (productId: string) => void;
  onAddToCart: (item: CartItem) => void;
}

export default function MenPage({ onOpenQuickView, onAddToCart }: MenPageProps) {
  const { products: PRODUCTS } = useProducts();

  const { language, t } = useLanguage();
  const { isDark } = useTheme();

  // Search, Filter and Sort States
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("ALL");
  const [selectedSize, setSelectedSize] = useState<string>("ALL");
  const [priceRange, setPriceRange] = useState<string>("ALL");
  const [sortBy, setSortBy] = useState<string>("FEATURED");

  // Favorites state
  const [favorites, setFavorites] = useState<Record<string, boolean>>({});

  // Dropdown UI visibility states
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);

  const menProductsRaw = useMemo(() => {
    return PRODUCTS.filter((p) => {
      const cat = p.category?.toUpperCase() || "";
      const id = p.id?.toLowerCase() || "";
      return cat === "NAM" || cat === "MEN" || cat === "OVERSIZED" || cat === "COMPRESSION" || cat === "TRAINING" || id.includes("men-");
    });
  }, [PRODUCTS]);

  // Map translations for product dynamic info
  const menProducts = useMemo(() => {
    return menProductsRaw.map((p) => {
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
  }, [menProductsRaw, t, language]);

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
      size: "M", // Default to M size when quick added
      quantity: 1,
    });
  };

  // Live filter and sorting calculation
  const filteredAndSortedProducts = useMemo(() => {
    let result = [...menProducts];

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
    if (selectedCategory !== "ALL") {
      result = result.filter((p) => {
        const cat = p.category?.toUpperCase() || "";
        const name = p.name?.toUpperCase() || "";
        const desc = p.description?.toUpperCase() || "";
        const sel = selectedCategory.toUpperCase();
        
        if (sel === "COMPRESSION") {
          return cat === "COMPRESSION" || name.includes("COMPRESSION") || name.includes("NÉN") || desc.includes("COMPRESSION");
        }
        if (sel === "OVERSIZED") {
          return cat === "OVERSIZED" || name.includes("OVERSIZED") || desc.includes("OVERSIZED");
        }
        if (sel === "TRAINING") {
          return cat === "TRAINING" || name.includes("TRAINING") || desc.includes("TRAINING");
        }
        return cat === sel;
      });
    }

    // Since we mock sizes on details, the size filter filters appropriate items
    // S, M, L, XL - we can simulate slight variance or let all support S-XL
    if (selectedSize !== "ALL") {
      // Just a mock check to simulate realistic size filters
      if (selectedSize === "S") {
        result = result.filter((p) => p.id !== "men-elite-recovery"); // simulate out of stock sizes
      }
    }

    // Price Filter
    if (priceRange !== "ALL") {
      if (priceRange === "UNDER_50") {
        result = result.filter((p) => p.priceNum <= 50);
      } else if (priceRange === "OVER_50") {
        result = result.filter((p) => p.priceNum > 50);
      }
    }

    // Sorting
    if (sortBy === "PRICE_LOW_HIGH") {
      result.sort((a, b) => a.priceNum - b.priceNum);
    } else if (sortBy === "PRICE_HIGH_LOW") {
      result.sort((a, b) => b.priceNum - a.priceNum);
    } else if (sortBy === "NAME_A_Z") {
      result.sort((a, b) => a.name.localeCompare(b.name));
    }

    return result;
  }, [menProducts, searchQuery, selectedCategory, selectedSize, priceRange, sortBy]);

  // Click on featured collections banner to filter category
  const selectCollectionCategory = (category: string) => {
    setSelectedCategory(category);
    const gridNode = document.getElementById("men-products-grid");
    if (gridNode) {
      gridNode.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  const toggleDropdown = (dropdown: string) => {
    setActiveDropdown((prev) => (prev === dropdown ? null : dropdown));
  };

  return (
    <div className={`min-h-screen transition-colors ${isDark ? 'bg-[#0c0f0f] text-white' : 'bg-gray-50 text-gray-900'}`}>
      {/* 1. HERO HEADER */}
      <section className="relative h-[65vh] min-h-[500px] w-full flex items-center justify-center overflow-hidden">
        {/* Background Image Grayscale Overlay */}
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?q=80&w=1600&auto=format&fit=crop"
            alt="Men's Peak Athletic Performance"
            className="w-full h-full object-cover object-top filter brightness-[0.3] contrast-[1.1] grayscale hover:scale-105 transition-transform duration-1000"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0c0f0f] via-transparent to-black/65" />
        </div>

        {/* Content Box */}
        <div className="relative z-10 max-w-4xl mx-auto px-6 text-center select-none flex flex-col items-center">
          <span className="font-anton text-6xl md:text-8xl tracking-widest text-white leading-none opacity-90">
            MEN
          </span>
          <span className="font-anton text-4xl md:text-7xl tracking-tighter text-[#0066ff] leading-none mb-6">
            {language === "vi" ? "THIẾT KẾ ĐỂ BẢNH & MẠNH" : "BUILT FOR STRENGTH"}
          </span>
          <p className="font-montserrat text-sm md:text-base text-zinc-300 max-w-xl mx-auto leading-relaxed tracking-wider mb-8 font-light">
            {language === "vi"
              ? "Dòng trang bị hiệu năng cao đanh góc dành cho các chiến thần thể hình. Vị kỷ mục tiêu, chinh phục giới hạn cốt lõi."
              : "Uncompromising performance gear engineered for the modern athlete. No distractions, just results."}
          </p>

          <button
            onClick={() => selectCollectionCategory("ALL")}
            className="bg-[#0066ff] hover:bg-[#0055dd] text-white font-montserrat text-xs font-bold tracking-[0.25em] py-3.5 px-8 transition-all hover:scale-105 duration-300 shadow-xl shadow-blue-900/20 uppercase"
          >
            {language === "vi" ? "MUA TẤT CẢ ĐỒ NAM" : "SHOP ALL MEN"}
          </button>
        </div>
      </section>

      {/* 2. FEATURED COLLECTIONS */}
      <section className="max-w-7xl mx-auto px-6 md:px-16 py-16">
        <h2 className={`font-anton text-3xl tracking-wider mb-8 border-l-4 border-[#0066ff] pl-4 uppercase ${isDark ? 'text-white' : 'text-gray-900'}`}>
          {language === "vi" ? "BỘ SƯU TẬP NỔI BẬT" : "FEATURED COLLECTIONS"}
        </h2>

        {/* Bento Layout Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Card left: OVERSIZED (2/3 width in large screen) */}
          <div
            onClick={() => selectCollectionCategory("OVERSIZED")}
            className={`group relative cursor-pointer overflow-hidden border lg:col-span-2 h-[420px] transition-all ${isDark ? 'bg-zinc-950 border-zinc-800/60' : 'bg-white border-gray-200 shadow-md'}`}
          >
            <div className="absolute inset-0 bg-black/10 z-10 group-hover:bg-transparent transition-all duration-300" />
            <img
              src="/men_oversized.png"
              alt="Oversized Streetwear Gym Weave"
              className="absolute inset-0 w-full h-full object-cover filter brightness-[0.8] contrast-[1.1] grayscale group-hover:scale-105 transition-transform duration-700"
            />
            {/* Blue Badge */}
            <div className="absolute top-6 left-6 z-20 bg-[#0066ff] text-white font-mono text-[9px] font-extrabold px-3 py-1 uppercase tracking-widest">
              {language === "vi" ? "MỚI NHẤT" : "NEW"}
            </div>

            {/* Bottom Content overlay */}
            <div className="absolute bottom-8 left-8 z-20 right-8">
              <h3 className="font-anton text-2xl md:text-3xl tracking-wide text-white uppercase mb-1">
                {language === "vi" ? "BỘ SƯU TẬP OVERSIZED" : "OVERSIZED COLLECTION"}
              </h3>
              <p className="font-montserrat text-xs text-zinc-300 tracking-wider font-light mb-4">
                {language === "vi" ? "Thoải mái tối đa, định hình phom dáng bề thế tối thượng." : "Maximum comfort, dominant silhouette."}
              </p>
              <div className="flex items-center gap-2 text-white font-montserrat text-[10px] font-bold uppercase tracking-[0.2em] group-hover:text-[#0066ff] transition-colors">
                <span>{language === "vi" ? "KHÁM PHÁ NGAY" : "EXPLORE"}</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1.5 transition-transform" />
              </div>
            </div>
          </div>

          {/* Right column stacked (1/3 width, two rows) */}
          <div className="grid grid-cols-1 gap-6">
            {/* Card 1: COMPRESSION */}
            <div
              onClick={() => selectCollectionCategory("COMPRESSION")}
              className={`group relative cursor-pointer overflow-hidden border h-[198px] transition-all ${isDark ? 'bg-zinc-950 border-zinc-800/60' : 'bg-white border-gray-200 shadow-md'}`}
            >
              <div className="absolute inset-0 bg-black/10 z-10 group-hover:bg-transparent transition-all duration-300" />
              <img
                src="/men_compression.png"
                alt="Elite level compression"
                className="absolute inset-0 w-full h-full object-cover filter brightness-[0.7] contrast-[1.1] grayscale group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute bottom-6 left-6 z-20 right-6">
                <h3 className="font-anton text-xl tracking-wider text-white uppercase mb-1">
                  {language === "vi" ? "COMPRESSION BÓ CƠ" : "COMPRESSION"}
                </h3>
                <p className="font-montserrat text-[11px] text-zinc-300 tracking-wider font-light mb-3">
                  {language === "vi" ? "Hỗ trợ lưu thông máu, đẩy nhanh phục hồi bắp cơ." : "Engineered recovery."}
                </p>
                <div className="flex items-center gap-2 text-white font-montserrat text-[9px] font-bold uppercase tracking-[0.2em] group-hover:text-[#0066ff] transition-colors">
                  <span>{language === "vi" ? "KHÁM PHÁ" : "EXPLORE"}</span>
                  <ArrowRight className="w-3 h-3 group-hover:translate-x-1.5 transition-transform" />
                </div>
              </div>
            </div>

            {/* Card 2: TRAINING */}
            <div
              onClick={() => selectCollectionCategory("TRAINING")}
              className={`group relative cursor-pointer overflow-hidden border h-[198px] transition-all ${isDark ? 'bg-zinc-950 border-zinc-800/60' : 'bg-white border-gray-200 shadow-md'}`}
            >
              <div className="absolute inset-0 bg-black/10 z-10 group-hover:bg-transparent transition-all duration-300" />
              <img
                src="/men_training.png"
                alt="Intense physical training"
                className="absolute inset-0 w-full h-full object-cover filter brightness-[0.7] contrast-[1.1] grayscale group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute bottom-6 left-6 z-20 right-6">
                <h3 className="font-anton text-xl tracking-wider text-white uppercase mb-1">
                  {language === "vi" ? "TRAINING KHẮC NGHIỆT" : "TRAINING"}
                </h3>
                <p className="font-montserrat text-[11px] text-zinc-300 tracking-wider font-light mb-3">
                  {language === "vi" ? "Sinh ra cho sự kiên trì luyện tập không ngừng nghỉ." : "Built for the grind."}
                </p>
                <div className="flex items-center gap-2 text-white font-montserrat text-[9px] font-bold uppercase tracking-[0.2em] group-hover:text-[#0066ff] transition-colors">
                  <span>{language === "vi" ? "KHÁM PHÁ" : "EXPLORE"}</span>
                  <ArrowRight className="w-3 h-3 group-hover:translate-x-1.5 transition-transform" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. SEARCH & INTERACTIVE FILTER ROW */}
      <section id="men-products-grid" className="max-w-7xl mx-auto px-6 md:px-16 pt-8 pb-12">
        <div className={`border-t border-b py-4 flex flex-col md:flex-row items-center justify-between gap-4 select-none ${isDark ? 'border-zinc-800/80' : 'border-gray-200'}`}>
          
          {/* Search Box */}
          <div className="relative w-full md:w-72">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={language === "vi" ? "TÌM SẢN PHẨM..." : "SEARCH GEAR..."}
              className={`w-full border px-4 py-2.5 pl-10 font-mono text-[11px] tracking-widest uppercase focus:outline-none focus:border-[#0066ff] transition-all font-bold ${isDark ? 'bg-black/50 hover:bg-black/80 focus:bg-black border-zinc-800 text-[#ececec] placeholder:text-zinc-600' : 'bg-white hover:bg-gray-50 focus:bg-white border-gray-300 text-gray-900 placeholder:text-gray-400'}`}
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
                className={`flex items-center gap-2 border px-4 py-2.5 font-mono text-[10px] tracking-widest font-extrabold uppercase transition-colors ${isDark ? 'bg-black hover:bg-zinc-900 border-zinc-850' : 'bg-white hover:bg-gray-50 border-gray-200 text-gray-700'}`}
              >
                <span>{language === "vi" ? "PHÂN LOẠI" : "CATEGORY"}: {selectedCategory}</span>
                <ChevronDown className={`w-3 h-3 text-zinc-400 transition-transform ${activeDropdown === "category" ? "rotate-180" : ""}`} />
              </button>

              {activeDropdown === "category" && (
                <div className={`absolute right-0 mt-1 z-30 w-44 border shadow-2xl uppercase font-mono text-[10px] ${isDark ? 'bg-zinc-950 border-zinc-800' : 'bg-white border-gray-200'}`}>
                  {["ALL", "OVERSIZED", "COMPRESSION", "TRAINING"].map((cat) => (
                    <button
                      key={cat}
                      onClick={() => {
                        setSelectedCategory(cat);
                        setActiveDropdown(null);
                      }}
                      className={`w-full text-left px-4 py-2.5 border-b last:border-0 transition-colors ${
                        isDark
                          ? (selectedCategory === cat ? "text-[#0066ff] bg-zinc-900 border-zinc-900" : "text-zinc-400 hover:text-white border-zinc-900")
                          : (selectedCategory === cat ? "text-[#0066ff] bg-gray-50 border-gray-100" : "text-gray-600 hover:text-gray-900 hover:bg-gray-50 border-gray-100")
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Dropdown SIZE */}
            <div className="relative">
              <button
                onClick={() => toggleDropdown("size")}
                className={`flex items-center gap-2 border px-4 py-2.5 font-mono text-[10px] tracking-widest font-extrabold uppercase transition-colors ${isDark ? 'bg-black hover:bg-zinc-900 border-zinc-850' : 'bg-white hover:bg-gray-50 border-gray-200 text-gray-700'}`}
              >
                <span>{language === "vi" ? "KÍCH CỠ" : "SIZE"}: {selectedSize}</span>
                <ChevronDown className={`w-3 h-3 text-zinc-400 transition-transform ${activeDropdown === "size" ? "rotate-180" : ""}`} />
              </button>

              {activeDropdown === "size" && (
                <div className={`absolute right-0 mt-1 z-30 w-40 border shadow-2xl uppercase font-mono text-[10px] ${isDark ? 'bg-zinc-950 border-zinc-800' : 'bg-white border-gray-200'}`}>
                  {["ALL", "S", "M", "L", "XL"].map((sz) => (
                    <button
                      key={sz}
                      onClick={() => {
                        setSelectedSize(sz);
                        setActiveDropdown(null);
                      }}
                      className={`w-full text-left px-4 py-2.5 border-b last:border-0 transition-colors ${
                        isDark
                          ? (selectedSize === sz ? "text-[#0066ff] bg-zinc-900 border-zinc-900" : "text-zinc-400 hover:text-white border-zinc-900")
                          : (selectedSize === sz ? "text-[#0066ff] bg-gray-50 border-gray-100" : "text-gray-600 hover:text-gray-900 hover:bg-gray-50 border-gray-100")
                      }`}
                    >
                      {sz}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Dropdown PRICE */}
            <div className="relative">
              <button
                onClick={() => toggleDropdown("price")}
                className={`flex items-center gap-2 border px-4 py-2.5 font-mono text-[10px] tracking-widest font-extrabold uppercase transition-colors ${isDark ? 'bg-black hover:bg-zinc-900 border-zinc-850' : 'bg-white hover:bg-gray-50 border-gray-200 text-gray-700'}`}
              >
                <span>
                  {language === "vi" ? "MỨC GIÁ" : "PRICE"}:{" "}
                  {priceRange === "ALL"
                    ? "ALL"
                    : priceRange === "UNDER_50"
                    ? "<= $50"
                    : "> $50"}
                </span>
                <ChevronDown className={`w-3 h-3 text-zinc-400 transition-transform ${activeDropdown === "price" ? "rotate-180" : ""}`} />
              </button>

              {activeDropdown === "price" && (
                <div className={`absolute right-0 mt-1 z-30 w-48 border shadow-2xl uppercase font-mono text-[10px] ${isDark ? 'bg-zinc-950 border-zinc-800' : 'bg-white border-gray-200'}`}>
                  {[
                    { label: "ALL PRICES", value: "ALL" },
                    { label: "UNDER $50", value: "UNDER_50" },
                    { label: "ABOVE $50", value: "OVER_50" },
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
                className={`flex items-center gap-2 border px-4 py-2.5 font-mono text-[10px] tracking-widest font-extrabold uppercase transition-colors ${isDark ? 'bg-[#121415] hover:bg-zinc-900 border-zinc-800 text-zinc-300' : 'bg-white hover:bg-gray-50 border-gray-200 text-gray-700'}`}
              >
                <SlidersHorizontal className="w-3 h-3 text-[#0066ff]" />
                <span>{sortBy === "FEATURED" ? "SORT BY: FEATURED" : `SORT: ${sortBy.replace(/_/g, " ")}`}</span>
                <ChevronDown className={`w-3 h-3 text-zinc-400 transition-transform ${activeDropdown === "sort" ? "rotate-180" : ""}`} />
              </button>

              {activeDropdown === "sort" && (
                <div className={`absolute right-0 mt-1 z-30 w-52 border shadow-2xl uppercase font-mono text-[10px] ${isDark ? 'bg-zinc-950 border-zinc-800' : 'bg-white border-gray-200'}`}>
                  {[
                    { label: "FEATURED BOLD", value: "FEATURED" },
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
        {searchQuery || selectedCategory !== "ALL" || selectedSize !== "ALL" || priceRange !== "ALL" ? (
          <div className={`mt-3 flex items-center justify-between font-mono text-[10px] tracking-widest px-4 py-2 border uppercase ${isDark ? 'bg-zinc-950 border-zinc-900/60 text-zinc-500' : 'bg-gray-50 border-gray-200 text-gray-500'}`}>
            <span>
              {language === "vi"
                ? `Tìm thấy ${filteredAndSortedProducts.length} trang bị phù hợp`
                : `Located ${filteredAndSortedProducts.length} performance SKU models`}
            </span>
            <button
              onClick={() => {
                setSearchQuery("");
                setSelectedCategory("ALL");
                setSelectedSize("ALL");
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
          <div className={`text-center py-24 border rounded-sm ${isDark ? 'bg-[#0e1011] border-zinc-900' : 'bg-gray-50 border-gray-200'}`}>
            <Ban className={`w-12 h-12 mx-auto mb-4 ${isDark ? 'text-zinc-700' : 'text-gray-300'}`} />
            <p className={`font-mono text-[11px] tracking-widest uppercase font-bold ${isDark ? 'text-zinc-400' : 'text-gray-500'}`}>
              {language === "vi"
                ? "Không tìm thấy trang bị thể thao nào phù hợp lựa chọn."
                : "No matching training equipment found in digital roster."}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 select-none">
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
                    
                    {/* Grayscale styled fitness image with subtle hover contrast boost */}
                    <img
                      src={p.image}
                      alt={p.name}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover filter brightness-[0.7] contrast-[1.1] grayscale group-hover:grayscale-0 group-hover:scale-105 duration-500 transition-all"
                    />

                    {/* Sold out overlay tag */}
                    {p.isSoldOut && (
                      <div className={`absolute top-4 left-4 z-10 border font-mono text-[9px] font-bold px-2 py-0.5 tracking-widest uppercase ${isDark ? 'bg-zinc-900 border-zinc-800 text-zinc-400' : 'bg-white border-gray-200 text-gray-500'}`}>
                        {language === "vi" ? "HẾT HÀNG" : "SOLD OUT"}
                      </div>
                    )}

                    {/* Best Seller Badge */}
                    {!p.isSoldOut && p.badge && (
                      <div className="absolute top-4 left-4 z-10 bg-[#0066ff] text-white font-mono text-[8px] font-extrabold px-2 py-0.5 tracking-widest uppercase">
                        {language === "vi" ? "BÁN CHẠY" : "BEST"}
                      </div>
                    )}

                    {/* Favorite Heart Icon Button */}
                    <button
                      onClick={(e) => toggleFavorite(p.id, e)}
                      className={`absolute top-4 right-4 z-10 p-2 border transition-all duration-200 ${
                        isDark ? 'bg-[#0c0f0f]/80 hover:bg-black hover:text-[#ff3355] text-zinc-400 border-zinc-800' : 'bg-white/80 hover:bg-white text-gray-400 hover:text-[#ff3355] border-gray-200'
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
                          QUICK VIEW
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Mid Title & Cost labels (Mockup details matches category placement) */}
                  <div className="p-4 flex flex-col justify-between flex-grow">
                    <div>
                      <span className="font-mono text-[9px] font-bold tracking-widest text-[#0066ff] uppercase block mb-1">
                        {p.category || "TRAINING"}
                      </span>
                      <h3 className={`font-montserrat text-xs font-bold tracking-wider transition-colors uppercase leading-tight mb-2 ${isDark ? 'text-[#eaeaea] group-hover:text-white' : 'text-gray-800 group-hover:text-black'}`}>
                        {p.name}
                      </h3>
                    </div>

                    <div className="flex items-center justify-between mt-4">
                      <span className={`font-mono text-sm font-extrabold ${isDark ? 'text-[#ffffff]' : 'text-gray-900'}`}>
                        {p.price}
                      </span>

                      {/* Dynamic Cart state circle add tracker button */}
                      {p.isSoldOut ? (
                        <button
                          disabled
                          className={`border p-2 rounded-full cursor-not-allowed ${isDark ? 'bg-zinc-950 border-zinc-850 text-zinc-700' : 'bg-gray-100 border-gray-200 text-gray-400'}`}
                          title="Temporarily unavailable"
                        >
                          <Ban className="w-3.5 h-3.5" />
                        </button>
                      ) : (
                        <button
                          onClick={(e) => handleQuickAdd(p, e)}
                          className={`hover:bg-[#0066ff] hover:text-white border hover:border-[#0066ff] p-2 rounded-full transition-all duration-200 cursor-pointer shadow-md ${
                            isDark ? 'bg-black text-zinc-300 border-zinc-800 shadow-black/40' : 'bg-white text-gray-700 border-gray-200 shadow-gray-200/50'
                          }`}
                          title="Add to workout gear"
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

        {/* 5. LOAD MORE GEAR BUTTON */}
        <div className="mt-12 text-center">
          <button
            onClick={() => {
              alert(
                language === "vi"
                  ? "Bạn đã xem toàn bộ danh mục sản phẩm nam Henry Fit Elite hiện tại."
                  : "All available static premium Men's SKUs are loaded."
              );
            }}
            className={`border hover:border-[#0066ff] hover:bg-[#0066ff]/5 font-montserrat text-[10px] font-extrabold tracking-[0.25em] py-3.5 px-10 transition-all uppercase rounded-none ${
              isDark ? 'border-[#424656]/50 bg-black text-zinc-300 hover:text-white' : 'border-gray-300 bg-white text-gray-600 hover:text-gray-900'
            }`}
          >
            {language === "vi" ? "TẢI THÊM TRANG BỊ" : "LOAD MORE GEAR"}
          </button>
        </div>
      </section>

      {/* 6. BLUE 'BUILT FOR PERFORMANCE' BANNER */}
      <section className="relative overflow-hidden w-full bg-[#0055ff]">
        {/* Subtle dynamic background grid pattern effect */}
        <div className="absolute inset-0 opacity-10 bg-[linear-gradient(to_right,#ffffff_1px,transparent_1px),linear-gradient(to_bottom,#ffffff_1px,transparent_1px)] bg-[size:28px_28px] pointer-events-none" />

        <div className="relative z-10 max-w-5xl mx-auto text-center px-6 py-16 flex flex-col items-center select-none">
          {/* Bolt icon */}
          <div className="bg-black text-[#0066ff] p-3 rounded-md mb-5 border border-blue-400/20">
            <Zap className="w-7 h-7 text-white fill-white" />
          </div>

          <h2 className="font-anton text-4xl sm:text-6xl tracking-widest text-white leading-none uppercase mb-4">
            {language === "vi" ? "THIẾT KẾ ĐỂ VƯỢT TRỘI" : "BUILT FOR PERFORMANCE"}
          </h2>

          <p className="font-montserrat text-xs sm:text-sm text-white/90 max-w-2xl mx-auto leading-relaxed tracking-widest font-normal mb-8">
            {language === "vi"
              ? "Mỗi mũi khâu, mỗi thớ sợi được các chuyên gia tinh chỉnh cốt để đứng vững trước áp suất và nhịp tập cao nhất. Hãy để trang bị của bạn gánh đỡ vạn năng."
              : "Every seam, every fiber engineered to withstand the most intense training sessions. Gear that works as hard as you do."}
          </p>

          <button
            onClick={() => {
              alert(
                language === "vi"
                  ? "Hệ thống: Thông tin kỹ thuật tản nhiệt Dry-Core và gia tốc lực nén cơ đã được gửi tới bảng điều hành!"
                  : "Performance Lab System: Tech specifications loaded successfully to telemetry console."
              );
            }}
            className="bg-black hover:bg-zinc-950 text-white font-montserrat text-xs font-bold tracking-[0.25em] py-4 px-8 border border-zinc-800 transition-all hover:scale-105 uppercase"
          >
            {language === "vi" ? "KHÁM PHÁ CÔNG NGHỆ" : "DISCOVER THE TECH"}
          </button>
        </div>
      </section>
    </div>
  );
}
