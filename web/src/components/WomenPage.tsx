import React, { useState, useMemo } from "react";
import { Search, ChevronDown, Heart, Plus, Ban, SlidersHorizontal, ArrowRight, Eye, Venus, Mars, Pill, Dumbbell, Zap, Star } from "lucide-react";
import { Product, CartItem } from "../types";
import { useProducts } from "../context/ProductContext";
import { useLanguage } from "../context/LanguageContext";

interface WomenPageProps {
  onOpenQuickView: (productId: string) => void;
  onAddToCart: (item: CartItem) => void;
  onNavigate?: (path: string) => void;
}

export default function WomenPage({ onOpenQuickView, onAddToCart, onNavigate }: WomenPageProps) {
  const { products: PRODUCTS } = useProducts();

  const { language, t } = useLanguage();

  // Search, Filter and Sort States
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedSubCategory, setSelectedSubCategory] = useState<string>("ALL");
  const [priceRange, setPriceRange] = useState<string>("ALL");
  const [sortBy, setSortBy] = useState<string>("FEATURED");

  // Favorites state
  const [favorites, setFavorites] = useState<Record<string, boolean>>({});

  // Dropdown UI visibility states
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);

  // Filter products belonging to Women's category (those starting with "women-")
  const womenProductsRaw = useMemo(() => {
    return PRODUCTS.filter((p) => (p.category === "Nữ" || p.category === "Women"));
  }, [PRODUCTS]);

  // Map translations for product dynamic info
  const womenProducts = useMemo(() => {
    return womenProductsRaw.map((p) => {
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
  }, [womenProductsRaw, t, language]);

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
      size: "M", // Default to M size for apparel
      quantity: 1,
    });
  };

  // Live filter and sorting calculation
  const filteredAndSortedProducts = useMemo(() => {
    let result = [...womenProducts];

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
      result = result.filter((p) => p.category?.toUpperCase() === selectedSubCategory.toUpperCase());
    }

    // Price Filter
    if (priceRange !== "ALL") {
      if (priceRange === "UNDER_100") {
        result = result.filter((p) => p.priceNum <= 100);
      } else if (priceRange === "OVER_100") {
        result = result.filter((p) => p.priceNum > 100);
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
      // Sort with newest women releases first
      result.sort((a, b) => (b.id === "women-stealth-set" ? 1 : -1));
    }

    return result;
  }, [womenProducts, searchQuery, selectedSubCategory, priceRange, sortBy]);

  const toggleDropdown = (dropdown: string) => {
    setActiveDropdown((prev) => (prev === dropdown ? null : dropdown));
  };

  const handleSidebarClick = (e: React.MouseEvent, path: string) => {
    e.preventDefault();
    if (onNavigate) {
      onNavigate(path);
    }
  };

  const handleAnchorClick = (e: React.MouseEvent, anchor: string) => {
    e.preventDefault();
    if (onNavigate) {
      onNavigate("/");
      setTimeout(() => {
        const target = document.querySelector(anchor);
        if (target) {
          target.scrollIntoView({ behavior: "smooth", block: "start" });
        }
      }, 300);
    }
  };

  return (
    <div className="bg-black text-white min-h-screen font-sans selection:bg-[#0066ff] selection:text-white">
      {/* 1. HERO HEADER */}
      <section className="relative h-[65vh] min-h-[500px] w-full flex items-center justify-center overflow-hidden border-b border-zinc-900">
        {/* Background Image Grayscale Overlay */}
        <div className="absolute inset-0 z-0">
          <img
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuCCtPvcN9DwnfHzVzVJhMUa1VZ8uAdbM8PP4WTOYa36EQh6UtX-Z19G1fDW_N8mMRZZfHbvspCTS1SN9Qr1LfMkzdr1kIZaROadshPdkUSauUY9RQNGSmiJ8kEDbvDM4aCSYzL-C_9ZXbUJhWZ46lJfPoh6kQ0DB99AvCOLjBqSbiC6QBfTkee2z7UVZVJ169Wv6vZuQrhcb7wXVAXTPt4XTH8x-vW3RA1ZyKASqR6UmqMTexwHChwL7B30NKeH6Qe4sta5AokuRHN8"
            alt="Women Collection Performance Fitness Wear"
            className="w-full h-full object-cover filter brightness-[0.35] contrast-[1.1] grayscale hover:scale-105 transition-transform duration-1000"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black/65" />
        </div>

        {/* Content Box */}
        <div className="relative z-10 max-w-4xl mx-auto px-6 text-center select-none flex flex-col items-center">
          <h1 className="font-anton text-6xl md:text-9xl tracking-tighter text-white leading-none uppercase mb-2">
            WOMEN
          </h1>
          <p className="font-montserrat text-xs md:text-sm text-zinc-400 uppercase tracking-[0.25em] border-l-4 border-[#0066ff] pl-3 text-left inline-block mt-2">
            {language === "vi" ? "THIẾT KẾ ĐỂ TỰ TIN" : "ENGINEERED FOR CONFIDENCE"}
          </p>
        </div>
      </section>

      {/* 2. MAIN LAYOUT WITH SIDEBAR */}
      <div className="max-w-[1600px] mx-auto px-6 md:px-16 py-16 flex flex-col lg:flex-row gap-8">
        
        {/* Sidebar Categories (Desktop Only for sub-nav feeling) */}
        <aside className="hidden lg:flex flex-col w-64 shrink-0 bg-zinc-950/30 border-r border-zinc-900/50 h-max sticky top-32 py-8 pr-6">
          <div className="px-4 mb-8 border-l-4 border-[#0066ff] pl-4 ml-1">
            <h2 className="font-anton text-2xl text-[#b3c5ff] tracking-wider uppercase mb-1">
              HENRY FIT
            </h2>
            <p className="font-montserrat text-[9px] font-extrabold text-zinc-500 uppercase tracking-widest">
              {language === "vi" ? "HIỆU NĂNG ƯU VIỆT" : "ELITE PERFORMANCE"}
            </p>
          </div>
          
          <nav className="flex flex-col gap-1">
            <a
              href="/men"
              onClick={(e) => handleSidebarClick(e, "/men")}
              className="flex items-center gap-3.5 px-4 py-3 text-zinc-400 hover:text-white hover:bg-zinc-900/50 transition-colors group uppercase font-mono text-[10px] tracking-widest font-extrabold"
            >
              <Mars className="w-3.5 h-3.5 text-zinc-500 group-hover:text-[#0066ff] transition-colors" />
              <span>{language === "vi" ? "Nam" : "Men"}</span>
            </a>
            
            <a
              href="/women"
              onClick={(e) => e.preventDefault()}
              className="flex items-center gap-3.5 px-4 py-3 bg-[#0066ff] text-white font-extrabold transition-transform group uppercase font-mono text-[10px] tracking-widest"
            >
              <Venus className="w-3.5 h-3.5 text-white" />
              <span>{language === "vi" ? "Nữ" : "Women"}</span>
            </a>
            
            <a
              href="/accessories"
              onClick={(e) => handleSidebarClick(e, "/accessories")}
              className="flex items-center gap-3.5 px-4 py-3 text-zinc-400 hover:text-white hover:bg-zinc-900/50 transition-colors group uppercase font-mono text-[10px] tracking-widest font-extrabold"
            >
              <Dumbbell className="w-3.5 h-3.5 text-zinc-500 group-hover:text-[#0066ff] transition-colors" />
              <span>{language === "vi" ? "Phụ kiện" : "Accessories"}</span>
            </a>
            
            <a
              href="/supplements"
              onClick={(e) => handleSidebarClick(e, "/supplements")}
              className="flex items-center gap-3.5 px-4 py-3 text-zinc-400 hover:text-white hover:bg-zinc-900/50 transition-colors group uppercase font-mono text-[10px] tracking-widest font-extrabold"
            >
              <Pill className="w-3.5 h-3.5 text-zinc-500 group-hover:text-[#0066ff] transition-colors" />
              <span>{language === "vi" ? "Thực phẩm bổ sung" : "Supplements"}</span>
            </a>
            
            <a
              href="/new-arrivals"
              onClick={(e) => { e.preventDefault(); onNavigate("/new-arrivals"); }}
              className="flex items-center gap-3.5 px-4 py-3 text-zinc-400 hover:text-white hover:bg-zinc-900/50 transition-colors group uppercase font-mono text-[10px] tracking-widest font-extrabold"
            >
              <Zap className="w-3.5 h-3.5 text-zinc-500 group-hover:text-[#0066ff] transition-colors" />
              <span>{language === "vi" ? "Hàng mới về" : "New Arrivals"}</span>
            </a>
            
            <a
              href="/best-sellers"
              onClick={(e) => { e.preventDefault(); onNavigate("/best-sellers"); }}
              className="flex items-center gap-3.5 px-4 py-3 text-zinc-400 hover:text-white hover:bg-zinc-900/50 transition-colors group uppercase font-mono text-[10px] tracking-widest font-extrabold"
            >
              <Star className="w-3.5 h-3.5 text-zinc-500 group-hover:text-[#0066ff] transition-colors" />
              <span>{language === "vi" ? "Bán chạy nhất" : "Best Sellers"}</span>
            </a>
          </nav>
        </aside>

        {/* Product Canvas */}
        <div className="flex-grow flex flex-col gap-12">
          
          {/* SEARCH & INTERACTIVE FILTER ROW */}
          <div className="border border-zinc-900 bg-zinc-950/20 p-4 flex flex-col md:flex-row items-center justify-between gap-4 select-none">
            
            {/* Search Input Box */}
            <div className="relative w-full md:w-80">
              <span className="absolute inset-y-0 left-3.5 flex items-center pointer-events-none">
                <Search className="h-3.5 w-3.5 text-zinc-500" />
              </span>
              <input
                type="text"
                placeholder={language === "vi" ? "Tìm trang phục nữ..." : "Search women's apparel..."}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-black border border-zinc-900 pl-10 pr-4 py-2 text-zinc-300 placeholder-zinc-600 focus:outline-none focus:border-[#0066ff]/60 font-mono text-[10px] tracking-widest uppercase transition-all rounded-none"
              />
            </div>

            {/* Filter Dropdowns group */}
            <div className="flex flex-wrap items-center gap-3 w-full md:w-auto justify-end">
              
              {/* Dropdown CATEGORY */}
              <div className="relative">
                <button
                  onClick={() => toggleDropdown("category")}
                  className="flex items-center gap-2 bg-[#121415] hover:bg-zinc-900 border border-zinc-900 px-4 py-2.5 font-mono text-[10px] tracking-widest font-extrabold uppercase transition-colors rounded-none"
                >
                  <span>
                    {language === "vi" ? "PHÂN LOẠI" : "CATEGORY"}: {selectedSubCategory}
                  </span>
                  <ChevronDown className={`w-3 h-3 text-zinc-400 transition-transform ${activeDropdown === "category" ? "rotate-180" : ""}`} />
                </button>

                {activeDropdown === "category" && (
                  <div className="absolute right-0 mt-1 z-30 w-48 bg-zinc-950 border border-zinc-900 shadow-2xl uppercase font-mono text-[10px]">
                    {["ALL", "LEGGINGS", "SPORTS BRAS", "SETS", "JACKETS", "SHORTS", "TANKS"].map((cat) => (
                      <button
                        key={cat}
                        onClick={() => {
                          setSelectedSubCategory(cat);
                          setActiveDropdown(null);
                        }}
                        className={`w-full text-left px-4 py-2.5 border-b border-zinc-900 last:border-0 transition-colors ${
                          selectedSubCategory === cat ? "text-[#0066ff] bg-zinc-900" : "text-zinc-400 hover:text-white"
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
                  className="flex items-center gap-2 bg-black hover:bg-zinc-900 border border-zinc-900 px-4 py-2.5 font-mono text-[10px] tracking-widest font-extrabold uppercase transition-colors rounded-none"
                >
                  <span>
                    {language === "vi" ? "MỨC GIÁ" : "PRICE"}:{" "}
                    {priceRange === "ALL"
                      ? "ALL"
                      : priceRange === "UNDER_100"
                      ? "<= $100"
                      : "> $100"}
                  </span>
                  <ChevronDown className={`w-3 h-3 text-zinc-400 transition-transform ${activeDropdown === "price" ? "rotate-180" : ""}`} />
                </button>

                {activeDropdown === "price" && (
                  <div className="absolute right-0 mt-1 z-30 w-48 bg-zinc-950 border border-zinc-900 shadow-2xl uppercase font-mono text-[10px]">
                    {[
                      { label: "ALL PRICES", value: "ALL" },
                      { label: "UNDER $100", value: "UNDER_100" },
                      { label: "ABOVE $100", value: "OVER_100" },
                    ].map((pr) => (
                      <button
                        key={pr.value}
                        onClick={() => {
                          setPriceRange(pr.value);
                          setActiveDropdown(null);
                        }}
                        className={`w-full text-left px-4 py-2.5 border-b border-zinc-900 last:border-0 transition-colors ${
                          priceRange === pr.value ? "text-[#0066ff] bg-zinc-900" : "text-zinc-400 hover:text-white"
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
                  className="flex items-center gap-2 bg-[#121415] hover:bg-zinc-900 border border-zinc-900 text-zinc-300 px-4 py-2.5 font-mono text-[10px] tracking-widest font-extrabold uppercase transition-colors rounded-none"
                >
                  <SlidersHorizontal className="w-3 h-3 text-[#0066ff]" />
                  <span>{sortBy === "FEATURED" ? "SORT BY: FEATURED" : `SORT: ${sortBy.replace(/_/g, " ")}`}</span>
                  <ChevronDown className={`w-3 h-3 text-zinc-400 transition-transform ${activeDropdown === "sort" ? "rotate-180" : ""}`} />
                </button>

                {activeDropdown === "sort" && (
                  <div className="absolute right-0 mt-1 z-30 w-52 bg-zinc-950 border border-zinc-900 shadow-2xl uppercase font-mono text-[10px]">
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
                        className={`w-full text-left px-4 py-2.5 border-b border-zinc-900 last:border-0 transition-colors ${
                          sortBy === item.value ? "text-[#0066ff] bg-zinc-900" : "text-zinc-400 hover:text-white"
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

          {/* Filters results counter */}
          {searchQuery || selectedSubCategory !== "ALL" || priceRange !== "ALL" || sortBy !== "FEATURED" ? (
            <div className="-mt-8 flex items-center justify-between text-zinc-500 font-mono text-[10px] tracking-widest bg-zinc-950 px-4 py-2 border border-zinc-900 uppercase">
              <span>
                {language === "vi"
                  ? `Tìm thấy ${filteredAndSortedProducts.length} trang phục luyện tập`
                  : `Located ${filteredAndSortedProducts.length} premium training assets`}
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

          {/* PRODUCTS DISPLAY GRID */}
          <div>
            {filteredAndSortedProducts.length === 0 ? (
              <div className="text-center py-24 bg-[#0e1011] border border-zinc-900 rounded-none">
                <Ban className="w-12 h-12 text-zinc-700 mx-auto mb-4" />
                <p className="font-mono text-[11px] tracking-widest text-zinc-400 uppercase font-bold">
                  {language === "vi"
                    ? "Không tìm thấy trang phục rèn luyện phù hợp lựa chọn."
                    : "No matching training apparel found in roster."}
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6 select-none animate-fade-in">
                {filteredAndSortedProducts.map((p) => {
                  const isFav = favorites[p.id] || false;
                  return (
                    <div
                      key={p.id}
                      onClick={() => onOpenQuickView(p.id)}
                      className="group relative cursor-pointer bg-black/40 hover:bg-black border border-zinc-900 hover:border-[#0066ff]/40 transition-all duration-300 flex flex-col justify-between"
                      style={{ minHeight: "410px" }}
                    >
                      {/* Top Image & badges zone */}
                      <div className="relative w-full aspect-[3/4] bg-[#101213] overflow-hidden flex items-center justify-center">
                        
                        {/* Grayscale styled image with subtle hover contrast boost */}
                        <img
                          src={p.image}
                          alt={p.name}
                          referrerPolicy="no-referrer"
                          className="w-full h-full object-cover filter brightness-[0.75] contrast-[1.1] grayscale group-hover:grayscale-0 group-hover:scale-105 duration-500 transition-all"
                        />

                        {/* Sold out overlay tag */}
                        {p.isSoldOut && (
                          <div className="absolute top-4 left-4 z-10 bg-zinc-900 border border-zinc-800 text-zinc-400 font-mono text-[9px] font-bold px-2 py-0.5 tracking-widest uppercase">
                            {language === "vi" ? "HẾT HÀNG" : "SOLD OUT"}
                          </div>
                        )}

                        {/* Promotional badge tag */}
                        {!p.isSoldOut && p.badge && (
                          <div className="absolute top-4 left-4 z-10 bg-[#0066ff] text-white font-mono text-[9px] font-extrabold px-2.5 py-1 uppercase tracking-widest">
                            {p.badge}
                          </div>
                        )}

                        {/* Floating Action Overlay on top of image */}
                        <div className="absolute top-4 right-4 z-20 flex flex-col gap-2">
                          {/* Favorite heart icon */}
                          <button
                            onClick={(e) => toggleFavorite(p.id, e)}
                            className={`p-2 rounded-none border border-zinc-800/80 transition-colors ${
                              isFav ? "bg-red-950 text-red-500 border-red-900/60" : "bg-black/75 text-zinc-400 hover:text-white"
                            }`}
                            title="Shortlist asset"
                          >
                            <Heart className={`w-3.5 h-3.5 ${isFav ? "fill-red-500" : ""}`} />
                          </button>

                          {/* Quick view inspector */}
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              onOpenQuickView(p.id);
                            }}
                            className="p-2 rounded-none bg-black/75 border border-zinc-800/80 text-zinc-400 hover:text-white transition-colors"
                            title="Examine Specs"
                          >
                            <Eye className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>

                      {/* Info & pricing zone */}
                      <div className="p-6 flex flex-col justify-between flex-grow bg-gradient-to-b from-transparent to-zinc-950/20">
                        <div>
                          {/* Category and tag line */}
                          <div className="flex items-center gap-1.5 mb-1 text-zinc-500 font-mono text-[9px] tracking-wider uppercase font-extrabold">
                            <span>{p.category || "APPAREL"}</span>
                            <span>•</span>
                            <span className="text-[#0066ff]">FIT PROTOCOL</span>
                          </div>

                          <h3 className="font-anton text-xl tracking-wide text-white uppercase group-hover:text-[#0066ff] transition-colors line-clamp-1 mb-2">
                            {p.name}
                          </h3>

                          <p className="font-sans text-xs text-zinc-400 leading-relaxed font-light line-clamp-2">
                            {p.description}
                          </p>
                        </div>

                        {/* Footer card row with price and quick add trigger */}
                        <div className="mt-5 pt-4 border-t border-zinc-900/40 flex items-center justify-between">
                          <span className="font-anton text-lg tracking-wider text-white">
                            {p.price}
                          </span>

                          <button
                            disabled={p.isSoldOut}
                            onClick={(e) => handleQuickAdd(p, e)}
                            className={`flex items-center justify-center gap-1.5 px-4 py-2 border transition-colors font-mono text-[9px] font-extrabold tracking-widest uppercase rounded-none cursor-pointer ${
                              p.isSoldOut
                                ? "bg-zinc-950 border-zinc-900 text-zinc-600 cursor-not-allowed"
                                : "bg-transparent hover:bg-white text-white hover:text-black border-white hover:border-white"
                            }`}
                          >
                            <Plus className="w-3 h-3" />
                            <span>{language === "vi" ? "THÊM PAYLOAD" : "ADD TO CART"}</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* 5. MARKETING BANNER */}
          <div className="relative w-full bg-zinc-950 border border-zinc-900 p-8 md:p-16 flex flex-col items-center justify-center text-center overflow-hidden my-6">
            <div
              className="absolute inset-0 bg-cover bg-center opacity-40 z-0 filter brightness-[0.4]"
              style={{
                backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuBu0GvLdNJ15GvgzqwruFFii54wPJS2dqYIhX9jVh0LkKfdBzoz-BRD_hHpVujTYx1iFu3LGAKf8LI8EOuzEYNvcGXxRqIFWvtNIXhuFrRXPZdOFqbuNhikcsZrcbTWPvXpiN01NNA9-2cHPib7NDYKCIO1yzBP9hVEoGa2axY2wAVPlsV8DiJQ3b6CnnKLsM5iWjvQXaxuyID7Gh815G-V6wb80Y1E61qWTfwB07Zok6hbfYsGwL1WIeKk7v-d-XJq0J5KynBVbWyu')",
              }}
            />
            <div className="absolute inset-0 bg-gradient-to-r from-black via-transparent to-black opacity-90 z-0" />

            <div className="relative z-10 max-w-3xl flex flex-col items-center select-none">
              <h2 className="font-anton text-4xl md:text-6xl text-white tracking-widest uppercase mb-4 leading-tight mix-blend-exclusion">
                TRAIN HARDER.
                <br />
                RECOVER FASTER.
              </h2>
              <p className="font-sans text-xs md:text-sm text-zinc-400 mb-8 max-w-xl mx-auto border-t border-zinc-900 pt-4 leading-relaxed tracking-wider font-light uppercase">
                {language === "vi"
                  ? "Trang phục rèn luyện đỉnh cao thiết kế để chịu đựng các buổi tập khắc nghiệt và thúc đẩy nhanh phục hồi cơ bắp."
                  : "Elite performance wear engineered to withstand the most brutal training sessions and accelerate post-workout recovery."}
              </p>
              <button
                onClick={(e) => {
                  e.preventDefault();
                  setSelectedSubCategory("ALL");
                  const gridNode = document.getElementById("acc-products-grid");
                  if (gridNode) {
                    gridNode.scrollIntoView({ behavior: "smooth", block: "start" });
                  }
                }}
                className="bg-[#0066ff] hover:bg-[#0055dd] text-white font-montserrat text-[10px] font-extrabold tracking-[0.25em] py-3.5 px-8 transition-all hover:scale-105 duration-300 shadow-xl shadow-blue-900/30 flex items-center gap-2 rounded-none"
              >
                <span>{language === "vi" ? "MUA BỘ PHỤC HỒI" : "SHOP RECOVERY"}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
