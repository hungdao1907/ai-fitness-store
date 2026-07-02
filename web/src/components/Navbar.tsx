/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo } from "react";
import { ShoppingCart, Menu, X, Trash2, Search, Plus, Minus, Loader2, User, Sun, Moon, ShieldCheck } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { CartItem, Product } from "../types";
import { useLanguage } from "../context/LanguageContext";
import { useProducts } from "../context/ProductContext";
import { useTheme } from "../context/ThemeContext";

interface NavbarProps {
  cart: CartItem[];
  onRemoveFromCart: (id: string, size: string) => void;
  onUpdateCartQty: (id: string, size: string, change: number) => void;
  onClearCart: () => void;
  onOpenAdvice: () => void;
  onOpenQuickView: (productId: string) => void;
  onNavigate: (path: string) => void;
  currentPath: string;
  onAddToCart: (product: Product, size: string) => void;
  memberSession: {name: string, email: string} | null;
  onMemberLogout: () => void;
}

export default function Navbar({
  cart,
  onRemoveFromCart,
  onUpdateCartQty,
  onClearCart,
  onOpenAdvice,
  onOpenQuickView,
  onNavigate,
  currentPath,
  onAddToCart,
  memberSession,
  onMemberLogout
}: NavbarProps) {
  const { products: PRODUCTS } = useProducts();
  const { language, setLanguage, t } = useLanguage();
  const { isDark, toggleTheme } = useTheme();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  
  // Search local states
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const cartCount = cart.reduce((acc, item) => acc + item.quantity, 0);
  const cartTotal = cart.reduce(
    (acc, item) => acc + item.product.priceNum * item.quantity,
    0
  );

  const handleCheckout = () => {
    setIsCheckingOut(true);
    setTimeout(() => {
      setIsCheckingOut(false);
      onClearCart();
      setIsCartOpen(false);
      alert(
        language === "vi"
          ? "Hệ thống Henry Fit: Giao dịch giả lập thành công! Cảm ơn bạn đã trải nghiệm."
          : "Henry Fit Labs: Secure Checkout Simulated Successfully! Thank you for testing."
      );
    }, 1500);
  };

  // Nav Links map
  const navLinks = [
    { name: t.nav.men, href: "/men" },
    { name: t.nav.women, href: "/women" },
    { name: t.nav.accessories, href: "/accessories" },
    { name: t.nav.supplements, href: "/supplements" },
    { name: t.nav.newArrivals, href: "/new-arrivals" },
    { name: t.nav.bestSellers, href: "/best-sellers" },
  ];

  // Dynamic products list mapped for current language
  const translatedProducts = useMemo(() => {
    return PRODUCTS.map((p) => {
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
  }, [t]);

  // Filter products by search query
  const searchResults = useMemo(() => {
    if (!searchQuery.trim()) return [];
    const query = searchQuery.toLowerCase().trim();
    return translatedProducts.filter(
      (p) =>
        p.name.toLowerCase().includes(query) ||
        p.description.toLowerCase().includes(query)
    );
  }, [searchQuery, translatedProducts]);

  const handleLinkClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    setIsMobileMenuOpen(false);

    if (href.startsWith("/")) {
      onNavigate(href);
      return;
    }

    // If we are currently on a sub-route, navigate back to home with the anchor
    if (currentPath !== "/") {
      onNavigate("/");
      setTimeout(() => {
        const target = document.querySelector(href);
        if (target) {
          target.scrollIntoView({ behavior: "smooth", block: "start" });
        }
      }, 300);
    } else {
      const target = document.querySelector(href);
      if (target) {
        target.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    }
  };

  const handleLogoClick = (e: React.MouseEvent) => {
    e.preventDefault();
    onNavigate("/");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <>
      <nav
        className={`sticky top-0 z-40 w-full border-b transition-all ${isDark ? 'bg-[#121414] border-[#424656]/20' : 'bg-white border-gray-200 shadow-sm'}`}
      >
        <div className="max-w-7xl mx-auto px-6 md:px-16 flex items-center justify-between h-20">
          {/* Logo Brand */}
          <a
            href="/"
            onClick={handleLogoClick}
            className={`font-anton text-3xl tracking-tighter hover:opacity-80 transition-colors uppercase select-none h-fit pt-1 cursor-pointer ${isDark ? 'text-[#b3c5ff]' : 'text-[#0066ff]'}`}
          >
            HENRY FIT
          </a>

          {/* Desktop Links */}
          <div className="hidden lg:flex items-center gap-6">
            {navLinks.map((link, idx) => (
              <a
                key={idx}
                href={link.href}
                onClick={(e) => handleLinkClick(e, link.href)}
                className={`font-montserrat text-[11px] font-bold tracking-wider whitespace-nowrap uppercase transition-colors ${isDark ? 'text-[#e2e2e2] hover:text-[#0066ff]' : 'text-gray-700 hover:text-[#0066ff]'}`}
              >
                {link.name}
              </a>
            ))}
          </div>

          {/* Actions & Language selectors */}
          <div className="hidden lg:flex items-center gap-4">
            {/* Theme toggle */}
            <button
              onClick={toggleTheme}
              className={`p-2 rounded-full transition-colors ${isDark ? 'text-yellow-400 hover:bg-white/10' : 'text-gray-600 hover:bg-gray-100'}`}
              title={isDark ? 'Light Mode' : 'Dark Mode'}
            >
              {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>

            {/* User Login */}
            {memberSession ? (
              <div className="flex items-center gap-3">
                <div className={`font-montserrat text-[11px] font-bold tracking-wider ${isDark ? 'text-[#b3c5ff]' : 'text-[#0066ff]'}`}>
                  {language === "en" ? "Hi, " : "Chào, "}{memberSession.name.split(' ')[0]}
                </div>
                <button
                  onClick={onMemberLogout}
                  className={`text-[10px] uppercase font-bold tracking-wider transition-colors ${isDark ? 'text-zinc-500 hover:text-white' : 'text-gray-500 hover:text-gray-900'}`}
                >
                  {language === "en" ? "Logout" : "Thoát"}
                </button>
              </div>
            ) : (
              <button
                onClick={() => onNavigate('/admin')}
                className={`flex items-center gap-2 transition-colors ${isDark ? 'text-[#b3c5ff] hover:text-white' : 'text-[#0066ff] hover:text-blue-800'}`}
                title={language === "en" ? "Login" : "Đăng nhập"}
              >
                <User className="w-5 h-5" />
                <span className="font-montserrat text-[11px] font-bold tracking-wider uppercase hidden xl:block whitespace-nowrap">
                  {language === "en" ? "Login" : "Đăng nhập"}
                </span>
              </button>
            )}

            {/* Language select buttons */}
            <div className={`flex items-center gap-1 p-1 border ${isDark ? 'bg-black border-[#424656]/30' : 'bg-gray-100 border-gray-300'}`}>
              <button
                onClick={() => setLanguage("en")}
                className={`px-2 py-1 font-mono text-[10px] font-bold tracking-wider uppercase transition-all ${
                  language === "en"
                    ? "bg-[#0066ff] text-white"
                    : isDark ? "text-zinc-500 hover:text-white" : "text-gray-500 hover:text-gray-900"
                }`}
                title="English language preference"
              >
                EN
              </button>
              <button
                onClick={() => setLanguage("vi")}
                className={`px-2 py-1 font-mono text-[10px] font-bold tracking-wider uppercase transition-all ${
                  language === "vi"
                    ? "bg-[#0066ff] text-white"
                    : isDark ? "text-zinc-500 hover:text-white" : "text-gray-500 hover:text-gray-900"
                }`}
                title="Lựa chọn Tiếng Việt"
              >
                VI
              </button>
            </div>

            {/* Search toggler */}
            <button
              onClick={() => setIsSearchOpen(true)}
              className={`p-2.5 transition-colors cursor-pointer ${isDark ? 'text-[#b3c5ff] hover:bg-neutral-800/40 hover:text-white' : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'}`}
              title={t.nav.search}
            >
              <Search className="w-5 h-5" />
            </button>

            {/* Cart Icon Badge */}
            <button
              id="cart-button"
              onClick={() => setIsCartOpen(!isCartOpen)}
              className={`relative p-2.5 transition-colors cursor-pointer ${isDark ? 'text-[#b3c5ff] hover:bg-neutral-800/40 hover:text-white' : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'}`}
              title={t.nav.cart}
            >
              <ShoppingCart className="w-5 h-5" />
              {cartCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 w-[18px] h-[18px] flex items-center justify-center bg-[#0066ff] text-white font-montserrat text-[10px] font-extrabold rounded-none">
                  {cartCount}
                </span>
              )}
            </button>
          </div>

          {/* Mobile Right Bar */}
          <div className="flex lg:hidden items-center gap-2">
            {/* Theme toggle mobile */}
            <button
              onClick={toggleTheme}
              className={`p-1.5 rounded-full ${isDark ? 'text-yellow-400' : 'text-gray-600'}`}
            >
              {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>

            {/* User Login Mobile */}
            {memberSession ? (
              <button
                onClick={onMemberLogout}
                className={`p-1 transition-colors ${isDark ? 'text-[#b3c5ff] hover:text-white' : 'text-[#0066ff] hover:text-blue-800'}`}
                title={language === "en" ? "Logout" : "Đăng xuất"}
              >
                <User className="w-5 h-5" />
              </button>
            ) : (
              <button
                onClick={() => {
                  onNavigate('/admin');
                  setIsMobileMenuOpen(false);
                }}
                className={`p-1 transition-colors ${isDark ? 'text-[#b3c5ff] hover:text-white' : 'text-[#0066ff] hover:text-blue-800'}`}
                title={language === "en" ? "Login" : "Đăng nhập"}
              >
                <User className="w-5 h-5" />
              </button>
            )}

            {/* Language selectors simple */}
            <div className="flex items-center gap-0.5 bg-black p-0.5 border border-[#424656]/30 mr-1">
              <button
                onClick={() => setLanguage("en")}
                className={`px-1.5 py-0.5 font-mono text-[9px] font-bold uppercase ${
                  language === "en" ? "bg-[#0066ff] text-white" : "text-zinc-500"
                }`}
              >
                EN
              </button>
              <button
                onClick={() => setLanguage("vi")}
                className={`px-1.5 py-0.5 font-mono text-[9px] font-bold uppercase ${
                  language === "vi" ? "bg-[#0066ff] text-white" : "text-zinc-500"
                }`}
              >
                VI
              </button>
            </div>

            <button
              onClick={() => setIsSearchOpen(true)}
              className="p-2 text-[#b3c5ff]"
              title={t.nav.search}
            >
              <Search className="w-5 h-5" />
            </button>

            <button
              onClick={() => setIsCartOpen(!isCartOpen)}
              className="relative p-2 text-[#b3c5ff] focus:outline-none"
              title={t.nav.cart}
            >
              <ShoppingCart className="w-5 h-5" />
              {cartCount > 0 && (
                <span className="absolute top-0 right-0 w-4 h-4 flex items-center justify-center bg-[#0066ff] text-white font-montserrat text-[9px] font-bold">
                  {cartCount}
                </span>
              )}
            </button>
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 text-[#e2e2e2] hover:text-white focus:outline-none"
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Slide-out Navigation Drawer */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMobileMenuOpen(false)}
              className="fixed inset-0 z-40 bg-black/80 backdrop-blur-sm lg:hidden"
            />

            {/* Sidebar drawer */}
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "tween", duration: 0.3 }}
              className="fixed right-0 top-0 bottom-0 z-50 w-80 max-w-full bg-[#121414] border-l border-[#424656]/30 px-6 py-20 flex flex-col justify-between lg:hidden shadow-2xl"
            >
              <button
                onClick={() => setIsMobileMenuOpen(false)}
                className="absolute top-5 right-6 p-2 text-white/70 hover:text-white"
              >
                <X className="w-6 h-6" />
              </button>

              <div className="flex flex-col gap-6 mt-8">
                {navLinks.map((link, idx) => (
                  <a
                    key={idx}
                    href={link.href}
                    onClick={(e) => handleLinkClick(e, link.href)}
                    className="font-montserrat text-base font-bold tracking-widest text-[#e2e2e2] hover:text-[#0066ff] transition-colors py-2 border-b border-[#333535]/30 uppercase"
                  >
                    {link.name}
                  </a>
                ))}
                <button
                  onClick={() => {
                    setIsMobileMenuOpen(false);
                    onNavigate("/chatbot");
                  }}
                  className="w-full mt-4 bg-[#0066ff] py-3 text-white font-montserrat text-xs font-bold tracking-widest uppercase text-center"
                >
                  {t.nav.chatbot}
                </button>
              </div>

              <div className="text-center font-mono text-[9px] text-[#c2c6d8]/40 uppercase tracking-widest">
                HENRY FIT LABS BILINGUAL DEV
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Cart Drawer */}
      <AnimatePresence>
        {isCartOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsCartOpen(false)}
              className="fixed inset-0 z-40 bg-black/80 backdrop-blur-sm"
            />

            {/* Drawer */}
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "tween", duration: 0.3 }}
              className="fixed right-0 top-0 bottom-0 z-50 w-96 max-w-full bg-[#121414] border-l border-[#424656]/30 flex flex-col shadow-2xl"
            >
              {/* Header */}
              <div className="p-6 border-b border-[#424656]/20 flex items-center justify-between">
                <h3 className="font-montserrat text-lg font-extrabold text-white tracking-widest uppercase">
                  {language === "vi" ? "GIỎ HÀNG THIẾT BỊ" : "CONCORDANCE CORE (CART)"}
                </h3>
                <button
                  onClick={() => setIsCartOpen(false)}
                  className="p-1.5 text-white/70 hover:text-white transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Items List */}
              <div className="flex-1 overflow-y-auto p-6 flex flex-col gap-4">
                {cart.length === 0 ? (
                  <div className="flex-1 flex flex-col items-center justify-center text-center opacity-70 py-20">
                    <ShoppingCart className="w-12 h-12 text-[#b3c5ff] mb-4 stroke-1" />
                    <p className="font-montserrat text-xs tracking-wider uppercase text-[#e2e2e2] font-semibold">
                      {language === "vi" ? "CHƯA NẠP THIẾT BỊ HOẠT ĐỘNG" : "NO ACTIVE HARDWARE LOADED"}
                    </p>
                    <p className="text-xs text-[#c2c6d8] mt-1 pr-6 pl-6 leading-relaxed">
                      {t.nav.cartEmpty}
                    </p>
                  </div>
                ) : (
                  cart.map((item, idx) => {
                    // Check localized name mapping
                    const mappedName =
                      t.products[item.product.id as keyof typeof t.products]?.name ||
                      item.product.name;

                    return (
                      <div
                        key={`${item.product.id}-${item.size}-${idx}`}
                        className="bg-[#1e2020] p-4 flex gap-4 border border-[#424656]/10 relative group"
                      >
                        <div className="w-16 h-16 bg-black p-1 flex items-center justify-center self-center shrink-0 border border-[#333535]">
                          <img
                            src={item.product.image}
                            alt={mappedName}
                            className="max-h-full max-w-full object-contain"
                          />
                        </div>
                        <div className="flex-1 min-w-0 pr-6">
                          <h4 className="font-montserrat text-xs font-extrabold text-white uppercase tracking-wider truncate">
                            {mappedName}
                          </h4>
                          <p className="font-mono text-[9px] text-[#ffb0ce] font-bold mt-0.5 uppercase">
                            {t.nav.size}: {item.size}
                          </p>

                          {/* Interactive Plus / Minus change quantity row */}
                          <div className="flex items-center gap-2 mt-2">
                            <button
                              onClick={() => {
                                if (item.quantity > 1) {
                                  onUpdateCartQty(item.product.id, item.size, -1);
                                } else {
                                  onRemoveFromCart(item.product.id, item.size);
                                }
                              }}
                              className="p-1 bg-black border border-[#424656]/30 text-white/70 hover:text-white"
                              title="Decrease quantity"
                            >
                              <Minus className="w-3 h-3" />
                            </button>
                            <span className="font-mono text-xs text-white font-bold px-1.5">
                              {item.quantity}
                            </span>
                            <button
                              onClick={() => {
                                onUpdateCartQty(item.product.id, item.size, 1);
                              }}
                              className="p-1 bg-black border border-[#424656]/30 text-white/70 hover:text-white"
                              title="Increase quantity"
                            >
                              <Plus className="w-3 h-3" />
                            </button>
                          </div>

                          <p className="font-mono text-xs text-[#b3c5ff] font-extrabold mt-1.5">
                            {item.product.price}
                          </p>
                        </div>

                        {/* Delete Trash icon */}
                        <button
                          onClick={() => onRemoveFromCart(item.product.id, item.size)}
                          className="absolute right-4 top-4 p-1.5 text-zinc-500 hover:text-[#ffb4ab] transition-colors"
                          title="Remove item"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    );
                  })
                )}
              </div>

              {/* Footer Checkout Summary */}
              {cart.length > 0 && (
                <div className="p-6 bg-[#0c0f0f] border-t border-[#424656]/30">
                  <div className="flex justify-between items-center mb-4">
                    <span className="font-montserrat text-xs tracking-widest text-[#c2c6d8] font-bold uppercase">
                      {t.nav.subtotal}
                    </span>
                    <span className="font-mono text-lg font-extrabold text-[#b3c5ff]">
                      ${cartTotal.toFixed(2)}
                    </span>
                  </div>

                  <div className="flex gap-2">
                    <button
                      disabled={isCheckingOut}
                      onClick={handleCheckout}
                      className="flex-1 bg-[#0066ff] hover:bg-[#0054d6] disabled:bg-neutral-800 disabled:text-zinc-500 text-white font-montserrat text-xs font-bold tracking-widest py-3.5 uppercase transition-all duration-200 cursor-pointer flex items-center justify-center gap-2"
                    >
                      {isCheckingOut ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin" />
                          {language === "vi" ? "ĐANG XÁC THỰC GIAO DỊCH..." : "CALIBRATING ESCROW..."}
                        </>
                      ) : (
                        t.nav.checkout
                      )}
                    </button>
                    <button
                      onClick={onClearCart}
                      title={t.nav.clearCart}
                      className="p-3 border border-[#424656]/50 hover:border-[#ffb4ab] hover:text-[#ffb4ab] transition-all text-[#e2e2e2] cursor-pointer"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>

                  <p className="font-mono text-[9px] text-[#c2c6d8] opacity-50 mt-4 text-center tracking-tight uppercase">
                    {language === "vi"
                      ? "Giao thức thanh toán mã hóa AES-256 an toàn"
                      : "TRANSFER PROTOCOL COMPLIANT SECURE TRANSFER APPLIED"}
                  </p>
                </div>
              )}
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* SEARCH OVERLAY MODAL */}
      <AnimatePresence>
        {isSearchOpen && (
          <div className="fixed inset-0 z-50 overflow-hidden">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => {
                setIsSearchOpen(false);
                setSearchQuery("");
              }}
              className="absolute inset-0 bg-black/95 backdrop-blur-md"
            />

            {/* Inner Content Container */}
            <div className="absolute inset-x-0 top-0 h-[80vh] bg-[#121414] border-b border-[#424656]/20 flex flex-col p-6 md:p-16">
              <div className="max-w-4xl mx-auto w-full flex-col relative">
                {/* Close Button */}
                <button
                  type="button"
                  onClick={() => {
                    setIsSearchOpen(false);
                    setSearchQuery("");
                  }}
                  className="absolute right-0 -top-12 p-2 text-[#e2e2e2] hover:text-white"
                  title="Close Search"
                >
                  <X className="w-6 h-6" />
                </button>

                {/* Input block */}
                <div className="w-full relative border-b border-[#424656]/50 py-3 mb-8">
                  <Search className="w-6 h-6 text-[#0066ff] absolute left-0 top-4" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder={t.nav.searchPlaceholder}
                    className="w-full bg-transparent pl-9 text-lg md:text-2xl text-white outline-none placeholder-[#c2c6d8]/30 font-montserrat tracking-widest uppercase"
                    autoFocus
                  />
                </div>

                {/* Search query results box */}
                <div className="overflow-y-auto max-h-[50vh] pr-2 flex flex-col gap-4">
                  {searchQuery.trim() === "" ? (
                    <div className="text-zinc-500 py-20 text-center font-mono text-xs uppercase tracking-widest">
                      {language === "vi"
                        ? "Gõ tên thiết bị để tìm kiếm..."
                        : "Type hardware or apparel name to query dynamic registries..."}
                    </div>
                  ) : searchResults.length === 0 ? (
                    <div className="text-[#ffb4ab] py-20 text-center font-mono text-xs uppercase tracking-widest">
                      {language === "vi"
                        ? "Không tìm thấy thiết bị phù hợp trong kho lưu trữ."
                        : "Zero matching registries found in hardware inventory."}
                    </div>
                  ) : (
                    searchResults.map((prod) => (
                      <div
                        key={prod.id}
                        className="bg-[#1e2020] border border-[#424656]/25 p-4 flex gap-4 hover:border-[#0066ff] transition-all"
                      >
                        <div className="w-16 h-16 bg-black p-1 flex items-center justify-center shrink-0 border border-zinc-800">
                          <img
                            src={prod.image}
                            alt={prod.name}
                            className="max-h-full max-w-full object-contain"
                          />
                        </div>
                        <div className="flex-1 min-w-0 flex flex-col justify-center">
                          <h4 className="font-montserrat text-xs md:text-sm font-extrabold text-white uppercase tracking-wider">
                            {prod.name}
                          </h4>
                          <p className="font-mono text-xs text-[#b3c5ff] font-bold mt-1">
                            {prod.price}
                          </p>
                        </div>
                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() => {
                              setIsSearchOpen(false);
                              onOpenQuickView(prod.id);
                            }}
                            className="bg-black text-white hover:bg-[#0066ff] font-montserrat text-[10px] font-bold tracking-widest px-3 py-2 uppercase border border-[#424656]/30 transition-all"
                          >
                            {t.bestSellers.quickView}
                          </button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
